# Design

The design contract for the Balsm marketing site. Tokens live in
[`src/app/globals.css`](src/app/globals.css); this file explains what they mean
and when to reach for each one.

**Register:** brand. Design IS the product here — this is a public-facing
marketing surface, not app UI.

## Sources

This system is ported, not invented. Upstream, in precedence order:

| Source | Role |
|---|---|
| `../Balsm-Core/brand/colors_and_type.css` | Canonical token file — colors, type, spacing, radii, shadows, motion |
| Claude Design project **Balsm Design System** (`51cdbf29-13b7-4206-9328-125fade14cc3`) | Full system — adds breakpoints, containers, gutters, `component-tokens.css`, `adaptive.css`, 18 components, 19 preview cards |
| `../Balsm-Core/brand/balsm-brand-canvas.md` | Brand canvas — voice, tone, values, positioning. Source of truth for copy |
| `../Balsm-Core/design.md` | Design contract prose — lockups, iconography, density, RTL |

Ported 2026-08-06 from the design project as of its 2026-08-05 revision.

**Upstream conflicts found during the port — since fixed in `Balsm-Core/design.md`:**

- **Breakpoints.** `design.md` §6.5 carried a Material-derived scale
  (`sm 600 · md 905 · lg 1240 · xl 1640`) that never matched the token file.
  `colors_and_type.css` is authoritative: `xs 375 · sm 480 · md 768 · lg 1024 ·
  xl 1280 · 2xl 1536`. §6.5 now states the token-file values.
- **Wordmark color.** `design.md` §4 and §7 still said `#6B6B60` (warm olive
  gray) after the brand moved to `#254B45` (deep pine green). Both now say
  `#254B45`; `#6B6B60` is documented as surviving only as `--balsm-ink-600`.
- **Gutters.** §6 said 24 (mobile) / 48 (desktop); the token ramp is actually
  16 → 24 (≥768) → 48 (≥1024). §6 now matches.
- **Eyebrow contrast** and the **RTL eyebrow** rule (below) were added to §5,
  along with a consumer note in §1 about the Tailwind name collisions.

## Token architecture

Two homes, split by whether Tailwind should generate a utility.

```
@theme  →  colors, fonts, breakpoints          →  Tailwind generates utilities
:root   →  type scale, spacing, radii, shadows, →  var() consumption only
           elevation, motion, gradients,
           containers, gutters, component tokens
```

Tokens go in `@theme` only when a utility class for them is genuinely wanted.
Motion easings, component heights, and breakpoint numbers are consumed through
`var()`, so putting them in `@theme` would generate ~150 dead utility classes.

### Token names that differ from upstream

Tailwind v4 resolves its utilities through theme variables — `rounded-lg` reads
`var(--radius-lg)`, `ease-out` reads `var(--ease-out)`, `max-w-md` reads
`var(--container-md)`. Five upstream families use those exact names with
different values, so adopting them verbatim would have silently restyled every
existing utility on shipped pages. They carry a `--balsm-` prefix here:

| Upstream | Here | Why |
|---|---|---|
| `--radius-*` | `--balsm-radius-*` | 14 live `rounded-*` usages |
| `--shadow-*` | `--balsm-shadow-*` | 8 live `shadow-*` usages |
| `--ease-in` / `--ease-out` / `--ease-in-out` | `--balsm-ease-*` | 9 live `ease-in-out` usages |
| `--container-*` | `--balsm-container-*` | 6 live `max-w-*` usages; `max-w-md` would have jumped 448px → 768px |
| `--tracking-*` | `--balsm-tracking-*` | 4 live `tracking-*` usages |

Everything else keeps its upstream name verbatim: `--fs-*`, `--lh-*`,
`--space-*`, `--elev-*`, `--dur-*`, `--grad-*`, `--bp-*`, `--gutter*`,
`--fg1`–`--fg4`, and all component tokens.

**Two scales need no port at all:**

- **Spacing.** `--space-1..24` is identical to Tailwind's default 4px scale.
  `p-6` is already 24px. The vars exist for inline-style consumers only; prefer
  the utility.
- **Breakpoints.** `md/lg/xl/2xl` already match (768/1024/1280/1536). Only
  `--breakpoint-xs: 375px` is added. `sm` stays at Tailwind's 640px — the design
  system says 480px, but 28 existing `sm:` utilities are authored against 640.
  Changing it is a deliberate migration, not a side effect of this port.

### Migration path

To move the site onto the design-system values for the five prefixed families,
do it one family at a time with visual verification:

