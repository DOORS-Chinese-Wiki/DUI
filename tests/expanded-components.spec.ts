import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
});

test('panel actions save, reset, close and reopen the current panel', async ({ page }) => {
  const section = page.getByRole('region', { name: '面板', exact: true });
  await section.getByRole('button', { name: '保存设置', exact: true }).click();
  await expect(section.getByRole('status')).toContainText('音量 35%');
  await section.getByRole('button', { name: '关闭装备面板', exact: true }).click();
  await expect(section.getByRole('region', { name: '装备面板', exact: true })).toHaveCount(0);
  await section.getByRole('button', { name: '重新打开面板' }).click();
  await section.getByRole('button', { name: '恢复默认' }).click();
  await expect(section.getByRole('status')).toHaveText('已恢复演示默认值。');
});

test('tabs skip disabled entries and preserve child control state', async ({ page }) => {
  const section = page.getByRole('region', { name: '标签页', exact: true });
  const tabs = section.getByRole('tablist', { name: '装备分类' });
  await tabs.getByRole('tab', { name: '背包' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.getByRole('tab', { name: '偏好设置' })).toBeFocused();
  const hints = section.getByRole('switch', { name: /^分类提示/ });
  await section.getByText('分类提示', { exact: true }).click();
  await expect(hints).not.toBeChecked();
  await tabs.getByRole('tab', { name: '背包' }).click();
  await tabs.getByRole('tab', { name: '偏好设置' }).click();
  await expect(hints).not.toBeChecked();
});

test('inventory shares icon easing and matches the gameplay outline and 25 percent growth', async ({ page }) => {
  const section = page.getByRole('region', { name: '物品栏', exact: true });
  const inventory = section.getByRole('group', { name: '随身物品栏' });
  const button = inventory.getByRole('button', { name: /维生素/ });
  const badge = button.locator('kbd');
  await expect(badge).toHaveText('1');
  await expect(badge).toHaveCSS('border-top-width', '4px');
  await expect(badge).toHaveCSS('border-top-color', 'rgb(255, 222, 189)');
  await expect(badge).toHaveCSS('box-shadow', 'none');
  const badgeWidth = (await badge.boundingBox())!.width;
  await expect(inventory.getByText('x1', { exact: true })).toBeVisible();
  await expect(inventory.locator('progress').first()).toHaveAttribute('value', '0.15');
  const circle = inventory.getByRole('button', { name: '指南针' });
  await expect(circle).toHaveCSS('width', '68px');
  await expect(circle).toHaveCSS('border-radius', '50%');
  const icon = page.getByRole('group', { name: '大厅图标菜单', exact: true }).getByRole('button', { name: '物品', exact: true });
  const easing = await icon.evaluate(element => getComputedStyle(element).transitionTimingFunction);
  await expect(button).toHaveCSS('transition-timing-function', easing);
  const before = (await button.boundingBox())!;
  const neighbor = inventory.getByRole('button', { name: /开锁器/ });
  const neighborBefore = (await neighbor.boundingBox())!;
  await button.hover();
  await expect(button).toHaveCSS('border-top-color', 'rgb(255, 222, 189)');
  await expect(button).toHaveCSS('color', 'rgb(255, 222, 189)');
  await expect(button).toHaveCSS('transform', 'none');
  await expect.poll(async () => (await button.boundingBox())!.width).toBeCloseTo(before.width * 1.25, 1);
  expect((await neighbor.boundingBox())!.x).not.toBe(neighborBefore.x);
  expect((await badge.boundingBox())!.width).toBeCloseTo(badgeWidth, 1);
  const bounds = await inventory.getByRole('button').evaluateAll(buttons => buttons.map(button => {
    const box = button.getBoundingClientRect(); return { left: box.left, right: box.right };
  }));
  for (let i = 1; i < bounds.length; i++) expect(bounds[i].left).toBeGreaterThanOrEqual(bounds[i - 1].right);
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(section.locator('output')).toHaveText('当前物品：维生素');
  const disabled = inventory.getByRole('button', { name: '十字架' });
  const disabledWidth = (await disabled.boundingBox())!.width;
  await disabled.hover();
  await expect(disabled).toHaveCSS('width', disabledWidth + 'px');
});

test('shop purchases update the local wallet and prevent duplicate purchases', async ({ page }) => {
  const section = page.getByRole('region', { name: '商店物品卡', exact: true });
  await section.getByRole('button', { name: '打火机：购买', exact: true }).click();
  await expect(section.locator('output')).toHaveText('余额：95 旋钮 · 已购买 1 件');
  await expect(section.getByRole('button', { name: '打火机：已拥有' })).toBeDisabled();
  await section.getByRole('button', { name: '维生素：购买' }).click();
  await section.getByRole('button', { name: '开锁器：购买' }).click();
  await expect(section.getByRole('img', { name: '商店余额：0' })).toBeVisible();
  await expect(section.getByRole('button', { name: '骷髅钥匙：售罄' })).toBeDisabled();
  await section.getByRole('button', { name: '重置商店' }).click();
  await expect(section.locator('output')).toHaveText('余额：120 旋钮 · 已购买 0 件');
});

test('achievement progress reaches its limit and unlocks the card', async ({ page }) => {
  const section = page.getByRole('region', { name: '成就卡', exact: true });
  await section.getByRole('button', { name: '增加成就进度' }).click();
  await section.getByRole('button', { name: '增加成就进度' }).click();
  await expect(section.getByRole('progressbar')).toHaveAttribute('value', '5');
  await expect(section.getByRole('region', { name: 'Out Of My Way', exact: true }).getByText('已解锁', { exact: true })).toBeVisible();
  await expect(section.getByRole('button', { name: '增加成就进度' })).toBeDisabled();
});

test('dialog traps focus, supports Escape and restores its trigger', async ({ page }) => {
  const section = page.getByRole('region', { name: '弹窗', exact: true });
  const trigger = section.getByRole('button', { name: '打开装备弹窗' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '出发前装备', exact: true });
  await expect(dialog).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole('button', { name: '开锁器', exact: true }).click();
  await dialog.getByRole('button', { name: '确认装备', exact: true }).click();
  await expect(section.locator('output')).toHaveText('已确认装备：开锁器');
  await expect(trigger).toBeFocused();
});

test('dialog closes on the backdrop and the documentation search finds nested components', async ({ page }) => {
  await page.getByRole('region', { name: '弹窗', exact: true }).getByRole('button', { name: '打开装备弹窗' }).click();
  await expect(page.getByRole('dialog', { name: '出发前装备' })).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(page.getByRole('dialog', { name: '出发前装备' })).not.toBeVisible();
  const search = page.getByRole('searchbox', { name: '搜索组件文档' });
  await search.fill('PanelSection');
  const navigation = page.getByRole('navigation', { name: '组件文档导航' });
  await expect(navigation.getByRole('link')).toHaveCount(1);
  await expect(navigation.getByRole('link')).toHaveAttribute('href', '#panel');
});

for (const width of [768, 390, 320]) {
  test(`expanded examples fit inside the document at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    const section = page.getByRole('region', { name: '弹窗', exact: true });
    await section.getByRole('button', { name: '打开装备弹窗' }).click();
    const dialog = (await page.getByRole('dialog', { name: '出发前装备' }).boundingBox())!;
    expect(dialog.x).toBeGreaterThanOrEqual(0);
    expect(dialog.x + dialog.width).toBeLessThanOrEqual(width);
    await page.keyboard.press('Escape');
  });
}
