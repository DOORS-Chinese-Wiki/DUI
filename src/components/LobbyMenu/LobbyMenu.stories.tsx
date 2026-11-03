import type { Meta, StoryObj } from '@storybook/react-vite';
import { LobbyIconButton, LobbyMenu } from '.';

const meta = {
  title: 'P1/Controls/LobbyMenu',
  component: LobbyMenu,
  args: { showStore: true },
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 'min(52rem, 90vw)' }}><Story /></div>],
} satisfies Meta<typeof LobbyMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const IconsOnly: Story = { args: { showStore: false } };
export const CustomItems: Story = { args: { showStore: false, items: ['backpack', 'journal', 'inventorySlot'] } };
export const DisabledIcon: Story = { render: () => <LobbyIconButton icon="settings" disabled /> };
