# Rotation — build handoff

Build a small web app that shows the new and recent albums of artists I follow, with a page per album. Visitors start on a welcome page where they enter (or create) a user ID.
**Stack: SvelteKit (Svelte 5, TypeScript) + Tailwind CSS v4.**

This folder holds the design, not code to copy:

| Path | What it is |
| --- | --- |
| `screens/Welcome.dc.html` | Welcome / user ID page — the first page visitors see (design source) |
| `screens/Setup.dc.html` | Onboarding: pick the artists you follow (design source) |
| `screens/Main.dc.html` | Hero / new-releases carousel (design source) |
| `screens/Album.dc.html` | Album detail page (design source) |
| `design-system/` | Tokens (`tokens.json`, `tokens.css`), the brand book (`README.md`), and component guidelines |
| `assets/cover.jpg` | Sample cover image for the album page |
| `assets/welcome-bg.jpg` | Black-and-white photo for the welcome page's left panel |

The `.dc.html` files are design-canvas sources: read them for layout, spacing, copy and behaviour. Markup inside `<x-dc>` is the page; `{{holes}}`, `<sc-for>` and `<sc-if>` are template syntax; the `<script type="text/x-dc">` block holds the sample data and state logic. `<x-import component-from-global-scope="…Button">` means "use the design system's Button". Rebuild everything as Svelte components; do not ship `support.js`, `bundle.js` or React.

---

## 1. Design system → Tailwind

Read `design-system/README.md` first: it is the brand book (dark canvas, one lavender accent, hairline borders instead of shadows, Inter + JetBrains Mono, sentence case, no emoji).

- Import `design-system/tokens.css` into `src/app.css` (it declares every token as a CSS variable and the `.t-*` type classes).
- Map the tokens into Tailwind v4 with `@theme inline` so utilities like `bg-surface-1`, `text-ink-subtle`, `border-hairline`, `rounded-xl`, `font-mono` exist:

```css
@import "tailwindcss";
@import "./lib/design/tokens.css";

@theme inline {
  --color-canvas: var(--color-canvas);
  --color-surface-1: var(--color-surface-1);
  --color-surface-2: var(--color-surface-2);
  --color-surface-3: var(--color-surface-3);
  --color-surface-4: var(--color-surface-4);
  --color-hairline: var(--color-hairline);
  --color-hairline-strong: var(--color-hairline-strong);
  --color-ink: var(--color-ink);
  --color-ink-muted: var(--color-ink-muted);
  --color-ink-subtle: var(--color-ink-subtle);
  --color-primary: var(--color-primary);
  --color-primary-hover: var(--color-primary-hover);
  --color-primary-ink: var(--color-primary-ink);
  --color-on-primary: var(--color-on-primary);
  --radius-md: var(--radius-md);   /* buttons, inputs: 8px */
  --radius-lg: var(--radius-lg);   /* cards: 12px */
  --radius-xl: var(--radius-xl);   /* artwork panels: 16px */
  --font-sans: var(--font-text);
  --font-mono: var(--font-mono);
}
```

- Load Inter (400/500/600/700) and JetBrains Mono (400/500) from Google Fonts in `app.html`.
- Copy the body defaults and `.t-eyebrow { text-transform: uppercase }` from `design-system/components/bundle.css`.
- Rebuild these components in Svelte from `design-system/components/*/README.md` and `index.d.ts` (props are listed there): **Button** (primary / secondary / tertiary, sizes sm/md/lg, renders `<a>` when given `href`), **Badge** (neutral / success / brand, optional dot), **Tag** (optional mono). Others (Card, Input, PricingTabs, Avatar) only when needed.
- Never use pill-rounded CTAs, drop shadows, gradients or coloured left borders. Focus ring: `--focus-ring` (2px lavender at 50%).

## 2. Routes

| Route | Screen | Source |
| --- | --- | --- |
| `/` | Welcome: enter or create a user ID | `screens/Welcome.dc.html` |
| `/setup` | Onboarding: pick artists | `screens/Setup.dc.html` |
| `/releases` | New releases hero + carousel | `screens/Main.dc.html` |
| `/album/[slug]` | Album detail | `screens/Album.dc.html` |

`/releases` and `/album/[slug]` share a layout with the header (section 3). The welcome page has its own minimal header (logo only). Links that pointed to `/` in the designs (logo, "← New releases") now go to `/releases`.

Naming: the welcome page headline is **FreshMusic**; the logo wordmark in the screens still reads "Rotation". Use "FreshMusic" everywhere unless told otherwise.

## 3. Header (both pages)

