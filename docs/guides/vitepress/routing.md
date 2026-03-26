# Routing in VitePress

VitePress uses **File-Based Routing**, where each Markdown file is compiled into a corresponding HTML page.

## Basic Mapping
The directory structure within your source directory (e.g., `docs/`) directly maps to the URL path:

```text
docs/index.md             -->  /
docs/about.md             -->  /about
docs/guides/index.md      -->  /guides/
docs/guides/setup.md      -->  /guides/setup
```

## Linking Between Pages
Use relative or absolute paths. It is recommended to **omit the `.md` extension** so VitePress can manage the final URLs automatically.

- **Recommended**: `[Setup Guide](./setup)`
- **Discouraged**: `[Setup Guide](./setup.md)`

## Clean URLs
By default, VitePress resolves links to URLs ending with `.html`. If your hosting provider (like GitHub Pages) supports it, you can enable `cleanUrls` in `config.mts`:

```typescript
export default defineConfig({
  cleanUrls: true
})
```
This will transform `example.com/guide.html` into `example.com/guide`.

## Advanced Routing
- **Route Rewrites**: Map complex source structures to simpler URLs using the `rewrites` config.
- **Dynamic Routes**: Generate multiple pages from a single Markdown template (e.g., `[pkg].md`) coupled with a `.paths.js` data loader.
