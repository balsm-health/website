// Balsm Cloud palette — literal values from the .dc.html designs, cross-checked
// against the design system's own `colors_and_type.css`. The Cloud pages are
// intentionally light-only (the designs have no dark variant), so these are used
// directly instead of the theme-reactive CSS vars.
//
// Every neutral here is a member of the DS cool navy-slate `--balsm-ink-*` ramp.
// An earlier pass carried six values from the retired warm olive-gray ramp
// (`#E6E5DC`, `#ECEBE2`, `#22221D`, `#ADACA0`, `#F0F0E8`, `#78776C`). None of
// them appear in any design file, and DESIGN.md § Color retires that ramp
// outright — so they read as warm hairlines and a warm-black band sitting under
// cool ink. Corrected to their `ink-*` siblings; don't reintroduce warm neutrals.
export const C = {
  ink: '#14202B',       // ink-900
  ink2: '#384756',      // ink-700
  muted: '#78838F',     // ink-500
  muted2: '#9BA4AD',    // ink-400
  bg: '#FAFAF7',        // cream-50
  white: '#FFFFFF',
  // The designs carry a single border weight (ink-200). `border` and
  // `borderSoft` therefore resolve to the same value; both names are kept so
  // call sites that mean "hairline card edge" and "control outline" stay
  // readable, and so either can diverge later without a sweep.
  border: '#DBDFE3',    // ink-200 (= --balsm-border)
  borderSoft: '#DBDFE3',// ink-200
  borderHair: '#EBEDF0',// ink-100 — section rules, lang-switch track
  blue: '#1283FF',
  blueDark: '#0F6BCC',
  blueBg: '#E4F0FF',
  aqua: '#02BBB5',
  aquaBg: '#E2F8F6',
  // teal-100. The aqua-tinted chip/card outline the designs use anywhere a soft
  // aqua wash needs an edge.
  aquaBorder: '#C9EEEB',
  emerald: '#01C4A2',
  emeraldDark: '#019A7F',// petal-emerald-600
  green: '#3FC366',     // petal-mint-600
  greenBg: '#E8F9EE',
  violet: '#724DD0',
  violetDark: '#5C3AB0',
  violetBg: '#ECE6FA',
  amber: '#D9A020',
  amberBg: '#FDF5DC',
  mint: '#55D77F',
  danger: '#D44A3C',
  // ink-900 (= --balsm-surface-inverse). Same value as `ink`, exactly as the
  // designs do it: the dark bands, the footer and the ink text are one colour.
  dark: '#14202B',
  grayDot: '#C0C6CC',   // ink-300
  ltTagBg: '#EBEDF0',   // ink-100
  ltTagText: '#526174', // ink-600 (= the wordmark's ".health" hue)
} as const;

/**
 * Colour roles for text and for labels sitting on a petal.
 *
 * ── Why these are the plain petals ──────────────────────────────────────────
 *
 * These four groups exist so every call site names the *role* it needs rather
 * than reaching for a fill. That indirection is worth keeping. What changed is
 * what they point at.
 *
 * An earlier pass pointed them at darkened variants so every petal used as text
 * would clear WCAG AA. It worked on the meter and failed on the page: the petals
 * are light by design, so meeting 4.5:1 at label sizes meant dropping OKLCH
 * lightness from ~0.73 to ~0.55 on every accent, and since a kicker leads each
 * section, the whole site read flat. Three rounds of narrowing that gap did not
 * fix it, because the gap is structural rather than a bad value choice.
 *
 * The brand owner's call, made explicitly, is that the palette wins. These now
 * resolve to the design's own values, so the rendered result matches
 * `Cloud.dc.html` exactly.
 *
 * ── The cost, stated plainly ────────────────────────────────────────────────
 *
 * Petals used as small text score 1.8–3.4:1 against 4.5:1. That is a real
 * accessibility regression for low-vision readers, and it is a deliberate,
 * documented exception rather than an oversight — see the Accessibility section
 * in PRODUCT.md.
 *
 * The AA-safe value for each role is kept in the comments. Anything here can be
 * dialled back individually by swapping one line; nothing else has to move.
 */
