import { expect, test, type Page } from '@playwright/test';

const wiki = 'https://zh.doorsgame.wiki';
const uploads = 'https://uploads.wiki.test';
const bundle = 'https://dui-static.test/dui/';
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16"/></svg>';
const icon = (id: string, props: string, assets = '') =>
  `<div id="${id}" class="dui-widget" data-dui="icon" data-dui-props='${props}' data-dui-assets='${assets}'></div>`;

async function serveWiki(page: Page, baseURL: string, widgets: string, config = '{}', site = wiki) {
  await page.route(`${bundle}**`, async route => {
    const file = await page.request.get(baseURL + route.request().url().slice(bundle.length));
    await route.fulfill({ response: file });
  });
  await page.route(`${site}/wiki/DUI_test`, route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: `<!doctype html>
    <script>window.DUIConfig = ${config};</script>
    <script src="${bundle}dui.js" defer></script>${widgets}` }));
  await page.route(`${uploads}/**`, route => {
    const path = new URL(route.request().url()).pathname;
    return path === '/unavailable.svg' ? route.abort('failed')
      : route.fulfill({ contentType: 'image/svg+xml', body: svg, headers: { 'access-control-allow-origin': '*' } });
  });
}

test('DOORS Wiki prefers its upload repository and deduplicates file lookups across widgets', async ({ page, baseURL }) => {
  const batches: string[][] = [];
  const bundledImages: string[] = [];
  page.on('request', request => { if (request.url().startsWith(bundle + 'assets/')) bundledImages.push(request.url()); });
  await serveWiki(page, baseURL!,
    icon('local', '{"name":"lighter"}') + icon('repeated', '{"name":"lighter"}') + icon('shared', '{"name":"settings"}'));
  await page.route(`${wiki}/w/api.php?*`, route => {
    batches.push(new URL(route.request().url()).searchParams.get('titles')!.split('|'));
    return route.fulfill({ json: { query: {
      redirects: [{ from: 'File:Settings icon.svg', to: 'File:Current settings icon.svg' }],
      pages: [
        { ns: 6, title: 'File:Icon lighter2.png', imagerepository: 'local', imageinfo: [{ url: uploads + '/lighter.svg', mime: 'image/svg+xml' }] },
        { ns: 6, title: 'File:Current settings icon.svg', missing: true, imagerepository: 'shared-doorswiki', imageinfo: [{ url: uploads + '/settings.svg', mime: 'image/svg+xml' }] },
      ],
    } } });
  });
  await page.goto(`${wiki}/wiki/DUI_test`);
  await expect(page.locator('#local img')).toHaveAttribute('src', uploads + '/lighter.svg');
  await expect(page.locator('#repeated img')).toHaveAttribute('src', uploads + '/lighter.svg');
  await expect(page.locator('#shared span[style*="mask-image"]')).toHaveCSS('mask-image', `url("${uploads}/settings.svg")`);
  expect(batches.flat().sort()).toEqual(['File:Icon lighter2.png', 'File:Settings icon.svg']);
  expect(bundledImages).toEqual([]);
});

test('file, widget and site overrides stay scoped and fall back when unavailable', async ({ page, baseURL }) => {
  await serveWiki(page, baseURL!,
    icon('direct', '{"name":"lighter","file":"文件:Custom_icon.svg"}', '{"items/lighter.png":"Widget.svg"}') +
    icon('widget', '{"name":"lighter"}', '{"items/lighter.png":"Widget.svg"}') +
    icon('missing', '{"name":"lighter","file":"File:Missing.svg"}') +
    icon('mask', '{"name":"settings","file":"File:Unavailable.svg"}') +
    icon('unsafe', '{"name":"lighter","file":"https://example.test/tracker.png"}') +
    '<div id="inventory" class="dui-widget" data-dui="inventory" data-dui-props=\'{"items":[{"id":"custom","file":"Custom icon.svg","label":"自定义物品","count":2}]}\'></div>',
    '{ wikiAssets: { "items/lighter.png": "Site.svg" } }');

  const urls: Record<string, string> = { 'Custom icon.svg': '/direct.svg', 'Widget.svg': '/widget.svg',
    'Site.svg': '/site.svg', 'Unavailable.svg': '/unavailable.svg' };
  await page.route(`${wiki}/w/api.php?*`, route => {
    const titles = new URL(route.request().url()).searchParams.get('titles')!.split('|');
    return route.fulfill({ json: { query: { pages: titles.map(title => {
      const path = urls[title.slice(5)];
      return { ns: 6, title, imageinfo: path ? [{ url: uploads + path, mime: 'image/svg+xml' }] : undefined };
    }) } } });
  });
  await page.goto(`${wiki}/wiki/DUI_test`);
  await expect(page.locator('#direct img')).toHaveAttribute('src', uploads + '/direct.svg');
  await expect(page.locator('#widget img')).toHaveAttribute('src', uploads + '/widget.svg');
  await expect(page.locator('#missing img')).toHaveAttribute('src', uploads + '/site.svg');
  await expect(page.locator('#mask span[style*="mask-image"]')).toHaveCSS('mask-image', `url("${bundle}assets/doors/icons/settings.svg")`);
  await expect(page.locator('#unsafe')).toHaveAttribute('data-dui-state', 'error');
  await expect(page.getByRole('button', { name: '自定义物品，数量 2' }).locator('img')).toHaveAttribute('src', uploads + '/direct.svg');
});

