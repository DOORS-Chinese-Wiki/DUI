import type { Meta, StoryObj } from '@storybook/react-vite';
import { InventoryBar } from '.';
const meta = {
  title: 'P1/Controls/InventoryBar', component: InventoryBar,
  args: { items: [
    { id: 'lighter', icon: 'lighter' }, { id: 'vitamins', icon: 'vitamins', count: 3 },
    { id: 'lockpick', icon: 'lockpick' }, { id: 'key', icon: 'skeletonKey', disabled: true },
    { id: 'empty', label: '空物品位' },
  ] },
  tags: ['autodocs'], parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 'min(44rem, 90vw)', padding: '0.75rem' }}><Story /></div>],
} satisfies Meta<typeof InventoryBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Unselected: Story = { args: { defaultValue: null } };
export const Gameplay: Story = {
  args: {
    defaultValue: null,
    items: [
      { id: 'vitamins', icon: 'vitamins' },
      { id: 'journal', icon: 'journal' },
      { id: 'flashlight', icon: 'flashlight', charge: 0.15 },
      { id: 'lockpick', icon: 'lockpick', charge: 0.45 },
      { id: 'lighter', icon: 'lighter', charge: 1 },
      { id: 'crucifix', icon: 'crucifix', disabled: true },
      { id: 'candle', icon: 'candle', size: 'sm' },
      { id: 'key', icon: 'skeletonKey', size: 'sm', count: 1 },
      { id: 'compass', icon: 'compass', size: 'sm', shape: 'circle' },
    ],
  },
};
