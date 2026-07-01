# Belhssan Platform — Project State

## Platform vision
Belhssan is a personal multi-tool platform — one website, one domain, one repo. Tools are vibe-coded by the owner (with AI) for personal use, and may eventually be shared with friends/entourage. It is intentionally built to grow: every tool added lives at `/toolname/` under the same domain. This is not a single app — it is a platform that will have many tools over time. All future sessions must treat it as such.

## Owner profile
- Non-technical / low-code background — relies entirely on AI (Claude Code) for all development
- Prefers batched decisions with minimal back-and-forth before building
- Comfortable with Anaconda Prompt / terminal for basic commands but not independently
- GitHub and Vercel beginner — needs explicit step-by-step for any manual actions
- Primary device: Android phone (PWA install via Chrome)
- Long-term decisions must be confirmed with owner before implementation, then documented here

## Design preferences
- Dark themed UI across all tools
- Clean, minimal interfaces — no clutter
- Mobile-first
- English only throughout
- Naming: platform = Belhssan, each tool gets its own distinct name

## Future tools
- Audiobooks tracker (mentioned, not started)
- More to come — owner adds tools they find useful or want to share with entourage

## Live deployment
- Vercel project: `belhssan-v1` (account: belhassan)
- Current live URL: https://belhssan-v1.vercel.app
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
    asli/            ← Vite/React PWA, served at /asli/ (family tree tool)
      src/App.jsx
      src/main.jsx
      index.html
      package.json
      vite.config.js ← base: '/asli/' is critical, do not remove
    landing/
      index.html     ← static homepage, links to each tool
  vercel.json        ← build command + output + rewrites
  build.sh           ← builds each app and assembles public_out/
  .gitignore
  CLAUDE.md          ← this file
```

## How Vercel builds this
vercel.json buildCommand runs `bash build.sh`, which:
1. Builds each app under `apps/<toolname>/` into its own `dist/`
2. Copies each app's dist/ contents into `public_out/<toolname>/`
3. Copies landing/index.html into public_out/
4. Vercel serves public_out/ as the site root

Resulting URLs:
- `/` → landing page (Belhssan homepage)
- `/aristo/` → Aristo app
- `/asli/` → Asli app

## Adding a new tool
1. Create `apps/<toolname>/` with its own package.json + vite.config.js (set `base: '/<toolname>/'`)
2. Add build step to `build.sh`
3. Add link card to `apps/landing/index.html`
4. Add rewrite rule to vercel.json rewrites
5. Commit + push to branch → Vercel auto-deploys

## Aristo — tool #1
Gym + bodyweight fitness tracker. Features:
- Gym mode: 17 exercises (12 numbered machines + 5 extras), grouped by body part (Legs/Core/Upper Body) with colored section headers
- Bodyweight mode: 12 exercises (push-up variants, core, mobility), also grouped by body part
- Per-exercise muscle group SVG diagram (body silhouette with highlights)
- ROM button (discrete) on gym exercises — saves machine range-of-motion setting
- Sparkline chart showing weight progression
- Edit/delete entries, backdate entries
- Drag-to-reorder — "Reorder" button lets you drag exercises into a custom order, persisted separately
- Cardio tracking — separate CardioCard (running/cycling/walking/swimming/elliptical/stairs/other), logs duration + distance, shows last 5 sessions + totals
- localStorage persistence (single user, single device for now)
- Pre-loaded history from OCR of owner's paper training log (Apr–Jun 2026)

### Aristo data storage
- Key: `gym-history-v4` in localStorage
- Shape: `{ history: { [exerciseId]: Entry[] }, rom: { [exerciseId]: string }, cardio: CardioEntry[] }`
- Entry: `{ date, weight, sets, reps, notes?, duration? }`
- CardioEntry: `{ date, type, duration?, distance?, notes? }`
- Custom exercise order: separate key `gym-order-v1`, shape `{ gym: [exerciseId...], bw: [exerciseId...] }`
- No backend — all local. Future plan: add Supabase for cross-device sync + multi-user.
- Feed feature (X-style activity feed across users, with photos) is planned but deferred until Supabase is set up.

## Asli — tool #2
Family tree tool. Supports multiple families, cross-device sync via Supabase (families created locally are pushed to Supabase once env vars are configured, so no data is lost when sync is enabled).

## Architecture decisions (confirmed)
- Option A monorepo — one Vercel project, all tools in one repo under one domain
- PWA over native app for now — installable from Chrome on Android
- No auth/login for now — site is public but not indexed by search engines
- Aristo: no database for now — localStorage only. Supabase planned later for cross-device sync + multi-user + Feed feature
- Asli: uses Supabase for cross-device sync
- Long-term decisions require owner confirmation before implementation
