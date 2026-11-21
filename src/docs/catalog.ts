export interface PropDefinition {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface DocPage {
  title: string;
  component: string;
  group: string;
  description: string;
  imports: string;
  note?: string;
  api: { component: string; props: PropDefinition[] }[];
}

const props = (rows: string[][]): PropDefinition[] => rows.map(
  ([name, type, defaultValue, description]) => ({ name, type, defaultValue, description }),
);

const lobbyMenuApi = { component: 'LobbyMenu', props: props([
  ['showStore', 'boolean', 'true', '显示商店入口；图标实例使用 false。'],
  ['items', 'readonly LobbyIconName[]', 'lobbyMenuIcons', '菜单中的图标及排列顺序，支持内置图标名称与 codes。'],
  ['onAction', '(action: LobbyMenuAction) => void', '—', '点击入口时返回图标名称或 store。'],
  ['aria-label', 'string', "'大厅菜单'", '菜单分组的无障碍名称。'],
]) };

const lobbyIconButtonApi = { component: 'LobbyIconButton', props: props([
  ['icon', "DoorsIconName | 'codes'", '必填', '图标素材；codes 显示兑换码图标。'],
  ['aria-label', 'string', '素材名称', '覆盖按钮的无障碍名称。'],
  ['onClick', 'MouseEventHandler<HTMLButtonElement>', '—', '点击或键盘激活时触发。'],
  ['disabled', 'boolean', 'false', '禁用操作、放大和反色反馈。'],
]) };

export const docPages = {
  panel: {
    title: '面板', component: 'Panel', group: '布局组件',
    description: 'Panel 容纳标题、内容和页脚。用 PanelSection 给控件分组。',
    imports: "import { Panel, PanelSection } from './components';",
    note: '在父组件中处理关闭、保存和恢复默认。',
    api: [
      { component: 'Panel', props: props([
        ['title', 'ReactNode', '必填', '面板标题，同时作为区域的无障碍名称。'],
        ['description', 'ReactNode', '—', '标题下方的说明。'],
        ['footer', 'ReactNode', '—', '页脚操作区域。'],
        ['onClose', '() => void', '—', '提供时显示关闭按钮。'],
        ['closeLabel', 'string', "'关闭面板'", '关闭按钮的无障碍名称。'],
        ['headingLevel', '2 | 3', '3', '标题的 HTML 层级。'],
      ]) },
      { component: 'PanelSection', props: props([
        ['title', 'ReactNode', '必填', '分组标题，使用统一的棕色标题带。'],
        ['children', 'ReactNode', '—', '分组内的控件或说明。'],
      ]) },
    ],
  },
  search: {
    title: '搜索与按键', component: 'SearchField / Kbd', group: '输入组件',
    description: 'SearchField 是带搜索图标和快捷键提示的输入框。',
    imports: "import { SearchField, Kbd } from './components';",
    note: '用 shortcut 显示按键，在页面中绑定对应的快捷键。',
    api: [
      { component: 'SearchField', props: props([
        ['value / defaultValue', 'string', '—', '原生受控或非受控搜索值。'],
        ['onChange', 'ChangeEventHandler<HTMLInputElement>', '—', '原生输入事件。'],
        ['shortcut', 'ReactNode', "'/'", '右侧按键提示；传 null 隐藏。'],
        ['size', "'sm' | 'md'", "'md'", '输入框与按键提示的尺寸。'],
        ['aria-label', 'string', "'搜索'", '输入框的无障碍名称。'],
        ['disabled', 'boolean', 'false', '禁用输入与悬停反馈。'],
        ['className / inputClassName', 'string', '—', '分别扩展外层和原生 input 的样式。'],
      ]) },
      { component: 'Kbd', props: props([
        ['children', 'ReactNode', '—', '按键文字，保留原生 kbd 语义。'],
        ['size', "'sm' | 'md'", "'md'", '按键提示尺寸。'],
      ]) },
    ],
  },
  tabs: {
    title: '标签页', component: 'Tabs', group: '导航组件',
    description: 'Tabs 在同一块区域切换内容。切换后，原面板中的输入值保留。',
    imports: "import { Tabs, type TabItem } from './components';",
    note: '左右方向键切换标签并跳过禁用项。Home 和 End 跳到首尾可用项。',
    api: [{ component: 'Tabs', props: props([
      ['items', 'TabItem[]', '必填', '每项包含 value、label、content，可选 icon 与 disabled。value 应唯一。'],
      ['label', 'string', '必填', '标签组的无障碍名称。'],
      ['value / defaultValue', 'string', '首个可用项', '受控选择值或初始选择值。'],
      ['onValueChange', '(value: string) => void', '—', '选择改变时触发。'],
    ]) }],
  },
  inventory: {
    title: '物品栏', component: 'InventoryBar', group: '物品与商店',
    description: '物品栏按一行排列。悬停时物品位放大，旁边的物品让位。窄屏横向滚动。',
    imports: "import { ItemSlot, InventoryBar, type InventoryItem } from './components';",
    note: '用 count 显示数量，用 charge 设置剩余资源。焦点在物品栏内时，按 1 到 9 选取对应槽位。',
    api: [
      { component: 'InventoryBar', props: props([
        ['items', 'InventoryItem[]', '必填', '每项包含唯一 id，可选 icon、label、count、disabled、size、shape 和 charge。'],
        ['value / defaultValue', 'string | null', '首个可用项', '受控选择或初始选择；null 表示未选中。'],
        ['onValueChange', '(id: string) => void', '—', '选择新物品位时触发。'],
        ['aria-label', 'string', "'物品栏'", '物品栏分组的无障碍名称。'],
      ]) },
      { component: 'ItemSlot', props: props([
        ['icon', 'DoorsIconName', '—', '物品素材；省略时显示空位。'],
        ['label', 'string', '素材名称', '覆盖物品的无障碍名称。'],
        ['count', 'number', '—', '提供时显示数量，包含 x1；数值至少为 1。'],
        ['size', "'sm' | 'md'", "'md'", '主要物品位或较小的辅助物品位。'],
        ['shape', "'square' | 'circle'", "'square'", '圆角矩形或圆形物品位。'],
        ['charge', 'number', '—', '提供时显示资源条，数值限制在 0–1，并加入按钮的无障碍说明。'],
        ['shortcut', 'ReactNode', '—', '位置按键提示，由使用方处理快捷键。'],
        ['selected / disabled', 'boolean', 'false', '选中或禁用状态。'],
      ]) },
    ],
  },
  currency: {
    title: '货币展示', component: 'CurrencyDisplay', group: '数据展示',
    description: '显示门把手、金币、复活次数和糖果数量。数值按千位分组。',
    imports: "import { CurrencyDisplay, CurrencyGroup } from './components';",
    api: [
      { component: 'CurrencyDisplay', props: props([
        ['kind', "'knobs' | 'gold' | 'revive' | 'candy'", '必填', '使用的资源素材。'],
        ['value', 'number', '必填', '展示数量；非有限值与负数显示为 0，小数截断。'],
        ['label', 'string', '资源名称', '覆盖无障碍名称与可见标签。'],
        ['size', "'sm' | 'md'", "'md'", '图标与数字尺寸。'],
        ['showLabel', 'boolean', 'false', '在数量旁显示资源名称。'],
      ]) },
      { component: 'CurrencyGroup', props: props([
        ['children', 'ReactNode', '—', '组合多个资源数量。'],
        ['aria-label', 'string', "'货币余额'", '资源组的无障碍名称，空间不足时自动换行。'],
      ]) },
    ],
  },
  shop: {
    title: '商店物品卡', component: 'ShopItemCard', group: '物品与商店',
    description: '商店卡显示物品、价格和购买状态。',
    imports: "import { ShopItemCard } from './components';",
    note: '示例购买扣除页面上的演示余额，并将物品标为已拥有。',
    api: [{ component: 'ShopItemCard', props: props([
      ['item', 'DoorsIconName', '必填', '物品素材名称。'],
      ['name / description', 'string / ReactNode', '素材名称 / —', '物品名称与说明。'],
      ['price', 'number', '必填', '展示价格，遵循货币展示的数值规则。'],
      ['currency', 'CurrencyKind', "'knobs'", '价格的资源类型。'],
      ['owned', 'boolean', 'false', '显示已拥有并禁用购买。'],
      ['available', 'boolean', 'true', 'false 时显示售罄。'],
      ['disabled', 'boolean', 'false', '禁用购买，例如余额不足。'],
      ['onPurchase', '() => void', '—', '请求购买，由使用方管理余额与所有权。'],
    ]) }],
  },
  achievements: {
    title: '成就卡', component: 'AchievementCard', group: '数据展示',
    description: '成就卡显示徽章、解锁状态和完成进度。',
    imports: "import { AchievementCard, doorsAchievementAssets } from './components';",
    api: [{ component: 'AchievementCard', props: props([
      ['achievement', 'DoorsAchievementName', '必填', '内置徽章：welcome、outOfMyWay、rockBottom。'],
      ['title / description', 'string / ReactNode', '徽章名称 / —', '标题与说明。'],
      ['unlocked', 'boolean', 'false', '已解锁状态；未解锁的徽章降低对比度。'],
      ['progress', 'number', '—', '提供时展示进度，数值限制在 0 到 max。'],
      ['max', 'number', '1', '进度上限，无效上限回退为 1。'],
    ]) }],
  },
  dialog: {
    title: '弹窗', component: 'Dialog', group: '交互能力',
    description: '弹窗打开后，键盘焦点留在窗口内。按 Esc 关闭，焦点回到打开按钮。',
    imports: "import { Dialog, Button } from './components';",
    note: '在父组件中用 open 控制开关，在 onOpenChange 中更新状态。',
    api: [{ component: 'Dialog', props: props([
      ['open', 'boolean', '必填', '是否打开弹窗。'],
      ['onOpenChange', '(open: boolean) => void', '必填', 'Escape、关闭按钮或遮罩请求关闭时触发。'],
      ['title', 'ReactNode', '必填', '标题，同时作为弹窗的无障碍名称。'],
      ['description', 'ReactNode', '—', '弹窗说明，并关联 aria-describedby。'],
      ['footer', 'ReactNode', '—', '底部操作区域。'],
      ['closeLabel', 'string', "'关闭弹窗'", '关闭按钮的无障碍名称。'],
      ['closeOnBackdrop', 'boolean', 'true', '是否允许点击遮罩请求关闭。'],
    ]) }],
  },
  actions: {
    title: '按钮', component: 'Button', group: '基础组件',
    description: '用 Button 触发操作。通过 variant 选择样式，用 loading 显示加载状态。',
    imports: "import { Button, Icon } from './components';",
    note: '纯图标按钮需要 aria-label。链接按钮使用 asChild，并传入一个 a 元素。',
    api: [{ component: 'Button', props: props([
      ['variant', "'primary' | 'secondary' | 'ghost' | 'plain' | 'danger'", "'primary'", '按钮的视觉层级。'],
      ['size', "'sm' | 'md' | 'lg'", "'md'", '按钮高度、内边距和字号。'],
      ['leadingIcon / trailingIcon', 'ReactNode', '—', '文字前后展示的图标。'],
      ['loading', 'boolean', 'false', '显示加载指示，同时禁用操作。'],
      ['loadingLabel', 'string', "'Loading'", '提供给辅助技术的加载说明。'],
      ['disabled', 'boolean', 'false', '原生禁用状态。'],
      ['iconOnly / fullWidth', 'boolean', 'false', '纯图标模式或占满可用宽度。'],
      ['asChild', 'boolean', 'false', '将样式和行为应用到单个子元素。'],
    ]) }],
  },
  icons: {
    title: '图标', component: 'Icon', group: '基础组件',
    description: 'Icon 显示图标。LobbyIconButton 把图标做成大厅入口。',
    imports: "import { LobbyMenu, LobbyIconButton, Icon } from './components';",
    api: [lobbyIconButtonApi, lobbyMenuApi, { component: 'Icon', props: props([
      ['name', 'DoorsIconName', '—', '项目内置的界面或物品图标名称。'],
      ['src', 'string', '—', '自定义素材路径，优先于 name。'],
      ['size', '16 | 20 | 24 | 32 | 48 | 64', '24', '图标容器边长，单位 px。'],
      ['tone', "'inherit' | 'cream' | 'muted' | 'accent' | 'danger'", "'inherit'", '蒙版图标的颜色。'],
      ['alt', 'string', '—', '图标的无障碍说明。'],
      ['mask', 'boolean', '按素材类型', '是否将素材作为单色蒙版显示。'],
    ]) }],
  },
  typography: {
    title: '文字', component: 'Text', group: '基础组件',
    description: '用 variant 选择字阶，用 as 指定 HTML 标签。',
    imports: "import { Text } from './components';",
    api: [{ component: 'Text', props: props([
      ['as', 'ElementType', "'span'", '实际渲染的 HTML 元素。'],
      ['variant', "'display' | 'h1' | 'h2' | 'h3' | 'label' | 'body' | 'small' | 'caption' | 'code'", "'body'", '字体、字号和字阶。'],
      ['tone', "'inherit' | 'default' | 'cream' | 'muted' | 'quiet' | 'accent' | 'danger'", "'default'", '文字颜色；inherit 跟随所在控件的当前颜色。'],
      ['align', "'start' | 'center' | 'end'", "'start'", '文字对齐方式。'],
      ['truncate', 'boolean', 'false', '单行溢出时显示省略号。'],
    ]) }],
  },
  slider: {
    title: '滑动条', component: 'Slider', group: '输入组件',
    description: '用 Slider 调整音量等数值。min、max 和 step 决定范围与步长。',
    imports: "import { Slider } from './components';",
    note: '方向键按步长调整数值。Home 和 End 分别跳到最小值和最大值。',
    api: [{ component: 'Slider', props: props([
      ['label / description', 'ReactNode', '—', '可访问名称和辅助说明。'],
      ['value', 'number', '—', '受控数值，配合 onValueChange 使用。'],
      ['defaultValue', 'number', '0', '非受控模式的初始数值。'],
      ['min / max', 'number | string', '0 / 100', '数值区间。'],
      ['step', 'number | string', '1', '每次调整的步长。'],
      ['onValueChange', '(value: number) => void', '—', '数值变化时的回调。'],
      ['disabled', 'boolean', 'false', '禁用指针及键盘操作。'],
    ]) }],
  },
  switch: {
    title: '开关', component: 'Switch', group: '输入组件',
    description: '用 Switch 开启或关闭一项设置。点击标签或按空格切换。',
    imports: "import { Switch } from './components';",
    note: 'onChange 的参数是原生事件。onCheckedChange 的参数是布尔值。',
    api: [{ component: 'Switch', props: props([
      ['label / description', 'ReactNode', '—', '选项名称和补充说明。'],
      ['checked', 'boolean', '—', '受控开关状态。'],
      ['defaultChecked', 'boolean', 'false', '非受控模式的初始状态。'],
      ['onCheckedChange', '(checked: boolean) => void', '—', '开关状态变化回调。'],
      ['size', "'sm' | 'md'", "'md'", '开关尺寸。'],
      ['disabled', 'boolean', 'false', '禁用选项。'],
    ]) }],
  },
  layout: {
    title: '布局', component: 'Layout & Space', group: '布局组件',
    description: 'Layout 限制内容宽度。Space 排列一组元素，Grid 划分列，Divider 分隔内容。',
    imports: "import { Layout, Space, Grid, Divider } from './components';",
    note: '固定列数时，设置 columns 和 responsive={false}。',
    api: [
      { component: 'Layout', props: props([
        ['as', 'ElementType', "'div'", '容器使用的 HTML 元素。'],
        ['maxWidth', "'prose' | 'content' | 'wide' | 'full'", "'content'", '内容区域的最大宽度。'],
        ['padding', "'none' | 'compact' | 'default' | 'spacious'", "'default'", '响应式水平内边距。'],
      ]) },
      { component: 'Space', props: props([
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", '子元素排列方向。'],
        ['size', "'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'", "'md'", '使用间距 token。'],
        ['align / justify', "CSSProperties['alignItems'] / CSSProperties['justifyContent']", '—', '交叉轴和主轴的对齐方式。'],
        ['wrap', 'boolean', 'false', '空间不足时允许换行。'],
      ]) },
      { component: 'Grid', props: props([
        ['columns', 'number', '—', '固定列数；搭配 responsive={false}。'],
        ['minItemWidth', 'number | string', '208', '自适应网格单元格最小宽度。'],
        ['gap', 'SpaceSize', "'md'", '网格单元格间距。'],
        ['responsive', 'boolean', 'true', '使用自适应列与移动端断点。'],
      ]) },
      { component: 'Divider', props: props([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", '分隔线方向。'],
        ['tone', "'subtle' | 'accent'", "'subtle'", '分隔线颜色。'],
        ['label', 'ReactNode', '—', '分隔线中的说明文字。'],
      ]) },
    ],
  },
  sound: {
    title: '音效', component: 'SoundProvider', group: '交互能力',
    description: 'SoundProvider 为内部按钮提供交互音效。设置 enabled 后启用。',
    imports: "import { SoundProvider, Button } from './components';",
    api: [{ component: 'SoundProvider', props: props([
      ['children', 'ReactNode', '必填', '需要共享音效配置的组件。'],
      ['enabled', 'boolean', 'false', '是否播放交互音效。'],
      ['volume', 'number', '0.42', '音量限制在 0–1。'],
      ['sounds', 'Partial<SoundSources>', '内置音频', '覆盖 hover、leave、press、click 的音频地址。'],
    ]) }],
  },
  lobby: {
    title: '大厅', component: 'LobbyMenu', group: '组合示例',
    description: 'HOST GAME 位于上方，商店和快捷入口排成一行。窄屏按容器宽度缩放。',
    imports: "import { Button, LobbyMenu, Space } from './components';",
    api: [lobbyMenuApi, lobbyIconButtonApi],
  },
  settings: {
    title: '设置面板', component: 'Settings panel', group: '组合示例',
    description: '设置面板用滑动条调整音量，用开关切换游戏选项。',
    imports: "import { Slider, Switch, Space } from './components';",
    note: '设置保留在当前页面，刷新后恢复默认值。',
    api: [],
  },
} satisfies Record<string, DocPage>;

export type DocId = keyof typeof docPages;
export const docOrder: DocId[] = [
  'actions', 'icons', 'typography', 'panel', 'layout', 'search', 'slider', 'switch', 'tabs',
  'inventory', 'shop', 'currency', 'achievements', 'dialog', 'sound', 'lobby', 'settings',
];

export const quickStartCode = `// src/App.tsx
import { Button, Icon } from './components';

export default function App() {
  return (
    <Button leadingIcon={<Icon name="items" size={20} />}>
      打开物品栏
    </Button>
  );
}`;
