import type { Meta, StoryObj } from '@storybook/react-vite';
import { AchievementCard } from '.';
const meta = {
  title: 'P1/Data/AchievementCard', component: AchievementCard,
  args: { achievement: 'welcome', unlocked: true, description: '演示已解锁状态。' },
  tags: ['autodocs'], parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 'min(28rem, 90vw)' }}><Story /></div>],
} satisfies Meta<typeof AchievementCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Locked: Story = { args: { achievement: 'rockBottom', unlocked: false, description: '演示未解锁状态。' } };
export const Progress: Story = { args: { achievement: 'outOfMyWay', unlocked: false, progress: 3, max: 5, description: '演示进度，不代表游戏成就条件。' } };
