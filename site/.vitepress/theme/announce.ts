import { nextTick, ref } from 'vue'
export const announcement = ref('')
export async function announceCopy() {
  announcement.value = ''
  await nextTick()
  announcement.value = '已复制安装提示词'
}
