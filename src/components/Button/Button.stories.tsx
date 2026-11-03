import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '.';

const meta = {
  title: 'P0/Actions/Button',
  component: Button,
  args: {
    children: 'ENTER THE DOOR',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost', 'plain', 'danger'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'OPEN INVENTORY',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'LEAVE THE RUN',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'HOST GAME',
    loadingLabel: '正在创建房间',
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    'aria-label': '打开设置',
    children: '⚙',
  },
};

export const KeyboardActivation: Story = {
  args: {
    children: 'KEYBOARD READY',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'KEYBOARD READY' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
