# Linear Marketing Design System

A faithful recreation of the design language behind **Linear's marketing site** (linear.app) — the deepest dark-canvas system in this collection. It exists so design agents can generate well-branded Linear-style marketing interfaces, specimen cards, and prototypes without re-deriving the foundations each time.

> **Scope note:** This system models Linear's *marketing canvas* — the dark public website (home, /pricing, /contact/sales, /build, /intake). It is **not** the in-product app theme. Linear's actual product UI uses a richer color-tag palette (red/orange/yellow/green/blue/purple for issue priorities and labels); those colors live inside the product screenshots the marketing site frames, not on the marketing chrome itself.

## Sources

Derived from a written design specification of Linear's marketing surface. Source pages referenced in the spec:

- `linear.app` (home)
- `linear.app/intake`
- `linear.app/pricing`
- `linear.app/contact/sales`
- `linear.app/build` (changelog)

No Figma file or codebase was attached — the system is reconstructed from the documented token spec. Surface-ladder values trace to Linear's canonical CSS variables (`--color-bg-level-3`, `--color-line-tint`, etc.).

## The system in one breath

Near-pure-black canvas (`#010102`, faint blue tint) → a four-step surface ladder lifts cards and panels into view, separated by 1px hairline borders rather than shadows. A single chromatic accent — **lavender-blue `#5e6ad2`** — appears scarcely: brand mark, primary CTA, focus ring, link emphasis. Type is one continuous voice (Inter substituting for Linear's custom sans) running display weight 600 with aggressively negative tracking down to body weight 400. **Product UI screenshots are the protagonist of every section;** the marketing chrome is a quiet dark frame around them.

---

## Content fundamentals

How Linear's marketing copy is written:

- **Voice — confident, terse, product-forward.** Short declarative sentences. No hype words, no exclamation marks, no emoji. Copy states what the product *is* and *does*, then stops. e.g. "Linear is a purpose-built tool for planning and building products." / "Made for modern product teams."
- **Person — "you" and "your team", rarely "we".** The reader's team is the subject ("Plan your work", "Track issues across your team"). Linear refers to itself in third person as a product, not "we".
- **Casing — sentence case everywhere.** Headlines, buttons, nav links all use sentence case ("Get started", "Read the changelog", not Title Case or ALL CAPS). The single exception is the **eyebrow**, which is uppercase with slight positive tracking — it reads as taxonomy/label, not prose.
- **CTA verbs are direct and low-pressure.** "Get started", "Sign in", "Contact sales", "Read changelog", "Start building". No "Sign up free today!" energy.
- **Feature copy leads with the noun.** Section headers name the capability ("Issue tracking", "Project planning", "Cycles") rather than selling a benefit first.
- **Numbers/IDs use mono.** Version strings, issue IDs (`ENG-1234`), keyboard shortcuts, and changelog version tags render in Linear Mono — a quiet nod to the product's keyboard-driven, engineering-native feel.
- **Tone overall:** natural but professional. Calm, precise, a little austere. The restraint *is* the brand — it signals the same taste the product embodies.

**Examples of in-voice copy:**
- Hero: "Linear is a purpose-built tool for planning and building products."
- Subhead: "Meet the system for modern software development. Streamline issues, projects, and product roadmaps."
- Section eyebrow: `PROJECT PLANNING`
- CTA pair: `Get started` (primary) · `Read the changelog` (secondary)
- Changelog row: `2026.06 · June 13` followed by terse bulleted changes.

---

## Visual foundations

**Canvas & surfaces.** The anchor is `--color-canvas` `#010102` — never `#000000` true black; the faint blue tint is intentional. Sections don't separate with whitespace gaps — *the dark canvas IS the whitespace.* Hierarchy comes from lifting content onto the four-step surface ladder: `surface-1` (#0c0d10, default cards & product panels) → `surface-2` (#141517, featured/hovered) → `surface-3` (#191a1c, sub-nav/dropdowns) → `surface-4` (#1f2023, deepest lift). Never skip levels.

**Borders.** Every lifted surface is outlined by a **1px hairline** (`--color-hairline` #23252a), strengthening to `--color-hairline-strong` on input focus surrounds and `--color-hairline-tertiary` for nested surfaces. Borders, not shadows, define edges.

**Shadows.** Almost none. The brand resists drop shadows on dark. The one depth flourish is a **subtle white top-edge highlight** (`--edge-highlight`, ~6% white) on lifted panels — it gives the dark surface a faint "pixel-rendered" crispness. No atmospheric gradients. No spotlight cards. No glow.

**Color.** Exactly one chromatic accent: lavender-blue `#5e6ad2`, used *scarcely* — brand mark, primary CTA, focus ring, link emphasis. Hover lightens to `#828fff`; pressed/focus shifts to `#5e69d1`. **No second accent.** Greens/oranges/reds are absent from marketing chrome; the lone semantic color is success green `#27a644` on the occasional status pill.

**Type.** One continuous voice — Inter (substitute for Linear's custom Display/Text cuts) from display to body. Display sizes sit at weight **600** with aggressively negative letter-spacing (-3.0px at 80px ≈ 4% of size), easing toward 0 at body. Body holds weight **400** at -0.05px. Linear resists 700+ display weights. The eyebrow is the lone positive-tracked mark (+0.4px, uppercase). Mono (JetBrains Mono substitute) only appears in code/ID contexts.

**Spacing & layout.** 4px base unit. Content maxes around **1280px**. Card grids: 3-up desktop → 2-up tablet (1024px) → 1-up mobile (768px). Generous 24px gaps between content blocks within a panel; 96px between sections. Product screenshot panels span the full content width — they're the protagonist.

**Corners.** Buttons & inputs `8px` (`--radius-md`). Cards `12px` (`--radius-lg`). Product screenshot panels `16px` (`--radius-xl`). Pills/avatars fully round. **CTAs are never pill-rounded** — that's reserved for tab toggles and status pills.

**Cards.** A card is: a surface-1 (or -2) fill, a 1px hairline border, 12px corners, 24px interior padding, and the faint white top-edge highlight. No shadow, no colored left-border accent, no gradient fill. Lavender is *never* a card background.

**Buttons.** Compact: 8px vertical / 14px horizontal padding, 8px corners, 14px medium label. Primary = lavender fill, white text; hover lightens, press darkens. Secondary = surface-1 fill + hairline border. Tertiary = plain text on canvas. Inverse = white fill / dark text (rare section openers only).

**Motion.** Restrained. Quiet opacity/color transitions (~150ms) on hover; no bounces, no springy easing, no decorative looping animation on content. Hover states lift surface color a step and/or lighten text; press states darken. Focus shows a 2px lavender-focus ring at 50% opacity.

**Imagery.** Product UI screenshots dominate — high-fidelity captures of the issue list, project view, dashboard — framed in surface-1 panels at 16px corners with 24px outer padding, never cropped, aspect ratio preserved. Customer logos render small (~24px tall) on bare canvas with no border. Avatars are 32–40px full circles in testimonial cards.

---

## Iconography

- **Linear uses a custom line-icon set** in-product (the issue-status rings, priority bars, project icons). On the *marketing* chrome icons are sparse — used in feature bullets, nav, and within product screenshots.
- **Style:** thin, consistent ~1.5px stroke, rounded joins, monochrome (inherits `--color-ink` / `--color-ink-subtle`), 16–20px. Geometric and restrained, matching the type's precision.
- **Substitute:** Linear's icon set isn't publicly distributed. This system uses **[Lucide](https://lucide.dev)** via CDN as the closest free match — same thin-stroke, rounded-join, monochrome character. ⚠️ *Substitution flagged: swap for Linear's real icons if/when available.* See `assets/icon-usage.md`.
- **No emoji.** Never used in marketing chrome.
- **Status rings** (the colored issue-status circles) appear *inside* product screenshots, drawn with the in-product priority palette — not on marketing chrome.

---

## Index — what's in here

**Foundations**
- `styles.css` — global entry point (consumers link this). `@import`-only.
- `tokens/colors.css` · `typography.css` · `spacing.css` · `radius.css` · `fonts.css` · `base.css` — the token layer + type utility classes.
- `tokens.json` — the same tokens in Design System format (colors, `t-*` type styles, spacing, radius, focus ring, type-scale and weight variables); `tokens.css` is generated from it. Edits made on this page land here.

**Specimen cards** (Design System tab) — `cards/*.html`, grouped Colors / Type / Spacing / Brand. The brand-mark card is now `components/BrandMark/preview.html`.

**Components** (`components/`) — reusable React primitives. Namespace `window.LinearMarketingDesignSystem_868804`:
- `core/Button` — primary · secondary · tertiary · inverse
- `core/Card` — feature · pricing · pricing-featured · product-screenshot · testimonial · cta-banner
- `core/Badge` — status pill · success pill
- `core/Tag` — small inline tag/chip
- `forms/Input` — text input + focus ring
- `navigation/PricingTabs` — pill toggle
- `core/Avatar` — circular avatar

Each component's guidelines, types and live preview are in `components/<Comp>/` (`README.md`, `<Comp>.d.ts`, `preview.html`); its source stays under `components/core/`, `components/forms/` or `components/navigation/`. `components/bundle.js` defines the namespace with the seven components; `components/bundle.css` holds the body defaults, the eyebrow's uppercase and the two composite paddings (`--pad-button`, `--pad-input`).

**UI kit** (`ui_kits/marketing/`) — interactive recreation of Linear's marketing site: hero, feature grid, product-screenshot section, pricing, CTA banner, footer.

**Skill** — `assets/notes/SKILL.from-standalone.md` makes this folder usable as a downloadable Agent Skill.

> **Font substitution flagged:** Linear's proprietary Display/Text/Mono families are replaced with **Inter** (display/text) and **JetBrains Mono** (mono) from Google Fonts. Provide the real font files to swap them in.
