import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

export interface Resource {
  name: string
  url: string
  desc?: string
  tags: string[]
}

// 子分类：右侧一个区块
export interface ResourceGroup {
  id: string
  title: string
  items: Resource[]
}

// 一级分类：一个 YAML 文件，左侧一个可折叠目录
export interface ResourceCategory {
  id: string
  title: string
  icon: string
  groups: ResourceGroup[]
}

declare const data: ResourceCategory[]
export { data }

// 一级分类：数组顺序 = 左侧目录与右侧内容的顺序
// file 对应 docs/resources/data/<file>.yaml；icon 为 lucide 图标名，需在 theme/icons.ts 中注册
// 未在此列出的 YAML 文件按文件名排在最后，图标为文件夹
// 子分类（group）和卡片的顺序 = YAML 文件里的书写顺序
const categoryOrder: { file: string; title: string; icon: string }[] = [
  { file: 'dev-tools', title: '开发工具', icon: 'wrench' },
  { file: 'ai-tools', title: 'AI 工具', icon: 'bot' },
  { file: 'design', title: '设计', icon: 'palette' },
  { file: 'indie', title: '出海', icon: 'globe' },
  { file: 'media', title: '自媒体', icon: 'smartphone' },
  { file: 'github', title: 'GitHub 项目', icon: 'star' }
]

function toResource(r: any): Resource {
  return {
    name: String(r.name),
    url: String(r.url),
    desc: r.desc ? String(r.desc) : undefined,
    tags: Array.isArray(r.tags) ? r.tags.map(String) : []
  }
}

// 支持两种写法：
// 1. 直接是资源列表 → 只有一个子分类
// 2. 由 { group, items } 组成的列表 → 多个子分类
function toGroups(id: string, title: string, list: any[]): ResourceGroup[] {
  const nested = list.some((x) => x && Array.isArray(x.items))
  if (!nested) return [{ id, title, items: list.map(toResource) }]
  return list.map((g, i) => ({
    id: `${id}-${i + 1}`,
    title: String(g.group ?? `分组 ${i + 1}`),
    items: (g.items ?? []).map(toResource)
  }))
}

export default {
  watch: ['../../resources/data/*.yaml'],
  load(files: string[]): ResourceCategory[] {
    const ids = categoryOrder.map((c) => c.file)
    const collator = new Intl.Collator('zh-CN', { numeric: true })
    return files
      .map((file) => {
        const id = path.basename(file, '.yaml')
        const list = (yaml.load(fs.readFileSync(file, 'utf-8')) as any[]) ?? []
        const m = categoryOrder.find((c) => c.file === id) ?? { title: id, icon: 'folder' }
        return { id, title: m.title, icon: m.icon, groups: toGroups(id, m.title, list) }
      })
      .sort((a, b) => {
        const ia = ids.indexOf(a.id), ib = ids.indexOf(b.id)
        const ra = ia < 0 ? Number.MAX_SAFE_INTEGER : ia, rb = ib < 0 ? Number.MAX_SAFE_INTEGER : ib
        return ra - rb || collator.compare(a.id, b.id)
      })
  }
}
