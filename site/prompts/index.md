---
layout: page
pageClass: bz-layout
title: Prompt
---

<script setup>
import LibraryPage from '../.vitepress/theme/components/LibraryPage.vue'
import { data } from '../.vitepress/data/prompts.data.mjs'
</script>

<LibraryPage title="Prompt" :items="data" />
