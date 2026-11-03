import { cp, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = resolve(import.meta.dirname, '..');
const result = spawnSync(process.execPath, [join(root, 'node_modules/vite/bin/vite.js'), 'build'], {
  cwd: root, stdio: 'inherit', env: { ...process.env, DUI_BASE_PATH: process.env.DUI_BASE_PATH ?? '/DUI/' },
});
if (result.status !== 0) process.exit(result.status ?? 1);
await cp(join(root, 'dist-mediawiki'), join(root, 'dist/mediawiki'), { recursive: true });
await mkdir(join(root, 'dist/downloads'), { recursive: true });
await cp(join(root, 'artifacts/dui-mediawiki-0.1.0.zip'), join(root, 'dist/downloads/dui-mediawiki-0.1.0.zip'));
await writeFile(join(root, 'dist/.nojekyll'), '');
console.log('DUI Pages: dist/ (base /DUI/, Wiki bundle and download included)');
