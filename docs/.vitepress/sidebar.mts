import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'
import { sections } from './sections.mts'
import { compareOrder, displayTitle, readMeta, type Orderable } from './order.mts'

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

type Entry = Orderable & { item: DefaultTheme.SidebarItem }

// 递归扫描目录：子目录作为可折叠分组，index.md 不重复列出
// 文章与子目录混在一起，按 order → 文件名 统一排序
function scan(dir: string, base: string): DefaultTheme.SidebarItem[] {
  if (!fs.existsSync(dir)) return []
  const entries: Entry[] = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('_') || e.name.startsWith('.')) continue // 以 _ 或 . 开头的文件不进侧边栏
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      const children = scan(full, `${base}${e.name}/`)
      const idx = path.join(full, 'index.md')
      const hasIdx = fs.existsSync(idx)
      if (!children.length && !hasIdx) continue
      entries.push({
        name: e.name,
        order: readMeta(idx).order,
        item: {
          text: hasIdx ? displayTitle(idx) : e.name,
          link: hasIdx ? `${base}${e.name}/` : undefined,
          collapsed: true,
          items: children
        }
      })
    } else if (e.name.endsWith('.md') && e.name !== 'index.md') {
      entries.push({
        name: e.name,
        order: readMeta(full).order,
        item: { text: displayTitle(full), link: `${base}${e.name.slice(0, -3)}` }
      })
    }
  }
  return entries.sort(compareOrder).map((e) => e.item)
}

// 栏目顺序由 sections.mts 中的数组顺序决定
export const sidebar: DefaultTheme.Sidebar = Object.fromEntries(
  sections.map((s) => [
    `/${s.dir}/`,
    [{ text: s.text, link: `/${s.dir}/`, items: scan(path.join(docsRoot, s.dir), `/${s.dir}/`) }]
  ])
)

