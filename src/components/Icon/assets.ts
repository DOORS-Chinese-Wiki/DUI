export type DoorsIconAsset = {
  src: string;
  label: string;
  kind: 'mask' | 'image';
};

export const doorsIconAssets = {
  backpack: {
    src: '/assets/doors/icons/backpack.png',
    label: '背包',
    kind: 'mask',
  },
  journal: {
    src: '/assets/doors/icons/journal.svg',
    label: '日志',
    kind: 'mask',
  },
  inventorySlot: {
    src: '/assets/doors/icons/inventory-slot.svg',
    label: '物品栏',
    kind: 'mask',
  },
  close: {
    src: '/assets/doors/icons/close.png',
    label: '关闭',
    kind: 'mask',
  },
  revive: {
    src: '/assets/doors/items/revive.png',
    label: '复活',
    kind: 'image',
  },
  knobs: {
    src: '/assets/doors/items/knobs.png',
    label: '旋钮',
    kind: 'image',
  },
  candy: {
    src: '/assets/doors/items/candy.png',
    label: '糖果',
    kind: 'image',
  },
  items: {
    src: '/assets/doors/icons/items.svg',
    label: '物品',
    kind: 'mask',
  },
  achievements: {
    src: '/assets/doors/icons/achievements.svg',
    label: '成就',
    kind: 'mask',
  },
  settings: {
    src: '/assets/doors/icons/settings.svg',
    label: '设置',
    kind: 'mask',
  },
  gallery: {
    src: '/assets/doors/icons/gallery.svg',
    label: '画廊',
    kind: 'mask',
  },
  player: {
    src: '/assets/doors/icons/player.svg',
    label: '玩家',
    kind: 'mask',
  },
  search: {
    src: '/assets/doors/icons/search.svg',
    label: '搜索',
    kind: 'mask',
  },
  flashlight: {
    src: '/assets/doors/items/flashlight.png',
    label: '手电筒',
    kind: 'image',
  },
  lighter: { src: '/assets/doors/items/lighter.png', label: '打火机', kind: 'image' },
  vitamins: { src: '/assets/doors/items/vitamins.png', label: '维生素', kind: 'image' },
  lockpick: { src: '/assets/doors/items/lockpick.png', label: '开锁器', kind: 'image' },
  skeletonKey: { src: '/assets/doors/items/skeleton-key.png', label: '骷髅钥匙', kind: 'image' },
  candle: {
    src: '/assets/doors/items/candle.png',
    label: '蜡烛',
    kind: 'image',
  },
  compass: {
    src: '/assets/doors/items/compass.png',
    label: '指南针',
    kind: 'image',
  },
  crucifix: {
    src: '/assets/doors/items/crucifix.png',
    label: '十字架',
    kind: 'image',
  },
  gold: {
    src: '/assets/doors/items/gold.png',
    label: '金币',
    kind: 'image',
  },
} as const satisfies Record<string, DoorsIconAsset>;

export type DoorsIconName = keyof typeof doorsIconAssets;
