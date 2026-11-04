import { expect, test } from '@playwright/test';
import packageInfo from '../../package.json' with { type: 'json' };
import type { WidgetNode } from '../../src/mediawiki/types';

declare global {
  interface Window { __wikiCallbacks: Array<(content: { 0?: HTMLElement }) => void>; }
}
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__wikiCallbacks = [];
    window.mw = { hook: () => ({
      add(callback) { window.__wikiCallbacks.push(callback); },
      remove(callback) { window.__wikiCallbacks = window.__wikiCallbacks.filter(item => item !== callback); },
    }) };
  });
});

test('IIFE loads its own runtime and assets under a deployment subdirectory without restyling the wiki', async ({ page }) => {
  const errors: string[] = [], failures: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto('./');
  await expect(page.locator('#inventory-demo')).toHaveAttribute('data-dui-state', 'ready');
  await expect(page.locator('#inventory-demo').getByRole('button')).toHaveCount(9);
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.locator('#inventory-demo img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('#outside-text')).toHaveCSS('color', 'rgb(32, 33, 34)');
  await expect(page.locator('#outside-control')).toHaveCSS('font-family', 'serif');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--doors-color-char'))).toBe('');
  expect(await page.evaluate(() => 'React' in window)).toBe(false);
  expect(await page.locator('#inventory-demo img').first().getAttribute('src')).toContain(`/releases/dui/${packageInfo.version}/assets/doors/`);
  expect(errors).toEqual([]); expect(failures).toEqual([]);
});

test('inventory preserves gameplay growth, number badges, neighbor movement and semantic events', async ({ page }) => {
  await page.goto('./');
  const inventory = page.locator('#inventory-demo');
  const slot = inventory.getByRole('button', { name: '维生素' });
  const neighbor = inventory.getByRole('button', { name: '日志' });
  const before = (await slot.boundingBox())!, nextBefore = (await neighbor.boundingBox())!;
  await slot.hover();
  await expect.poll(async () => (await slot.boundingBox())!.width).toBeCloseTo(before.width * 1.25, 1);
  expect((await neighbor.boundingBox())!.x).not.toBe(nextBefore.x);
  await expect(slot.locator('kbd')).toHaveCSS('border-top-width', '4px');
  await slot.click();
  await expect(page.locator('#event-log')).toContainText('"value": "vitamins"');
  await expect(slot).toHaveAttribute('aria-pressed', 'true');
  const bounds = await inventory.getByRole('button').evaluateAll(buttons => buttons.map(button => {
    const box = button.getBoundingClientRect(); return { left: box.left, right: box.right };
  }));
  for (let i = 1; i < bounds.length; i++) expect(bounds[i].left).toBeGreaterThanOrEqual(bounds[i - 1].right);
});

test('content hooks initialize new fragments, retain existing state and clean up removed modals', async ({ page }) => {
  await page.goto('./');
  const toggle = page.locator('#panel-demo').getByRole('switch');
  await page.locator('#panel-demo').getByText('减小动作幅度', { exact: true }).click();
  await expect(toggle).not.toBeChecked();
  await page.evaluate(() => {
    const fragment = document.createElement('section'); fragment.id = 'wiki-preview';
    fragment.innerHTML = '<div class="dui-widget" data-dui="button" data-dui-props=\'{"label":"动态预览"}\'>后备内容</div>';
    document.body.append(fragment);
    for (const callback of window.__wikiCallbacks) {
      callback({ 0: document.getElementById('mw-content-text')! }); callback({ 0: fragment });
    }
  });
  await expect(page.locator('#wiki-preview').getByRole('button', { name: '动态预览' })).toBeVisible();
  await expect(toggle).not.toBeChecked();
  const trigger = page.getByRole('button', { name: '查看装备', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '出发前装备' });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(element => Boolean(element.closest('.dui-scope')))).toBe(true);
  await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator('#dialog-demo').evaluate(element => element.remove());
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('all 23 component entry points render through the production bundle', async ({ page }) => {
  const nodes: WidgetNode[] = [
    { component: 'button', props: { label: '操作' } }, { component: 'icon', props: { name: 'items' } },
    { component: 'lobby-icon', props: { icon: 'settings' } }, { component: 'lobby', props: { showStore: false } },
    { component: 'text', props: { text: '文字' } }, { component: 'kbd', props: { text: 'Ctrl' } },
    { component: 'space', children: '间距' }, { component: 'grid', children: '网格' }, { component: 'layout', children: '布局' },
    { component: 'divider', props: { label: '分隔线' } }, { component: 'slider', props: { label: '音量' } },
    { component: 'switch', props: { label: '开关' } }, { component: 'search', props: { label: '搜索' } },
    { component: 'panel', props: { title: '面板' }, children: '面板内容' }, { component: 'panel-section', props: { title: '分组' }, children: '分组内容' },
    { component: 'tabs', props: { items: [{ value: 'one', label: '第一页', content: { component: 'text', children: '分页内容' } }] } },
    { component: 'item-slot', props: { icon: 'lighter', shortcut: '1' } },
    { component: 'inventory', props: { items: [{ id: 'lighter', icon: 'lighter' }] } },
    { component: 'currency', props: { kind: 'knobs', value: 1250 } }, { component: 'currency-group', children: { component: 'currency', props: { value: 10 } } },
    { component: 'shop-item', props: { item: 'lighter', price: 25 } },
    { component: 'achievement', props: { achievement: 'welcome', unlocked: true } },
    { component: 'dialog', props: { title: '测试弹窗' }, children: '弹窗内容' },
  ];
  await page.goto('./');
  await expect.poll(() => page.evaluate(() => Boolean(window.DUI))).toBe(true);
  const count = await page.evaluate(serialized => {
    const nodes = JSON.parse(serialized) as WidgetNode[];
    const container = document.createElement('section'); container.id = 'all-widgets'; document.body.append(container);
    for (const node of nodes) {
      const host = document.createElement('div'); host.dataset.kind = node.component; container.append(host);
      window.DUI!.mount(host, node);
    }
    return window.DUI!.componentNames.length;
  }, JSON.stringify(nodes));
  expect(count).toBe(23);
  await expect(page.locator('#all-widgets [data-kind]')).toHaveCount(23);
  await expect(page.locator('#all-widgets').getByRole('button', { name: '操作', exact: true })).toBeVisible();
  await expect(page.locator('#all-widgets').getByText('分页内容', { exact: true })).toBeVisible();
  await expect(page.locator('#all-widgets [data-dui-state="error"]')).toHaveCount(0);
});

test('invalid article configuration keeps fallback and does not execute markup', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => {
    const broken = document.createElement('div'); broken.id = 'broken'; broken.className = 'dui-widget';
    broken.dataset.dui = 'button'; broken.dataset.duiProps = '{'; broken.textContent = '可读的后备内容';
    const literal = document.createElement('div'); literal.id = 'literal'; literal.className = 'dui-widget';
    literal.dataset.dui = 'button'; literal.dataset.duiProps = JSON.stringify({ label: '<img src=x onerror=alert(1)>', dangerouslySetInnerHTML: { __html: '<script>alert(1)</script>' } });
    document.body.append(broken, literal); window.DUI!.scan();
  });
  await expect(page.locator('#broken')).toHaveText('可读的后备内容');
  await expect(page.locator('#broken')).toHaveAttribute('data-dui-state', 'error');
  await expect(page.locator('#literal').getByRole('button')).toHaveText('<img src=x onerror=alert(1)>');
  await expect(page.locator('#literal img, #literal script')).toHaveCount(0);
});

