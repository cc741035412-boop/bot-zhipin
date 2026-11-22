---
layout: page
pageClass: bz-layout
---

<script setup>
import { useData } from 'vitepress'
import AuthorPage from '../.vitepress/theme/components/AuthorPage.vue'
const { params } = useData()
</script>

<AuthorPage :key="params.login" :author="params.author" />