1. Point the Tailwind name at the Balsm value in `@theme`
   (e.g. `--radius-lg: var(--balsm-radius-lg)`).
2. Screenshot the affected surfaces before and after.
3. Fix the fallout, then delete the prefixed alias.

Do not do all five at once.

## Color

**No single primary.** The mark is five petals in five hues; the palette is
categorical. Reach for one petal when you need a category (module, department,
chart series). Reach for all five only in brand moments — hero, loader,
watermark.

| Token | Hex | Role |
|---|---|---|
| `--color-petal-aqua` | `#02BBB5` | Accent · healing surfaces |
| `--color-petal-emerald` | `#01C4A2` | Eyebrow labels · success-adjacent |
| `--color-petal-blue` | `#1283FF` | **Primary action** — CTAs, links, focus rings |
| `--color-petal-mint` | `#55D77F` | **Success** |
| `--color-petal-violet` | `#724DD0` | **Controlled substance** |

Each has a `-600` (hover/pressed) and `-50` (soft wash) sibling.

**Neutrals are warm olive-gray**, never cool slate. `--color-ink-900` `#2B2B25`
through `--color-ink-50` `#F6F6F2`. Tailwind's own `gray-*` / `slate-*` scales are
off-brand here — use `ink-*`.

**Cream is a document surface, not a page background.** `--color-cream-*` is for
receipts, prescriptions, print, and framed panels. The body background is white
(or `--color-bg` in dark mode). A cream body bg is the AI-default warm-neutral
tell the brand explicitly rejects.

**Wordmark** is `--color-wordmark` `#254B45` deep pine green on light, knocked out
to `#FAFAF7` on dark per the reverse-lockup rule. Never gradient.

Color strategy for this site: **Restrained** — tinted warm neutrals carrying the
surface, blue as the single action color, petals appearing only in brand
moments. That is a deliberate choice for a clinical brand; "calm, not flashy" is
a stated design principle.

## Typography

| Role | Family | Weights |
|---|---|---|
| Display / headings | **Montserrat** | 600, 700, 800 |
| Body / UI | **IBM Plex Sans** | 400–700 |
| Arabic (RTL) | **IBM Plex Sans Arabic**, Cairo for display | 400, 600, 700 |
| Numeric / IDs | **IBM Plex Mono** | 400–600 |

The type scale is exposed through opt-in role classes, not element selectors —
`.h-display`, `.h1`–`.h5`, `.eyebrow`, `.meta`, `.fluid-display`, `.fluid-body`,
`.wordmark`, `.wordmark-ar`. No bare `p` or `h1` styling is injected, so existing
Tailwind-utility pages are untouched.

Arabic drops negative letter-spacing automatically (`[dir="rtl"]` overrides) —
Arabic letterforms connect, and tightening breaks the join.

**Eyebrows**: `.eyebrow` exists because the design system defines it. Use *one*
named kicker per surface. An eyebrow above every section is AI scaffolding, not
voice.

### Deliberate divergence: eyebrow color

Upstream sets `.eyebrow` to `--petal-emerald` `#01C4A2`. At its specified 12px
that scores **2.23:1 on white** and **2.00:1 on cream** — far below the 4.5:1
this project commits to in PRODUCT.md.

`.eyebrow` here uses `--color-eyebrow` instead: the same emerald darkened to
`#017560`, which clears AA on white (5.65), cream (5.08), and `#FAFAF7` (5.41).
Dark mode reverts to the full-strength `#01C4A2`, which scores 7.68:1 on ink —
the darkened value would fail there.

This divergence should be pushed back upstream; the design system's own eyebrow
spec is not AA-compliant on any of its light surfaces.

### Known contrast debt (pre-existing, not introduced here)

A contrast audit of the rendered homepage found **37 text nodes below AA**. None
originate from the token port — they are color choices inside the shipped
`cloud/*` components:

| Pattern | Example | Ratio | Needs |
|---|---|---|---|
| White on `--color-primary` blue | "Join the Cloud" CTA | 3.67 | 4.5 |
| `--color-text-muted` on cream | hero subhead | 3.24 | 4.5 |
| Petal colors as large numerals | "100%", "0" stat figures | 1.84–2.39 | 3 |
| Emerald/aqua micro-labels | "How Balsm works", "SLICE 2" | 2.23–3.31 | 4.5 |

