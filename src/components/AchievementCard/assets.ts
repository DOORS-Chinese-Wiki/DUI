export const doorsAchievementAssets = {
  welcome: { src: '/assets/doors/achievements/welcome.png', label: 'Welcome' },
  outOfMyWay: { src: '/assets/doors/achievements/out-of-my-way.png', label: 'Out Of My Way' },
  rockBottom: { src: '/assets/doors/achievements/rock-bottom.png', label: 'Rock Bottom' },
} as const;
export type DoorsAchievementName = keyof typeof doorsAchievementAssets;
