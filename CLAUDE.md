# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

No linting, testing, or TypeScript tooling is configured.

## Architecture

**LucidMap** is a React 18 + Vite SPA that visualizes computer science topics through animated, step-based interactive pages. The UI is in Chinese.

### Routing

Hash-based routing (`HashRouter`) with three main route types:
- `#/` — Landing page
- `#/map` — Knowledge map browser (reads from `src/data.json`)
- `#/topics/*` — Individual topic pages (e.g. `#/topics/os/thread-sync`)

All routes are registered in `src/App.jsx`.

### Key Components

- **`TopicShell.jsx`** — The reusable template used by nearly all topic pages. Accepts `eyebrow`, `title`, `subtitle`, `steps`, `renderDiagram`, `principles`, `panel`, `interval`, `backPath`, `diagramClass`, and `principlesPlacement` props. Handles play/pause/prev/next controls and auto-advance timer. Some complex pages bypass this and use `Layout` directly to manage their own state.
- **`TopNav.jsx`** — Navigation header; reads section structure from `data.json` to build dropdowns dynamically.
- **`Layout.jsx`** — Wraps all pages with TopNav and footer.

### Adding a New Topic Page

1. Create `src/pages/YourTopic.jsx` using `TopicShell` as the wrapper.
2. Define a `steps` array (each step: `id`, `title`, `description`, optional `bullets` and custom diagram props).
3. Write a `renderDiagram(step, stepIndex)` function for the custom visualization.
4. Optionally add a `principles` array and `panel` array.
5. Add a route in `src/App.jsx`.
6. Add the entry to `src/data.json` under the appropriate section/group.
7. Create `src/styles/pages/your-topic.css` and import it in `src/styles/pages.css`.

### Data Configuration (`src/data.json`)

Drives both the Home map browser and TopNav dropdowns. Schema:
```json
{
  "site": { "title", "tagline", "subtitle", "footer" },
  "legend": ["tag1", "tag2"],
  "sections": [{
    "id": "os",
    "title": "操作系统",
    "desc": "section description",
    "groups": [{
      "title": "进程与线程",
      "items": [{ "title", "desc", "link", "tags" }]
    }]
  }]
}
```
`link` values starting with `/topics/` are treated as internal routes; others open externally.

### Step and Panel Shapes

```js
// steps array (each item)
{ id, title, description, bullets?: string[], ...customDiagramProps }

// panel array (hero info cards)
{ title, detail }

// principles array
{ title, detail }
```

`principlesPlacement` is `"below"` (default) or `"side"`.

### Styling Conventions

- Global tokens and resets: `src/styles/base.css` — defines CSS vars `--bg`, `--ink`, `--accent`, `--line`, `--shadow`
- TopicShell layout: `src/styles/topic-shell.css`
- Page-specific styles: `src/styles/pages/*.css`, aggregated in `src/styles/pages.css`
- Class naming follows BEM-like patterns: `.component__element--modifier`
- Responsive via media queries; no CSS framework used
