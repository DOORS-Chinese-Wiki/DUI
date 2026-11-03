import type { Meta, StoryObj } from '@storybook/react-vite';
import { CurrencyDisplay, CurrencyGroup } from '.';
const meta = {
  title: 'P1/Data/CurrencyDisplay', component: CurrencyDisplay,
  args: { kind: 'knobs', value: 1250, showLabel: true },
  tags: ['autodocs'], parameters: { layout: 'centered' },
} satisfies Meta<typeof CurrencyDisplay>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { size: 'sm', kind: 'gold', value: 680 } };
export const Group: Story = { render: () => <CurrencyGroup><CurrencyDisplay kind="knobs" value={1250} /><CurrencyDisplay kind="gold" value={680} /><CurrencyDisplay kind="revive" value={2} /></CurrencyGroup> };
