// 资源导航使用的 lucide 图标（https://lucide.dev/icons）
// 按需引入，只打包这里列出的图标；新增分类图标时在此注册
import type { Component } from 'vue'
import { Bot, ChartColumnIncreasing, Folder, Globe, Palette, Smartphone, Star, Wrench } from 'lucide-vue-next'

export const icons: Record<string, Component> = {
  wrench: Wrench,
  bot: Bot,
  palette: Palette,
  globe: Globe,
  smartphone: Smartphone,
  star: Star,
  'chart-column-increasing': ChartColumnIncreasing,
  folder: Folder
}

export function getIcon(name: string): Component {
  return icons[name] ?? Folder
}
