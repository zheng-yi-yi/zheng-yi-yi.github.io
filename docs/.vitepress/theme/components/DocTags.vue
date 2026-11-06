<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter } = useData()
const tags = computed<string[]>(() => Array.isArray(frontmatter.value.tags) ? frontmatter.value.tags : [])
</script>

<template>
  <div v-if="tags.length" class="kb-doc-tags">
    <a v-for="t in tags" :key="t" class="kb-tag" :href="withBase(`/tags?tag=${encodeURIComponent(t)}`)">#{{ t }}</a>
  </div>
</template>
