import { useState } from 'react';
import { Button, CurrencyDisplay, Grid, ShopItemCard, Space, Text } from '../../components';
import styles from './ShopExample.module.css';

const products = [
  { item: 'lighter', price: 25, description: '购买后将展示已拥有状态。' },
  { item: 'vitamins', price: 45, description: '余额不足时自动禁用购买按钮。' },
  { item: 'lockpick', price: 50, description: '卡片复用面板、货币和按钮组件。' },
  { item: 'skeletonKey', price: 200, description: '此卡片演示售罄状态。', available: false },
] as const;

export default function ShopExample() {
  const [wallet, setWallet] = useState({ balance: 120, owned: [] as string[] });
  return <Space direction="vertical" size="lg" className={styles.example}>
    <Space align="center" justify="space-between" wrap>
      <CurrencyDisplay kind="knobs" value={wallet.balance} label="商店余额" showLabel />
      <Button size="sm" variant="secondary" onClick={() => setWallet({ balance: 120, owned: [] })}>重置商店</Button>
    </Space>
    <Grid columns={2} responsive={false} gap="md" className={styles.cards}>
      {products.map(product => <ShopItemCard key={product.item} item={product.item} price={product.price}
        description={product.description} available={product.item !== 'skeletonKey'}
        owned={wallet.owned.includes(product.item)} disabled={wallet.balance < product.price}
        onPurchase={() => setWallet(current => current.owned.includes(product.item) || current.balance < product.price
          ? current : { balance: current.balance - product.price, owned: [...current.owned, product.item] })} />)}
    </Grid>
    <Text as="output" aria-live="polite" variant="small" tone="accent">余额：{wallet.balance} 旋钮 · 已购买 {wallet.owned.length} 件</Text>
    <Text as="p" variant="caption" tone="muted">价格与余额仅为交互演示，不代表当前游戏商店。</Text>
  </Space>;
}
