import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchField } from '.';

const meta = {
  title: 'P1/Controls/SearchField',
  component: SearchField,
  args: { 'aria-label': '搜索组件文档', placeholder: '搜索组件文档…', shortcut: '/' },
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 'min(32rem, 88vw)' }}><Story /></div>],
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { size: 'sm' } };
export const WithoutShortcut: Story = { args: { shortcut: null } };
export const Disabled: Story = { args: { disabled: true } };
