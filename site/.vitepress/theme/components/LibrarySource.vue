<script setup lang="ts">
import BzIcon from './BzIcon.vue'
defineProps<{ href: string }>()
</script>
<template>
  <a data-track-kind="source" :href="href" target="_blank" rel="noopener noreferrer"><slot>查看原文</slot><BzIcon name="arrow-up-right" /></a>
</template>
