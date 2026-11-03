import type { Preview } from '@storybook/react-vite';
import { create, themes } from 'storybook/theming';
import { SoundProvider } from '../src';
import '../src/styles/global.css';

const doorsTheme = create({
  base: 'dark',
  brandTitle: 'DUI',
  brandUrl: './?path=/docs/dui-overview--docs',
  colorPrimary: '#f7ddbe',
  colorSecondary: '#d0ae82',
  appBg: '#1a100d',
  appContentBg: '#241510',
  appBorderColor: '#5a4439',
  appBorderRadius: 8,
  textColor: '#e6e6e6',
  textInverseColor: '#321f19',
  barBg: '#2f1b15',
  barTextColor: '#e6e6e6',
  barSelectedColor: '#d0ae82',
  inputBg: '#2f1b15',
  inputBorder: '#d0ae82',
  inputTextColor: '#f7ddbe',
  fontBase: '"Rubik Variable", "MiSans", sans-serif',
  fontCode: '"Inconsolata Variable", monospace',
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <SoundProvider>
        <div
          style={{
            minHeight: '100vh',
            color: '#e6e6e6',
            background: '#1a100d',
          }}
        >
          <Story />
        </div>
      </SoundProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    backgrounds: {
      options: {
        doors: { name: 'DOORS', value: '#1a100d' },
        bark: { name: 'Bark', value: '#2f1b15' },
      },
    },
    docs: {
      theme: doorsTheme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['P0', ['Overview', 'Actions', 'Assets', 'Type', 'Layout']],
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  initialGlobals: {
    backgrounds: {
      value: 'doors',
    },
  },
  tags: ['autodocs'],
};

export default preview;
