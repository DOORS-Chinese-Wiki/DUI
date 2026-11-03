import { useState } from 'react';
import { Grid, Slider, Text } from '../../components';
import styles from './SliderExample.module.css';

export default function SliderExample() {
  const [volume, setVolume] = useState(35);
  return (
    <Grid columns={1} gap="md" responsive={false} data-doc-controls className={styles.documentationControls}>
      <Slider id="documentation-volume" label="音乐音量"
        description="拖动或使用方向键调整" value={volume} onValueChange={setVolume} />
      <output htmlFor="documentation-volume" aria-live="polite"><Text variant="code" tone="inherit">当前音量：{volume}%</Text></output>
      <Slider label="不可调整的音量" defaultValue={65} disabled />
    </Grid>
  );
}
