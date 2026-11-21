import { Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { AssetProvider, SoundProvider } from '../components';
import type { AssetLookup } from '../assets/AssetProvider';
import packageInfo from '../../package.json';
import { WidgetView } from './WidgetView';
import { parseElement, validateNode } from './validation';
import { createWikiAssetLookup, wikiAssetMap } from './wikiAssets';
import type { WidgetEventDetail, WidgetHandle, WidgetNode, WikiOptions } from './types';

export const version: string = packageInfo.version;
const selector = '.dui-widget[data-dui]';
let options: WikiOptions = { sound: false, volume: 0.42 };
interface Mounted { root: Root; node: WidgetNode; revision: number; fallback: Node[]; hadScope: boolean; handle: WidgetHandle; assetLookup: AssetLookup }
const mounted = new Map<HTMLElement, Mounted>();

function report(host: HTMLElement, error: unknown) {
  host.dataset.duiState = 'error';
  host.dispatchEvent(new CustomEvent('dui:error', { bubbles: true, detail: { message: error instanceof Error ? error.message : String(error) } }));
}
class Boundary extends Component<{ children: ReactNode; host: HTMLElement }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch(error: Error, _info: ErrorInfo) { report(this.props.host, error); }
  render() { return this.state.error ? <p role="alert">组件配置无效，请检查该组件的参数。</p> : this.props.children; }
}
function render(host: HTMLElement, entry: Mounted) {
  const emit = (detail: WidgetEventDetail) => host.dispatchEvent(new CustomEvent('dui:action', { bubbles: true, detail }));
  host.dataset.duiState = 'ready';
  entry.root.render(<Boundary key={entry.revision} host={host}>
    <AssetProvider baseUrl={options.baseUrl} lookup={entry.assetLookup}><SoundProvider enabled={options.sound} volume={options.volume}>
      <WidgetView node={entry.node} host={host} emit={emit} />
    </SoundProvider></AssetProvider>
  </Boundary>);
}

export function configure(next: WikiOptions): Readonly<WikiOptions> {
  const resolved = { ...options };
  if (next.baseUrl !== undefined) {
    const url = new URL(next.baseUrl.endsWith('/') ? next.baseUrl : next.baseUrl + '/', document.baseURI);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('baseUrl 需要 HTTP(S) 地址');
    resolved.baseUrl = url.href;
  }
  if (next.sound !== undefined) {
    if (typeof next.sound !== 'boolean') throw new Error('sound 需要布尔值');
    resolved.sound = next.sound;
  }
  if (next.volume !== undefined) {
    if (!Number.isFinite(next.volume) || next.volume < 0 || next.volume > 1) throw new Error('volume 需要 0–1 的数值');
    resolved.volume = next.volume;
  }
  if (next.preferWikiAssets !== undefined) {
    if (typeof next.preferWikiAssets !== 'boolean') throw new Error('preferWikiAssets 需要布尔值');
    resolved.preferWikiAssets = next.preferWikiAssets;
  }
  if (next.wikiAssets !== undefined) resolved.wikiAssets = wikiAssetMap(next.wikiAssets);
  const assetConfigChanged = resolved.preferWikiAssets !== options.preferWikiAssets || resolved.wikiAssets !== options.wikiAssets;
  options = resolved;
  for (const [host, entry] of mounted) {
    if (assetConfigChanged) entry.assetLookup = createWikiAssetLookup(options, entry.node.assets);
    render(host, entry);
  }
  return Object.freeze({ ...options });
}

/** Mount a validated JSON tree; no HTML parsing, eval or callbacks from article configuration. */
export function mount(element: HTMLElement, config: WidgetNode): WidgetHandle {
  const node = validateNode(config);
  const existing = mounted.get(element);
  if (existing) { existing.handle.update(node); return existing.handle; }
  const entry: Mounted = {
    root: createRoot(element), node, revision: 0, assetLookup: createWikiAssetLookup(options, node.assets),
    fallback: Array.from(element.childNodes, child => child.cloneNode(true)),
    hadScope: element.classList.contains('dui-scope'),
    handle: {
      element,
      update(next) {
        if (!mounted.has(element)) throw new Error('组件已卸载，请重新 mount');
        entry.node = validateNode(next);
        entry.assetLookup = createWikiAssetLookup(options, entry.node.assets);
        entry.revision++;
        render(element, entry);
      },
      unmount() { unmount(element); },
    },
  };
  element.classList.add('dui-scope');
  mounted.set(element, entry);
  render(element, entry);
  return entry.handle;
}

export function unmount(element: HTMLElement): boolean {
  const entry = mounted.get(element);
  if (!entry) return false;
  entry.root.unmount();
  mounted.delete(element);
  element.replaceChildren(...entry.fallback.map(child => child.cloneNode(true)));
  if (!entry.hadScope) element.classList.remove('dui-scope');
  delete element.dataset.duiState;
  return true;
}

/** Repeated MediaWiki content hooks must not reset a user's selected item or control values. */
export function scan(content: ParentNode = document): WidgetHandle[] {
  const elements = Array.from(content.querySelectorAll<HTMLElement>(selector));
  if (content instanceof HTMLElement && content.matches(selector)) elements.unshift(content);
  const handles: WidgetHandle[] = [];
  for (const element of elements) {
    if (element.parentElement?.closest(selector)) continue;
    const existing = mounted.get(element);
    if (existing) { handles.push(existing.handle); continue; }
    try { handles.push(mount(element, parseElement(element))); }
    catch (error) { report(element, error); } // Keep the author's readable fallback on parse errors.
  }
  return handles;
}

type ContentHook = { add(callback: (content: { 0?: HTMLElement }) => void): void; remove(callback: (content: { 0?: HTMLElement }) => void): void };
declare global {
  interface Window {
    DUIConfig?: WikiOptions;
    mw?: { hook(name: string): ContentHook; config?: { get(name: string): unknown } };
  }
}
let stop: (() => void) | undefined;
export function startAutoMount() {
  if (stop) return;
  const hook = window.mw?.hook('wikipage.content');
  const onContent = (content: { 0?: HTMLElement }) => scan(content[0] ?? document);
  hook?.add(onContent);
  scan();
  const observer = new MutationObserver(() => {
    // Clean up detached React roots, listeners and modal scroll locks after Ajax navigation.
    for (const host of mounted.keys()) if (!host.isConnected) unmount(host);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  stop = () => { hook?.remove(onContent); observer.disconnect(); stop = undefined; };
}
export function destroy() {
  stop?.();
  document.removeEventListener('DOMContentLoaded', startAutoMount);
  for (const host of Array.from(mounted.keys())) unmount(host);
}
