import { useState } from 'react';
import { Grid, Kbd, SearchField, Space, Text } from '../../components';
import styles from './SearchExample.module.css';

const names = ['Button', 'Icon', 'Panel', 'Tabs', 'InventoryBar', 'CurrencyDisplay', 'ShopItemCard', 'AchievementCard', 'Dialog'];

export default function SearchExample() {
  const [query, setQuery] = useState('');
  const matches = names.filter(name => name.toLowerCase().includes(query.trim().toLowerCase()));
  return <Space direction="vertical" size="md" className={styles.example}>
    <SearchField aria-label="示例组件筛选" placeholder="在示例中查找组件…" shortcut={null}
      value={query} onChange={event => setQuery(event.target.value)} />
    <Text as="p" role="status" variant="small" tone="accent">{matches.length ? '找到 ' + matches.length + ' 个组件' : '没有匹配的组件'}</Text>
    <Grid minItemWidth={160} gap="xs">{matches.map(name => <Text key={name} variant="code" tone="cream" className={styles.result}>{name}</Text>)}</Grid>
    <Space size="xs" align="center" wrap>
      <Kbd>Ctrl</Kbd><Kbd>K</Kbd><Text variant="caption" tone="muted">聚焦页面顶部搜索；此输入框演示局部筛选。</Text>
    </Space>
  </Space>;
}
