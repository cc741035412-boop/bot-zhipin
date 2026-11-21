---
layout: page
pageClass: bz-layout
---

<script setup>
import { useData } from 'vitepress'
import LibraryDetail from '../.vitepress/theme/components/LibraryDetail.vue'
const { params } = useData()
</script>

<LibraryDetail :key="params.slug" :item="params.prompt" />
