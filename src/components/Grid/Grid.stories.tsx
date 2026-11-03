import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../Text';
import { Grid } from '.';

const meta = {
  title: 'P0/Layout/Grid',
  component: Grid,
  args: {
    minItemWidth: 180,
    gap: 'md',
    responsive: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {
  render: (args) => (
    <div style={{ width: 'min(70rem, 92vw)' }}>
      <Grid {...args}>
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            style={{
              minHeight: '8rem',
              padding: '1rem',
              border: '1px solid #5a4439',
              borderRadius: '0.875rem',
              background: '#2f1b15',
            }}
          >
            <Text as="span" variant="label" tone="accent">
              CELL {String(index + 1).padStart(2, '0')}
            </Text>
          </div>
        ))}
      </Grid>
    </div>
  ),
};

export const FixedFourColumns: Story = {
  args: {
    columns: 4,
  },
  render: Responsive.render,
};
