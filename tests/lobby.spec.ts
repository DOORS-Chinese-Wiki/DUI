import { expect, test } from '@playwright/test';

for (const width of [1440, 1024, 900, 768, 390, 320]) {
  test(`lobby controls stay inside the stage at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const lobby = page.getByRole('region', { name: '大厅', exact: true });
    const host = lobby.getByRole('button', { name: 'HOST GAME' });
    const stage = await host.locator('../..').boundingBox();
    expect(stage).not.toBeNull();
    await expect(lobby.getByRole('button')).toHaveCount(8);
    const menu = lobby.getByRole('group', { name: '大厅菜单' });
    const menuBounds = (await menu.boundingBox())!;
    const hostBounds = (await host.boundingBox())!;
    const iconBounds = (await menu.getByRole('button', { name: '设置', exact: true }).boundingBox())!;
    expect(hostBounds.width / menuBounds.width).toBeCloseTo(482 / 778, 2);
    expect(hostBounds.height / iconBounds.height).toBeCloseTo(96 / 88, 1);
    const tops = await menu.getByRole('button').evaluateAll(buttons =>
      buttons.map(button => button.getBoundingClientRect().bottom));
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(1);

    for (const button of await lobby.getByRole('button').all()) {
      const bounds = await button.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(stage!.x - 1);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
        stage!.x + stage!.width + 1,
      );
    }
    if (width === 390) await host.locator('../..').screenshot({ path: 'test-results/lobby-mobile-390.png' });
  });
}

for (const [name, snapshot] of [['商店', 'store'], ['物品', 'inventory']] as const) {
  test(`lobby ${snapshot} hover matches the reference feedback`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const lobby = page.getByRole('region', { name: '大厅', exact: true });
    const menu = lobby.getByRole('group', { name: '大厅菜单' });
    const button = menu.getByRole('button', { name, exact: true });
    const host = lobby.getByRole('button', { name: 'HOST GAME' });
    await lobby.scrollIntoViewIfNeeded();
    const before = await button.boundingBox();
    const hostBefore = await host.boundingBox();
    const positions = await menu.getByRole('button').evaluateAll(buttons =>
      buttons.map(button => {
        const element = button as HTMLButtonElement;
        return [element.offsetLeft, element.offsetTop];
      }),
    );

    await button.hover();
    await expect(button).toHaveCSS('background-color', 'rgb(255, 222, 189)');
    await expect(button).toHaveCSS('color', 'rgb(69, 39, 25)');
    await expect(button).toHaveCSS('border-top-color', 'rgb(69, 39, 25)');
    await expect(button).toHaveCSS('transform', 'none');
    expect(await button.evaluate(element =>
      getComputedStyle(element).transitionDuration.split(',')
        .some(duration => parseFloat(duration) >= 0.2),
    )).toBe(true);
    await expect.poll(async () => (await button.boundingBox())!.width)
      .toBeCloseTo(before!.width * 1.14, 1);
    const after = await button.boundingBox();
    expect(after!.width).toBeCloseTo(before!.width * 1.14, 1);
    expect(await host.boundingBox()).toEqual(hostBefore);
    expect(await menu.getByRole('button').evaluateAll(buttons =>
      buttons.map(button => {
        const element = button as HTMLButtonElement;
        return [element.offsetLeft, element.offsetTop];
      }),
    )).not.toEqual(positions);
    const bounds = await menu.getByRole('button').evaluateAll(buttons =>
      buttons.map(button => {
        const rect = button.getBoundingClientRect();
        return { left: rect.left, right: rect.right };
      }),
    );
    for (let index = 1; index < bounds.length; index += 1) {
      expect(bounds[index].left).toBeGreaterThanOrEqual(bounds[index - 1].right);
    }
    if (name === '物品') {
      await expect(button.locator('span').last()).toHaveCSS(
        'background-color', 'rgb(69, 39, 25)',
      );
    }

    await expect(host.locator('../..')).toHaveScreenshot(`lobby-hover-${snapshot}.png`, {
      animations: 'disabled',
    });
    await page.mouse.move(0, 0);
    await expect.poll(async () => (await button.boundingBox())!.width)
      .toBeCloseTo(before!.width, 1);
    await expect(button).toHaveCSS('transform', 'none');
    await expect(button).toHaveCSS('color', 'rgb(255, 222, 189)');
  });
}

test('lobby controls provide the same feedback for keyboard focus', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('group', { name: '大厅菜单' })
    .getByRole('button', { name: '物品', exact: true });
  await button.focus();
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('background-color', 'rgb(255, 222, 189)');
  await expect(button).toHaveCSS('outline-width', '2px');
});
