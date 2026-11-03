import { Fragment, useState, type ReactNode } from 'react';
import {
  AchievementCard, Button, CurrencyDisplay, CurrencyGroup, Dialog, Divider, Grid, Icon,
  InventoryBar, ItemSlot, Kbd, Layout, LobbyIconButton, LobbyMenu, Panel, PanelSection,
  SearchField, ShopItemCard, Slider, Space, Switch, Tabs, Text, doorsAchievementAssets, doorsIconAssets,
  type DoorsIconName, type InventoryItem,
} from '../components';
import { boolean, choice, list, number, read, record, required, text } from './validation';
import type { WidgetChild, WidgetEventDetail, WidgetNode } from './types';

const icon = choice(Object.keys(doorsIconAssets) as DoorsIconName[]);
const achievement = choice(Object.keys(doorsAchievementAssets) as (keyof typeof doorsAchievementAssets)[]);
const size = choice(['sm', 'md']);
const gap = choice(['none', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']);
const currency = choice(['knobs', 'gold', 'revive', 'candy']);
const lobbyIcon = choice([...Object.keys(doorsIconAssets), 'codes'] as (DoorsIconName | 'codes')[]);
const slotSchema = { icon, label: text, count: number, selected: boolean, disabled: boolean,
  size, shape: choice(['square', 'circle']), charge: number };

function inventoryItem(value: unknown): InventoryItem {
  const parsed = read(record(value), { id: text, ...slotSchema });
  return { ...parsed, id: required(parsed.id, 'id') };
}
function unique<T>(items: T[], key: (item: T) => string) {
  if (new Set(items.map(key)).size !== items.length) throw new Error('列表标识不得重复');
  return items;
}
interface ViewProps {
  node: WidgetNode;
  host: HTMLElement;
  emit: (detail: WidgetEventDetail) => void;
}
export function WidgetView({ node, host, emit }: ViewProps) {
  const [closed, setClosed] = useState(false);
  const [open, setOpen] = useState(() => boolean(node.props?.defaultOpen) ?? false);
  const [owned, setOwned] = useState(false);
  const p = node.props ?? {};
  const action = (name: string, value?: WidgetEventDetail['value']) => emit({ component: node.component, action: name, value });
  function content(child: WidgetChild | undefined): ReactNode {
    if (child === null || child === undefined || typeof child === 'string' || typeof child === 'number') return child;
    if (Array.isArray(child)) return child.map((item, index) => <Fragment key={index}>{content(item)}</Fragment>);
    return <WidgetView node={child} host={host} emit={emit} />;
  }
  const children = content(node.children);
  switch (node.component) {
    case 'button': {
      const a = read(p, { label: text, variant: choice(['primary', 'secondary', 'ghost', 'plain', 'danger']),
        size: choice(['sm', 'md', 'lg']), disabled: boolean, loading: boolean, fullWidth: boolean, action: text });
      return <Button variant={a.variant} size={a.size} disabled={a.disabled} loading={a.loading}
        fullWidth={a.fullWidth} onClick={() => action(a.action ?? 'click')}>{children ?? a.label ?? '按钮'}</Button>;
    }
    case 'icon': {
      const a = read(p, { name: icon, alt: text, size: choice([16, 20, 24, 32, 48, 64]), tone: choice(['inherit', 'cream', 'muted', 'accent', 'danger']) });
      return <Icon {...a} name={required(a.name, 'name')} />;
    }
    case 'lobby-icon': {
      const a = read(p, { icon: lobbyIcon, label: text, disabled: boolean });
      return <LobbyIconButton icon={required(a.icon, 'icon')} aria-label={a.label} disabled={a.disabled} onClick={() => action('action', a.icon)} />;
    }
    case 'lobby': {
      const a = read(p, { showStore: boolean, items: list(lobbyIcon), label: text });
      return <LobbyMenu showStore={a.showStore} items={a.items} aria-label={a.label} onAction={value => action('action', value)} />;
    }
    case 'text': {
      const a = read(p, { text, as: choice(['span', 'p', 'strong', 'em', 'h2', 'h3', 'code']),
        variant: choice(['display', 'h1', 'h2', 'h3', 'label', 'body', 'small', 'caption', 'code']),
        tone: choice(['inherit', 'default', 'cream', 'muted', 'quiet', 'accent', 'danger']), align: choice(['start', 'center', 'end']), truncate: boolean });
      return <Text as={a.as} variant={a.variant} tone={a.tone} align={a.align} truncate={a.truncate}>{children ?? a.text}</Text>;
    }
    case 'kbd': {
      const a = read(p, { text, size });
      return <Kbd size={a.size}>{children ?? a.text}</Kbd>;
    }
    case 'space': {
      const a = read(p, { direction: choice(['horizontal', 'vertical']), size: gap, wrap: boolean,
        align: choice(['start', 'center', 'end', 'stretch']), justify: choice(['start', 'center', 'end', 'space-between']) });
      return <Space {...a}>{children}</Space>;
    }
    case 'grid': {
      const a = read(p, { columns: number, minItemWidth: number, gap, responsive: boolean });
      if (a.columns !== undefined && (!Number.isInteger(a.columns) || a.columns < 1 || a.columns > 12)) throw new Error('columns 需要 1–12 的整数');
      if (a.minItemWidth !== undefined && a.minItemWidth <= 0) throw new Error('minItemWidth 必须大于 0');
      return <Grid {...a}>{children}</Grid>;
    }
    case 'layout': {
      const a = read(p, { maxWidth: choice(['prose', 'content', 'wide', 'full']), padding: choice(['none', 'compact', 'default', 'spacious']) });
      return <Layout {...a}>{children}</Layout>;
    }
    case 'divider': return <Divider {...read(p, { orientation: choice(['horizontal', 'vertical']), tone: choice(['subtle', 'accent']), label: text })} />;
    case 'slider': {
      const a = read(p, { label: text, description: text, defaultValue: number, min: number, max: number, step: number, disabled: boolean });
      if ((a.max ?? 100) <= (a.min ?? 0) || (a.step !== undefined && a.step <= 0)) throw new Error('滑动条需要 max > min 且 step > 0');
      return <Slider {...a} onValueChange={value => action('change', value)} />;
    }
    case 'switch': {
      const a = read(p, { label: text, description: text, defaultChecked: boolean, size, disabled: boolean });
      return <Switch {...a} onCheckedChange={value => action('change', value)} />;
    }
    case 'search': {
      const a = read(p, { label: text, placeholder: text, defaultValue: text, shortcut: text, size, disabled: boolean });
      return <SearchField aria-label={a.label ?? '搜索'} placeholder={a.placeholder} defaultValue={a.defaultValue}
        shortcut={a.shortcut} size={a.size} disabled={a.disabled} onChange={event => action('change', event.currentTarget.value)} />;
    }
    case 'panel': {
      const a = read(p, { title: text, description: text, footer: text, closable: boolean, closeLabel: text });
      if (closed) return null;
      return <Panel title={a.title ?? '面板'} description={a.description} footer={a.footer} closeLabel={a.closeLabel}
        onClose={a.closable ? () => { setClosed(true); action('close'); } : undefined}>{children}</Panel>;
    }
    case 'panel-section': return <PanelSection title={text(p.title) ?? '分组'}>{children}</PanelSection>;
    case 'tabs': {
      const a = read(p, { label: text, defaultValue: text });
      const items = list(value => {
        const item = record(value);
        return { value: required(text(item.value), 'value'), label: required(text(item.label), 'label'),
          disabled: boolean(item.disabled), content: content(item.content as WidgetChild) };
      })(p.items) ?? [];
      if (!items.length) throw new Error('标签页至少需要一项');
      return <Tabs {...a} label={a.label ?? '标签页'} items={unique(items, item => item.value)} onValueChange={value => action('change', value)} />;
    }
    case 'item-slot': {
      const a = read(p, { ...slotSchema, shortcut: text });
      return <ItemSlot {...a} onClick={() => action('click', a.icon)} />;
    }
    case 'inventory': {
      const a = read(p, { label: text, defaultValue: value => value === null ? null : text(value), items: list(inventoryItem) });
      return <InventoryBar items={unique(a.items ?? [], item => item.id)} defaultValue={a.defaultValue}
        aria-label={a.label} onValueChange={value => action('change', value)} />;
    }
    case 'currency': {
      const a = read(p, { kind: currency, value: number, label: text, size, showLabel: boolean });
      return <CurrencyDisplay {...a} kind={a.kind ?? 'knobs'} value={a.value ?? 0} />;
    }
    case 'currency-group': return <CurrencyGroup>{children}</CurrencyGroup>;
    case 'shop-item': {
      const a = read(p, { item: icon, name: text, description: text, price: number, currency, owned: boolean, available: boolean, disabled: boolean });
      return <ShopItemCard {...a} item={required(a.item, 'item')} price={a.price ?? 0} owned={a.owned || owned}
        onPurchase={() => { setOwned(true); action('purchase', a.item); }} />;
    }
    case 'achievement': {
      const a = read(p, { achievement, title: text, description: text, unlocked: boolean, progress: number, max: number });
      return <AchievementCard {...a} achievement={required(a.achievement, 'achievement')} />;
    }
    case 'dialog': {
      const a = read(p, { title: text, description: text, triggerLabel: text, closeLabel: text, closeOnBackdrop: boolean, footer: text });
      return <><Button onClick={() => { setOpen(true); action('open'); }}>{a.triggerLabel ?? '打开弹窗'}</Button>
        <Dialog title={a.title ?? '弹窗'} description={a.description} footer={a.footer} closeLabel={a.closeLabel}
          closeOnBackdrop={a.closeOnBackdrop} open={open} portalContainer={host}
          onOpenChange={value => { setOpen(value); action(value ? 'open' : 'close'); }}>{children}</Dialog></>;
    }
  }
}
