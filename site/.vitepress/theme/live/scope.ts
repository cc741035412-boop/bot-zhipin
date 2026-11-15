import { inject, provide, ref, type InjectionKey } from 'vue'
import type { Play } from './playback'

interface AvatarHandle {
  play(detail: Play): void
  enter(event: PointerEvent): void
  leave(event: PointerEvent): void
}
const botAction: InjectionKey<(detail: Play) => void> = Symbol('bot-action')

/** 每张卡片/详情独立持有头像引用，兄弟按钮不扫描全局 DOM。 */
export function provideBotAction() {
  const avatar = ref<AvatarHandle>()
  provide(botAction, (detail) => avatar.value?.play(detail))
  return avatar
}
export const useBotAction = () => inject(botAction, () => {})
