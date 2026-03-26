import { defineConfig } from 'vitepress'
import { nav } from './nav.mts'
import { sidebar } from './sidebar.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zheng, Yiyi",
  description: "Observations on life and code.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zheng-yi-yi/zheng-yi-yi.github.io' }
    ]
  }
})
