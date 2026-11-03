import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'dist-mediawiki');
const artifacts = join(root, 'artifacts');
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const css = await readFile(join(out, 'dui.css'), 'utf8');
if (/:root\s*\{|url\(["']?\/assets\//.test(css)) throw new Error('Build contains unscoped theme or absolute asset URLs');
await mkdir(artifacts, { recursive: true });
await cp(join(root, 'public/assets/doors'), join(out, 'assets/doors'), { recursive: true });
await cp(join(root, 'mediawiki'), join(out, 'integration'), {
  recursive: true, filter: path => path !== join(root, 'mediawiki/standalone.html'),
});
await cp(join(root, 'mediawiki/standalone.html'), join(out, 'index.html'));
await cp(join(root, 'docs/MEDIAWIKI.md'), join(out, 'README.md'));
await cp(join(root, 'ATTRIBUTION.md'), join(out, 'ATTRIBUTION.md'));
const thirdParty = ['react', 'react-dom', 'scheduler', '@radix-ui/react-slot', '@radix-ui/react-compose-refs', 'clsx',
  '@fontsource-variable/oswald', '@fontsource-variable/rubik', '@fontsource-variable/inconsolata'];
await mkdir(join(out, 'licenses'), { recursive: true });
for (const dependency of thirdParty) {
  const directory = join(root, 'node_modules', dependency);
  const license = (await readdir(directory)).find(name => /^licen[cs]e(?:\.(?:txt|md))?$/i.test(name));
  if (!license) throw new Error('Missing dependency license: ' + dependency);
  await cp(join(directory, license), join(out, 'licenses', dependency.replaceAll('/', '-') + '.txt'), { recursive: false });
}
await writeFile(join(out, 'package.json'), JSON.stringify({
  name: 'dui-mediawiki', version: pkg.version, private: true, type: 'module',
  description: 'Self-contained DUI widgets for MediaWiki',
  main: './dui.mjs', module: './dui.mjs', unpkg: './dui.js', jsdelivr: './dui.js',
  types: './types/src/mediawiki/api.d.ts',
  exports: { '.': { types: './types/src/mediawiki/api.d.ts', import: './dui.mjs', default: './dui.mjs' }, './style.css': './dui.css' },
  sideEffects: ['*.js', '*.mjs', '*.css'],
}, null, 2) + '\n');

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const path = join(directory, entry.name);
    files.push(...(entry.isDirectory() ? await filesIn(path) : [path]));
  }
  return files;
}

// Small deterministic ZIP writer: UTF-8 names, DEFLATE, no platform-specific shell dependencies.
const crcTable = Array.from({ length: 256 }, (_, n) => {
  for (let i = 0; i < 8; i++) n = (n & 1) ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
function crc32(data) {
  let n = 0xffffffff;
  for (const byte of data) n = crcTable[(n ^ byte) & 255] ^ (n >>> 8);
  return (n ^ 0xffffffff) >>> 0;
}
const sources = await filesIn(out);
const manifest = {};
for (const file of sources) manifest[relative(out, file).replaceAll('\\', '/')] = createHash('sha256').update(await readFile(file)).digest('hex');
await writeFile(join(out, 'SHA256SUMS.json'), JSON.stringify(manifest, null, 2) + '\n');
const files = await filesIn(out);
const local = [], central = [];
let offset = 0;
for (const file of files) {
  const name = Buffer.from('dui-mediawiki/' + relative(out, file).replaceAll('\\', '/'));
  const data = await readFile(file), compressed = deflateRawSync(data), crc = crc32(data);
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x800, 6);
  header.writeUInt16LE(8, 8); header.writeUInt16LE(33, 12); header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(compressed.length, 18); header.writeUInt32LE(data.length, 22); header.writeUInt16LE(name.length, 26);
  local.push(header, name, compressed);
  const directory = Buffer.alloc(46);
  directory.writeUInt32LE(0x02014b50, 0); directory.writeUInt16LE(20, 4); directory.writeUInt16LE(20, 6);
  directory.writeUInt16LE(0x800, 8); directory.writeUInt16LE(8, 10); directory.writeUInt16LE(33, 14);
  directory.writeUInt32LE(crc, 16); directory.writeUInt32LE(compressed.length, 20); directory.writeUInt32LE(data.length, 24);
  directory.writeUInt16LE(name.length, 28); directory.writeUInt32LE(offset, 42);
  central.push(directory, name); offset += header.length + name.length + compressed.length;
}
const directory = Buffer.concat(central), end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
const archive = join(artifacts, `dui-mediawiki-${pkg.version}.zip`);
await writeFile(archive, Buffer.concat([...local, directory, end]));
console.log(`MediaWiki package: ${relative(root, archive)} (${files.length} files)`);
