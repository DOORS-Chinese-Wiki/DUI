import { useState } from 'react';
import { Button, Dialog, InventoryBar, Kbd, Space, Text, doorsIconAssets, type InventoryItem } from '../../components';
import styles from './DialogExample.module.css';

const items: InventoryItem[] = [
  { id: 'lighter', icon: 'lighter' }, { id: 'vitamins', icon: 'vitamins' }, { id: 'lockpick', icon: 'lockpick' },
];

export default function DialogExample() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('lighter');
  const [result, setResult] = useState('尚未确认装备。');
  return <Space direction="vertical" size="md" align="flex-start" className={styles.example}>
    <Button onClick={() => setOpen(true)}>打开装备弹窗</Button>
    <Space size="xs" align="center" wrap><Kbd>Esc</Kbd><Text variant="caption" tone="muted">关闭弹窗后，焦点返回打开按钮。</Text></Space>
    <Text as="output" variant="small" tone="accent" aria-live="polite">{result}</Text>
    <Dialog open={open} onOpenChange={setOpen} title="出发前装备" closeLabel="关闭装备弹窗"
      description="选择一个演示物品，再确认装备。" footer={<>
        <Button variant="secondary" onClick={() => setOpen(false)}>取消</Button>
        <Button onClick={() => {
          const item = items.find(item => item.id === selected);
          setResult('已确认装备：' + (item?.icon ? doorsIconAssets[item.icon].label : '无'));
          setOpen(false);
        }}>确认装备</Button>
      </>}>
      <InventoryBar items={items} value={selected} onValueChange={setSelected} aria-label="弹窗物品选择" />
    </Dialog>
  </Space>;
}
