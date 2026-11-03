import type { ComponentType } from 'react';
import type { DocId } from '../catalog';
import PanelExample from './PanelExample';
import PanelExampleSource from './PanelExample.tsx?raw';
import PanelExampleStyles from './PanelExample.module.css?raw';
import TabsExample from './TabsExample';
import TabsExampleSource from './TabsExample.tsx?raw';
import TabsExampleStyles from './TabsExample.module.css?raw';
import InventoryExample from './InventoryExample';
import InventoryExampleSource from './InventoryExample.tsx?raw';
import InventoryExampleStyles from './InventoryExample.module.css?raw';
import CurrencyExample from './CurrencyExample';
import CurrencyExampleSource from './CurrencyExample.tsx?raw';
import CurrencyExampleStyles from './CurrencyExample.module.css?raw';
import ShopExample from './ShopExample';
import ShopExampleSource from './ShopExample.tsx?raw';
import ShopExampleStyles from './ShopExample.module.css?raw';
import AchievementsExample from './AchievementsExample';
import AchievementsExampleSource from './AchievementsExample.tsx?raw';
import AchievementsExampleStyles from './AchievementsExample.module.css?raw';
import DialogExample from './DialogExample';
import DialogExampleSource from './DialogExample.tsx?raw';
import DialogExampleStyles from './DialogExample.module.css?raw';
import SearchExample from './SearchExample';
import SearchExampleSource from './SearchExample.tsx?raw';
import SearchExampleStyles from './SearchExample.module.css?raw';
import ActionsExample from './ActionsExample';
import ActionsExampleSource from './ActionsExample.tsx?raw';
import ActionsExampleStyles from './ActionsExample.module.css?raw';
import IconsExample from './IconsExample';
import IconsExampleSource from './IconsExample.tsx?raw';
import IconsExampleStyles from './IconsExample.module.css?raw';
import TypographyExample from './TypographyExample';
import TypographyExampleSource from './TypographyExample.tsx?raw';
import TypographyExampleStyles from './TypographyExample.module.css?raw';
import LayoutExample from './LayoutExample';
import LayoutExampleSource from './LayoutExample.tsx?raw';
import LayoutExampleStyles from './LayoutExample.module.css?raw';
import SliderExample from './SliderExample';
import SliderExampleSource from './SliderExample.tsx?raw';
import SliderExampleStyles from './SliderExample.module.css?raw';
import SwitchExample from './SwitchExample';
import SwitchExampleSource from './SwitchExample.tsx?raw';
import SwitchExampleStyles from './SwitchExample.module.css?raw';
import SettingsExample from './SettingsExample';
import SettingsExampleSource from './SettingsExample.tsx?raw';
import SettingsExampleStyles from './SettingsExample.module.css?raw';
import LobbyExample from './LobbyExample';
import LobbyExampleSource from './LobbyExample.tsx?raw';
import LobbyExampleStyles from './LobbyExample.module.css?raw';
import SoundExample from './SoundExample';
import SoundExampleSource from './SoundExample.tsx?raw';
import SoundExampleStyles from './SoundExample.module.css?raw';

export interface ExampleFile {
  filename: string;
  path: string;
  language: 'tsx' | 'css';
  source: string;
}

export interface ExampleDefinition {
  Component: ComponentType;
  files: ExampleFile[];
}