- Left: logo mark (lavender rounded square with a white ring + dot, inline SVG in the source) + wordmark "Rotation", linking to `/`. On `/` the "New releases" eyebrow sits next to it; on album pages a "← New releases" link instead.
- Right: **Menu** button (secondary, hamburger icon). It opens nothing yet: render it with `aria-expanded="false"` and leave a TODO. Menu sections (all artists, others TBD) come later.
- 1px hairline bottom border, 20px / 32px padding.

## 3b. Welcome `/` — user ID

Full-height page, two columns that wrap (each `flex: 1 1 480px`); on narrow screens the photo panel stacks above the form.

**Left: photo panel** (`aria-hidden`, decorative)
- `assets/welcome-bg.jpg`, `object-cover`, `object-position: 50% 30%`, `grayscale(1)`, **opacity 0.3** over pure black.
- Its right edge is a **wave**, not a line: clip the panel with
  `<clipPath id="wave-edge" clipPathUnits="objectBoundingBox"><path d="M0,0 H1 C1,0.18 0.83,0.3 0.86,0.5 C0.89,0.7 1,0.78 1,1 H0 Z"/></clipPath>`
  (`clip-path: url(#wave-edge)`). It is the two-ellipse wave separator turned vertical: the edge curves about 14% into the photo and swings back out lower down. No border, no gradient.

**Right: form column** (black canvas)
- Header: logo only (no Menu).
- Centred block, max-width 400px, gap 32px:
  1. **FreshMusic** (`t-display-md`, `clamp(32px, 5vw, 40px)`), centred, with "Enter your user ID to see new releases from the artists you follow." under it (`t-body`, ink-subtle).
  2. Form: **User ID** input (design-system Input: label, placeholder `e.g. RT-7K2P-QX9M`, hint "The ID you got when you created your account.", `autocomplete="username"`, `spellcheck="false"`), then a full-width primary **Continue** button (44px tall, trailing chevron).
  3. Divider: hairline — "New here?" (caption) — hairline.
  4. **Create new user ID**: secondary button, size lg, sized to its label and **centred**.
  5. After creating: a `role="status"` row (surface-1, hairline, 8px radius) with a success Badge "Created" and "Your new ID is filled in above. Save it — you'll need it to sign in."

**Behaviour**
- Continue submits the form: validate the ID (non-empty; format `RT-XXXX-XXXX`, letters A–Z without I/O and digits 2–9), look it up, store the session, go to `/releases` (or to `/setup` if the user follows no artists yet). Show an inline error under the input for an empty or unknown ID.
- Create new user ID: generate an ID in that format on the server, save the user, fill the input with it and show the status row. Continue then goes to `/setup`. (The design generates it client-side as a mock.)
- Keep the user's ID in a cookie/session; `/releases` and `/album/*` redirect to `/` when there is none.

## 3c. Setup `/setup` — pick artists (onboarding)

Shown after a new user ID is created (and whenever a user follows zero artists), so nobody lands on an empty carousel.

- Header: logo + "FreshMusic", and `Setup · 1 of 1` in mono on the right. No Menu.
- Content max-width 1040px: eyebrow "Get started", `t-display-md` "Pick the artists you follow", subline "We'll show their latest albums first and flag anything new. You can change this any time."
- **Search**: design-system Input, label "Search artists", `type="search"`, hint "Type at least 3 letters", **centred** (max-width 480px, `margin-inline: auto`).
- **Results**: nothing is shown until the query has **3 or more letters** (no placeholder box). Then a grid `repeat(auto-fill, minmax(150px, 1fr))`, gap 16px, of artist cards:
  - card = `<button aria-pressed>` with `aria-label` "Add {name}" / "Remove {name}"; surface-1 + hairline, 12px radius, 10px padding; selected: surface-2 + primary border.
  - square photo (8px radius, `object-cover`) — the artist image from the music API; fallback: initials on surface-3.
  - the **name is not shown under the photo**: it fades in over the bottom of the photo on hover or keyboard focus (dark-to-transparent band, 150ms); on touch devices (`@media (hover: none)`) it is always visible.
  - round 22px check top-right: empty ring when unselected, filled primary with a white check when selected.
  - "No artists match "{query}"." when there are no results.
  - Debounce the search (~250ms) and query the artist search endpoint; the design uses a local list.
- **Your artists**: when at least one is picked, an eyebrow "Your artists" and removable pills (32px Avatar + name + ×, pill radius, 44px tall).
- **Sticky bottom bar**: "{n} selected · pick at least one to continue / you can add more later" (`role="status"`), a "Skip for now" text link → `/releases`, and primary **Show my releases** → saves the followed artists, then `/releases`; disabled while nothing is picked.

## 4. Releases `/releases` — new-releases carousel

Full-height page (`min-h-screen`), flex column: header, carousel stage, caption + controls.

