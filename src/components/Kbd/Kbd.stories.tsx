import type { Meta, StoryObj } from '@storybook/react-vite';
import { Space } from '../Space';
import { Kbd } from '.';

const meta = {
  title: 'P0/Type/Kbd',
  component: Kbd,
  args: { children: '/', size: 'md' },
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Shortcut: Story = {
  render: () => <Space size="xs" align="center"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></Space>,
};
