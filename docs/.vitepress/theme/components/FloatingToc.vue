<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { List, X } from 'lucide-vue-next'

interface Heading { id: string; text: string; level: 1 | 2 | 3 }

const { page, frontmatter } = useData()
const route = useRoute()

const headings = ref<Heading[]>([])
const activeId = ref('')
const hovering = ref(false)
const pinned = ref(false) // 点击指示器后固定展开
const sheetOpen = ref(false) // 移动端底部目录
const root = ref<HTMLElement>()

const isDoc = computed(() => !frontmatter.value.layout || frontmatter.value.layout === 'doc')
const visible = computed(() => isDoc.value && headings.value.length > 0)
const expanded = computed(() => hovering.value || pinned.value)

// 从正文 DOM 收集 h1（文章标题）/ h2 / h3，去掉 VitePress 的 # 锚点符号
function collect() {
  const els = document.querySelectorAll<HTMLElement>('.vp-doc h1[id], .vp-doc h2[id], .vp-doc h3[id]')
  headings.value = [...els].map((el) => {
    const clone = el.cloneNode(true) as HTMLElement
    clone.querySelectorAll('.header-anchor, .VPBadge').forEach((n) => n.remove())
    const level = Number(el.tagName[1]) as Heading['level']
    return { id: el.id, text: clone.textContent?.trim() ?? el.id, level }
  })
  updateActive()
}

// 顶部固定 Header 高度（桌面为导航栏，移动端还有本地导航条）
function headerOffset() {
  const nav = document.querySelector<HTMLElement>('.VPNav')?.offsetHeight ?? 64
  const local = document.querySelector<HTMLElement>('.VPLocalNav')
  const localH = local && getComputedStyle(local).position !== 'static' ? local.offsetHeight : 0
  return nav + localH + 16
}

// Scroll Spy：最后一个越过 Header 下沿的标题即为当前章节
function updateActive() {
  const offset = headerOffset() + 8
  let current = headings.value[0]?.id ?? ''
  for (const h of headings.value) {
    const el = document.getElementById(h.id)
    if (el && el.getBoundingClientRect().top <= offset) current = h.id
    else break
  }
  // 滚到底部时，高亮最后一个章节
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    current = headings.value[headings.value.length - 1]?.id ?? current
  }
  activeId.value = current
}

let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => { updateActive(); ticking = false })
}

function jump(id: string) {
  // 目录容器带 vp-raw 类，VitePress 路由不会拦截这些锚点，滚动完全由这里控制
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset()
  window.scrollTo({ top, behavior: 'smooth' })
  history.replaceState(history.state, '', `#${encodeURIComponent(id)}`)
  activeId.value = id
  sheetOpen.value = false
}

function togglePin() {
  pinned.value = !pinned.value
}

// 点击组件外部时收起固定展开的面板
function onDocClick(e: MouseEvent) {
  if (pinned.value && root.value && !root.value.contains(e.target as Node)) pinned.value = false
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { pinned.value = false; sheetOpen.value = false }
}

// 横线长度：h1 最长，h2 次之，h3 最短
function barWidth(h: Heading) {
  return h.level === 1 ? 26 : h.level === 2 ? 20 : 12
}

// 折叠态指示器最多显示 10 条：以 active 为中心取一个窗口，首尾处贴边
// 所有横线都渲染在一条轨道里，只平移轨道，窗口变化时平滑滑动、不重建 DOM
const MAX_BARS = 10
const barRows = computed(() => Math.min(headings.value.length, MAX_BARS))
const barStart = computed(() => {
  const n = headings.value.length
  if (n <= MAX_BARS) return 0
  const idx = Math.max(0, headings.value.findIndex((h) => h.id === activeId.value))
  const start = idx - Math.floor((MAX_BARS - 1) / 2)
  return Math.min(Math.max(start, 0), n - MAX_BARS)
})
const hiddenBefore = computed(() => barStart.value > 0)
const hiddenAfter = computed(() => barStart.value + barRows.value < headings.value.length)

onMounted(() => {
  collect()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})

// 切换文章（VitePress 单页路由）后重新收集标题
watch(() => route.path, () => {
  pinned.value = false
  sheetOpen.value = false
  nextTick(() => setTimeout(collect, 50))
})
watch(() => page.value.headers, () => nextTick(collect))

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div v-if="visible" ref="root" class="ftoc">
    <!-- 桌面 / 平板：右侧悬浮指示器，展开时面板覆盖在指示器上 -->
    <div class="ftoc-dock" @mouseenter="hovering = true" @mouseleave="hovering = false">
      <nav class="ftoc-panel vp-raw" :class="{ open: expanded }" aria-label="文章目录" :aria-hidden="!expanded">
        <ul>
          <li v-for="h in headings" :key="h.id" :class="['lv' + h.level, { active: activeId === h.id }]">
            <a :href="`#${h.id}`" :tabindex="expanded ? 0 : -1" @click.prevent="jump(h.id)">
              <span class="ftoc-dot" />{{ h.text }}
            </a>
          </li>
        </ul>
      </nav>
      <button class="ftoc-bars" :class="{ 'more-before': hiddenBefore, 'more-after': hiddenAfter }"
        :style="{ '--ftoc-rows': barRows, '--ftoc-start': barStart }"
        :aria-expanded="expanded" aria-label="文章目录" @click="togglePin">
        <span class="ftoc-bars-track">
          <span v-for="h in headings" :key="h.id" class="ftoc-bar-row">
            <span class="ftoc-bar" :class="{ active: activeId === h.id }"
              :style="{ '--ftoc-bar-w': barWidth(h) + 'px' }" />
          </span>
        </span>
      </button>
    </div>

    <!-- 移动端：右下角按钮 + 底部弹出目录 -->
    <button class="ftoc-fab" aria-label="打开文章目录" @click="sheetOpen = true"><List :size="20" /></button>
    <Transition name="ftoc-fade">
      <div v-if="sheetOpen" class="ftoc-mask" @click.self="sheetOpen = false">
        <nav class="ftoc-sheet vp-raw" aria-label="文章目录">
          <div class="ftoc-sheet-head">
            <span>目录</span>
            <button aria-label="关闭" @click="sheetOpen = false"><X :size="18" /></button>
          </div>
          <ul>
            <li v-for="h in headings" :key="h.id" :class="['lv' + h.level, { active: activeId === h.id }]">
              <a :href="`#${h.id}`" @click.prevent="jump(h.id)"><span class="ftoc-dot" />{{ h.text }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </Transition>
  </div>
</template>
