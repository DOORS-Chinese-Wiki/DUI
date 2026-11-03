import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShopItemCard } from '.';
const meta = {
  title: 'P1/Commerce/ShopItemCard', component: ShopItemCard,
  args: { item: 'lighter', price: 25, description: '仅为组件示例价格。' },
  tags: ['autodocs'], parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 'min(20rem, 90vw)' }}><Story /></div>],
} satisfies Meta<typeof ShopItemCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Owned: Story = { args: { owned: true } };
export const SoldOut: Story = { args: { available: false, item: 'skeletonKey' } };
export const Disabled: Story = { args: { disabled: true } };
