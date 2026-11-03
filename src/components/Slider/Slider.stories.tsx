import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Slider } from '.';

const meta = {
  title: 'P1/Controls/Slider',
  component: Slider,
  args: {
    label: '大厅音乐',
    defaultValue: 30,
    min: 0,
    max: 100,
    step: 1,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 'min(42rem, 88vw)' }}>
      <Slider {...args} />
    </div>
  ),
};

export const VolumeRows: Story = {
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
      <Slider label="大厅音乐" defaultValue={10} />
      <Slider label="游戏音乐" defaultValue={90} />
    </div>
  ),
};

export const KeyboardInput: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('slider', { name: '大厅音乐' });
    await userEvent.tab();
    await expect(control).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(control).toHaveValue('31');
  },
};
