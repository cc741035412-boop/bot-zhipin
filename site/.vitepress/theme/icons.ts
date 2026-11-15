// 全站一套线性图标：24 网格、描边 1.5、圆头圆角、currentColor、不填充。由 BzIcon.vue 渲染。
// 这里是卡片车道为了能跑放的最小可用版，名单照 V5-DESIGN §2；合并时以设计系统车道的版本为准。
export const ICONS = {
  flame: '<path d="M13 3c1 5-4 5-2 9 2-1 3-2 3-4 3 3 5 5 5 8a7 7 0 0 1-14 0c0-4 4-7 8-13Z"/>',
  bolt: '<path d="M13.5 2.5 5 13.5h6l-.5 8L19 10.5h-6l.5-8Z"/>',
  shield: '<path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z"/><path d="m9.2 12 2 2 3.6-4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  plug: '<path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0V8ZM12 17v4"/>',
  'plug-off': '<path d="M9 3v2.5M15 3v5h2.5v3.5c0 .8-.2 1.6-.5 2.3M6.5 9v2.5a5.5 5.5 0 0 0 8.8 4.4M12 17v4M4 4l16 16"/>',
  users: '<circle cx="9" cy="8.5" r="3.25"/><path d="M3 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5.5a3.25 3.25 0 0 1 0 6M17.5 14.3c2.1.7 3.5 2.6 3.5 5.2"/>',
  'arrow-up-right': '<path d="M7 17 17 7M9 7h8v8"/>',
  'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  quote: '<path d="M10 7H6.5A1.5 1.5 0 0 0 5 8.5V12h5V7Zm0 5c0 3-1.5 4.5-4 5M19 7h-3.5A1.5 1.5 0 0 0 14 8.5V12h5V7Zm0 5c0 3-1.5 4.5-4 5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
} as const
export type IconName = keyof typeof ICONS
