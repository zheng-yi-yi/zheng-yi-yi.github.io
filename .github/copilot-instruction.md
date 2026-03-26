# Project Context
This is a personal blog website for **Zheng, Yiyi**, built with **VitePress**. It is hosted on GitHub Pages at `https://zheng-yi-yi.github.io/`.

# Development Guidelines
- **VitePress ESM**: VitePress is an ESM-only package. Ensure `package.json` has `"type": "module"` or use `.mjs`/`.mts` extensions.
- **Source Root**: The VitePress project root is the `docs/` directory.
- **File-based Routing**: Markdown files in `docs/` (except `.vitepress/`) are source files and mapped directly to URLs.
- **Deployment**: Automatic deployment to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).
- **Markdown**: Use standard Markdown with VitePress-specific extensions where applicable.

# Technical Note
VitePress is an ESM-only package. Don't use `require()` to import it, and make sure your nearest `package.json` contains `"type": "module"`, or change the file extension of your relevant files like `.vitepress/config.js` to `.mjs`/`.mts`. Refer to [Vite's troubleshooting guide](http://vitejs.dev/guide/troubleshooting.html#this-package-is-esm-only) for more details. Also, inside async CJS contexts, you can use `await import('vitepress')` instead.
