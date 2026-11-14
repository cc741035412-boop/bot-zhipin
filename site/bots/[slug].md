---
layout: page
---

<script setup>
import { useData } from 'vitepress'
import BotDetail from '../.vitepress/theme/components/BotDetail.vue'
const { params } = useData()
</script>

<BotDetail :key="params.slug" :bot="params.bot" :copy="params.copy" :design-html="params.designHtml" />
