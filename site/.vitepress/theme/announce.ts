import { nextTick, ref } from 'vue'
export const announcement = ref('')
export async function announce(text: string) {
  announcement.value = ''
  await nextTick()
  announcement.value = text
}
export const announceCopy = () => announce('已复制安装提示词')
