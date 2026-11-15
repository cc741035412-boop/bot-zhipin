<!--
  小队的流程图：谁把什么交给谁。
  排版由 theme/squad.ts 的 flowLayout 按画布宽度算（1:1 画，不缩放）：线画在 SVG 里，节点和标签是叠在上面的 HTML。
  图本身是装饰（aria-hidden）；读屏和窄屏读的是后面那份文字版，内容一样。
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BotName from './BotName.vue'
import BotPortrait from './BotPortrait.vue'
import SquadStill from './SquadStill.vue'
import BzIcon from './BzIcon.vue'
import { avatarColor } from '../avatar'
import { botPalette } from '../color'
import { nextPoke } from '../pitch'
import { SQUAD_COPY } from '../../meta.mjs'
import { FLOW_MIN_WIDTH, YOU, flowLayout, type FlowEdge } from '../squad'

interface Member { bot: string; name: string; nameZh?: string | null; title: string | null; avatar: string | null; lead: boolean }
const props = defineProps<{ squad: { formation: string; members: Member[]; flow: { from: string; to: string; what: string | null }[] } }>()

const root = ref<HTMLElement>()
// 服务端按内容区的满宽 1140 排；挂载后按容器的实际宽度重排。
const width = ref(1140)
const ready = ref(false)
const layout = computed(() => flowLayout(props.squad, width.value))
const bySlug = computed(() => new Map(props.squad.members.map((member) => [member.bot, member])))
const palette = (slug: string) => {
  const member = bySlug.value.get(slug)
  return member ? botPalette(member.avatar ? '#8a8a93' : avatarColor(slug)) : undefined
}
const portrait = (member: Member) => ({ slug: member.bot, name: member.name, nameZh: member.nameZh, avatar: member.avatar })
const nodes = computed(() => (layout.value?.nodes ?? []).map((node) => ({ ...node, member: bySlug.value.get(node.id) })))

// 悬停某个节点：和它相连的线亮成它的颜色，其余变淡。
const hot = ref<string | null>(null)
const touches = (edge: FlowEdge, id: string) => edge.from === id || edge.to === id
const edgeState = (edge: FlowEdge) => hot.value ? (touches(edge, hot.value) ? 'on' : 'dim') : 'rest'
const nodeState = (id: string) => !hot.value ? 'rest'
  : id === hot.value || layout.value!.edges.some((edge) => touches(edge, hot.value!) && touches(edge, id)) ? 'on' : 'dim'
const portraits = new Map<string, InstanceType<typeof BotPortrait>>()
const keep = (slug: string) => (el: unknown) => { if (el) portraits.set(slug, el as InstanceType<typeof BotPortrait>); else portraits.delete(slug) }
function enter(event: PointerEvent, id: string) { if (event.pointerType === 'mouse') hot.value = id }
function leave(event: PointerEvent, id: string) { if (event.pointerType === 'mouse' && hot.value === id) hot.value = null }
function poke(id: string) { portraits.get(id)?.play({ state: nextPoke(id).state }) }

// 文字版：一条一行，和数据顺序一致。
const who = (id: string) => id === YOU ? null : bySlug.value.get(id) ?? null
const steps = computed(() => props.squad.flow.filter((step) => step.what && (step.from === YOU || who(step.from)) && (step.to === YOU || who(step.to))))

let observer: ResizeObserver | undefined
onMounted(() => {
  const measure = () => {
    const box = root.value?.clientWidth ?? 0
    // 窄屏上图是藏起来的（宽度为 0），不用重排。
    if (box >= FLOW_MIN_WIDTH) width.value = Math.round(box)
    ready.value = true
  }
  measure()
  if (root.value && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(measure)
    observer.observe(root.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div v-if="layout" ref="root" class="squad-flow" :class="[layout.kind, { 'is-ready': ready, 'has-hot': hot, 'hot-you': hot?.startsWith('you') }]" data-testid="squad-flow-chart" aria-hidden="true">
    <div class="flow-canvas" :style="{ width: `${layout.width}px`, height: `${layout.height}px` }">
      <svg class="flow-lines" :width="layout.width" :height="layout.height" :viewBox="`0 0 ${layout.width} ${layout.height}`" fill="none">
        <g
          v-for="(edge, index) in layout.edges" :key="edge.key" class="flow-edge bz-bot-scope" :data-state="edgeState(edge)" :data-edge="edge.key"
          :style="[palette(edge.from), hot ? palette(hot) : undefined]"
        >
          <path class="flow-line" :d="edge.d" />
          <path class="flow-head" d="M-6.5 -4.5 0 0l-6.5 4.5" :transform="`translate(${edge.head.x} ${edge.head.y}) rotate(${edge.head.angle})`" />
          <!-- 小光点沿线走：位置由 CSS 的 offset-path 管，减少动效时整个不显示。 -->
          <circle class="flow-dot" r="2.5" :style="{ offsetPath: `path('${edge.d}')`, animationDelay: `${-index * 0.6}s` }" />
        </g>
      </svg>
      <span
        v-for="edge in layout.edges" :key="edge.key" class="flow-label" :data-state="edgeState(edge)" :data-anchor="edge.label.anchor"
        :style="{ left: `${edge.label.x}px`, top: `${edge.label.y}px`, maxWidth: `${edge.label.max}px` }"
      ><span v-for="(what, index) in edge.whats" :key="index">{{ what }}</span></span>
      <div
        v-for="node in nodes" :key="node.id" class="flow-node" :class="[node.kind, `caption-${node.caption}`, { lead: node.member?.lead }]"
        :data-node="node.id" :data-state="nodeState(node.id)" :style="{ left: `${node.x}px`, top: `${node.y}px` }"
        @pointerenter="enter($event, node.id)" @pointerleave="leave($event, node.id)" @click="node.member && poke(node.id)"
      >
        <template v-if="node.member">
          <span class="flow-tile bz-tile bz-bot-scope" :style="palette(node.id)">
            <BotPortrait :ref="keep(node.id)" :bot="portrait(node.member)" :rest="hot === node.id ? 'wide' : 'idle'" />
          </span>
          <span class="flow-caption"><b><BotName :bot="node.member" short /></b><i v-if="node.member.title">{{ node.member.title }}</i></span>
        </template>
        <span v-else class="flow-you">{{ SQUAD_COPY.you }}</span>
      </div>
    </div>
  </div>
  <ol v-if="steps.length" class="flow-list" data-testid="squad-flow-list">
    <li v-for="(step, index) in steps" :key="index">
      <span class="flow-what">{{ step.what }}</span>
      <span class="flow-route">
        <span class="flow-who"><SquadStill v-if="who(step.from)" :bot="portrait(who(step.from)!)" /><i v-else class="flow-you-dot" aria-hidden="true" /><BotName v-if="who(step.from)" :bot="who(step.from)!" short /><template v-else>{{ SQUAD_COPY.you }}</template></span>
        <BzIcon name="arrow-right" :size="12" /><span class="bz-sr-only">交给</span>
        <span class="flow-who"><SquadStill v-if="who(step.to)" :bot="portrait(who(step.to)!)" /><i v-else class="flow-you-dot" aria-hidden="true" /><BotName v-if="who(step.to)" :bot="who(step.to)!" short /><template v-else>{{ SQUAD_COPY.you }}</template></span>
      </span>
    </li>
  </ol>
</template>
