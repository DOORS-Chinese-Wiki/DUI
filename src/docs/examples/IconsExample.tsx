import { useState } from 'react';
import { Layout, LobbyMenu, Space, Text, doorsIconAssets, type LobbyMenuAction } from '../../components';
import styles from './IconsExample.module.css';

export default function IconsExample() {
  const [lastAction, setLastAction] = useState<LobbyMenuAction>();
  const label = lastAction === 'store' ? '商店' : lastAction === 'codes' ? '兑换码'
    : lastAction ? doorsIconAssets[lastAction].label : undefined;

  return (
    <Layout maxWidth="full" padding="none" className={styles.stage}>
      <Space direction="vertical" size="lg" align="center">
        <LobbyMenu showStore={false} aria-label="大厅图标菜单" onAction={setLastAction} />
        <Text as="output" variant="small" tone="cream" aria-live="polite" className={styles.status}>
          {label ? '已触发：' + label : '移入或聚焦查看反馈，点击图标触发对应操作。'}
        </Text>
      </Space>
    </Layout>
  );
}
