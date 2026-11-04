import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import postcss from 'postcss';

export default defineConfig({
  plugins: [react(), {
    name: 'dui-relative-font-urls',
    enforce: 'post',
    generateBundle: { order: 'post', handler(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type === 'asset' && output.fileName.endsWith('.css') && typeof output.source === 'string') {
          // Scope AFTER CSS Modules have renamed their local classes.
          const css = postcss.parse(output.source);
          css.walkRules(rule => {
            if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
            rule.selectors = rule.selectors.map(selector => selector === ':root' ? '.dui-scope'
              : selector.startsWith('.dui-scope') || selector.startsWith('.dui-lobby-example')
                ? selector : '.dui-scope ' + selector);
          });
          output.source = css.toString().replaceAll('/assets/doors/', './assets/doors/');
        }
      }
    } },
  }],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: 'dist-mediawiki', emptyOutDir: true, copyPublicDir: false,
    target: 'es2020', cssCodeSplit: false,
    lib: {
      entry: 'src/mediawiki/entry.ts', name: 'DUI', formats: ['es', 'iife'],
      fileName: format => format === 'iife' ? 'dui.js' : 'dui.mjs',
      cssFileName: 'dui',
    },
  },
});
