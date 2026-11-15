import type { InjectionKey, Ref } from 'vue'

// 只包含轻量的注入 key；货架组件不引入投稿页或校验器。
export const previewMode: InjectionKey<boolean> = Symbol('submit-preview')
export const previewUpdate: InjectionKey<Ref<boolean>> = Symbol('submit-preview-update')
export const previewDetail: InjectionKey<() => void> = Symbol('submit-preview-detail')
export const previewCardActive: InjectionKey<Ref<boolean>> = Symbol('submit-preview-card-active')
