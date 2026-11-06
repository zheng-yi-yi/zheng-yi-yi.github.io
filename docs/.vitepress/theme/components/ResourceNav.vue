<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronRight, Search, X } from 'lucide-vue-next'
import { data as categories } from '../../data/resources.data'
import { getIcon } from '../icons'

const keyword = ref('')
const activeId = ref('')
// 默认展开第一个一级分类
const opened = ref<Set<string>>(new Set(categories[0] ? [categories[0].id] : []))

const total = computed(() => categories.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.items.length, 0), 0))

// 关键词过滤：匹配名称 / 简介 / 标签
const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return categories
  return categories
    .map((c) => ({
      ...c,
      groups: c.groups
        .map((g) => ({
          ...g,
          items: g.items.filter((r) => `${r.name} ${r.desc ?? ''} ${r.tags.join(' ')}`.toLowerCase().includes(kw))
        }))
        .filter((g) => g.items.length)
    }))
    .filter((c) => c.groups.length)
})

function hasChildren(c: (typeof categories)[number]) {
  return c.groups.length > 1
}

function toggle(id: string) {
  const s = new Set(opened.value)
  s.has(id) ? s.delete(id) : s.add(id)
  opened.value = s
}

function go(id: string) {
  const el = document.getElementById(id)
  // 第一个子分类：滚到一级分类块，让大标题一起露出来
  const block = el?.parentElement
  const target = block?.classList.contains('rn-cat-block') && block.querySelector('.rn-group') === el ? block : el
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeId.value = id
}

function onCategory(c: (typeof categories)[number]) {
  if (hasChildren(c)) toggle(c.id)
  else go(c.groups[0].id)
}

const matchCount = computed(() => filtered.value.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.items.length, 0), 0))

// 回车：展开所有匹配的分类，跳到第一个匹配区块，并高亮第一张卡片 1 秒
const flashKey = ref('')
let flashTimer: ReturnType<typeof setTimeout> | undefined

function cardKey(groupId: string, url: string) {
  return `${groupId}|${url}`
}

async function onEnter(e: KeyboardEvent) {
  if (e.isComposing) return // 中文输入法选词时的回车不触发
  if (!keyword.value.trim() || !filtered.value.length) return
  const s = new Set(opened.value)
  filtered.value.forEach((c) => s.add(c.id))
  opened.value = s
  await nextTick()
  const first = filtered.value[0].groups[0]
  go(first.id)
  clearTimeout(flashTimer)
  flashKey.value = ''
  await nextTick()
  flashKey.value = cardKey(first.id, first.items[0].url)
  flashTimer = setTimeout(() => (flashKey.value = ''), 1000)
}

function clearKeyword() {
  keyword.value = ''
  flashKey.value = ''
}

function host(url: string) {
  try { return new URL(url).hostname } catch { return '' }
}

// 首字母占位：图标加载失败时显示
function onIconError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  ;(img.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex')
}

// 滚动时高亮当前所在的子分类
let observer: IntersectionObserver | undefined
function observe() {
  observer?.disconnect()
  document.querySelectorAll('.rn-group').forEach((el) => observer!.observe(el))
}
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (hit) activeId.value = hit.target.id
    },
    { rootMargin: '-80px 0px -60% 0px' }
  )
  observe()
})
// 搜索后区块重新渲染，需要重新监听
watch(filtered, () => nextTick(observe))
onUnmounted(() => {
  observer?.disconnect()
  clearTimeout(flashTimer)
})
</script>

<template>
  <div class="rn">
    <aside class="rn-side">
      <div class="rn-side-head">
        资源导航 <span>{{ keyword ? `${matchCount} / ${total}` : total }}</span>
      </div>
      <label class="rn-search">
        <Search :size="16" class="rn-search-icon" />
        <input v-model="keyword" placeholder="输入关键词..." enterkeyhint="search" @keydown.enter="onEnter" />
        <button v-if="keyword" class="rn-search-clear" aria-label="清空" @click.prevent="clearKeyword">
          <X :size="14" />
        </button>
      </label>
      <nav>
        <div v-for="c in filtered" :key="c.id" class="rn-cat">
          <button class="rn-cat-btn" :class="{ active: !hasChildren(c) && activeId === c.groups[0].id }"
            @click="onCategory(c)">
            <component :is="getIcon(c.icon)" class="rn-icon" :size="18" :stroke-width="1.8" />
            <span class="rn-cat-title">{{ c.title }}</span>
            <ChevronRight v-if="hasChildren(c)" class="rn-arrow" :class="{ open: opened.has(c.id) || keyword }" :size="16" />
          </button>
          <div v-if="hasChildren(c) && (opened.has(c.id) || keyword)" class="rn-sub">
            <button v-for="g in c.groups" :key="g.id" class="rn-sub-btn" :class="{ active: activeId === g.id }"
              @click="go(g.id)">{{ g.title }}</button>
          </div>
        </div>
      </nav>
    </aside>

    <main class="rn-main">
      <section v-for="c in filtered" :key="c.id" class="rn-cat-block">
        <h2 class="rn-cat-heading">
          <component :is="getIcon(c.icon)" :size="22" :stroke-width="1.8" />
          {{ c.title }}
        </h2>
        <section v-for="g in c.groups" :id="g.id" :key="g.id" class="rn-group">
          <h3 v-if="hasChildren(c)" class="rn-group-title">{{ g.title }}</h3>
          <div class="rn-grid">
            <a v-for="r in g.items" :key="r.url" class="rn-card" :class="{ flash: flashKey === cardKey(g.id, r.url) }" :href="r.url" target="_blank" rel="noopener"
              :title="r.desc ? `${r.name}：${r.desc}` : r.name">
              <div class="rn-logo">
                <img :src="`https://icons.duckduckgo.com/ip3/${host(r.url)}.ico`" alt="" loading="lazy" @error="onIconError" />
                <span class="rn-logo-text">{{ r.name.slice(0, 1).toUpperCase() }}</span>
              </div>
              <div class="rn-card-body">
                <div class="rn-card-name">{{ r.name }}</div>
                <div class="rn-card-desc">{{ r.desc ?? host(r.url) }}</div>
              </div>
            </a>
          </div>
        </section>
      </section>
      <p v-if="!filtered.length" class="rn-empty">没有匹配的资源</p>
    </main>
  </div>
</template>

