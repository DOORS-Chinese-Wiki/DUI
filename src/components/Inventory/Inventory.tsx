import clsx from 'clsx';
import { forwardRef, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { doorsIconAssets, type DoorsIconName } from '../Icon/assets';
import { Kbd } from '../Kbd';
import { Space } from '../Space';
import { Text } from '../Text';
import gameStyles from '../Button/GameButton.module.css';
import styles from './Inventory.module.css';

export interface ItemSlotProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-pressed'> {
  icon?: DoorsIconName;
  label?: string;
  count?: number;
  shortcut?: ReactNode;
  selected?: boolean;
  size?: 'sm' | 'md';
  shape?: 'square' | 'circle';
  charge?: number;
}
export const ItemSlot = forwardRef<HTMLButtonElement, ItemSlotProps>(({ icon, label, count,
  shortcut, selected = false, size = 'md', shape = 'square', charge, className, 'aria-label': ariaLabel, ...rest }, ref) => {
  const name = label ?? (icon ? doorsIconAssets[icon].label : '空物品位');
  const quantity = Number.isFinite(count) ? Math.max(1, Math.trunc(count!)) : 1;
  const remaining = Number.isFinite(charge) ? Math.max(0, Math.min(1, charge!)) : 0;
  return <Button {...rest} ref={ref} variant="secondary" aria-pressed={selected}
    aria-label={ariaLabel ?? name + (count !== undefined ? '，数量 ' + quantity : '') + (charge !== undefined ? '，剩余 ' + Math.round(remaining * 100) + '%' : '')}
    data-selected={selected} data-charge={charge !== undefined} className={clsx(gameStyles.button, styles.slot, size === 'sm' && styles.small, shape === 'circle' && styles.circle, className)}>
    {icon ? <span className={styles.artwork}><Icon name={icon} size={64} /></span>
      : <span className={styles.empty} aria-hidden="true">—</span>}
    {shortcut ? <span className={styles.shortcut} aria-hidden="true"><Kbd className={styles.number}>{shortcut}</Kbd></span> : null}
    {icon && count !== undefined ? <Text variant="caption" tone="cream" aria-hidden="true" className={styles.count}>x{quantity}</Text> : null}
    {icon && charge !== undefined ? <span className={styles.charge} aria-hidden="true"><progress value={remaining} max={1} /></span> : null}
  </Button>;
});
ItemSlot.displayName = 'ItemSlot';

export interface InventoryItem { id: string; icon?: DoorsIconName; label?: string; count?: number; disabled?: boolean; size?: 'sm' | 'md'; shape?: 'square' | 'circle'; charge?: number }
export interface InventoryBarProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'defaultValue'> {
  items: InventoryItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
}
export function InventoryBar({ items, value, defaultValue, onValueChange, className, onKeyDown,
  'aria-label': label = '物品栏', ...rest }: InventoryBarProps) {
  const [internal, setInternal] = useState(defaultValue === undefined ? items.find(item => !item.disabled)?.id : defaultValue);
  const selected = value === undefined ? internal : value;
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const enabled = items.filter(item => !item.disabled);
  const focusId = enabled.find(item => item.id === selected)?.id ?? enabled[0]?.id;
  function select(id: string) {
    if (value === undefined) setInternal(id);
    if (id !== selected) onValueChange?.(id);
  }
  return <Space {...rest} role="group" aria-label={label} size="xs" align="end" justify="center"
    className={clsx(styles.inventory, className)} onKeyDown={event => {
      onKeyDown?.(event);
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || !enabled.length) return;
      const current = enabled.findIndex(item => refs.current.get(item.id) === document.activeElement);
      const key = event.key;
      let next: InventoryItem | undefined;
      if (/^[1-9]$/.test(key)) next = items[Number(key) - 1];
      else if (key === 'Home') next = enabled[0];
      else if (key === 'End') next = enabled[enabled.length - 1];
      else if (key === 'ArrowLeft' || key === 'ArrowRight') next = enabled[(Math.max(0, current) + (key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length];
      if (next && !next.disabled) { event.preventDefault(); select(next.id); refs.current.get(next.id)?.focus(); }
    }}>
    {items.map((item, index) => <ItemSlot key={item.id} icon={item.icon} label={item.label} count={item.count}
      size={item.size} shape={item.shape} charge={item.charge}
      disabled={item.disabled} selected={item.id === selected} shortcut={index < 9 ? index + 1 : undefined}
      ref={node => { if (node) refs.current.set(item.id, node); else refs.current.delete(item.id); }}
      tabIndex={item.id === focusId ? 0 : -1} onClick={() => select(item.id)} />)}
  </Space>;
}
