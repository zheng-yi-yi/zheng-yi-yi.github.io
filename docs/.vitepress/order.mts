import fs from 'node:fs'
import path from 'node:path'

// 排序规则（侧边栏、标签页共用）：
// 1. frontmatter 里的 order 数字越小越靠前；没写 order 的排在后面
// 2. order 相同或都没写时，按文件名自然排序（2-xxx 排在 10-xxx 前面）
// 子目录的 order 写在它的 index.md 里

export interface Orderable {
  order?: number
  name: string
}

const collator = new Intl.Collator('zh-CN', { numeric: true, sensitivity: 'base' })

export function compareOrder(a: Orderable, b: Orderable): number {
  const oa = a.order ?? Number.POSITIVE_INFINITY
  const ob = b.order ?? Number.POSITIVE_INFINITY
  if (oa !== ob) return oa < ob ? -1 : 1
  return collator.compare(a.name, b.name)
}

// 解析 frontmatter 中的 order，非数字视为未设置
export function parseOrder(value: unknown): number | undefined {
  const n = typeof value === 'number' ? value : Number(value)
  return value !== undefined && value !== null && value !== '' && Number.isFinite(n) ? n : undefined
}

// 只读取 frontmatter 中 title 与 order，避免为侧边栏引入完整的 YAML 解析
export function readMeta(file: string): { title?: string; order?: number; h1?: string } {
  if (!fs.existsSync(file)) return {}
  const src = fs.readFileSync(file, 'utf-8')
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const pick = (key: string) => fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^['"]|['"]$/g, '')
  return {
    title: pick('title'),
    order: parseOrder(pick('order')),
    h1: src.match(/^#\s+(.+)$/m)?.[1].trim()
  }
}

export function displayTitle(file: string): string {
  const m = readMeta(file)
  return m.title ?? m.h1 ?? path.basename(file, '.md')
}
