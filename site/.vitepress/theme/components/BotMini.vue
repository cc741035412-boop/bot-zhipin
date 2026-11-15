<script setup lang="ts">
import { computed } from 'vue'
import BotPortrait from './BotPortrait.vue'
import { avatarColor } from '../avatar'
import { botPalette } from '../color'
import type { StateId } from '../vendor/bloub/states'

// 小头像：一块头像砖里一只活 Bot，砖底的柔光是它自己的颜色。纯装饰，名字由旁边的文字给。
// size 只用头像砖的档位（28、40、48…）；rest 由外层决定（比如整张卡悬停时睁大眼）。
// bare：不要方砖，Bot 直接占满这一格（和首页列表卡一样），小尺寸下身体才够大。
const props = withDefaults(defineProps<{ bot: { slug: string; name: string; avatar: string | null }; size?: number; rest?: StateId; bare?: boolean }>(), { size: 40, rest: 'idle' })
const palette = computed(() => botPalette(props.bot.avatar ? '#8a8a93' : avatarColor(props.bot.slug)))
</script>

<template>
  <span class="bot-mini bz-tile bz-bot-scope" :class="[`s${size}`, { bare }]" :style="palette" aria-hidden="true">
    <BotPortrait :bot="bot" :rest="rest" />
  </span>
</template>