test('a failed Wiki API leaves the bundled image usable', async ({ page, baseURL }) => {
  await serveWiki(page, baseURL!, icon('demo', '{"name":"lighter"}'));
  await page.route(`${wiki}/w/api.php?*`, route => route.fulfill({ status: 503 }));
  await page.goto(`${wiki}/wiki/DUI_test`);
  await expect(page.locator('#demo img')).toHaveAttribute('src', bundle + 'assets/doors/items/lighter.png');
});

test('other Wiki installations can use their configured API path for an explicit file', async ({ page, baseURL }) => {
  const other = 'https://example.wiki.test';
  await serveWiki(page, baseURL!, icon('default', '{"name":"lighter"}') + icon('custom', '{"file":"Local.svg"}'), '{}', other);
  await page.addInitScript(() => {
    window.mw = { config: { get: () => '/mediawiki' }, hook: () => ({ add() {}, remove() {} }) };
  });
  const requests: string[] = [];
  await page.route(`${other}/mediawiki/api.php?*`, route => {
    requests.push(new URL(route.request().url()).searchParams.get('titles')!);
    return route.fulfill({ json: { query: { pages: [{ ns: 6, title: 'File:Local.svg', imageinfo: [{ url: uploads + '/local.svg', mime: 'image/svg+xml' }] }] } } });
  });
  await page.goto(`${other}/wiki/DUI_test`);
  await expect(page.locator('#default img')).toHaveAttribute('src', bundle + 'assets/doors/items/lighter.png');
  await expect(page.locator('#custom img')).toHaveAttribute('src', uploads + '/local.svg');
  expect(requests).toEqual(['File:Local.svg']);
});

test('interaction audio prefers the configured Wiki file and falls back on playback error', async ({ page, baseURL }) => {
  await serveWiki(page, baseURL!, '<div id="sound" class="dui-widget" data-dui="button">测试</div>',
    '{ sound: true, wikiAssets: { "audio/click.mp3": "Custom sound.mp3" } }');
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => { document.body.dataset.sounds = '[]'; });
    window.Audio = class extends EventTarget {
      constructor(public src: string) { super(); }
      play() {
        const played: string[] = JSON.parse(document.body.dataset.sounds!);
        played.push(this.src);
        document.body.dataset.sounds = JSON.stringify(played);
        if (this.src.endsWith('/custom.mp3')) queueMicrotask(() => this.dispatchEvent(new Event('error')));
        return Promise.resolve();
      }
    } as unknown as typeof Audio;
  });
  const requested: string[] = [];
  await page.route(`${wiki}/w/api.php?*`, route => {
    const titles = new URL(route.request().url()).searchParams.get('titles')!.split('|');
    requested.push(...titles);
    return route.fulfill({ json: { query: { pages: [{ ns: 6, title: 'File:Custom sound.mp3',
      imageinfo: [{ url: uploads + '/custom.mp3', mime: 'audio/mpeg' }] }] } } });
  });
  await page.goto(`${wiki}/wiki/DUI_test`);
  const button = page.locator('#sound button');
  await expect(button).toBeVisible();
  await expect.poll(async () => {
    await button.press('Enter');
    return JSON.parse((await page.locator('body').getAttribute('data-sounds'))!);
  }).toContain(uploads + '/custom.mp3');
  await expect.poll(async () => JSON.parse((await page.locator('body').getAttribute('data-sounds'))!))
    .toEqual(expect.arrayContaining([uploads + '/custom.mp3', bundle + 'assets/doors/audio/click.mp3']));
  expect(requested.filter(title => title === 'File:Custom sound.mp3')).toHaveLength(1);
});
