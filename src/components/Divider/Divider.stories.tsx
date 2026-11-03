import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '.';

const meta = {
  title: 'P0/Layout/Divider',
  component: Divider,
  args: {
    orientation: 'horizontal',
    tone: 'subtle',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Subtle: Story = {
  render: (args) => (
    <div style={{ width: 'min(42rem, 85vw)' }}>
      <Divider {...args} />
    </div>
  ),
};

export const Labeled: Story = {
  args: {
    tone: 'accent',
    label: 'Interface glyphs',
  },
  render: (args) => (
    <div style={{ width: 'min(42rem, 85vw)' }}>
      <Divider {...args} />
    </div>
  ),
};
