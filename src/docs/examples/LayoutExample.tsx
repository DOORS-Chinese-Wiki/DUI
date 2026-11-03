import { Button, Divider, Grid, Layout, Space, Text } from '../../components';
import styles from './LayoutExample.module.css';

export default function LayoutExample() {
  return (
    <Layout maxWidth="full" padding="none" className={`${styles.settingsPreview} ${styles.documentationDemo}`}>
      <Space size="md" align="center" justify="space-between" className={styles.settingsHeader}>
        <Text as="h3" variant="h2" tone="cream" id="layout-preview-title" className={styles.settingsTitle}>
          布局
        </Text>
      </Space>
      <Text as="div" variant="body" tone="inherit" className={styles.settingsBand}>间距</Text>
      <Space direction="vertical" size="none" className={styles.settingsRows}>
        {([
          ['小', 'sm'],
          ['中', 'md'],
          ['大', 'lg'],
        ] as const).map(([label, size]) => (
          <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow} key={label}>
            <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>{label}</Text>
            <Space size={size} wrap>
              <Button size="sm" variant="secondary">返回</Button>
              <Button size="sm">继续</Button>
            </Space>
          </Space>
        ))}
      </Space>

      <Text as="div" variant="body" tone="inherit" className={styles.settingsBand}>网格</Text>
      <Space direction="vertical" size="none" className={styles.settingsRows}>
        <Layout padding="compact">
        <Grid columns={3} responsive={false} className={styles.layoutDemoGrid}>
          {Array.from({ length: 3 }, (_, index) => (
            <span className={styles.layoutDemoCell} key={index} />
          ))}
        </Grid>
        </Layout>
      </Space>

      <Text as="div" variant="body" tone="inherit" className={styles.settingsBand}>分隔</Text>
      <Space direction="vertical" size="none" className={styles.settingsRows}>
        <Divider tone="accent" />
      </Space>
    </Layout>
  );
}
