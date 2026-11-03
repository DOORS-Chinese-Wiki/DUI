import { expect, test } from '@playwright/test';

test('icon and lobby examples share their buttons and hover behavior', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#icons');
  await page.evaluate(() => document.fonts.ready);
  const icons = page.getByRole('group', { name: '大厅图标菜单', exact: true });
  const lobby = page.getByRole('group', { name: '大厅菜单', exact: true });
  const button = icons.getByRole('button', { name: '物品', exact: true });
  const lobbyButton = lobby.getByRole('button', { name: '物品', exact: true });
  await expect(icons.getByRole('button')).toHaveCount(6);
  await expect(button).toHaveAttribute('class', (await lobbyButton.getAttribute('class'))!);
  for (const property of ['width', 'height', 'padding', 'border-radius', 'border-top-color', 'background-color', 'color']) {
    const value = await lobbyButton.evaluate((element, property) => getComputedStyle(element).getPropertyValue(property), property);
    await expect(button).toHaveCSS(property, value);
  }
  const before = (await button.boundingBox())!;
  await button.hover();
  await expect(button).toHaveCSS('background-color', 'rgb(255, 222, 189)');
  await expect(button).toHaveCSS('color', 'rgb(69, 39, 25)');
  await expect(button).toHaveCSS('transform', 'none');
  await expect.poll(async () => (await button.boundingBox())!.width).toBeCloseTo(before.width * 1.14, 1);
  const bounds = await icons.getByRole('button').evaluateAll(buttons => buttons.map(button => {
    const rect = button.getBoundingClientRect();
    return { left: rect.left, right: rect.right };
  }));
  for (let index = 1; index < bounds.length; index++) {
    expect(bounds[index].left).toBeGreaterThanOrEqual(bounds[index - 1].right);
  }
  await button.click();
  await expect(page.getByRole('region', { name: '图标', exact: true }).locator('output')).toHaveText('已触发：物品');
});

for (const width of [768, 390, 320]) {
  test(`icon menu stays inside its preview at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#icons');
    await page.evaluate(() => document.fonts.ready);
    const menu = page.getByRole('group', { name: '大厅图标菜单', exact: true });
    const stage = (await menu.locator('../..').boundingBox())!;
    for (const button of await menu.getByRole('button').all()) {
      const bounds = (await button.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(stage.x);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(stage.x + stage.width);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
  });
}
