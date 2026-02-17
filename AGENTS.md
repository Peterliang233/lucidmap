# Repository Guidelines

This repo contains a React 18 + Vite 5 site for organizing interview-topic “knowledge cards.” Content is primarily data-driven via `src/data.json`, with topic pages in `src/pages/` and shared UI in `src/components/`.

## Project Structure & Module Organization
- `src/`: application source code.
- `src/pages/`: routed topic pages (PascalCase filenames like `BPlusTree.jsx`).
- `src/components/`: shared UI building blocks.
- `src/data.json`: navigation content, sections, groups, and tags.
- `src/assets/`: static assets such as `logo-lucidmap.svg`.
- `src/styles.css`: global styles.
- `index.html`, `vite.config.js`: Vite entry and config.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the local Vite dev server.
- `npm run build`: produce a production build in `dist/`.
- `npm run preview`: serve the production build locally.

## Coding Style & Naming Conventions
- Use 2-space indentation and double quotes in JS/JSX to match existing files.
- React components and pages use PascalCase names (for example, `TopNav.jsx`, `NetworkTcpHandshake.jsx`).
- Keep new topic pages under `src/pages/` and wire routes in `src/App.jsx`.
- Keep content updates in `src/data.json` and prefer data-driven changes over hardcoded UI.

## CSS Organization
- Each CSS file must be 1000 lines or fewer.
- Split long styles into multiple files under `src/styles/pages/` and import them from `src/styles/pages.css`.
- Name CSS files by the page/module they style (for example, `os-thread-sync.css`, `mq-kafka-election.css`).
- Shared styles should live in clearly scoped shared files (for example, `shared-layout.css`, `shared-flow.css`, `shared-sequence.css`, `shared-utilities.css`).
- Avoid generic chunk names like `pages-01.css`; keep names semantic and maintainable.

## Testing Guidelines
- No automated test framework is configured in `package.json`.
- Run `npm run dev` and do a quick smoke check: load `#/` and `#/map`, then verify new routes and cards render correctly.

## Commit & Pull Request Guidelines
- Commit messages follow a Conventional Commits style (for example, `chore: add Vite configuration for React project`).
- Keep commits focused and describe what changed and why.
- PRs should include a short summary, steps to verify, and screenshots or a short clip for UI changes.

## Content & Routing Tips
- Hash-based routes are used (for example, `/topics/bplus-tree` renders at `#/topics/bplus-tree`).
- When adding a new topic, add a page in `src/pages/`, a route in `src/App.jsx`, and a card entry in `src/data.json`.

## Animation Standards
- Goal: animations must be visually rich but technically accurate; every motion should map to a real system step.
- Build from the real flow: list the core steps first, then assign each step a visual cue (node state, signal, buffer, or transfer).
- Prefer interaction over text: use moving signals, pulses, and state changes to show causality; keep labels short and supporting only.
- Animation can use some exactly data examples to show the real system behavior.
- Encode rules visually: compare nodes with badges/metrics (for example priority/offset/runid), show quorum or vote counts as meters.
- Temporal clarity: stagger animations to reflect order (handshake → snapshot/transfer → replay → steady state).
- Avoid clutter: cap at 3–4 concurrent motions per scene and keep the layout tight on mobile (hide lines, stack nodes).
- Reuse patterns: use existing animations (`flow`, `frameFlow`, pulses) and keep new keyframes scoped to the diagram class.
