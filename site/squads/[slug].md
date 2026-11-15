---
layout: page
pageClass: bz-layout
---

<script setup>
import { useData } from 'vitepress'
import SquadDetail from '../.vitepress/theme/components/SquadDetail.vue'
const { params } = useData()
</script>

<SquadDetail :key="params.slug" :squad="params.squad" :copy="params.copy" />
