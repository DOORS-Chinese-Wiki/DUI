/* DUI 0.1.2 loader for MediaWiki. Source: https://github.com/DOORS-Chinese-Wiki/DUI */
(function () {
  'use strict';

  const sourcePage = 'https://dev.miraheze.org/w/index.php?title=User:Yatmt/';
  const selector = '.dui-widget[data-dui]';
  const stylesheetId = 'dui-mediawiki-stylesheet';

  function loadForContent($content) {
    const content = $content?.[0] ?? document;
    if (!content.matches?.(selector) && !content.querySelector(selector)) return;
    if (window.DUI || document.getElementById(stylesheetId)) return;

    const stylesheet = document.createElement('link');
    stylesheet.id = stylesheetId;
    stylesheet.rel = 'stylesheet';
    stylesheet.referrerPolicy = 'no-referrer';
    stylesheet.href = sourcePage + 'DUI.css&action=raw&ctype=text/css';
    stylesheet.addEventListener('error', () => {
      stylesheet.remove();
      mw.log.warn('DUI: could not load User:Yatmt/DUI.css.');
    }, { once: true });

    stylesheet.addEventListener('load', () => {
      if (window.DUI) return;
      const script = document.createElement('script');
      script.referrerPolicy = 'no-referrer';
      script.src = sourcePage + 'DUI-runtime.js&action=raw&ctype=text/javascript';
      script.addEventListener('error', () => {
        script.remove();
        stylesheet.remove();
        mw.log.warn('DUI: could not load User:Yatmt/DUI-runtime.js.');
      }, { once: true });
      document.head.append(script);
    }, { once: true });

    document.head.append(stylesheet);
  }

  mw.hook('wikipage.content').add(loadForContent);
}());
