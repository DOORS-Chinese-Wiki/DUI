import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/mediawiki', fullyParallel: true, reporter: 'list',
  outputDir: 'test-results/mediawiki',
  use: { baseURL: 'http://127.0.0.1:4175/releases/dui/0.1.0/', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'node scripts/serve-mediawiki.mjs', url: 'http://127.0.0.1:4175/', reuseExistingServer: true },
  projects: [{ name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
});
