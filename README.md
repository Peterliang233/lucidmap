# LucidMap Knowledge Map

LucidMap is a **React + Vite** configuration-driven knowledge map site. It uses animated topic pages to organize computer fundamentals and system design topics. Navigation, cards, tags, and per-page principles are driven by JSON or page data for easy, continuous expansion.

## Features
- JSON-configured catalog and content
- Paged knowledge map browsing (2 categories per page)
- Keyword search (title / description / tags)
- Tag filtering (toggle on/off)
- Collapsible groups
- Animated topic pages (step timeline + play/pause)
- Principles panel that explains the core ideas per topic
- Responsive layout + motion cards

## Tech Stack
- React 18
- Vite 5

## Quick Start
Routes:
- Home: `#/`
- Knowledge map: `#/map`
- Example topic: `#/topics/bplus-tree`

1. Install dependencies
```bash
npm install
```

2. Start dev server
```bash
npm run dev
```

3. Build
```bash
npm run build
```

4. Preview
```bash
npm run preview
```

## Configuration
All content is configured in `src/data.json`.

### Top-Level Schema
- `site`: site metadata (title, subtitle, footer)
- `legend`: tag list (optional, defaults to auto-collected from content)
- `sections`: catalog sections

### Section Schema
- `id`: unique anchor ID
- `title`: section title
- `desc`: section description
- `groups`: list of groups

### Group Schema
- `title`: group title
- `items`: list of cards

### Item Schema
- `title`: card title
- `desc`: summary
- `link`: external link or internal route (optional, `#` means no link)
- `tags`: tag array

### Internal Routing Example
- If `link` in `src/data.json` starts with `/`, it is treated as an internal route.
- Example: `/topics/bplus-tree` (Hash route address is `#/topics/bplus-tree`).

### Example
```json
{
  "id": "os",
  "title": "Operating Systems",
  "desc": "Processes, threads, memory, scheduling, and I/O essentials",
  "groups": [
    {
      "title": "Processes and Threads",
      "items": [
        {
          "title": "Thread Sync & Concurrency Control",
          "desc": "Mutex, spinlock, and condition variables: comparison and usage",
          "link": "#",
          "tags": ["high-frequency", "performance"]
        }
      ]
    }
  ]
}
```

## Directory Structure
```
.
├─ index.html
├─ package.json
├─ vite.config.js
└─ src
   ├─ App.jsx
   ├─ components
   ├─ pages
   ├─ data.json
   ├─ main.jsx
   └─ styles
      ├─ base.css
      ├─ pages.css
      ├─ topic-shell.css
      └─ pages
         ├─ shared-layout.css
         ├─ shared-flow.css
         ├─ shared-sequence.css
         ├─ shared-animations.css
         ├─ shared-utilities.css
         └─ (page-level styles)
```

## Styling & Animation
- Global tokens and resets live in `src/styles/base.css`.
- The TopicShell layout styles live in `src/styles/topic-shell.css`.
- Page-level styles are split under `src/styles/pages/` and aggregated by `src/styles/pages.css`.
- Each topic page defines its own diagram/animation markup and step data in `src/pages/`.

## FAQ
- **Q: Why does opening the HTML directly show nothing?**
  - A: This is a Vite project. Use `npm run dev` to start a local server.

## How to Extend
- Add a new topic page: create a page in `src/pages/` and register a route in `src/App.jsx`.
- Add knowledge cards: add `section/group/item` entries in `src/data.json`.

## Contributing

1. Fork this repository and clone it locally
2. Create a feature branch from `main`
```bash
git checkout -b feat_xxx
```
3. Make your changes and verify the build passes
```bash
npm run build
```
4. Commit and push to your fork
```bash
git add .
git commit -m "feat: describe your change"
git push origin feat_xxx
```
5. Open a Pull Request targeting the `main` branch and wait for review
