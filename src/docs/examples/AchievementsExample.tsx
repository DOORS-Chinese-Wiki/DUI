import { useState } from 'react';
import { AchievementCard, Button, Grid, Space, Text } from '../../components';
import styles from './AchievementsExample.module.css';

export default function AchievementsExample() {
  const [progress, setProgress] = useState(3);
  return <Space direction="vertical" size="lg" className={styles.example}>
    <Grid minItemWidth={208} gap="md">
      <AchievementCard achievement="welcome" unlocked description="展示已解锁状态。" />
      <AchievementCard achievement="outOfMyWay" unlocked={progress === 5} progress={progress} max={5}
        description="点击下方按钮查看演示进度与解锁状态。" />
      <AchievementCard achievement="rockBottom" description="未解锁时使用低对比度徽章图。" />
    </Grid>
    <Space size="sm" wrap>
      <Button size="sm" disabled={progress === 5} onClick={() => setProgress(value => Math.min(5, value + 1))}>增加成就进度</Button>
      <Button size="sm" variant="secondary" onClick={() => setProgress(3)}>重置进度</Button>
    </Space>
    <Text as="output" aria-live="polite" variant="small" tone="accent">演示进度：{progress} / 5{progress === 5 ? '，已解锁' : ''}</Text>
    <Text as="p" variant="caption" tone="muted">徽章图来自维基；此处进度只用于组件演示，不代表游戏成就条件。</Text>
  </Space>;
}
