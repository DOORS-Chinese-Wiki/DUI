import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { configure, destroy, mount, scan, unmount } from './api';
import { parseElement, validateNode } from './validation';
import { resolveAssetUrl } from '../assets/AssetProvider';

beforeEach(() => { configure({ sound: false, baseUrl: 'https://static.example.test/dui/0.1.0/' }); });
afterEach(() => { act(() => destroy()); document.body.replaceChildren(); });
function host() {
  const element = document.createElement('div');
  element.className = 'dui-widget'; element.dataset.dui = 'button'; element.textContent = '后备内容';
  document.body.append(element); return element;
}
describe('MediaWiki adapter', () => {
  it('resolves only library-owned paths against the deployment directory', () => {
    expect(resolveAssetUrl('/assets/doors/items/lighter.png', 'https://cdn.example.test/v1/')).toBe('https://cdn.example.test/v1/assets/doors/items/lighter.png');
    expect(resolveAssetUrl('/assets/doors/items/lighter.png')).toBe('/assets/doors/items/lighter.png');
    expect(resolveAssetUrl('https://other.example.test/item.png', 'https://cdn.example.test/v1/')).toBe('https://other.example.test/item.png');
  });
  it('parses empty template props and rejects unknown component types or excessive nesting', () => {
    const element = host(); element.dataset.duiProps = '';
    expect(parseElement(element).component).toBe('button');
    expect(() => validateNode({ component: 'script' })).toThrow('未知组件');
    let node: unknown = 'nested';
    for (let i = 0; i < 20; i++) node = { component: 'space', children: node };
    expect(() => validateNode(node)).toThrow('嵌套过深');
  });
  it('preserves local control state across repeated content scans and restores fallback on unmount', () => {
    const element = host(); element.dataset.dui = 'switch';
    element.dataset.duiProps = JSON.stringify({ label: '保留操作', defaultChecked: true });
    let first: ReturnType<typeof scan> = [];
    act(() => { first = scan(element); });
    fireEvent.click(screen.getByRole('switch', { name: '保留操作' }));
    expect(screen.getByRole('switch')).not.toBeChecked();
    act(() => { expect(scan(element)[0]).toBe(first[0]); configure({ sound: true }); });
    expect(screen.getByRole('switch')).not.toBeChecked();
    act(() => { expect(unmount(element)).toBe(true); });
    expect(element).toHaveTextContent('后备内容'); expect(element).not.toHaveClass('dui-scope');
  });
  it('dispatches semantic bubbling events and ignores arbitrary DOM props', () => {
    const element = host(); const events: unknown[] = [];
    element.addEventListener('dui:action', event => events.push((event as CustomEvent).detail));
    act(() => { mount(element, { component: 'button', props: { label: '<b>纯文字</b>', action: 'host-game', onClick: 'alert(1)', dangerouslySetInnerHTML: { __html: '<em>wrong</em>' } } }); });
    const button = screen.getByRole('button', { name: '<b>纯文字</b>' });
    expect(button.querySelector('b')).toBeNull(); expect(button.querySelector('em')).toBeNull();
    fireEvent.click(button);
    expect(events).toEqual([{ component: 'button', action: 'host-game', value: undefined }]);
  });
  it('retains readable fallback and reports invalid JSON without aborting other widgets', () => {
    const broken = host(); broken.dataset.duiProps = '{'; const events: unknown[] = [];
    broken.addEventListener('dui:error', event => events.push((event as CustomEvent).detail));
    const valid = host(); valid.dataset.duiProps = '{"label":"可用组件"}';
    act(() => { scan(); });
    expect(broken).toHaveTextContent('后备内容'); expect(broken.dataset.duiState).toBe('error');
    expect(events).toHaveLength(1); expect(screen.getByRole('button', { name: '可用组件' })).toBeInTheDocument();
  });
  it('resets local state only on an explicit handle update', () => {
    const element = host(); let handle: ReturnType<typeof mount>;
    act(() => { handle = mount(element, { component: 'switch', props: { label: '设置', defaultChecked: true } }); });
    fireEvent.click(screen.getByRole('switch')); expect(screen.getByRole('switch')).not.toBeChecked();
    act(() => { handle.update({ component: 'switch', props: { label: '设置', defaultChecked: true } }); });
    expect(screen.getByRole('switch')).toBeChecked();
  });
});
