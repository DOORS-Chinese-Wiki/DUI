import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from '../Grid';
import { LobbyIconButton, LobbyMenu } from '../LobbyMenu';
import { Space } from '../Space';
import { Text } from '../Text';
import { Icon } from '.';
import { doorsIconAssets } from './assets';

const meta = {
  title: 'P0/Assets/Icon',
  component: Icon,
  args: {
    name: 'settings',
    alt: '设置',
    size: 48,
    tone: 'cream',
  },
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(doorsIconAssets),
    },
    tone: {
      control: 'inline-radio',
      options: ['inherit', 'cream', 'muted', 'accent', 'danger'],
    },
    size: {
      control: 'inline-radio',
      options: [16, 20, 24, 32, 48, 64],
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InterfaceGlyph: Story = {};

export const ItemAsset: Story = {
  args: {
    name: 'flashlight',
    alt: '手电筒',
    size: 64,
  },
};

export const LobbyMenuInstance: Story = {
  render: () => <div style={{ width: 'min(48rem, 90vw)' }}><LobbyMenu showStore={false} /></div>,
};

export const AssetMatrix: Story = {
  render: () => (
    <Grid columns={6} minItemWidth={100} style={{ width: 'min(48rem, 90vw)' }}>
      {Object.entries(doorsIconAssets).map(([name, asset]) => (
        <Space key={name} direction="vertical" size="sm" align="center">
          <LobbyIconButton icon={name as keyof typeof doorsIconAssets} aria-label={asset.label} />
          <Text as="span" variant="caption" tone="muted">
            {name}
          </Text>
        </Space>
      ))}
    </Grid>
  ),
};