// Render and display the same module; Vite imports each actual file as text.
export const examples: Record<DocId, ExampleDefinition> = {
  panel: {
    Component: PanelExample,
    files: [
      { filename: 'PanelExample.tsx', path: 'src/docs/examples/PanelExample.tsx', language: 'tsx', source: PanelExampleSource },
      { filename: 'PanelExample.module.css', path: 'src/docs/examples/PanelExample.module.css', language: 'css', source: PanelExampleStyles },
    ],
  },
  tabs: {
    Component: TabsExample,
    files: [
      { filename: 'TabsExample.tsx', path: 'src/docs/examples/TabsExample.tsx', language: 'tsx', source: TabsExampleSource },
      { filename: 'TabsExample.module.css', path: 'src/docs/examples/TabsExample.module.css', language: 'css', source: TabsExampleStyles },
    ],
  },
  inventory: {
    Component: InventoryExample,
    files: [
      { filename: 'InventoryExample.tsx', path: 'src/docs/examples/InventoryExample.tsx', language: 'tsx', source: InventoryExampleSource },
      { filename: 'InventoryExample.module.css', path: 'src/docs/examples/InventoryExample.module.css', language: 'css', source: InventoryExampleStyles },
    ],
  },
  currency: {
    Component: CurrencyExample,
    files: [
      { filename: 'CurrencyExample.tsx', path: 'src/docs/examples/CurrencyExample.tsx', language: 'tsx', source: CurrencyExampleSource },
      { filename: 'CurrencyExample.module.css', path: 'src/docs/examples/CurrencyExample.module.css', language: 'css', source: CurrencyExampleStyles },
    ],
  },
  shop: {
    Component: ShopExample,
    files: [
      { filename: 'ShopExample.tsx', path: 'src/docs/examples/ShopExample.tsx', language: 'tsx', source: ShopExampleSource },
      { filename: 'ShopExample.module.css', path: 'src/docs/examples/ShopExample.module.css', language: 'css', source: ShopExampleStyles },
    ],
  },
  achievements: {
    Component: AchievementsExample,
    files: [
      { filename: 'AchievementsExample.tsx', path: 'src/docs/examples/AchievementsExample.tsx', language: 'tsx', source: AchievementsExampleSource },
      { filename: 'AchievementsExample.module.css', path: 'src/docs/examples/AchievementsExample.module.css', language: 'css', source: AchievementsExampleStyles },
    ],
  },
  dialog: {
    Component: DialogExample,
    files: [
      { filename: 'DialogExample.tsx', path: 'src/docs/examples/DialogExample.tsx', language: 'tsx', source: DialogExampleSource },
      { filename: 'DialogExample.module.css', path: 'src/docs/examples/DialogExample.module.css', language: 'css', source: DialogExampleStyles },
    ],
  },
  search: {
    Component: SearchExample,
    files: [
      { filename: 'SearchExample.tsx', path: 'src/docs/examples/SearchExample.tsx', language: 'tsx', source: SearchExampleSource },
      { filename: 'SearchExample.module.css', path: 'src/docs/examples/SearchExample.module.css', language: 'css', source: SearchExampleStyles },
    ],
  },
  actions: {
    Component: ActionsExample,
    files: [
      { filename: 'ActionsExample.tsx', path: 'src/docs/examples/ActionsExample.tsx', language: 'tsx', source: ActionsExampleSource },
      { filename: 'ActionsExample.module.css', path: 'src/docs/examples/ActionsExample.module.css', language: 'css', source: ActionsExampleStyles },
    ],
  },
  icons: {
    Component: IconsExample,
    files: [
      { filename: 'IconsExample.tsx', path: 'src/docs/examples/IconsExample.tsx', language: 'tsx', source: IconsExampleSource },
      { filename: 'IconsExample.module.css', path: 'src/docs/examples/IconsExample.module.css', language: 'css', source: IconsExampleStyles },
    ],
  },
  typography: {
    Component: TypographyExample,
    files: [
      { filename: 'TypographyExample.tsx', path: 'src/docs/examples/TypographyExample.tsx', language: 'tsx', source: TypographyExampleSource },
      { filename: 'TypographyExample.module.css', path: 'src/docs/examples/TypographyExample.module.css', language: 'css', source: TypographyExampleStyles },
    ],
  },
  layout: {
    Component: LayoutExample,
    files: [
      { filename: 'LayoutExample.tsx', path: 'src/docs/examples/LayoutExample.tsx', language: 'tsx', source: LayoutExampleSource },
      { filename: 'LayoutExample.module.css', path: 'src/docs/examples/LayoutExample.module.css', language: 'css', source: LayoutExampleStyles },
    ],
  },
  slider: {
    Component: SliderExample,
    files: [
      { filename: 'SliderExample.tsx', path: 'src/docs/examples/SliderExample.tsx', language: 'tsx', source: SliderExampleSource },
      { filename: 'SliderExample.module.css', path: 'src/docs/examples/SliderExample.module.css', language: 'css', source: SliderExampleStyles },
    ],
  },
  switch: {
    Component: SwitchExample,
    files: [
      { filename: 'SwitchExample.tsx', path: 'src/docs/examples/SwitchExample.tsx', language: 'tsx', source: SwitchExampleSource },
      { filename: 'SwitchExample.module.css', path: 'src/docs/examples/SwitchExample.module.css', language: 'css', source: SwitchExampleStyles },
    ],
  },
  settings: {
    Component: SettingsExample,
    files: [
      { filename: 'SettingsExample.tsx', path: 'src/docs/examples/SettingsExample.tsx', language: 'tsx', source: SettingsExampleSource },
      { filename: 'SettingsExample.module.css', path: 'src/docs/examples/SettingsExample.module.css', language: 'css', source: SettingsExampleStyles },
    ],
  },
  lobby: {
    Component: LobbyExample,
    files: [
      { filename: 'LobbyExample.tsx', path: 'src/docs/examples/LobbyExample.tsx', language: 'tsx', source: LobbyExampleSource },
      { filename: 'LobbyExample.module.css', path: 'src/docs/examples/LobbyExample.module.css', language: 'css', source: LobbyExampleStyles },
    ],
  },
  sound: {
    Component: SoundExample,
    files: [
      { filename: 'SoundExample.tsx', path: 'src/docs/examples/SoundExample.tsx', language: 'tsx', source: SoundExampleSource },
      { filename: 'SoundExample.module.css', path: 'src/docs/examples/SoundExample.module.css', language: 'css', source: SoundExampleStyles },
    ],
  },
};
