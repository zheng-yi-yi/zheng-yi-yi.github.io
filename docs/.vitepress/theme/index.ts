// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './resource-nav.css'
import './floating-toc.css'
import './scrollbar.css'
import DocTags from './components/DocTags.vue'
import FloatingToc from './components/FloatingToc.vue'
import ResourceNav from './components/ResourceNav.vue'
import TagFilter from './components/TagFilter.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 文章标题上方显示 frontmatter 中的标签
      'doc-before': () => h(DocTags),
      // 文章页悬浮目录（替代默认右侧大纲）
      'doc-after': () => h(FloatingToc)
    })
  },
  enhanceApp({ app }) {
    app.component('ResourceNav', ResourceNav)
    app.component('TagFilter', TagFilter)
  }
} satisfies Theme
