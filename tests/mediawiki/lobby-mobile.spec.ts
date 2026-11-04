import { expect, test, type Locator, type Page } from '@playwright/test';

test.use({ isMobile: true, hasTouch: true, deviceScaleFactor: 1 });

async function addWikiMenu(page: Page, width: number) {
  await page.evaluate(width => {
    const frame = document.createElement('section');
    frame.id = 'wiki-lobby-fixture';
    frame.className = 'dui-lobby-example';
    frame.style.cssText = `width:${width}px;max-width:100%;margin:auto;`;
    const host = document.createElement('div');
    host.className = 'dui-widget'; host.dataset.dui = 'lobby'; host.style.padding = '0';
    host.dataset.duiProps = JSON.stringify({ label: 'Wiki 大厅菜单' });
    host.dataset.actions = '0';
    host.addEventListener('dui:action', event => {
      host.dataset.lastAction = (event as CustomEvent).detail.value;
      host.dataset.actions = String(Number(host.dataset.actions) + 1);
    });
    const primary = document.createElement('div'); primary.className = 'dui-lobby-host';
    const primaryWidget = document.createElement('div'); primaryWidget.className = 'dui-widget';
    primaryWidget.dataset.dui = 'button';
    primaryWidget.dataset.duiProps = JSON.stringify({ label: 'HOST GAME', action: 'host-game' });
    primary.append(primaryWidget);
    const navigation = document.createElement('div'); navigation.className = 'dui-lobby-navigation';
    navigation.append(host);
    frame.append(primary, navigation); document.body.append(frame); window.DUI!.scan(frame);
  }, width);
  const frame = page.locator('#wiki-lobby-fixture');
  await expect(frame.getByRole('button')).toHaveCount(8);
  return frame;
}

async function expectContained(frame: Locator) {
  const bounds = (await frame.boundingBox())!;
  for (const button of await frame.getByRole('button').all()) {
    const box = (await button.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(bounds.x - 1);
    expect(box.x + box.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
  }
  const boxes = await frame.getByRole('button').evaluateAll(buttons => buttons.map(button => {
    const r = button.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
  }));
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    expect(a.right <= b.left + 1 || b.right <= a.left + 1 || a.bottom <= b.top + 1 || b.bottom <= a.top + 1).toBe(true);
  }
}

for (const [viewport, container] of [[320, 239], [390, 309], [390, 192], [1024, 280]]) {
  test(`lobby fits a ${container}px Wiki container in a ${viewport}px touch viewport`, async ({ page }) => {
    await page.setViewportSize({ width: viewport, height: 900 }); await page.goto('./');
    const frame = await addWikiMenu(page, container);
    await expectContained(frame);
    const menu = frame.getByRole('group', { name: 'Wiki 大厅菜单' });
    const boxes = await menu.getByRole('button').evaluateAll(buttons => buttons.map(button => button.getBoundingClientRect().top));
    expect(Math.max(...boxes) - Math.min(...boxes)).toBeLessThan(1);
    const primary = (await frame.getByRole('button', { name: 'HOST GAME', exact: true }).boundingBox())!;
    expect(primary.width / container).toBeCloseTo(482 / 778, 2);
    expect(primary.height).toBeCloseTo(96 * container / 778, 1);
    const settings = frame.getByRole('button', { name: '设置', exact: true });
    const baseWidth = (await settings.boundingBox())!.width;
    await settings.tap();
    const host = frame.locator('[data-dui="lobby"]');
    await expect(host).toHaveAttribute('data-last-action', 'settings');
    await expect(host).toHaveAttribute('data-actions', '1');
    await expect.poll(async () => (await settings.boundingBox())!.width).toBeCloseTo(baseWidth, 1);
    await expectContained(frame);
  });
}

test('holding a lobby button gives touch feedback without losing the release action', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('./');
  const frame = await addWikiMenu(page, 239);
  const button = frame.getByRole('button', { name: '设置', exact: true });
  await button.scrollIntoViewIfNeeded();
  const before = (await button.boundingBox())!;
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: before.x + before.width / 2, y: before.y + before.height / 2 }] });
  await expect.poll(async () => (await button.boundingBox())!.width).toBeCloseTo(before.width * 1.14, 1);
  await expect(button).toHaveCSS('background-color', 'rgb(255, 222, 189)');
  await expectContained(frame);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(frame.locator('[data-dui="lobby"]')).toHaveAttribute('data-last-action', 'settings');
  await expect(frame.locator('[data-dui="lobby"]')).toHaveAttribute('data-actions', '1');
  await expect.poll(async () => (await button.boundingBox())!.width).toBeCloseTo(before.width, 1);
  await cdp.detach();
});

test('cancelling a touch restores the lobby button without dispatching an action', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('./');
  const frame = await addWikiMenu(page, 309);
  const button = frame.getByRole('button', { name: '设置', exact: true });
  await button.scrollIntoViewIfNeeded();
  const before = (await button.boundingBox())!;
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: before.x + before.width / 2, y: before.y + before.height / 2 }] });
  await expect(button).toHaveAttribute('data-touch-pressed', 'true');
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await expect(button).not.toHaveAttribute('data-touch-pressed');
  await expect.poll(async () => (await button.boundingBox())!.width).toBeCloseTo(before.width, 1);
  await expect(frame.locator('[data-dui="lobby"]')).toHaveAttribute('data-actions', '0');
  await cdp.detach();
});
