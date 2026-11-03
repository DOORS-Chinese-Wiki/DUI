import type { Meta, StoryObj } from '@storybook/react-vite';
import { Space } from '../Space';
import { Text } from '.';

const meta = {
  title: 'P0/Type/Text',
  component: Text,
  args: {
    as: 'p',
    children: '每一扇门都从清晰的边界开始。',
    variant: 'body',
    tone: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'display',
        'h1',
        'h2',
        'h3',
        'label',
        'body',
        'small',
        'caption',
        'code',
      ],
    },
    tone: {
      control: 'inline-radio',
      options: ['inherit', 'default', 'cream', 'muted', 'quiet', 'accent', 'danger'],
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};

export const Display: Story = {
  args: {
    as: 'h1',
    variant: 'display',
    tone: 'cream',
    children: 'DON’T LOOK BACK.',
  },
};

export const ChineseAndEnglish: Story = {
  render: () => (
    <Space direction="vertical" size="lg" style={{ maxWidth: '42rem' }}>
      <Text as="p" variant="label" tone="accent">
        DOORSFONT / OSWALD / RUBIK / MISANS
      </Text>
      <Text as="p" variant="h2" tone="cream">
        Keep the door closed.
      </Text>
      <Text as="p" variant="body">
        中文正文由 MiSans 承接，英文正文使用 Rubik。层级比字号更重要。
      </Text>
      <Text as="p" variant="code" tone="accent">
        {'<Button variant="primary">ENTER</Button>'}
      </Text>
    </Space>
  ),
};
