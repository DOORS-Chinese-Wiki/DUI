import { useState } from 'react';
import { Button, Panel, PanelSection, Slider, Space, Switch, Text } from '../../components';
import styles from './PanelExample.module.css';

export default function PanelExample() {
  const [open, setOpen] = useState(true);
  const [volume, setVolume] = useState(35);
  const [hints, setHints] = useState(true);
  const [status, setStatus] = useState('更改仅保留在本示例中。');
  return <Space direction="vertical" size="md" className={styles.example}>
    {open ? <Panel title="装备面板" description="由现有按钮、滑动条和开关组成的可复用面板。"
      onClose={() => setOpen(false)} closeLabel="关闭装备面板" footer={<>
        <Button variant="secondary" onClick={() => { setVolume(35); setHints(true); setStatus('已恢复演示默认值。'); }}>恢复默认</Button>
        <Button onClick={() => setStatus('已保存：音量 ' + volume + '%，提示' + (hints ? '开启' : '关闭'))}>保存设置</Button>
      </>}>
      <PanelSection title="声音与提示">
        <Slider label="面板音量" value={volume} onValueChange={setVolume} />
        <Switch label="装备提示" checked={hints} onCheckedChange={setHints} />
      </PanelSection>
    </Panel> : <Button onClick={() => setOpen(true)}>重新打开面板</Button>}
    <Text as="p" role="status" variant="small" tone="accent">{status}</Text>
  </Space>;
}
