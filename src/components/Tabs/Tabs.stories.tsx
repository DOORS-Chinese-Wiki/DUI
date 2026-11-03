import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '../Switch';
import { Text } from '../Text';
import { Tabs } from '.';
const meta = {
  title: 'P1/Controls/Tabs', component: Tabs,
  args: { label: '装备分类', items: [
    { value: 'inventory', label: '背包', content: <Text>随身物品</Text> },
    { value: 'locked', label: '未开放', disabled: true, content: null },
    { value: 'settings', label: '偏好设置', content: <Switch label="显示提示" defaultChecked /> },
  ] },
  tags: ['autodocs'], parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 'min(40rem, 90vw)' }}><Story /></div>],
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SecondPanel: Story = { args: { defaultValue: 'settings' } };
