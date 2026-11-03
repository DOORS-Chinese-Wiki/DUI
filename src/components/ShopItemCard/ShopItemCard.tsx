import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Button } from '../Button';
import { CurrencyDisplay, type CurrencyKind } from '../CurrencyDisplay';
import { Icon } from '../Icon';
import { doorsIconAssets, type DoorsIconName } from '../Icon/assets';
import { Panel } from '../Panel';
import { Space } from '../Space';
import { Text } from '../Text';
import styles from './ShopItemCard.module.css';

export interface ShopItemCardProps {
  item: DoorsIconName;
  name?: string;
  description?: ReactNode;
  price: number;
  currency?: CurrencyKind;
  owned?: boolean;
  available?: boolean;
  disabled?: boolean;
  onPurchase?: () => void;
  className?: string;
}
export function ShopItemCard({ item, name = doorsIconAssets[item].label, description, price, currency = 'knobs',
  owned = false, available = true, disabled = false, onPurchase, className }: ShopItemCardProps) {
  const action = owned ? '已拥有' : !available ? '售罄' : disabled ? '暂不可购买' : '购买';
  return <Panel title={name} className={clsx(styles.card, className)} footer={
    <Button fullWidth disabled={owned || !available || disabled} aria-label={name + '：' + action} onClick={onPurchase}>{action}</Button>
  }>
    <Space direction="vertical" size="md" align="center">
      <Space align="center" justify="center" className={styles.artwork}><Icon name={item} size={64} /></Space>
      {description ? <Text as="p" variant="small" tone="muted" className={styles.description}>{description}</Text> : null}
      <CurrencyDisplay kind={currency} value={price} size="sm" />
    </Space>
  </Panel>;
}
