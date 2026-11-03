import clsx from 'clsx';
import { useId, type ReactNode } from 'react';
import { Icon } from '../Icon';
import { Panel } from '../Panel';
import { Space } from '../Space';
import { Text } from '../Text';
import { doorsAchievementAssets, type DoorsAchievementName } from './assets';
import styles from './AchievementCard.module.css';

export interface AchievementCardProps {
  achievement: DoorsAchievementName;
  title?: string;
  description?: ReactNode;
  unlocked?: boolean;
  progress?: number;
  max?: number;
  className?: string;
}
export function AchievementCard({ achievement, title = doorsAchievementAssets[achievement].label, description,
  unlocked = false, progress, max = 1, className }: AchievementCardProps) {
  const id = useId();
  const total = Number.isFinite(max) && max > 0 ? max : 1;
  const current = Number.isFinite(progress) ? Math.min(total, Math.max(0, progress!)) : 0;
  return <Panel title={title} className={clsx(styles.card, !unlocked && styles.locked, className)}>
    <Space size="md" align="center" wrap>
      <Icon src={doorsAchievementAssets[achievement].src} size={64} mask={false} className={styles.artwork} />
      <Space direction="vertical" size="xs" className={styles.details}>
        <Text variant="small" tone={unlocked ? 'accent' : 'muted'}>{unlocked ? '已解锁' : '未解锁'}</Text>
        {description ? <Text as="p" variant="small" tone="muted">{description}</Text> : null}
      </Space>
    </Space>
    {progress !== undefined ? <Space direction="vertical" size="xs">
      <Text as="label" id={id} variant="caption" tone="muted">{title} 进度：{current} / {total}</Text>
      <progress aria-labelledby={id} value={current} max={total} className={styles.progress} />
    </Space> : null}
  </Panel>;
}
