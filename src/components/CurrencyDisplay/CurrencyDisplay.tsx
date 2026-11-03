import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { Space } from '../Space';
import { Text } from '../Text';
import styles from './CurrencyDisplay.module.css';

export type CurrencyKind = 'knobs' | 'gold' | 'revive' | 'candy';
const labels: Record<CurrencyKind, string> = { knobs: '旋钮', gold: '金币', revive: '复活次数', candy: '糖果' };
const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
export interface CurrencyDisplayProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  kind: CurrencyKind;
  value: number;
  label?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function CurrencyDisplay({ kind, value, label = labels[kind], size = 'md', showLabel = false,
  className, ...rest }: CurrencyDisplayProps) {
  const amount = numberFormat.format(Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0);
  return <Space {...rest} as="span" size="xs" align="center" role="img" aria-label={label + '：' + amount}
    className={clsx(styles.currency, size === 'sm' && styles.small, className)}>
    <Icon name={kind} size={size === 'sm' ? 24 : 32} />
    <Text variant="body" tone="inherit" aria-hidden="true" className={styles.amount}>{amount}</Text>
    {showLabel ? <Text variant="caption" tone="inherit" aria-hidden="true">{label}</Text> : null}
  </Space>;
}

export function CurrencyGroup({ className, 'aria-label': label = '货币余额', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <Space {...rest} role="group" aria-label={label} size="lg" align="center" wrap className={clsx(styles.group, className)} />;
}
