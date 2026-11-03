import type { Meta, StoryObj } from '@storybook/react-vite';
import { Layout } from '.';

const meta = {
  title: 'P0/Layout/Layout',
  component: Layout,
  args: {
    maxWidth: 'content',
    padding: 'default',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Content: Story = {
  render: (args) => (
    <Layout {...args}>
      <div
        style={{
          minHeight: '12rem',
          border: '1px solid #5a4439',
          borderRadius: '1.25rem',
          background: '#2f1b15',
        }}
      />
    </Layout>
  ),
};

export const Prose: Story = {
  args: {
    maxWidth: 'prose',
    padding: 'spacious',
  },
};
