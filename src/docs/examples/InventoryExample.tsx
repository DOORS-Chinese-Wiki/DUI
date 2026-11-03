import { useState } from 'react';
import { InventoryBar, Space, Text, doorsIconAssets, type InventoryItem } from '../../components';
import styles from './InventoryExample.module.css';

const items: InventoryItem[] = [
  { id: 'vitamins', icon: 'vitamins' },
  { id: 'journal', icon: 'journal' },
  { id: 'flashlight', icon: 'flashlight', charge: 0.15 },
  { id: 'lockpick', icon: 'lockpick', charge: 0.45 },
  { id: 'lighter', icon: 'lighter', charge: 1 },
  { id: 'crucifix', icon: 'crucifix', disabled: true },
  { id: 'candle', icon: 'candle', size: 'sm' },
  { id: 'skeletonKey', icon: 'skeletonKey', count: 1, size: 'sm' },
  { id: 'compass', icon: 'compass', size: 'sm', shape: 'circle' },
];

export default function InventoryExample() {
  const [selected, setSelected] = useState<string | null>(null);
  const item = items.find(item => item.id === selected);
  const name = item?.icon ? doorsIconAssets[item.icon].label : item?.label;
  return <Space direction="vertical" size="md" className={styles.example}>
    <div className={styles.stage}>
      <InventoryBar items={items} value={selected} onValueChange={setSelected} aria-label="随身物品栏" />
    </div>
    <Text as="output" aria-live="polite" variant="small" tone="accent">当前物品：{name ?? '未选择'}</Text>
    <Text as="p" variant="caption" tone="muted" className={styles.note}>数字牌、大小物品位、圆形位与底边按实机参考调整。焦点在栏内时，用方向键、Home / End 或 1–9 切换；小屏可横向滚动。资源条数值仅为演示。</Text>
  </Space>;
}
