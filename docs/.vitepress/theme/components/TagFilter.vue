<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../../data/posts.data'

const active = ref('')

const tagCounts = computed(() => {
  const m = new Map<string, number>()
  posts.forEach((p) => p.tags.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)))
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
})

const list = computed(() => active.value ? posts.filter((p) => p.tags.includes(active.value)) : posts)

// 支持 /tags?tag=xxx 直接定位
onMounted(() => {
  const t = new URLSearchParams(location.search).get('tag')
  if (t) active.value = t
})

function pick(t: string) {
  active.value = active.value === t ? '' : t
  const url = active.value ? `?tag=${encodeURIComponent(active.value)}` : location.pathname
  history.replaceState(null, '', url)
}
</script>

<template>
  <div class="kb-filter">
    <button class="kb-tag" :class="{ on: !active }" @click="pick('')">全部 {{ posts.length }}</button>
    <button v-for="[t, n] in tagCounts" :key="t" class="kb-tag" :class="{ on: active === t }" @click="pick(t)">
      {{ t }} {{ n }}
    </button>
  </div>
  <ul class="kb-list">
    <li v-for="p in list" :key="p.url">
      <a :href="withBase(p.url)">{{ p.title }}</a>
      <span class="kb-meta">{{ p.tags.map((t) => '#' + t).join(' ') }}</span>
    </li>
  </ul>
  <p v-if="!list.length" class="kb-empty">暂无笔记</p>
</template>
