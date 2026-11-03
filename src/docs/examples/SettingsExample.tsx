import { useState } from 'react';
import { Button, Icon, Slider, Space, Switch, Text, doorsIconAssets, Layout, Grid } from '../../components';
import styles from './SettingsExample.module.css';

export default function SettingsExample() {
  const [settingsOpen, setSettingsOpen] = useState(true);
  return (
    <Layout maxWidth="full" padding="none" className={`${styles.gameStage} ${styles.settingsScene}`} data-settings-scene>
      <Space size="md" align="center" justify="space-between" wrap className={styles.gameHud}>
        <Space size="sm">
          {(['settings', 'gallery', 'search'] as const).map((name) => (
            <Button
              key={name}
              variant="plain"
              iconOnly
              aria-label={doorsIconAssets[name].label}
            >
              <Icon name={name} size={32} tone="cream" />
            </Button>
          ))}
        </Space>

      </Space>

      <Grid gap="md" responsive={false} className={styles.gameWorkspace}>
        <Space
          direction="vertical"
          size="md"
          className={styles.quickDock}
        >
          <Button
            variant="plain"
            iconOnly
            aria-label="打开背包"
            className={styles.quickButton}
          >
            <Icon name="backpack" size={64} tone="cream" />
          </Button>
          <Button
            variant="plain"
            iconOnly
            aria-label="打开日志"
            className={styles.quickButton}
          >
            <Icon name="journal" size={64} tone="cream" />
          </Button>
        </Space>

        {settingsOpen ? <Layout maxWidth="full" padding="none" className={styles.settingsPreview}>
          <Space size="md" align="center" justify="space-between" className={styles.settingsHeader}>
            <Text
              as="h3"
              variant="h2"
              tone="cream"
              id="settings-preview-title"
              className={styles.settingsTitle}
            >
              设置
            </Text>
            <Button
              variant="plain"
              iconOnly
              aria-label="关闭设置"
              className={styles.settingsClose}
              leadingIcon={<Icon name="close" size={64} tone="cream" />}
              onClick={() => setSettingsOpen(false)}
            />
          </Space>

          <Text as="div" variant="body" tone="inherit" className={styles.settingsBand}>音量</Text>
          <Space direction="vertical" size="none" className={styles.settingsRows}>
            <Slider label="大厅音乐" defaultValue={20} className={styles.settingsSlider} />
            <Slider label="游戏音乐" defaultValue={100} className={styles.settingsSlider} />
          </Space>

          <Text as="div" variant="body" tone="inherit" className={styles.settingsBand}>其他</Text>
          <Space direction="vertical" size="none" className={`${styles.settingsRows} ${styles.settingsOptions}`}>
            <Switch label="切换蹲姿" />
            <Switch label="减小动作幅度" defaultChecked />
            <Switch label="隐藏自己的衣服" defaultChecked />
            <Switch label="没有蜘蛛腿" defaultChecked />
          </Space>
        </Layout> : <Grid columns={1} gap="md" responsive={false} className={styles.settingsRestore}>
          <Button onClick={() => setSettingsOpen(true)}>重新打开设置</Button>
        </Grid>}
      </Grid>
    </Layout>
  );
}
