import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { build } from 'vite';
import postcss from 'postcss';

const root = resolve(import.meta.dirname, '..');
const { version } = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const outputDirectory = join(root, 'artifacts', `dui-miraheze-submission-${version}`);

const result = await build({
  root,
  configFile: join(root, 'vite.mediawiki.config.ts'),
  mode: 'miraheze',
  build: { write: false },
});
const outputs = (Array.isArray(result) ? result : [result]).flatMap(entry => entry.output);
const runtime = outputs.find(entry => entry.type === 'chunk' && entry.fileName === 'dui.js')?.code;
const css = outputs.find(entry => entry.type === 'asset' && entry.fileName === 'dui.css')?.source;
if (typeof runtime !== 'string' || typeof css !== 'string') throw new Error('Missing Miraheze build output');

const bundledAssets = JSON.parse(await readFile(join(root, 'mediawiki/miraheze/assets.json'), 'utf8'));
const paths = runtime.matchAll(/['"](\/assets\/doors\/(?:icons|items|achievements|audio)\/[^'"\s]+)['"]/g);
for (const [, path] of paths) {
  if (!Object.hasOwn(bundledAssets, path.slice('/assets/doors/'.length))) {
    throw new Error(`Missing WikiTide mapping for ${path}`);
  }
}
const fontUrls = Object.values(JSON.parse(await readFile(join(root, 'mediawiki/miraheze/fonts.json'), 'utf8')));
const fontOrigins = ['https://static.wikitide.net', 'https://fonts.gstatic.com'];
const actualUrls = [...css.matchAll(/url\(\s*["']?([^"')\s]+)/gi)].map(([, url]) => url);
if (fontUrls.some(url => !fontOrigins.includes(new URL(url).origin)) ||
    actualUrls.some(url => !fontUrls.includes(url)) || fontUrls.some(url => !actualUrls.includes(url))) {
  throw new Error('Miraheze CSS must use the configured CDN font URLs');
}
postcss.parse(css).walkAtRules('import', () => {
  throw new Error('Miraheze CSS must not import another stylesheet');
});

await mkdir(join(outputDirectory, 'licenses'), { recursive: true });
const sources = ['DUI.js', 'DUI.mw', 'DUI-Demo.mw', 'Template-DUI.mw', 'install.js', 'README.md'];
await Promise.all(sources.map(name => cp(join(root, 'mediawiki/miraheze', name), join(outputDirectory, name))));
await Promise.all([
  writeFile(join(outputDirectory, 'DUI-runtime.js'), runtime),
  writeFile(join(outputDirectory, 'DUI.css'), css),
  cp(join(root, 'docs/ASSETS.md'), join(outputDirectory, 'ASSETS.md')),
  cp(join(root, 'LICENSE'), join(outputDirectory, 'LICENSE')),
]);

const dependencies = ['react', 'react-dom', 'scheduler', '@radix-ui/react-slot', '@radix-ui/react-compose-refs', 'clsx',
  '@fontsource-variable/oswald', '@fontsource-variable/rubik', '@fontsource-variable/inconsolata'];
await Promise.all(dependencies.map(async dependency => {
  const directory = join(root, 'node_modules', dependency);
  const license = (await readdir(directory)).find(name => /^licen[cs]e(?:\.(?:txt|md))?$/i.test(name));
  if (!license) throw new Error(`Missing dependency license for ${dependency}`);
  await cp(join(directory, license), join(outputDirectory, 'licenses', `${dependency.replaceAll('/', '-')}.txt`));
}));

console.log(`Miraheze source pages: ${outputDirectory}`);