test('the Common.js bootstrap loads CSS and the IIFE through mw.loader', async ({ page, baseURL }) => {
  await page.route('**/bootstrap.html', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body><div class="dui-widget" data-dui="button">后备内容</div></body></html>' }));
  await page.goto('bootstrap.html');
  await page.evaluate(base => {
    window.DUIConfig = { baseUrl: base };
    Object.assign(window.mw!, { log: { warn: console.warn }, loader: {
      load(url: string, type: string) {
        if (type === 'text/css') { const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = url; document.head.append(link); }
        else { const script = document.createElement('script'); script.src = url; document.head.append(script); }
      },
    } });
  }, baseURL!);
  await page.addScriptTag({ path: 'mediawiki/bootstrap.js' });
  await expect(page.getByRole('button', { name: '按钮', exact: true })).toBeVisible();
  await expect(page.getByRole('button')).toHaveCSS('background-color', 'rgb(247, 221, 190)');
  expect(await page.evaluate(() => window.__wikiCallbacks.length)).toBe(1);
});

test('ES Module entry works without the IIFE global', async ({ page, baseURL }) => {
  await page.route('**/empty.html', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body><div id="module-host">后备</div></body></html>' }));
  await page.goto('empty.html');
  await page.addStyleTag({ url: baseURL + 'dui.css' });
  const version = await page.evaluate(async base => {
    window.DUIConfig = { baseUrl: base };
    const api = await import(base + 'dui.mjs');
    api.mount(document.getElementById('module-host'), { component: 'button', props: { label: '模块入口' } });
    return api.version;
  }, baseURL!);
  expect(version).toBe(packageInfo.version);
  await expect(page.getByRole('button', { name: '模块入口' })).toBeVisible();
  expect(await page.evaluate(() => window.DUI)).toBeUndefined();
});

for (const width of [390, 320]) {
  test(`wiki contents fit at ${width}px and inventory remains scrollable`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await page.goto('./');
    await expect(page.locator('#inventory-demo')).toHaveAttribute('data-dui-state', 'ready');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    const inventory = page.locator('#inventory-demo').getByRole('group');
    expect(await inventory.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
    await page.getByRole('button', { name: '查看装备', exact: true }).click();
    const bounds = (await page.getByRole('dialog').boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0); expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
  });
}
