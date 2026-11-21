---
layout: page
pageClass: bz-layout
title: Skills
---

<script setup>
import LibraryPage from '../.vitepress/theme/components/LibraryPage.vue'
import { data } from '../.vitepress/data/skills.data.mjs'
</script>

<LibraryPage title="Skills" :items="data" />
