<!-- 分组的吉祥物（静止的小号）：和首屏砖墙里对应那只同色同形。用在分组切换、分组标签里；不认识的分组什么都不画。 -->
<script setup lang="ts">
import { computed } from 'vue'
import StaticBot from './StaticBot.vue'
import { CATEGORY_MASCOTS } from '../color'
import { shapeRadii } from '../face'

const props = withDefaults(defineProps<{ category: string; size?: number }>(), { size: 16 })
const mascot = computed(() => Object.hasOwn(CATEGORY_MASCOTS, props.category) ? CATEGORY_MASCOTS[props.category] : null)
</script>

<template>
  <StaticBot v-if="mascot" class="role-mascot" :radii="shapeRadii(mascot.shape)" :color="mascot.color" :size="size" />
</template>