export const FILL = {
  blue: C.blue,        // AA-safe with a white label: '#0C74E5' (4.52:1)
} as const;

export const ON = {
  aqua:   '#FFFFFF',   // AA-safe: '#024442' (4.60:1) — white here is 2.39:1
  // The design's own on-mint value is `ink` — Cloud.dc.html and Sponsor.dc.html
  // both set `background:#55D77F; color:#14202B`. An earlier note here claimed
  // '#1B3B27' was the design value; it wasn't, and ink scores higher anyway.
  mint:   '#14202B',   // 8.98:1 — compliant
  blue:   '#FFFFFF',   // AA-safe: '#011C41' (4.60:1) — white here is 3.67:1
  violet: '#FFFFFF',   // 5.69:1 — compliant as-is
} as const;

export const TEXT = {
  muted:   C.muted,    // AA-safe: '#526174' (= --color-ink-600, 5.39:1)
  emerald: C.emerald,  // AA-safe: '#11826C' (4.55:1)
  aqua:    C.aqua,     // AA-safe: '#11817D' (4.55:1)
  blue:    C.blue,     // AA-safe: '#0F71DE' (4.54:1)
  mint:    C.mint,     // AA-safe: '#078540' (4.54:1)
  amber:   C.amber,    // AA-safe: '#956C0B' (4.55:1)
  danger:  C.danger,   // AA-safe: '#CE4134' (4.55:1)
  violet:  C.violet,   // 5.69:1 — compliant as-is
} as const;

/**
 * Kept as a distinct role so display-size type can diverge from label-size type
 * later without touching call sites. Both currently resolve to the petal.
 */
export const DISPLAY = {
  blue:    C.blue,     // 3.51:1 on cream — already clears the 3:1 large-text bar
  violet:  C.violet,   // 5.45:1 — clears
  danger:  C.danger,   // 4.15:1 — clears
  emerald: C.emerald,  // 2.13:1 — AA-safe at this size: '#14A387' (3.03:1)
  aqua:    C.aqua,     // 2.29:1 — AA-safe at this size: '#15A19C' (3.04:1)
  mint:    C.mint,     // 1.76:1 — AA-safe at this size: '#01A651' (3.05:1)
  amber:   C.amber,    // 2.23:1 — AA-safe at this size: '#BA870E' (3.06:1)
} as const;

export const FONT = {
  // Both stacks match Providers.dc.html exactly. The cross-fallbacks that used
  // to sit here (Cairo inside `arabic`, Plex Arabic inside `cairo`) looked like
  // safety but were a bug source: fallback is per-glyph, so a character missing
  // from the first family — or missing at the requested weight — swapped
  // typeface mid-word instead of failing visibly.
  cairo: "'Cairo', sans-serif",
  arabic: "'IBM Plex Sans Arabic', sans-serif",
  display: "'Montserrat', system-ui, sans-serif",
  body: "'IBM Plex Sans', system-ui, sans-serif",
  // Bare, matching the designs. Mono is a Latin/numeric role only — where a
  // design puts Arabic in a stat slot it switches family outright rather than
  // relying on fallback (see the Contributors stat row).
  mono: "'IBM Plex Mono', monospace",
} as const;

export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Motion values lifted from the design's balsm-motion.js, so the React port
// feels identical to the design file: a [data-reveal] element fades over .6s
// while its 20px rise settles faster, in .35s; direct children of a
// [data-stagger] container cascade at 80ms; the observer fires at 8% visibility
// with a -6% bottom margin so nothing reveals while still below the fold.
export const MOTION = {
  // One string covers both reveal and hover-lift, exactly as balsm-motion.js does
  // (attachLift reuses REVEAL_TRANSITION), so a lifting card also eases its shadow.
  revealTransition: `opacity .6s ${EASE}, transform .35s ${EASE}, box-shadow .35s ${EASE}`,
  revealY: 20,
  staggerStep: 80,
  threshold: 0.08,
  rootMargin: '0px 0px -6% 0px',
} as const;
