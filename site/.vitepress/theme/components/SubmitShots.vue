<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { busyShot, failedShot, shotMessage, sizeLabel, type Shot } from '../submit/shots'
const props = defineProps<{ manager: any; valid: boolean; user: any; submitting: boolean; now: number }>()
const slots = computed<Shot[]>(() => props.manager.slots)
const locked = computed(() => !props.valid || !props.user)
const complete = computed(() => slots.value.filter((s) => s.required && s.state === 'done').length)
const required = computed(() => slots.value.filter((s) => s.required).length)
const allDone = computed(() => complete.value === required.value && !slots.value.some((s) => busyShot(s) || failedShot(s)))
const touch = ref(false)
let media: MediaQueryList
function device() { touch.value = media.matches }
onMounted(() => { media = matchMedia('(hover: none) and (pointer: coarse)'); device(); media.addEventListener('change', device) })
onBeforeUnmount(() => media?.removeEventListener('change', device))
const inputs = new Map<number, HTMLInputElement>()
function select(i: number) { if (!locked.value && !props.submitting) inputs.get(slots.value[i].id)?.click() }
function files(i: number, event: Event) { const input = event.target as HTMLInputElement; props.manager.receive(i, Array.from(input.files || [])); input.value = '' }
const beforeDrag = new Map<number, string>()
function drag(shot: Shot) { if (locked.value || props.submitting) return; if (shot.state !== 'dragover') beforeDrag.set(shot.id, shot.state); if (!busyShot(shot)) shot.state = 'dragover' }
function leave(shot: Shot) { if (shot.state === 'dragover') shot.state = beforeDrag.get(shot.id) || 'empty' }
function drop(i: number, event: DragEvent) { leave(slots.value[i]); props.manager.receive(i, Array.from(event.dataTransfer?.files || [])) }
const states: Record<string, string> = { empty: '待放入', dragover: '松手放入', compressing: '压缩中', queued: '排队中', uploading: '上传中', done: '已上传', failed: '上传失败', 'too-large': '图片太大', unsupported: '格式不支持' }
</script>
<template>
  <section class="submit-step submit-shots" data-testid="step-shots" :data-state="locked ? 'locked' : slots.some(failedShot) ? 'error' : allDone ? 'done' : 'current'" :inert="submitting">
    <header class="submit-step-heading"><span class="submit-step-number" aria-hidden="true">{{ !locked && slots.some(failedShot) ? '!' : allDone && !locked ? '✓' : '3' }}</span><h2 id="shots-title" tabindex="-1">放截图</h2><span class="submit-step-status">{{ complete }} / {{ required }} 张</span></header>
    <p data-testid="privacy-reminder" class="submit-notice">放之前看一眼：截图里不能有密钥、公司内部信息、别人的聊天记录和手机号。只放 Bot 真实输出的截图，不要用生成或伪造的图。</p>
    <div v-if="locked" class="submit-lock-message" data-testid="slots-locked">{{ !valid ? '投稿包检查通过后才能放截图' : '先登录，再放截图' }}</div>
    <div data-testid="slots" class="submit-slots" :class="{ 'is-locked': locked }">
      <div v-for="(shot, i) in slots" :key="shot.id" class="submit-slot" data-testid="slot" :data-index="i" :data-state="shot.state" :data-required="shot.required" role="button" :tabindex="locked ? -1 : 0" :aria-disabled="locked" :aria-label="`截图 ${i + 1}，${states[shot.state]}，按回车选择图片`" @keydown.enter.self.prevent="select(i)" @keydown.space.self.prevent="select(i)" @click.self="select(i)" @dragover.prevent="drag(shot)" @dragleave.self="leave(shot)" @drop.prevent="drop(i, $event)">
        <header @click="select(i)"><strong>截图 {{ i + 1 }}</strong> <span v-if="shot.required" class="bot-tag">必填</span><code>{{ shot.name }}</code><p v-if="shot.description">AI 说这张是：{{ shot.description }}</p></header>
        <input :ref="(el) => { if (el) inputs.set(shot.id, el as HTMLInputElement); else inputs.delete(shot.id) }" data-testid="slot-input" class="bz-sr-only" tabindex="-1" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple :disabled="locked" :aria-label="`选择截图 ${i + 1}`" @change="files(i, $event)" />
        <div class="submit-slot-image" @click="select(i)">
          <img v-if="shot.url" :src="shot.url" data-testid="slot-thumb" :alt="`截图 ${i + 1} 缩略图`" />
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="2" /><path d="m4 19 6-6 4 3 4-7 3 10" /></svg>
          <span v-if="shot.state === 'done'" class="submit-shot-done" aria-hidden="true">✓</span>
          <p v-if="shot.state === 'dragover'">松手，放进截图 {{ i + 1 }}</p>
          <p v-else-if="shot.state === 'empty'">{{ touch ? '点这里选一张图' : '把图片拖到这里，或 点击选择 · 也可以粘贴（Ctrl+V / ⌘V）' }}</p>
          <p v-else-if="shot.state === 'compressing'">图片有点大，正在压缩…</p>
          <p v-else-if="shot.state === 'queued'">排队中</p>
        </div>
        <div v-if="shot.state === 'compressing'" class="submit-compress-bar" aria-hidden="true" />
        <template v-if="shot.state === 'uploading'"><div data-testid="slot-progress" class="submit-slot-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="shot.progress" :aria-label="`截图 ${i + 1} 上传进度`"><span :style="{ width: shot.progress + '%' }" /></div><p>上传中 {{ shot.progress }}%</p></template>
        <template v-if="shot.state === 'done'"><p>{{ shot.filename || shot.name }} · {{ sizeLabel(shot.size) }}</p><p v-if="shot.originalSize && shot.originalSize !== shot.size">已从 {{ sizeLabel(shot.originalSize) }} 压到 {{ sizeLabel(shot.size) }}</p></template>
        <p v-if="shot.error" data-testid="slot-message" class="submit-danger">{{ shotMessage(shot, now) }}</p>
        <div class="submit-slot-buttons">
          <button v-if="busyShot(shot)" type="button" class="submit-text-button" data-testid="slot-cancel" :disabled="locked" @click.stop="manager.cancel(i)">取消</button>
          <template v-else-if="shot.state === 'done' || failedShot(shot)">
            <button v-if="shot.state === 'failed'" type="button" class="submit-text-button" data-testid="slot-retry" :disabled="locked" :aria-disabled="(shot.retryAt || 0) > now" @click.stop="(shot.retryAt || 0) <= now && (shot.file ? manager.retry(i) : select(i))">重试</button>
            <button type="button" class="submit-text-button" data-testid="slot-replace" :disabled="locked" @click.stop="select(i)">换一张</button><button type="button" class="submit-text-button" data-testid="slot-remove" :disabled="locked" @click.stop="manager.remove(i)">移除</button>
          </template>
        </div>
      </div>
    </div>
    <button v-if="slots.length < manager.limit" type="button" class="shelf-button" data-testid="slot-add" :aria-disabled="locked" @click="!locked && manager.add()"><span aria-hidden="true">＋</span>再加一张</button><p v-else class="submit-muted">最多 {{ manager.limit }} 张</p>
  </section>
</template>
