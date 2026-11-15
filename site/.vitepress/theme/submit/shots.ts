import { reactive } from 'vue'
import { screenshotNames } from './model'
import { LIMITS } from '../../../../scripts/submission/bundle-core.mjs'
import { compressImage, inspectImage, makeThumb, planCompression } from './compress'
import { uploadScreenshot } from './api'
import { explainError, countdownText } from './errors'
import { announce } from '../announce'
import type { createStore, StoredShot } from './store'

export interface Shot {
  id: number; name: string; required: boolean; description: string
  state: string; progress: number; url?: string; thumb?: string
  file?: File; filename?: string; size?: number; originalSize?: number
  format?: 'png' | 'jpeg' | 'webp' | 'gif'; receipt?: string; exp?: number
  error?: any; retryAt?: number; generation: number; interrupted?: boolean
}
export const busyShot = (shot: Shot) => ['compressing', 'queued', 'uploading'].includes(shot.state)
export const failedShot = (shot: Shot) => ['failed', 'too-large', 'unsupported'].includes(shot.state)
export const sizeLabel = (n = 0) => n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`
export function shotMessage(shot: Shot, now: number) {
  if (!shot.error) return ''
  if (shot.error.error === 'receipt_invalid') return '这张需要重新上传。'
  const copy = explainError(shot.error.error, { ...shot.error, stage: 'upload', countdown: countdownText(((shot.retryAt || 0) - now) / 1000) })
  return (shot.state === 'failed' ? '这张没传上去。' : '') + copy.message
}

/** 交互队列：上传/压缩/回执仍由 L3 负责；一次最多两个任务。 */
export function createShots({ store, user, slug, unlocked, changed, onError }: {
  store: ReturnType<typeof createStore>; user: () => { id: number } | null; slug: () => string
  unlocked: () => boolean; changed: () => void; onError: (error: any) => void
}) {
  const slots = reactive<Shot[]>([])
  let limit = 12, serial = 0, active = 0, disposed = false
  const controllers = new Map<number, AbortController>()
  const urls = new Set<string>()
  const make = (name: string, required = false, description = ''): Shot => ({ id: ++serial, name, required, description, state: 'empty', progress: 0, generation: 0 })
  function objectUrl(file: Blob) { const url = URL.createObjectURL(file); urls.add(url); return url }
  function revoke(url?: string) { if (url && urls.delete(url)) URL.revokeObjectURL(url) }
  function persist() {
    const uid = user()?.id
    if (uid !== undefined && slug()) {
      store.clearShots(uid, slug())
      slots.forEach((shot, index) => {
        if (shot.receipt && shot.exp) store.saveShot(uid, slug(), index, {
          name: shot.name, required: shot.required, receipt: shot.receipt, exp: shot.exp,
          thumb: shot.thumb, filename: shot.filename, size: shot.size, format: shot.format, originalSize: shot.originalSize,
        })
      })
    }
    changed()
  }
  function initialize(bundle: any) {
    clear()
    limit = Math.max(0, Math.min(12, LIMITS.files - Object.keys(bundle.files).length))
    const design = bundle.files[`bots/${bundle.slug}/DESIGN.md`] || ''
    const descriptions = new Map([...design.matchAll(/!\[([^\]]*)\]\(<?(?:\.\/)?screenshots\/([^\s)>]+)>?\)/g)].map((m: any) => [m[2], m[1]]))
    slots.push(...screenshotNames(bundle).slice(0, limit).map((name) => make(name, true, String(descriptions.get(name) || ''))))
  }
  function restore(interrupted: number[] = []) {
    const uid = user()?.id
    if (uid === undefined) return
    const saved = store.loadShots(uid, slug())
    saved.slice(0, limit).forEach((shot: StoredShot | null, index) => {
      if (!shot) return
      while (!slots[index] && slots.length < limit) add()
      if (!slots[index]) return
      // 约定文件名改变时不把旧回执误配给新图；按名字查找。
      let target = slots[index]
      if (target.required && shot.name && target.name !== shot.name) target = slots.find((s) => s.name === shot.name)!
      if (!target) return
      const thumb = typeof shot.thumb === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(shot.thumb) ? shot.thumb : undefined
      Object.assign(target, { ...shot, id: target.id, name: target.name, required: target.required, thumb, url: thumb ? objectUrl(new Blob([Uint8Array.from(atob(thumb.split(',')[1]), (c) => c.charCodeAt(0))], { type: 'image/jpeg' })) : undefined, state: 'done', progress: 100 })
    })
    for (const i of interrupted) if (slots[i] && slots[i].state === 'empty') Object.assign(slots[i], { state: 'failed', error: { error: 'network_error' } })
  }
  function add() {
    if (slots.length >= limit) return
    let n = slots.length + 1
    while (slots.some((s) => s.name === `screenshot-${n}.png`)) n++
    slots.push(make(`screenshot-${n}.png`))
  }
  function cancel(index: number) {
    const shot = slots[index]
    if (!shot) return
    shot.generation++
    controllers.get(shot.id)?.abort()
    revoke(shot.url)
    Object.assign(shot, { state: 'empty', url: undefined, thumb: undefined, receipt: undefined, exp: undefined, file: undefined, progress: 0, error: undefined, interrupted: false })
    persist()
  }
  function remove(index: number) {
    cancel(index)
    if (!slots[index]?.required) { slots.splice(index, 1); persist() }
  }
  function enqueue(index: number, file: File) {
    if (!unlocked() || !slots[index]) return
    const shot = slots[index]
    shot.generation++
    controllers.get(shot.id)?.abort()
    shot.file = file
    shot.error = undefined
    shot.interrupted = false
    shot.retryAt = 0
    shot.state = 'queued'
    shot.progress = 0
    changed()
    pump()
  }
  function receive(index: number, files: File[]) {
    if (!unlocked()) return
    for (let i = 0; i < files.length; i++) {
      let target = i === 0 ? index : slots.findIndex((s, n) => n > index && s.state === 'empty')
      if (target < 0 || !slots[target]) { target = slots.length; add() }
      if (!slots[target]) break
      enqueue(target, files[i]); index = target
    }
  }
  function retry(index: number) {
    const shot = slots[index]
    if (shot?.file && (shot.retryAt || 0) <= Date.now()) enqueue(index, shot.file)
    // 刷新后的失败槽没有 File，界面会重新打开选图。
  }
  function pump() {
    if (disposed || !unlocked()) return
    while (active < 2) {
      const shot = slots.find((s) => s.state === 'queued' && !controllers.has(s.id))
      if (!shot) break
      active++
      void run(shot).finally(() => { active--; pump() })
    }
  }
  async function run(shot: Shot) {
    const generation = shot.generation
    const controller = new AbortController()
    controllers.set(shot.id, controller)
    const valid = () => !disposed && shot.generation === generation && !controller.signal.aborted
    let newUrl: string | undefined
    try {
      const original = shot.file!
      let format = await inspectImage(original)
      if (!valid()) return
      if (planCompression(original.size, original.type) === 'compress') {
        shot.state = 'compressing'
        if (!shot.receipt) { revoke(shot.url); shot.url = objectUrl(original) }
      }
      const file = await compressImage(original)
      if (!valid()) return
      if (file !== original) format = 'jpeg'
      newUrl = objectUrl(file)
      // 替换成功前保留旧的已传图。
      if (!shot.receipt) { revoke(shot.url); shot.url = newUrl }
      shot.state = 'uploading'
      const response = await uploadScreenshot(file, { signal: controller.signal, onProgress: (percent) => { if (valid()) shot.progress = percent } })
      if (!valid()) return
      let thumb: string | undefined
      try { thumb = await makeThumb(file) } catch { /* 回执仍有效，长图缩略图不写入超额数据 */ }
      if (!valid()) return
      if (shot.url !== newUrl) revoke(shot.url)
      Object.assign(shot, { url: newUrl, thumb, format, state: 'done', receipt: response.receipt, exp: response.exp,
        size: file.size, originalSize: original.size, filename: file.name, error: undefined })
      newUrl = undefined
      persist()
      void announce(`截图 ${slots.indexOf(shot) + 1} 上传好了`)
    } catch (error: any) {
      if (!valid()) return
      shot.error = { ...error, gif: shot.file?.type === 'image/gif' }
      shot.state = ['gif-too-large', 'too-large', 'too_large'].includes(error.error) ? 'too-large' : error.error === 'unsupported_type' ? 'unsupported' : 'failed'
      if (error.retryAfter) shot.retryAt = Date.now() + error.retryAfter * 1000
      changed()
      void announce(`截图 ${slots.indexOf(shot) + 1} 没传上去`)
      onError(error)
    } finally {
      if (newUrl && shot.url !== newUrl) revoke(newUrl)
      controllers.delete(shot.id)
    }
  }
  function invalidate(indices: number[]) {
    // 服务端下标对应压紧后的回执数组，不是包含空选填槽的 UI 数组。
    const sent = slots.filter((s) => s.state === 'done')
    for (const i of indices) if (sent[i]) Object.assign(sent[i], { state: 'failed', receipt: undefined, exp: undefined, error: { error: 'receipt_invalid' } })
    persist()
    return slots.indexOf(sent[indices[0]])
  }
  function pause() {
    for (const shot of slots) if (busyShot(shot)) {
      shot.generation++
      controllers.get(shot.id)?.abort()
      shot.state = 'failed'; shot.interrupted = true; shot.error = { error: 'network_error' }
    }
    changed()
  }
  function clear() {
    for (const shot of slots) { shot.generation++; controllers.get(shot.id)?.abort() }
    slots.splice(0)
    for (const url of urls) URL.revokeObjectURL(url)
    urls.clear()
  }
  return { slots, initialize, restore, add, receive, retry, cancel, remove, invalidate, pause, clear, persist,
    get limit() { return limit }, dispose() { disposed = true; clear() } }
}
