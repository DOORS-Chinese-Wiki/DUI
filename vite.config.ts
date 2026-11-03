/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { env } from 'node:process';

export default defineConfig({
  base: env.DUI_BASE_PATH ?? '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['tests/**', 'node_modules/**', 'dist/**', 'dist-mediawiki/**', 'storybook-static/**'],
    css: true,
    testTimeout: 15_000,
  },
});
