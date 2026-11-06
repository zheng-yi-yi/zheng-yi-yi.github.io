// 知识库栏目定义：导航栏、侧边栏、首页入口都从这里读取
export interface Section {
  dir: string
  text: string
  desc: string
}

export const sections: Section[] = [
  { dir: 'backend', text: '后端', desc: '语言、框架、数据库、中间件' },
  { dir: 'frontend', text: '前端', desc: 'JS/TS、框架、工程化' },
  { dir: 'network', text: '网络', desc: '计算机网络概念、协议、排查' },
  { dir: 'devops', text: 'DevOps', desc: 'K8s、GitLab CI/CD、Docker' },
  { dir: 'ai', text: 'AI Agent', desc: 'Skill、Harness、记忆等 AI Agent 相关知识' },
  { dir: 'indie', text: '出海', desc: '出海建站、变现' }
]
