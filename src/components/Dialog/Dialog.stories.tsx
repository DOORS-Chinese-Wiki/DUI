import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Text } from '../Text';
import { Dialog } from '.';
const meta = {
  title: 'P1/Feedback/Dialog', component: Dialog,
  args: { open: false, onOpenChange: () => {}, title: '出发前装备', description: '可通过 Escape 或关闭按钮返回。' },
  tags: ['autodocs'], parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function Example(args) {
    const [open, setOpen] = useState(false);
    return <><Button onClick={() => setOpen(true)}>打开弹窗</Button>
      <Dialog {...args} open={open} onOpenChange={setOpen} footer={<Button onClick={() => setOpen(false)}>确认</Button>}><Text>复用 Panel 和原生模态行为。</Text></Dialog></>;
  },
};
