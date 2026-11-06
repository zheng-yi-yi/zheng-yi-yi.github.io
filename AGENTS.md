# AGENTS.md

本文件写给参与本仓库的 AI 编码助手和协作者，说明项目结构，以及编写知识库、资源导航时要遵守的约定。

## 项目简介

「翼翼的笔记」：个人知识库 + 资源导航站，原则是**看到就收集，学到就记录**。

- 技术栈：VitePress 2（alpha）+ Vue 3 + TypeScript，图标用 `lucide-vue-next`，资源数据用 `js-yaml` 解析。
- 部署：推送到 `main` 后，由 `.github/workflows/deploy.yml` 自动发布到 GitHub Pages（`https://zheng-yi-yi.github.io`）。
- 语言：页面文案以中文为主；代码注释用中文。

## 常用命令

需要 Node.js ≥ 20.12（VitePress 2 依赖 `crypto.hash`，Node 19 会构建失败）。

```bash
npm install
npm run docs:dev      # 本地开发
npm run docs:build    # 构建，产物在 docs/.vitepress/dist
npm run typecheck     # vue-tsc 类型检查
```

改动代码后，至少跑一次 `typecheck` 和 `docs:build`，两者都通过才算完成。

## 目录结构

```
docs/
├─ index.md                 首页（hero + 6 个栏目入口）
├─ tags.md                  标签页（TagFilter 组件）
├─ backend/ frontend/ network/ devops/ ai/ indie/
│   └─ index.md             栏目索引页，笔记放在同目录下
├─ resources/
│   ├─ index.md             资源导航页（layout: page + ResourceNav 组件）
│   └─ data/*.yaml          资源数据，一个文件 = 一个一级分类
└─ .vitepress/
    ├─ config.mts           站点配置：本地搜索、sitemap、canonical、SEO
    ├─ sections.mts         栏目定义（唯一来源）
    ├─ nav.mts / sidebar.mts 导航栏、按目录自动生成的侧边栏
    ├─ order.mts            排序规则（侧边栏、标签页共用）
    ├─ data/posts.data.ts   汇总笔记的标题、标签、状态
    ├─ data/resources.data.ts 读取资源 YAML，定义一级分类顺序与图标
    └─ theme/
        ├─ index.ts         注册组件和 layout 插槽
        ├─ icons.ts         资源分类用到的 lucide 图标注册表
        ├─ components/      DocTags、FloatingToc、ResourceNav、TagFilter
        └─ *.css            style / resource-nav / floating-toc / scrollbar
```

## 栏目

| 栏目 | 目录 | 记录什么 |
|---|---|---|
| 后端 | `docs/backend/` | 语言、框架、数据库、中间件 |
| 前端 | `docs/frontend/` | JS/TS、框架、工程化 |
| 网络 | `docs/network/` | 计算机网络概念、协议、排查 |
| DevOps | `docs/devops/` | K8s、GitLab CI/CD、Docker |
| AI Agent | `docs/ai/` | Skill、Harness、记忆等 AI Agent 知识 |
| 出海 | `docs/indie/` | 出海建站、变现、抖音小游戏 |

新增栏目：在 `sections.mts` 加一项，再创建目录和 `index.md`。导航栏、侧边栏、标签页都会自动读取，**不要**在其他文件里硬编码栏目列表。
