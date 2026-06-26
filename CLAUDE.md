# Belhssan Platform — Project State

## What this is
Personal multi-tool platform. One repo, one Vercel deployment, one domain (belhssan.com — not yet purchased).

## Live deployment
- Vercel project: `belhssan-v1` (account: belhassan)
- Current live URL: https://belhssan-v1.vercel.app
- Branch being developed: `claude/project-context-objectives-sopi1x`
- Production branch: `main`

## Repo structure
```
BelhssanV1/
  apps/
    aristo/          ← Vite/React PWA, served at /aristo/
      src/App.jsx    ← all UI + logic (single file)
      src/main.jsx   ← localStorage storage adapter
      index.html
      package.json
      vite.config.js ← base: '/aristo/' is critical, do not remove
    landing/
      index.html     ← static homepage, links to each tool
  vercel.json        ← build command + output + rewrites
  .gitignore
  CLAUDE.md          ← this file
```

## How Vercel builds this
vercel.json buildCommand:
1. `cd apps/aristo && npm install && npm run build` — builds Vite app into apps/aristo/dist/
2. Copies dist/ contents into public_out/aristo/
3. Copies landing/index.html into public_out/
4. Vercel serves public_out/ as the site root

Resulting URLs:
- `/` → landing page
- `/aristo/` → Aristo app

## Aristo — tool #1
Gym + bodyweight fitness tracker. Features:
- Gym mode: 17 exercises (12 numbered machines + 5 extras), weight/sets/reps logging
- Bodyweight mode: 12 exercises (push-up variants, core, mobility)
- Per-exercise muscle group SVG diagram (body silhouette with highlights)
- ROM button (discrete) on gym exercises — saves machine range-of-motion setting
- Sparkline chart showing weight progression
- Edit/delete entries, backdate entries
- localStorage persistence (single user, single device for now)
- Pre-loaded history from OCR of user's paper training log (Apr–Jun 2026)

## Data storage
- Key: `gym-history-v3` in localStorage
- Shape: `{ history: { [exerciseId]: Entry[] }, rom: { [exerciseId]: string } }`
- Entry: `{ date, weight, sets, reps, notes?, duration? }`
- No backend — all local. Future plan: add Supabase for cross-device sync + multi-user.

## Adding a new tool
1. Create `apps/<toolname>/` with its own package.json + vite.config.js (set `base: '/<toolname>/'`)
2. Add build step to vercel.json buildCommand
3. Add link card to `apps/landing/index.html`
4. Add rewrite rule to vercel.json rewrites
5. Commit + push

## Leftover junk on main branch
The old `gym-tracker/` and `gym-pwa-dist/` folders still exist on main (from manual uploads during initial setup). They don't affect builds but should be cleaned up eventually. They do NOT exist on the development branch.

## Key decisions made
- Option A monorepo (single Vercel project, all tools together) — chosen for simplicity
- PWA not native app — installable from Chrome on Android, works offline
- No auth/login for now — site is public but not indexed
- AI-only development (Claude Code)
