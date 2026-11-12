# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run check        # type-check (svelte-check + tsc)
npm run check:watch  # type-check in watch mode
npm run db:push      # push schema changes to Neon (requires DATABASE_URL)
npm run db:studio    # open Drizzle Studio
```

No test runner is set up yet.

## Architecture

**Stack:** SvelteKit + Svelte 5 (runes mode) + TypeScript + Tailwind CSS v4 + Neon (serverless PostgreSQL) + Drizzle ORM.

### Routes

| Route | Description |
|---|---|
| `/welcome` | Enter or create a user ID; redirects to `/setup` (new) or `/releases` (returning) |
| `/setup` | Pick artists to follow; doubles as "add artists" when `?from=artists` |
| `/releases` | New-releases carousel (main app screen) |
| `/artists` | Grid of followed artists |
| `/album/[slug]` | Album detail page |
| `/` | Immediately redirects to `/releases` |

`+layout.svelte` guards the signed-in routes: if `localStorage` has no `rotation-user-id`, it redirects to `/welcome`. Welcome and Setup render outside the shared layout.

### Identity & state model

There are no passwords. A user creates a two-word ID (e.g. `river-desk`) generated client-side from `src/lib/data/wordlist.ts`. The ID is stored in `localStorage` under the key `rotation-user-id`. Followed artists are persisted to the Neon DB via the API and cached locally under `rotation-followed-artists`.

### Database

`src/lib/server/db.ts` exports `getDb()` — it creates a new Drizzle + Neon HTTP client per call (intentional; avoids keeping a connection during serverless cold starts). Never import this from client-side code; it lives under `src/lib/server/`.

Schema is in `src/lib/server/schema.ts`: two tables — `users` (id, created_at) and `follows` (user_id, artist_name, followed_at) with a composite PK.

### API routes

```
POST   /api/users                              upsert user, returns { id, isNew }
GET    /api/users/[id]/artists                 list followed artists
PUT    /api/users/[id]/artists                 replace full follow list
DELETE /api/users/[id]/artists/[name]          unfollow one artist
```

### Data

Album data lives in `src/lib/data/albums.ts` as a typed static array — no API yet. The `/releases` and `/album/[slug]` pages load from this file. Future work involves replacing it with real Spotify/music API data.

### Path alias

`#lib` resolves to `./src/lib` (defined in `package.json` `imports`). Use `#lib/components/Button.svelte` etc. — not `$lib`.

### Design system

- Design tokens are CSS variables declared in `src/lib/design/tokens.css` and re-exported into Tailwind v4 via `@theme inline` in `src/app.css`. Use Tailwind utilities like `bg-surface-1`, `text-ink-subtle`, `border-hairline`, `rounded-xl`.
- Typography uses `.t-*` utility classes (`.t-display-lg`, `.t-body`, `.t-mono`, etc.) from `tokens.css`, not Tailwind text utilities.
- The design is **dark-only** — `color-scheme: dark`, canvas `#010102`, lavender primary `#5e6ad2`. No light mode.
- No drop shadows, no gradients on backgrounds, no pill-rounded CTAs, no emoji. Hairline borders (`--color-hairline`) instead of shadows.
- Focus ring: `box-shadow: var(--focus-ring)` (2px lavender at 50% opacity).

### Svelte 5 runes

All components use Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`). The vite config enforces runes mode for all non-`node_modules` files. Do not write Svelte 4 options API syntax.

### Design files

`docs/design/HANDOFF.md` is the original build spec — useful reference for intended behaviour and layout details. The `.dc.html` files in `docs/design/screens/` are design-canvas sources (read for layout/copy, not code to copy).
