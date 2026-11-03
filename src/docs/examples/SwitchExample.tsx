import { useState } from 'react';
import { Grid, Switch, Text } from '../../components';
import styles from './SwitchExample.module.css';

export default function SwitchExample() {
  const [hintsEnabled, setHintsEnabled] = useState(true);
  return (
    <Grid columns={1} gap="md" responsive={false} data-doc-controls className={styles.documentationControls}>
      <Switch label="交互提示" description="显示操作提示"
        checked={hintsEnabled} onCheckedChange={setHintsEnabled} />
      <output aria-live="polite"><Text variant="code" tone="inherit">交互提示{hintsEnabled ? '已开启' : '已关闭'}</Text></output>
      <Switch label="小号开关" size="sm" defaultChecked />
      <Switch label="不可更改的选项" disabled />
    </Grid>
  );
}
