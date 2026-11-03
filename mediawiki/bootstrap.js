/* Paste into MediaWiki:Common.js or MediaWiki:Gadget-DUI.js AFTER setting DUIConfig.baseUrl. */
(function () {
  'use strict';
  var config = window.DUIConfig || {};
  if (!config.baseUrl) {
    mw.log.warn('DUI: set window.DUIConfig.baseUrl to the uploaded package directory.');
    return;
  }
  var base = config.baseUrl.replace(/\/?$/, '/');
  window.DUIConfig = Object.assign({}, config, { baseUrl: base });
  mw.loader.load(base + 'dui.css', 'text/css');
  mw.loader.load(base + 'dui.js', 'text/javascript');
}());
