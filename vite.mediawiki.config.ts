import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import postcss from 'postcss';
import wikiFiles from './mediawiki/miraheze/assets.json' with { type: 'json' };
import wikiFonts from './mediawiki/miraheze/fonts.json' with { type: 'json' };

const assetBase = new URL('https://static.wikitide.net/');
const wikiAssetUrls = Object.fromEntries(Object.entries(wikiFiles).map(([path, file]) => {
  const url = new URL(file, assetBase);
  if (url.origin !== assetBase.origin) throw new Error(`Unexpected WikiTide asset origin for ${path}`);
  return [`/assets/doors/${path}`, url.href];
}));

export default defineConfig(({ mode }) => {
  const miraheze = mode === 'miraheze';
  return {
    plugins: [react(), {
      name: 'dui-mediawiki-css',
      enforce: 'post',
      generateBundle: { order: 'post', handler(_options, bundle) {
        for (const output of Object.values(bundle)) {
          if (output.type !== 'asset' || !output.fileName.endsWith('.css') || typeof output.source !== 'string') continue;
          // Scope CSS after CSS Modules has renamed the local classes.
          const css = postcss.parse(output.source);
          css.walkRules(rule => {
            if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
            rule.selectors = rule.selectors.map(selector => selector === ':root' ? '.dui-scope'
              : selector.startsWith('.dui-scope') || selector.startsWith('.dui-lobby-example')
                ? selector : '.dui-scope ' + selector);
          });
          if (miraheze) {
            const fonts = new Map(Object.entries(wikiFonts));
            css.walkAtRules('font-face', rule => {
              const family = rule.nodes?.find(node => node.type === 'decl' && node.prop === 'font-family');
              const name = family?.type === 'decl' ? family.value.replace(/^["']|["']$/g, '') : '';
              const url = fonts.get(name);
              if (!url) {
                rule.remove();
                return;
              }
              rule.walkDecls('src', declaration => {
                declaration.value = `url("${url}") format("woff2")`;
              });
            });
            css.walkDecls('--doors-font-display', declaration => {
              declaration.value = declaration.value.replace(/"DOORS",\s*/, '');
            });
            css.walkDecls('--doors-font-label', declaration => {
              declaration.value = declaration.value.replace('"DOORS"', '"DOORS Remake"');
            });
          }
          const scoped = css.toString();
          output.source = miraheze ? scoped : scoped.replaceAll('/assets/doors/', './assets/doors/');
        }
      } },
    }],
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'import.meta.env.DUI_MIRAHEZE_ASSETS': miraheze ? JSON.stringify(wikiAssetUrls) : 'undefined',
    },
    build: {
      outDir: 'dist-mediawiki', emptyOutDir: true, copyPublicDir: false,
      target: 'es2020', cssCodeSplit: false,
      lib: {
        entry: 'src/mediawiki/entry.ts', name: 'DUI', formats: miraheze ? ['iife'] : ['es', 'iife'],
        fileName: format => format === 'iife' ? 'dui.js' : 'dui.mjs',
        cssFileName: 'dui',
      },
    },
  };
});
