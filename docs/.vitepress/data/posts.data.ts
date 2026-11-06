import { createContentLoader } from 'vitepress'
import { sections } from '../sections.mts'
import { compareOrder, parseOrder } from '../order.mts'

export interface Post {
  title: string
  url: string
  section: string
  tags: string[]
  status?: string
}

declare const data: Post[]
export { data }

// 栏目列表直接取 sections.mts，新增栏目时只需改那一处
const sectionDirs = sections.map((s) => s.dir)

export default createContentLoader(sectionDirs.map((d) => `${d}/**/*.md`), {
  transform(raw): Post[] {
    return raw
      .filter((p) => !p.url.endsWith('/') && !/\/_[^/]*$/.test(p.url)) // 排除栏目索引页和 _ 开头的草稿
      .map((p) => {
        const section = p.url.split('/')[1]
        return {
          title: p.frontmatter.title ?? p.url.split('/').pop(),
          url: p.url,
          section,
          tags: Array.isArray(p.frontmatter.tags) ? p.frontmatter.tags.map(String) : [],
          status: p.frontmatter.status,
          // 排序用：栏目顺序 → order → 路径
          _sec: sectionDirs.indexOf(section),
          _order: parseOrder(p.frontmatter.order)
        }
      })
      .sort((a, b) => a._sec - b._sec || compareOrder({ order: a._order, name: a.url }, { order: b._order, name: b.url }))
      .map(({ _sec, _order, ...post }) => post)
  }
})
