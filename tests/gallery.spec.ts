import { expect, test } from '@playwright/test';

const viewports = [
  { name: '1440', width: 1440, height: 1000 },
  { name: '1024', width: 1024, height: 900 },
  { name: '768', width: 768, height: 900 },
  { name: '390', width: 390, height: 844 },
];

for (const viewport of viewports) {
  test(`gallery renders at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto('/');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images, (image) => {
          if (image.complete) {
            return Promise.resolve();
          }
          return new Promise<void>((resolve) => {
            image.addEventListener('load', () => resolve(), { once: true });
            image.addEventListener('error', () => resolve(), { once: true });
          });
        }),
      );
    });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await expect(page).toHaveScreenshot(`gallery-${viewport.name}.png`, {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    });
  });
}

test('sound feedback can be enabled from the header', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: '开启交互音效' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(
    page.getByRole('button', { name: '关闭交互音效' }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('buttons do not animate on hover or press', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: '确定' }).first();
  await button.hover();

  await expect(button).toHaveCSS('transition-duration', '0s');
  await expect(button).toHaveCSS('transform', 'none');
});
