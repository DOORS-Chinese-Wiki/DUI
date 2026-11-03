import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Switch } from '.';

const meta = {
  title: 'P1/Controls/Switch',
  component: Switch,
  args: {
    label: '切换蹲姿',
    defaultChecked: false,
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 'min(34rem, 85vw)' }}>
      <Switch {...args} />
    </div>
  ),
};

export const SettingsRows: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        width: 'min(42rem, 88vw)',
        padding: '1.25rem',
        border: '3px solid #f7ddbe',
        borderRadius: '0.5rem',
        background: '#2f1b15',
      }}
    >
      <div
        style={{
          padding: '0.65rem 1rem',
          borderRadius: '0.5rem',
          color: '#f7ddbe',
          background: '#49322b',
          fontFamily: '"Rubik Variable", "MiSans", sans-serif',
          fontSize: '1.35rem',
        }}
      >
        其他
      </div>
      <Switch label="切换蹲姿" defaultChecked />
      <Switch label="减少动作幅度" />
      <Switch label="隐藏自己的衣服" defaultChecked />
      <Switch label="没有蜘蛛腿" />
    </div>
  ),
};

export const KeyboardAndPointer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: '切换蹲姿' });
    await userEvent.tab();
    await expect(control).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(control).toBeChecked();
  },
};
