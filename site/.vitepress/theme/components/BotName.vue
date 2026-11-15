<!--
  Bot 的名字。有中文叫法（nameZh）的：中文叫法为主，原名小一号、淡一档跟在后面；
  没有的：照旧只有原名，直接输出文字，不套任何元素。规矩在 scripts/lib/bot-name.mjs，样式在 styles/base.css「Bot 的名字」。
  - 默认：一行。放不下时先截原名（省略号）；留给原名的地方不到 4 个字宽就整个不显示；中文叫法自己都放不下才截它。
    鼠标停在名字上能看到原名全称（title）。
  - wrap：详情页的大标题用。可以换行，原名不截断，放不下就整个落到下一行（原名始终是全的，所以不带 title）。
  - short：只写中文叫法，原名放在 title 里。同一页里反复出现的地方用（流程图、清单、收件人）。
  - small：名字本身只有 13–14px 的地方用，原名降到 12px。
-->
<script setup lang="ts">
import { computed } from 'vue'
import { displayName, originalName } from '../../../../scripts/lib/bot-name.mjs'

const props = defineProps<{ bot: { name?: string | null; nameZh?: string | null }; wrap?: boolean; short?: boolean; small?: boolean }>()
const main = computed(() => displayName(props.bot))
const original = computed(() => originalName(props.bot))
</script>

<template>
  <template v-if="!original">{{ main }}</template>
  <span v-else-if="short" :title="original">{{ main }}</span>
  <span v-else class="bz-name" :class="{ wrap, small }" :title="wrap ? undefined : original"><span class="bz-name-zh">{{ main }}</span>{{ ' ' }}<span class="bz-name-orig">{{ original }}</span></span>
</template>
