import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Switch } from '../Switch';
import { Panel, PanelSection } from '.';
const meta = {
  title: 'P1/Containers/Panel', component: Panel,
  args: { title: '装备面板', description: '统一的标题、分组与操作区域。' },
  tags: ['autodocs'], parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 'min(40rem, 90vw)' }}><Story /></div>],
} satisfies Meta<typeof Panel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: args => <Panel {...args} footer={<Button>保存设置</Button>}><PanelSection title="操作偏好"><Switch label="显示提示" defaultChecked /></PanelSection></Panel>,
};
export const Closable: Story = { args: { onClose: () => {}, closeLabel: '关闭装备面板' } };
