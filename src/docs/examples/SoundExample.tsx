import { useState } from 'react';
import { Button, Grid, Layout, SoundProvider, Space, Text } from '../../components';
import styles from './SoundExample.module.css';

export default function SoundExample() {
  const [enabled, setEnabled] = useState(false);
  const onToggle = () => setEnabled(value => !value);

  return (
    <SoundProvider enabled={enabled} volume={0.38}>
      <Grid columns={1} gap="md" responsive={false} className={styles.soundDemo}>
        <Layout maxWidth="full" padding="none">
          <Text variant="caption" tone="inherit" className={styles.demoEyebrow}>交互反馈</Text>
          <Text as="h4" variant="h3" tone="inherit">让操作听得见。</Text>
          <Text as="p" variant="small" tone="inherit">先开启音效，再移入或点击按钮。</Text>
        </Layout>
        <Space size="sm" wrap>
          <Button aria-pressed={enabled} onClick={onToggle}>{enabled ? '关闭演示音效' : '开启演示音效'}</Button>
          <Button variant="secondary">试试移入与点击</Button>
        </Space>
        <output><Text variant="code" tone="inherit">音效{enabled ? '已开启' : '已关闭'} · 音量 38%</Text></output>
      </Grid>
    </SoundProvider>
  );
}
