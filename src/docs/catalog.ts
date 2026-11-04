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
    description: '沿用设置面板的深棕底色、奶油色描边与分组标题。Panel 与 PanelSection 可组合按钮、滑动条、开关和页脚操作。',
    imports: "import { Panel, PanelSection } from './components';",
    note: '关闭、保存和恢复默认由使用方处理。面板只组织内容，不接管子组件状态；示例会保留当前演示设置。',
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
    description: '基于维基搜索框风格的输入框与按键提示。复用已有搜索图标，支持原生输入属性、受控值和输入框 ref。',
    imports: "import { SearchField, Kbd } from './components';",
    note: 'shortcut 只显示按键提示，快捷键逻辑由使用方绑定。文档顶部支持 /、Ctrl+K 和 ⌘K；下方示例只演示局部筛选。',
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
    description: '使用现有 Button 切换同一上下文中的内容。支持受控与非受控选择、禁用项、方向键和 Home / End。',
    imports: "import { Tabs, type TabItem } from './components';",
    note: '标签使用自动激活模式，键盘焦点移动时同步切换内容，并跳过禁用项。未激活面板仍保留挂载，子控件状态不会丢失。',
    api: [{ component: 'Tabs', props: props([
      ['items', 'TabItem[]', '必填', '每项包含 value、label、content，可选 icon 与 disabled。value 应唯一。'],
      ['label', 'string', '必填', '标签组的无障碍名称。'],
      ['value / defaultValue', 'string', '首个可用项', '受控选择值或初始选择值。'],
      ['onValueChange', '(value: string) => void', '—', '选择改变时触发。'],
    ]) }],
  },
  inventory: {
    title: '物品栏', component: 'InventoryBar', group: '物品与商店',
    description: '按实机参考呈现半透明物品位、描边数字牌、资源条和圆形工具位。与大厅按钮共用缓动实现，物品位使用 25% 放大、描边高亮与相邻让位。',
    imports: "import { ItemSlot, InventoryBar, type InventoryItem } from './components';",
    note: '方向键、Home / End 和数字键只在栏内生效。示例物品来自已收录的维基素材，布局和动效按实机图调整；资源条与数量为演示值。窄屏保留单行并允许横向滚动。',
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
    description: '用原始旋钮、金币、复活与糖果素材显示数量。自动添加千位分隔符，组合成可换行的资源信息栏。',
    imports: "import { CurrencyDisplay, CurrencyGroup } from './components';",
    note: '数量是演示数据。组件只负责展示，不读取游戏账户，不改变既有设置面板的 HUD。',
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
    description: '组合 Panel、Icon、CurrencyDisplay 与 Button，展示物品、价格和购买状态。支持可购买、已拥有、售罄与禁用状态。',
    imports: "import { ShopItemCard } from './components';",
    note: '示例购买会扣除本地演示余额并禁用重复购买，不发起网络请求。价格与库存不代表当前游戏商店。',
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
    description: '使用维基徽章图展示成就的锁定、解锁与进度状态。进度采用原生 progress 元素，并提供可读名称与数值。',
    imports: "import { AchievementCard, doorsAchievementAssets } from './components';",
    note: '徽章图来自维基，示例描述和进度只用于展示组件行为，不代表游戏中的成就条件。',
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
    description: '基于原生 dialog 与共用 Panel 的模态窗口。提供焦点约束、Escape 关闭、触发器焦点恢复和背景滚动锁定。',
    imports: "import { Dialog, Button } from './components';",
    note: 'open 由父组件控制。弹窗通过 Portal 挂载到 body 并进入原生顶层，避免被文档预览或其他容器裁切。',
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
    description: '触发操作或提交选择。通过类型、尺寸和状态区分操作层级，支持图标、加载反馈与原生 button 属性。',
    imports: "import { Button, Icon } from './components';",
    note: '仅包含图标的按钮需要 aria-label。基础 Button 保持稳定尺寸；大厅风格的图标入口使用 LobbyIconButton，由共用组件提供放大、反色与让位反馈。',
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
    description: '使用大厅菜单中的真实图标按钮。LobbyIconButton 组合 Button 与 Icon，统一圆角、描边、反色及 14% 放大缓动；LobbyMenu 负责排列和相邻按钮让位。',
    imports: "import { LobbyMenu, LobbyIconButton, Icon } from './components';",
    note: '此处是 LobbyMenu 的图标实例，与大厅示例共用 src/components/LobbyMenu 中的组件和样式。Icon 只绘制素材；需要交互入口时使用 LobbyIconButton，不再单独添加 framed 底板。',
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
    description: '通过统一字阶和语义元素组织标题、正文与代码。显示样式与 HTML 标签可以独立选择。',
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
    description: '在连续区间内调整数值。保留原生 range 的键盘操作，并提供圆点刻度、填充轨道和独立圆角滑块。',
    imports: "import { Slider } from './components';",
    note: '使用方向键微调，Home / End 跳转到区间端点。轨道圆角只在起点至第一个圆点之间变化，到达圆点后保持固定。',
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
    description: '立即开启或关闭一个独立选项。标签和说明与原生 checkbox 关联，支持受控与非受控模式。',
    imports: "import { Switch } from './components';",
    note: '用 Tab 聚焦后按空格切换。onChange 接收原生事件，onCheckedChange 直接提供 boolean。',
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
    description: '用容器限制阅读宽度，通过 Space 排列内容，用 Grid 创建网格，再用 Divider 划分层级。',
    imports: "import { Layout, Space, Grid, Divider } from './components';",
    note: 'Grid 默认使用自适应网格。需要严格固定 columns 时，同时设置 responsive={false}。',
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
    description: '为 Button 的移入、移出和操作事件提供可选音效。默认关闭，由用户主动开启，播放失败不会阻断交互。',
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
    description: '组合主操作按钮与 LobbyMenu，复刻大厅快捷入口。图标按钮与 Icon 文档实例使用同一组件，移入或聚焦时放大、反色，并推动相邻按钮让位。',
    imports: "import { Button, LobbyMenu, Space } from './components';",
    note: '预览直接运行 LobbyExample.tsx，同名 CSS 模块只负责背景和主操作布局。手机端仍按一行排列，主按钮和菜单随容器一起缩小。菜单按钮及 14% 放大缓动统一由 src/components/LobbyMenu 实现。',
    api: [lobbyMenuApi, lobbyIconButtonApi],
  },
  settings: {
    title: '设置面板', component: 'Settings panel', group: '组合示例',
    description: '将滑动条、开关与图标操作组合为游戏设置面板。试着调整音量和切换选项，查看组件在实际场景中的表现。',
    imports: "import { Slider, Switch, Space } from './components';",
    note: '这是组件交互演示，设置只在当前页面内生效，不会写入真实游戏或持久化到服务器。',
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