**Carousel**
- Square cards, size `clamp(240px, 30vw, 440px)`, absolutely centred in the stage.
- For each album compute `offset = index - selected`, wrapped to the shortest way round (it loops).
  - `translateX(offset × 0.92 × cardSize)`
  - scale: 1 selected · 0.72 for ±1 · 0.55 beyond
  - opacity: 1 · 0.5 · 0.18 (±2) · 0 further
  - `z-index: 10 - |offset|`, `grayscale(0.6)` on non-selected
  - transition 600ms `cubic-bezier(0.22, 1, 0.36, 1)` on transform/opacity/filter
- Clicking a side card selects it. Each card is a `<button>` with `aria-label="Artist — Title"`.
- Albums flagged new show a brand **Badge** "New" (with dot) top-left of the card.
- Card artwork: the album's cover image (`object-cover`). The design used abstract placeholders because real covers were not available; fall back to a surface-1 panel when an album has no cover.
- Behind the cards: the giant selected index ("01") top-left, `clamp(120px, 18vw, 260px)`, weight 600, colour `surface-3`, `aria-hidden`.
- Wrap in `role="region" aria-roledescription="carousel" aria-label="Latest albums from artists you follow"`.
- Add: left/right arrow keys while the carousel has focus, and swipe/drag on touch. Respect `prefers-reduced-motion` (no transition).

**Caption (bottom-left), for the selected album**
1. Album title on top: `t-display-lg`, `clamp(36px, 5vw, 56px)`.
2. A hairline-topped row (max 680px), space-between:
   - left: artist (`t-body-lg`, 500), with "Produced by {producer}" under it (`t-body-sm`, subtle with the names in muted)
   - right, right-aligned: "Released" eyebrow (11px) over the full date in mono, e.g. `15 March 2015`
3. **View album** primary button → `/album/{slug}`.

**Controls (bottom-right)**
- One progress segment per album: 44×44 hit area, 2px bar, primary for selected, `hairline-strong` otherwise; click selects.
- Counter in mono: `01 / 06` (current in ink, rest subtle).
- Previous / next square buttons, 44px, surface-1 + hairline, chevron icons, with `aria-label`s.

## 5. Album page `/album/[slug]`

Max width 1280px, padding 64px 32px 96px, two columns that wrap (gap 64px):

**Left column (flex 1 1 480px)**
- Cover: square, 16px radius, hairline border, `object-cover`, fades in on load (opacity 0 → 1, scale 1.04 → 1, 1200ms, 150ms delay; none with reduced motion).
- Under it, mono 11px caption row: `01 / 06` left, "Cover" right.
- Album info:
  - Badges row: brand "New" (when new) + Tag "Album"
  - Title (`t-display-lg`, `clamp(40px, 5vw, 56px)`)
  - Same hairline row as the hero: artist + "Produced by …" left, "Released" + date right
  - Definition list: Label · Tracks (count)

**Right column (flex 1 1 380px)**
- "Tracklist" eyebrow, then an ordered list: one row per track, hairline separators, number in mono (`01`), title in ink, 14px.

The artist section was removed for now: do not build it.

## 6. Data

Start with a typed local file, `src/lib/data/albums.ts`, so the UI can be built before any API work:

```ts
export type Album = {
  slug: string;          // 'to-pimp-a-butterfly'
  title: string;
  artist: string;
  producer: string;      // short credit, e.g. 'Sounwave, Terrace Martin & others'
  releaseDate: string;   // ISO, e.g. '2015-03-15'; display as '15 March 2015'
  label?: string;
  tracks: string[];
  cover?: string;        // URL
  isNew: boolean;        // later: derived from releaseDate (e.g. within the last 30 days)
};
```

Seed it with the six albums in the `<script>` block of `screens/Main.dc.html` (title, artist, date, producer) and the tracklist in `screens/Album.dc.html`. These were filled in from memory and not checked: verify them before relying on them. Use `assets/cover.jpg` as the cover for one album to exercise the image path. Load the list in `+page.ts` / `+page.server.ts` and the album by slug in `album/[slug]/+page.ts` (404 when not found).

**Later (not now):** a list of followed artists, fetching their discographies and new releases from a music API (e.g. Spotify Web API, which also provides licensed cover images at runtime), and `isNew` computed from release dates.

## 7. Not in scope yet

The Menu and its sections · artist pages / discography · real data and covers · real authentication beyond the user ID (passwords, OAuth).

## 8. Done when

- `/`, `/setup`, `/releases` and `/album/[slug]` match the screens at 1440px wide and still work at 390px (columns stack, controls wrap, nothing overflows).
- The carousel loops, animates, and works with mouse, keyboard and touch.
- All text meets 4.5:1 contrast on its background; every control is a real `<button>` or `<a>` with a visible focus ring.
- `npm run check` and `npm run build` pass.
