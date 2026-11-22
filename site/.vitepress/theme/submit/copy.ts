import { reactive, onBeforeUnmount, type InjectionKey } from 'vue'
export const submitCopyKey: InjectionKey<ReturnType<typeof useSubmitCopy>> = Symbol('submit-copy')
import { announce } from '../announce'

export function useSubmitCopy() {
  const state = reactive({ copied: '', text: '', open: false })
  let opener: HTMLElement | null = null
  let timer: ReturnType<typeof setTimeout>
  async function copy(text: string, id: string, event?: Event, spoken = '已复制') {
    opener = (event?.currentTarget || document.activeElement) as HTMLElement
    try {
      await navigator.clipboard.writeText(text)
      state.copied = id
      clearTimeout(timer)
      timer = setTimeout(() => { state.copied = '' }, 1800)
      void announce(spoken)
      return true
    } catch { state.text = text; state.open = true; return false }
  }
  function close() { state.open = false; opener?.focus() }
  onBeforeUnmount(() => clearTimeout(timer))
  return { state, copy, close }
}