The petal palette is simply too light to carry text on white. Fixing this means
either darkening the petals when they are used as *text* (as `--color-eyebrow`
now does), or reserving petals for fills and drawing text in `ink-*`. That is a
page migration, out of scope for this port.

## Spacing · radii · shadows · motion

- **Page gutters** 24 mobile / 48 desktop (`--gutter`, `--gutter-lg`).
- **Card padding** 24 standard / 32 hero.
- **Radii**: `sm` 6 chips · `md` 10 buttons and inputs · `lg` 14 **card default** ·
  `xl` 20 hero and modal · `pill` 999.
- **Shadows** are warm and soft — `rgba(43,43,37,.06–.10)`. Never crisp. Prefer
  `--elev-1..4` over ad-hoc `box-shadow`.
- **Motion** default ease `cubic-bezier(0.16, 1, 0.3, 1)` — calm, never bouncy.
  Durations 120 / 200 / 320ms. Hover shifts tint one step or drops opacity to
  0.85; **never scale up** on clinical surfaces. Page transitions are a 200ms
  cross-fade. No slides, no rotations.
- Every animation needs a `prefers-reduced-motion` alternative. `globals.css`
  ships a global reduce block; anything richer needs its own.

## Bans

From the brand, on top of the shared frontend bans:

- **No glassmorphism / frosted-glass cards.** Reads consumer-flashy, not clinical.
  Sticky headers may use `backdrop-filter: blur(12px)` over 92% white — that's the
  exception, not a licence.
- **No gradient text.** `--grad-*` is for surfaces. The wordmark is always solid.
- **No medical-cliché iconography** as brand symbols — no cross, syringe, heart.
  Lucide `pill` / `stethoscope` is fine *inside* the product, never as a logo.
- **No emoji in product UI.** The flower is the emoji.
- **No cool blue-gray (Tailwind slate) neutrals.** Use `ink-*`.
- **No teal-dominant palette.** Teal is a petal, not the action color. Blue is.
- **No cream body background.**
- **No stock medical photography.**

## Arabic & RTL

Arabic is first-class, not a translation layer.

- `بَلسَم` **with diacritics** — fatha on ب and on س. Without is incorrect.
- Every surface must work under `dir="rtl"`. Use logical properties
  (`margin-inline`, `padding-inline-start`, `inline-start/end`), never
  `left`/`right`, so gutters and column order mirror automatically.
- Test each breakpoint in **both** directions.
- Egyptian formatting: dates `DD/MM/YYYY`, currency `LE 245.00` (non-breaking
  space), phones `+20 1X XXXX XXXX`, national ID grouped `2 9912 22 12345 6`.
- `.chevron-end` flips directional icons under RTL.

## Voice

Calm · confident · ours. Second person. Sentence case for all UI; Title Case only
on marketing hero headlines; ALL CAPS only for eyebrows at `0.16em` tracking.

> "Saved locally. Will sync when you reconnect."
> not "Oops! Something went wrong 😬"

Full voice spec — 14 brand words, the clinical and community registers, what
Balsm never sounds like — is in `../Balsm-Core/brand/balsm-brand-canvas.md` §6.
Pin it for any copy work.

## Accessibility

WCAG AA minimum. Body text ≥4.5:1, large text ≥3:1, placeholders held to the same
4.5:1 as body. Touch targets ≥44px (`.touch-target`, 48px on coarse pointers).
Reduced-motion alternatives for every animation. RTL-native at every breakpoint.

## Not ported

Available upstream in the design project; pull them in when a surface actually
needs one rather than pre-emptively:

- **18 components** — Button, Input, Badge, Select, Toast, Spinner, Skeleton,
  Progress, ProgressButton, SegmentedProgress, Steps, DatePicker, TimePicker,
  ProSidebar, LoadingOverlay, TopLoadingBar, AnimatedLogo. Mostly product
  surfaces, not marketing ones.
- **`adaptive.css`** — container-query helpers (`.cq*`, `.adaptive-row`,
  `.adaptive-split`, `.adaptive-grid`), priority column drop for dense tables.
  Worth porting when a genuinely adaptive layout appears.
- **Upstream `.container` / `.grid` / `.card-grid` utility classes** — deliberately
  **not** ported. `.grid` and `.container` collide with Tailwind's own utilities,
  and `grid` is in live use (`Features.tsx`, `Mission.tsx`). Use Tailwind's grid
  utilities, or `repeat(auto-fit, minmax(280px, 1fr))` for breakpoint-free decks.
- **Pharmacy POS UI kit** and **patient-app prototype** — product, not marketing.
