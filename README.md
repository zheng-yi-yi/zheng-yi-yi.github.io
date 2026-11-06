# 翼翼的笔记

记录一下学到的知识，还有日常收集的工具与资源。基于 [VitePress](https://vitepress.dev/) 构建，推送到 `main` 分支后由 GitHub Actions 自动部署到 GitHub Pages。

## 本地开发

需要 Node.js ≥ 20.12。

```bash
npm install
npm run docs:dev      # 本地预览
npm run docs:build    # 构建
npm run docs:preview  # 预览构建产物
```

## 新增笔记

在对应栏目目录下新建 `.md` 文件即可，侧边栏和标签页会自动收录。

| 栏目 | 目录 |
|---|---|
| 后端 | `docs/backend/` |
| 前端 | `docs/frontend/` |
| 网络 | `docs/network/` |
| DevOps | `docs/devops/` |
| AI Agent | `docs/ai/` |
| 出海 | `docs/indie/` |

文件头（都可选）：

```yaml
---
title: 笔记标题        # 不写则取第一个 # 标题
order: 10              # 排序，数字越小越靠前；不写则排在有 order 的后面
tags: [k8s, 速查]      # 用于标签页筛选
status: draft          # draft 草稿 / growing 补充中 / done 完成
---
```

- 子目录会在侧边栏中成为可折叠分组；子目录里放 `index.md` 可作为分组页。
- 以 `_` 开头的文件或目录（如 `_draft.md`）不会出现在侧边栏和标签页，可用来放草稿。
- 新增栏目：在 `docs/.vitepress/sections.mts` 中加一项，并创建目录和 `index.md`。

### 排序规则

| 对象 | 顺序由什么决定 |
|---|---|
| 栏目（后端、前端…） | `docs/.vitepress/sections.mts` 数组中的顺序 |
| 栏目内的文章和子目录 | 文章 frontmatter 的 `order`；子目录看它 `index.md` 的 `order`。文章和子目录混合排序 |
| 没写 `order` 的 | 排在有 `order` 的后面，按文件名自然排序（`2-xxx` 在 `10-xxx` 前） |

## 新增资源

编辑 `docs/resources/data/` 下对应分类的 YAML 文件。一个文件 = 左侧一个一级目录，支持两种写法。

**写法一：直接列资源**（左侧只有一级目录）

```yaml
- name: Excalidraw
  url: https://excalidraw.com
  desc: 手绘风白板
  tags: [画图, 免费]
```

**写法二：分子分类**（左侧目录可折叠，展开后是子目录）

```yaml
- group: 画图
  items:
    - name: Excalidraw
      url: https://excalidraw.com
      desc: 手绘风白板
- group: 图标
  items:
    - name: Iconify
      url: https://icon-sets.iconify.design
```

| 文件 | 分类 |
|---|---|
| `dev-tools.yaml` | 开发工具 |
| `ai-tools.yaml` | AI 工具 |
| `design.yaml` | 设计（写法二示例） |
| `indie.yaml` | 出海 |
| `media.yaml` | 自媒体 |
| `github.yaml` | GitHub 项目 |

- 新建 YAML 文件即新增一级分类；显示名称和图标在 `docs/.vitepress/data/resources.data.ts` 的 `categoryOrder` 中配置。
- 分类图标使用 [Lucide](https://lucide.dev/icons)：在 `categoryOrder` 中填图标名（如 `wrench`），并在 `docs/.vitepress/theme/icons.ts` 中引入注册；未注册时显示文件夹图标。
- 卡片图标自动取网站 favicon，取不到时显示名称首字母。

### 排序规则

| 对象 | 顺序由什么决定 |
|---|---|
| 一级分类（左侧目录） | `categoryOrder` 数组中的顺序；未列出的 YAML 按文件名排在最后 |
| 子分类（`group`） | YAML 文件中的书写顺序 |
| 卡片 | YAML 文件中的书写顺序 |
