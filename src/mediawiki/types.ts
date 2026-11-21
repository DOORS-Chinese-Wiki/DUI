export const componentNames = [
  'button', 'icon', 'lobby-icon', 'lobby', 'text', 'kbd', 'space', 'grid', 'layout',
  'divider', 'slider', 'switch', 'search', 'panel', 'panel-section', 'tabs',
  'item-slot', 'inventory', 'currency', 'currency-group', 'shop-item', 'achievement', 'dialog',
] as const;
export type WidgetName = typeof componentNames[number];
export type WidgetChild = string | number | null | WidgetNode | WidgetChild[];
export type WikiAssetMap = Readonly<Record<string, string>>;
export interface WidgetNode {
  component: WidgetName;
  props?: Record<string, unknown>;
  children?: WidgetChild;
  /** Optional overrides for the mounted widget tree. */
  assets?: WikiAssetMap;
}
export interface WikiOptions {
  /** Directory containing dui.js, dui.css and assets/. Ends in a slash. */
  baseUrl?: string;
  sound?: boolean;
  volume?: number;
  /** Default to true on the DOORS Wiki hosts. */
  preferWikiAssets?: boolean;
  wikiAssets?: WikiAssetMap;
}
export interface WidgetHandle {
  element: HTMLElement;
  /** Explicit updates reset the widget's local state. Repeated scans preserve it. */
  update(node: WidgetNode): void;
  unmount(): void;
}
export interface WidgetEventDetail {
  component: WidgetName;
  action: string;
  value?: string | number | boolean;
}
