import { Text, Layout, Space } from '../../components';
import styles from './TypographyExample.module.css';

const typographySamples = [
  ['display', '展示', 'DOORS'],
  ['h1', '一级', '进入下一扇门'],
  ['h2', '二级', '界面基础层'],
  ['h3', '三级', '状态与反馈'],
  ['label', '标签', 'PRIMARY ENTRY'],
  ['body', '正文', '清晰的层级让每次选择都更直接。'],
  ['code', '代码', '<Button variant="primary" />'],
] as const;

export default function TypographyExample() {
  return (
    <Layout maxWidth="full" padding="none" className={`${styles.settingsPreview} ${styles.documentationDemo}`}>
      <Space size="md" align="center" justify="space-between" className={styles.settingsHeader}>
        <Text as="h3" variant="h2" tone="cream" id="typography-preview-title" className={styles.settingsTitle}>
          字体
        </Text>
      </Space>
      <Text as="div" variant="body" tone="inherit" className={styles.settingsBand}>字阶</Text>
      <Space direction="vertical" size="none" className={styles.settingsRows}>
        {typographySamples.map(([variant, label, sample]) => (
          <Space size="md" align="center" justify="space-between" wrap className={styles.controlRow} key={variant}>
            <Text as="span" variant="body" tone="inherit" className={styles.controlLabel}>{label}</Text>
            <Text
              as="span"
              variant={variant}
              tone={variant === 'code' ? 'accent' : 'default'}
              className={styles.typeSample}
            >
              {sample}
            </Text>
          </Space>
        ))}
      </Space>
    </Layout>
  );
}
