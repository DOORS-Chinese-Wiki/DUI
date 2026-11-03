export { configure, mount, unmount, scan, destroy, version } from './runtime';
export { componentNames, type WidgetName, type WidgetChild, type WidgetNode,
  type WidgetHandle, type WidgetEventDetail, type WikiOptions } from './types';

declare global {
  interface Window { DUI?: typeof import('./api'); }
}
