import { useState } from 'react';
import { Icon, InventoryBar, Space, Switch, Tabs, Text } from '../../components';
import styles from './TabsExample.module.css';

export default function TabsExample() {
  const [value, setValue] = useState('equipment');
  return <Space direction="vertical" size="md" className={styles.example}>
    <Tabs label="装备分类" value={value} onValueChange={setValue} items={[
      { value: 'equipment', label: '背包', icon: <Icon name="backpack" size={20} />, content: <InventoryBar aria-label="分类物品" items={[
        { id: 'lighter', icon: 'lighter' }, { id: 'vitamins', icon: 'vitamins', count: 3 }, { id: 'lockpick', icon: 'lockpick' },
      ]} /> },
      { value: 'unavailable', label: '未开放', disabled: true, content: null },
      { value: 'preferences', label: '偏好设置', icon: <Icon name="settings" size={20} />, content: <Switch label="分类提示" description="切换标签后仍保留此开关的状态。" defaultChecked /> },
    ]} />
    <Text as="output" variant="small" tone="accent" aria-live="polite">当前分类：{value === 'equipment' ? '背包' : '偏好设置'}</Text>
  </Space>;
}
