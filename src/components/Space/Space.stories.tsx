import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../Text';
import { Space } from '.';

const meta = {
  title: 'P0/Layout/Space',
  component: Space,
  args: {
    direction: 'horizontal',
    size: 'md',
    wrap: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj<typeof meta>;

const Block = ({ label }: { label: string }) => (
  <span
    style={{
      display: 'inline-flex',
      minWidth: '6rem',
      minHeight: '3rem',
      padding: '0.75rem',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#321f19',
      background: '#d0ae82',
      borderRadius: '0.5rem',
    }}
  >
    {label}
  </span>
);

export const Horizontal: Story = {
  render: (args) => (
    <Space {...args}>
      <Block label="04" />
      <Block label="08" />
      <Block label="12" />
    </Space>
  ),
};

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    size: 'lg',
  },
  render: (args) => (
    <Space {...args}>
      <Text as="p" variant="label" tone="accent">
        FIRST LINE
      </Text>
      <Block label="VERTICAL SPACE" />
      <Text as="p" variant="caption" tone="muted">
        The stack keeps rhythm without decorative dividers.
      </Text>
    </Space>
  ),
};
