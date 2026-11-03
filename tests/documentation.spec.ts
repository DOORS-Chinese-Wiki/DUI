import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

test('search filters actual components and opens their documentation', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: '搜索组件文档' });
  await page.keyboard.press('Control+k');
  await expect(search).toBeFocused();
  await search.fill('滑动条');
  const navigation = page.getByRole('navigation', { name: '组件文档导航' });
  await expect(navigation.getByRole('link')).toHaveCount(1);
  await expect(navigation.getByRole('link')).toHaveAttribute('href', '#slider');
  await search.press('Enter');
  await expect(page).toHaveURL(/#slider$/);
  await expect(page.getByRole('region', { name: '滑动条', exact: true })).toBeInViewport();
  await expect(navigation.getByRole('link')).toHaveAttribute('aria-current', 'location');
});

test('search shows an honest empty state', async ({ page }) => {
  await page.getByRole('searchbox', { name: '搜索组件文档' }).fill('does-not-exist');
  const navigation = page.getByRole('navigation', { name: '组件文档导航' });
  await expect(navigation.getByRole('link')).toHaveCount(0);
  await expect(navigation).toContainText('没有匹配的组件');
});

test('example tabs reveal code and copy the actual snippet', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const section = page.getByRole('region', { name: '按钮', exact: true });
  await section.getByRole('tab', { name: '代码', exact: true }).click();
  const code = section.locator('pre[aria-label="按钮代码"]');
  await expect(code).toContainText("from '../../components';");
  await expect(code).toContainText('export default function ActionsExample()');
  await section.getByRole('button', { name: '复制按钮代码' }).click();
  await expect(section.getByRole('status')).toContainText('已复制');
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard.replace(/\r\n/g, '\n')).toBe(await code.textContent());
  const files = section.getByRole('tablist', { name: '按钮源文件', exact: true });
  await files.getByRole('tab', { name: 'ActionsExample.module.css', exact: true }).click();
  const stylesheet = section.locator('pre[aria-label="按钮样式代码"]');
  await expect(stylesheet).toContainText('.documentationDemo');
  await section.getByRole('button', { name: '复制按钮样式代码', exact: true }).click();
  await expect(section.getByRole('status')).toContainText('已复制');
  const copiedStyles = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiedStyles.replace(/\r\n/g, '\n')).toBe(await stylesheet.textContent());
  await files.getByRole('tab', { name: 'ActionsExample.module.css', exact: true }).press('ArrowLeft');
  await expect(files.getByRole('tab', { name: 'ActionsExample.tsx', exact: true })).toHaveAttribute('aria-selected', 'true');
  await section.getByRole('tab', { name: '预览', exact: true }).click();
  await expect(section.getByRole('button', { name: '确定', exact: true })).toBeVisible();
  await expect(section.getByRole('table')).toContainText('loadingLabel');
});

test('example tabs support arrow-key navigation', async ({ page }) => {
  const section = page.getByRole('region', { name: '图标', exact: true });
  const preview = section.getByRole('tab', { name: '预览', exact: true });
  const code = section.getByRole('tab', { name: '代码', exact: true });
  await preview.focus();
  await preview.press('ArrowRight');
  await expect(code).toBeFocused();
  await expect(code).toHaveAttribute('aria-selected', 'true');
  await code.press('ArrowLeft');
  await expect(preview).toHaveAttribute('aria-selected', 'true');
});

test('controlled examples update their displayed state', async ({ page }) => {
  const sliderSection = page.getByRole('region', { name: '滑动条', exact: true });
  const slider = sliderSection.getByRole('slider', { name: /^音乐音量/ });
  await slider.focus();
  await slider.press('Home');
  await slider.press('ArrowRight');
  await expect(sliderSection.locator('output')).toHaveText('当前音量：1%');
  await sliderSection.getByRole('tab', { name: '代码', exact: true }).click();
  await sliderSection.getByRole('tab', { name: '预览', exact: true }).click();
  await expect(slider).toHaveValue('1');
  const switchSection = page.getByRole('region', { name: '开关', exact: true });
  await switchSection.getByText('交互提示', { exact: true }).click();
  await expect(switchSection.locator('output')).toHaveText('交互提示已关闭');
});

test('mobile navigation opens and closes after selecting a section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const navigation = page.getByRole('navigation', { name: '组件文档导航' });
  await expect(navigation).toBeHidden();
  await page.getByRole('button', { name: '打开文档导航' }).click();
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link', { name: /^Button/ }).click();
  await expect(navigation).toBeHidden();
  await expect(page).toHaveURL(/#actions$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test('settings scenario matches the reference state and can reopen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1400 });
  await page.evaluate(() => document.fonts.ready);
  const section = page.getByRole('region', { name: '设置面板', exact: true });
  await expect(section.getByRole('slider', { name: '大厅音乐', exact: true })).toHaveValue('20');
  await expect(section.getByRole('slider', { name: '游戏音乐', exact: true })).toHaveValue('100');
  await expect(section.getByRole('switch', { name: '切换蹲姿', exact: true })).not.toBeChecked();
  for (const name of ['减小动作幅度', '隐藏自己的衣服', '没有蜘蛛腿']) {
    await expect(section.getByRole('switch', { name, exact: true })).toBeChecked();
  }
  const scene = page.locator('[data-settings-scene]');
  for (const currency of ['152', '422', '14,848']) {
    await expect(scene.getByText(currency, { exact: true })).toHaveCount(0);
  }
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveScreenshot('settings-panel-reference.png', { animations: 'disabled' });
  await section.getByRole('button', { name: '关闭设置', exact: true }).click();
  await expect(section.getByRole('button', { name: '重新打开设置', exact: true })).toBeVisible();
  await section.getByRole('button', { name: '重新打开设置', exact: true }).click();
  await expect(section.getByRole('slider', { name: '大厅音乐', exact: true })).toHaveValue('20');
});

test('every preview exposes its actual TSX and CSS source files', async ({ page }) => {
  const examples = [
    ['按钮', 'ActionsExample'], ['图标', 'IconsExample'], ['文字', 'TypographyExample'],
    ['滑动条', 'SliderExample'], ['开关', 'SwitchExample'], ['布局', 'LayoutExample'],
    ['音效', 'SoundExample'], ['大厅', 'LobbyExample'], ['设置面板', 'SettingsExample'],
    ['面板', 'PanelExample'], ['标签页', 'TabsExample'], ['物品栏', 'InventoryExample'],
    ['货币展示', 'CurrencyExample'], ['商店物品卡', 'ShopExample'], ['成就卡', 'AchievementsExample'],
    ['弹窗', 'DialogExample'], ['搜索与按键', 'SearchExample'],
  ];
  for (const [title, name] of examples) {
    const section = page.getByRole('region', { name: title, exact: true });
    await section.getByRole('tab', { name: '代码', exact: true }).click();
    const tabs = section.getByRole('tablist', { name: title + '源文件', exact: true });
    await expect(tabs.getByRole('tab')).toHaveCount(2);
    for (const extension of ['.tsx', '.module.css']) {
      const filename = name + extension;
      await tabs.getByRole('tab', { name: filename, exact: true }).click();
      const label = title + (extension === '.module.css' ? '样式' : '') + '代码';
      const displayed = await section.locator(`pre[aria-label="${label}"]`).textContent();
      const actual = readFileSync(new URL('../src/docs/examples/' + filename, import.meta.url), 'utf8');
      expect(displayed?.replace(/\r\n/g, '\n')).toBe(actual.replace(/\r\n/g, '\n'));
    }
    await section.getByRole('tab', { name: '预览', exact: true }).click();
  }
});
