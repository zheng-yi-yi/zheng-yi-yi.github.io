import type { DefaultTheme } from 'vitepress'
import { sections } from './sections.mts'

export const nav: DefaultTheme.NavItem[] = [
  {
    text: '知识库',
    items: sections.map((s) => ({ text: s.text, link: `/${s.dir}/`, activeMatch: `^/${s.dir}/` }))
  },
  { text: '资源导航', link: '/resources/', activeMatch: '^/resources/' },
  { text: '标签', link: '/tags', activeMatch: '^/tags' }
]
