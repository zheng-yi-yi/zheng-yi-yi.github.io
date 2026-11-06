import { defineConfig } from 'vitepress'
import { nav } from './nav.mts'
import { sidebar } from './sidebar.mts'

const hostname = 'https://zheng-yi-yi.github.io'

export default defineConfig({
  lang: 'zh-CN',
  title: '翼翼的笔记',
  description: '记录一下学到的知识，还有日常收集的工具与资源：后端、前端、网络、DevOps、AI、出海。',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname },
  head: [
    ['meta', { name: 'keywords', content: '知识库,后端,前端,计算机网络,K8s,CI/CD,AI Agent,Skill,Harness,出海,资源导航' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '翼翼的笔记' }]
  ],
  // 每页注入 canonical 和 og:title，利于搜索引擎收录
  transformPageData(pageData) {
    const p = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: `${hostname}/${p}` }],
      ['meta', { property: 'og:title', content: pageData.title || '翼翼的笔记' }]
    )
  },
  themeConfig: {
    nav,
    sidebar,
    // 默认大纲关闭，改用 FloatingToc 悬浮目录；右侧 aside 区域保留，正文宽度不变
    outline: false,
    lastUpdated: { text: '最后更新' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zheng-yi-yi' }
    ]
  }
})
