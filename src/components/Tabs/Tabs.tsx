import clsx from 'clsx';
import { useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button';
import { Space } from '../Space';
import styles from './Tabs.module.css';

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue'> {
  items: TabItem[];
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ items, label, value, defaultValue, onValueChange, className, ...rest }: TabsProps) {
  const uid = useId();
  const [internal, setInternal] = useState(defaultValue ?? items.find(item => !item.disabled)?.value);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const requested = value ?? internal;
  const selected = items.find(item => item.value === requested && !item.disabled)?.value
    ?? items.find(item => !item.disabled)?.value;
  function select(next: string) {
    if (value === undefined) setInternal(next);
    if (next !== selected) onValueChange?.(next);
  }
  return <div {...rest} className={clsx(styles.tabs, className)}>
    <Space role="tablist" aria-label={label} size="xs" align="center" className={styles.list}>
      {items.map((item, index) => <Button key={item.value} size="sm" role="tab"
        ref={node => { if (node) buttons.current.set(item.value, node); else buttons.current.delete(item.value); }}
        variant={selected === item.value ? 'primary' : 'plain'} disabled={item.disabled}
        id={uid + '-tab-' + index} aria-controls={uid + '-panel-' + index}
        aria-selected={selected === item.value} tabIndex={selected === item.value ? 0 : -1}
        leadingIcon={item.icon} onClick={() => select(item.value)} onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const enabled = items.filter(candidate => !candidate.disabled);
          const current = enabled.findIndex(candidate => candidate.value === item.value);
          const position = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1
            : (current + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length;
          const next = enabled[position];
          if (next) { select(next.value); buttons.current.get(next.value)?.focus(); }
        }}>{item.label}</Button>)}
    </Space>
    {items.map((item, index) => <div key={item.value} role="tabpanel" tabIndex={0}
      id={uid + '-panel-' + index} aria-labelledby={uid + '-tab-' + index}
      hidden={selected !== item.value} className={styles.content}>{item.content}</div>)}
  </div>;
}
