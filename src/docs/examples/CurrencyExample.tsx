import { useState } from 'react';
import { Button, CurrencyDisplay, CurrencyGroup, Panel, Space, Text } from '../../components';
import styles from './CurrencyExample.module.css';

export default function CurrencyExample() {
  const [knobs, setKnobs] = useState(1250);
  return <Space direction="vertical" size="md" className={styles.example}>
    <Panel title="随身资源" description="图标使用维基原始素材，数量是可交互的演示数据。">
      <CurrencyGroup aria-label="资源数量">
        <CurrencyDisplay kind="knobs" value={knobs} showLabel />
        <CurrencyDisplay kind="gold" value={680} showLabel />
        <CurrencyDisplay kind="revive" value={2} showLabel />
        <CurrencyDisplay kind="candy" value={152} showLabel />
      </CurrencyGroup>
      <Space size="sm" wrap>
        <Button size="sm" onClick={() => setKnobs(value => value + 50)}>增加 50 旋钮</Button>
        <Button size="sm" variant="secondary" onClick={() => setKnobs(1250)}>重置资源</Button>
      </Space>
    </Panel>
    <Text as="output" variant="small" tone="accent" aria-live="polite">当前旋钮：{knobs}</Text>
  </Space>;
}
