# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

No linting, testing, or TypeScript tooling is configured. Verify changes by running `npm run dev` and smoke-checking affected routes in the browser.

## Architecture

**LucidMap** is a React 18 + Vite SPA that visualizes computer science topics through animated, step-based interactive pages. The UI is in Chinese.

### Routing

Hash-based routing (`HashRouter`) with three main route types:
- `#/` — Landing page
- `#/map` — Knowledge map browser (reads from `src/data.json`)
- `#/topics/*` — Individual topic pages (e.g. `#/topics/os/thread-sync`)

All routes are registered in `src/App.jsx` (~39 routes across sections: os, network, database, backend, algorithms, redis, mq, ai).

### Key Components

- **`TopicShell.jsx`** — The reusable template used by ~95% of topic pages. Accepts `eyebrow`, `title`, `subtitle`, `steps`, `renderDiagram`, `principles`, `panel`, `interval`, `backPath`, `diagramClass`, and `principlesPlacement` props. Handles play/pause/prev/next controls and auto-advance timer (default 2600ms). Some complex pages (e.g. `Home.jsx`) bypass this and use `Layout` directly.
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
`link` values starting with `/topics/` are internal routes; `"#"` means disabled; others open externally.

### Step and Panel Shapes

```js
// steps array (each item)
{ id, title, description, bullets?: string[], ...customDiagramProps }

// panel array (hero info cards)
{ title, detail }

// principles array
{ title, detail, points?: string[] }
```

`principlesPlacement` is `"below"` (default) or `"side"`.

## Coding Style

- 2-space indentation, double quotes in JS/JSX.
- React components use PascalCase filenames (e.g. `NetworkTcpHandshake.jsx`).
- Commit messages follow Conventional Commits style (e.g. `feat: add TCP handshake animation`).

## Styling Conventions

- Global tokens: `src/styles/base.css` — CSS vars `--bg`, `--bg-deep`, `--ink`, `--ink-soft`, `--accent` (orange), `--accent-2` (teal), `--card`, `--line`, `--shadow`.
- TopicShell layout: `src/styles/topic-shell.css`.
- Page-specific styles: `src/styles/pages/*.css`, aggregated via `@import` in `src/styles/pages.css`.
- Class naming follows BEM-like patterns: `.component__element--modifier`.
- Each CSS file must stay under 1000 lines. Split into multiple files if needed.
- Shared animation patterns live in `shared-animations.css`, `shared-flow.css`, `shared-sequence.css`, `shared-layout.css`, `shared-utilities.css`. Reuse existing keyframes before adding new ones.
- Responsive via media queries; no CSS framework. Small screens must remain readable — compress spacing but don't break layout.

## Animation Standards

Animations are the core value of this project. Every topic page must have a meaningful, technically accurate visualization.

- **Map to real steps**: every motion should correspond to a real system step. List the core steps first, then assign each a visual cue (node state, signal, buffer, transfer).
- **Interaction over text**: use moving signals, pulses, state changes to show causality. Keep labels short.
- **Example-driven**: use concrete values (keys, sequence numbers, offsets) to make abstract concepts tangible.
- **Temporal clarity**: stagger animations to reflect order. Avoid more than 3–4 concurrent motions per scene.
- **Visual richness minimum**: multi-element coordinated animation, concrete process visualization (nodes/flows/queues/states), and clear comparison between strategies/versions/phases.
- **No hover-only triggers**: mobile must be fully operable.
- **Avoid `position: absolute`** layouts that prevent height from expanding and cause overlap with sections below.
- Scope new keyframes to the diagram class. Reuse existing patterns (`flow`, `frameFlow`, pulses) from shared CSS files.

### SVG Layout & Alignment Rules

All SVG-based diagram scenes must follow these rules to ensure centered, non-overlapping, well-coordinated layouts:

- **Centered container**: every diagram wrapper must use `width: min(100%, 780px); margin: 0 auto;` to center within the page.
- **All content within viewBox**: every SVG element (rect, text, circle, line) must fit entirely within the declared `viewBox`. Never place elements that extend beyond the viewBox boundaries — they will be clipped and invisible.
- **Margin from edges**: keep at least 20px padding from viewBox edges. For example, in a `viewBox="0 0 600 280"`, the rightmost element should not exceed x=580, and the bottommost should not exceed y=260.
- **Text sizing**: titles 12–13px, labels 10–11px, sub-labels 9px, hints 8–9px. Never use excessively large or small font sizes.
- **No overlapping elements**: verify that rects, texts, and circles do not overlap each other. When elements are stacked vertically, ensure sufficient gap (at least 8px between bounding boxes). When placed side by side, ensure no horizontal overlap.
- **Arrow coordinates**: use explicit x1/y1/x2/y2 values for arrows rather than computing from element centers with offsets that may go wrong. Verify arrow start/end points visually make sense (e.g., a downward arrow should have y2 > y1).
- **viewBox height must accommodate all content**: if the scene has elements down to y=220 plus text at y=245, the viewBox height must be at least 260. Always add ~20px below the lowest element.
- **Consistent spacing**: use uniform gaps between repeated elements (e.g., cache rows, timeline nodes, flow boxes). Calculate positions arithmetically rather than hardcoding arbitrary values.
- **Responsive hiding**: on small screens (≤640px), hide secondary labels (sub-text, hints, annotations) via `display: none` to prevent cramped layouts, but never hide primary content.
- **`preserveAspectRatio="xMidYMid meet"`**: always set this on SVG elements to ensure centered scaling without distortion.
