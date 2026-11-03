import { componentNames, type WidgetChild, type WidgetNode } from './types';

export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('需要 JSON 对象');
  return value as Record<string, unknown>;
}
type Reader<T = unknown> = (value: unknown) => T | undefined;
export const text: Reader<string> = value => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw new Error('需要字符串');
  return value;
};
export const number: Reader<number> = value => {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('需要有限数值');
  return value;
};
export const boolean: Reader<boolean> = value => {
  if (value === undefined) return undefined;
  if (typeof value !== 'boolean') throw new Error('需要布尔值');
  return value;
};
export function choice<const T extends readonly (string | number)[]>(values: T): Reader<T[number]> {
  return value => {
    if (value === undefined) return undefined;
    if (!values.includes(value as T[number])) throw new Error('不支持的取值：' + String(value));
    return value as T[number];
  };
}
export function list<T>(reader: Reader<T>): Reader<T[]> {
  return value => {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.length > 50) throw new Error('需要不超过 50 项的数组');
    return value.map(item => {
      const result = reader(item);
      if (result === undefined) throw new Error('数组项不能为空');
      return result;
    });
  };
}
export function read<S extends Record<string, Reader>>(input: Record<string, unknown>, schema: S) {
  const output: Record<string, unknown> = {};
  for (const [name, reader] of Object.entries(schema)) {
    try { output[name] = reader(input[name]); }
    catch (error) { throw new Error(name + '：' + (error as Error).message); }
  }
  return output as { [K in keyof S]: ReturnType<S[K]> };
}
export function required<T>(value: T | undefined, name: string): T {
  if (value === undefined) throw new Error('缺少 ' + name);
  return value;
}

/** Restrict structure as well as component names before anything is rendered. */
export function validateNode(input: unknown): WidgetNode {
  let nodes = 0;
  function child(value: unknown, depth: number): WidgetChild {
    if (++nodes > 500 || depth > 12) throw new Error('组件配置过大或嵌套过深');
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (Array.isArray(value)) return value.map(item => child(item, depth + 1));
    const node = record(value);
    if (!componentNames.includes(node.component as typeof componentNames[number])) throw new Error('未知组件：' + String(node.component));
    const props = node.props === undefined ? {} : { ...record(node.props) };
    // Tabs have nested content inside their item descriptions rather than children.
    if (node.component === 'tabs' && props.items !== undefined) {
      if (!Array.isArray(props.items) || props.items.length > 50) throw new Error('items 需要不超过 50 项的数组');
      props.items = props.items.map(item => {
        const tab = record(item);
        return { ...tab, content: child(tab.content, depth + 1) };
      });
    }
    return { component: node.component as WidgetNode['component'], props, children: child(node.children, depth + 1) };
  }
  const node = child(input, 0);
  if (!node || typeof node !== 'object' || Array.isArray(node)) throw new Error('根节点需要组件对象');
  return node;
}

export function parseElement(element: HTMLElement): WidgetNode {
  const source = element.dataset.duiProps?.trim() || '{}';
  if (source.length > 65536) throw new Error('配置不得超过 64 KiB');
  const props = record(JSON.parse(source));
  return validateNode({ component: element.dataset.dui, props, children: props.children });
}
