import { Button, Icon, Space, Text, Layout } from '../../components';
import styles from './ActionsExample.module.css';

export default function ActionsExample() {
  return (
    <Layout maxWidth="full" padding="none" className={`${styles.settingsPreview} ${styles.documentationDemo}`}>
      <Space size="md" align="center" justify="space-between" className={styles.settingsHeader}>
        <Text as="h3" variant="h2" tone="cream" id="actions-preview-title" className={styles.settingsTitle}>
          按钮
        </Text>
      </Space>
      <Text as="div" variant="body" tone="inherit" className={styles.settingsBand}>类型</Text>
      <Space direction="vertical" size="none" className={styles.settingsRows}>
        <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow}>
          <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>主要按钮</Text>
          <Button>确定</Button>
        </Space>
        <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow}>
          <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>次要按钮</Text>
          <Button variant="secondary">取消</Button>
        </Space>
        <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow}>
          <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>轻量按钮</Text>
          <Button variant="ghost">更多</Button>
        </Space>
        <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow}>
          <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>危险按钮</Text>
          <Button variant="danger">删除</Button>
        </Space>
      </Space>

      <Text as="div" variant="body" tone="inherit" className={styles.settingsBand}>尺寸</Text>
      <Space direction="vertical" size="none" className={styles.settingsRows}>
        <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow}>
          <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>小号</Text>
          <Button size="sm">小号</Button>
        </Space>
        <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow}>
          <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>中号</Text>
          <Button size="md">中号</Button>
        </Space>
        <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow}>
          <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>大号</Text>
          <Button size="lg">大号</Button>
        </Space>
      </Space>

      <Text as="div" variant="body" tone="inherit" className={styles.settingsBand}>状态</Text>
      <Space direction="vertical" size="none" className={styles.settingsRows}>
        <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow}>
          <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>加载中</Text>
          <Button loading loadingLabel="加载中">
            加载中
          </Button>
        </Space>
        <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow}>
          <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>不可用</Text>
          <Button disabled>不可用</Button>
        </Space>
        <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow}>
          <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>图标按钮</Text>
          <Space size="sm">
            <Button iconOnly aria-label="打开设置">
              <Icon name="settings" size={20} />
            </Button>
            <Button iconOnly variant="secondary" aria-label="查看物品">
              <Icon name="items" size={20} />
            </Button>
          </Space>
        </Space>
      </Space>
    </Layout>
  );
}
