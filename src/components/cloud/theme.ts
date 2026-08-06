// Balsm Cloud palette — literal values from the Cloud.dc.html design.
// The Cloud page is intentionally light-only (the design has no dark variant),
// so these are used directly instead of the theme-reactive CSS vars.
export const C = {
  ink: '#2B2B25',
  ink2: '#56564C',
  muted: '#8C8C82',
  muted2: '#ADACA0',
  bg: '#FAFAF7',
  white: '#FFFFFF',
  border: '#E6E5DC',
  borderSoft: '#E1E1D9',
  borderHair: '#ECEBE2',
  blue: '#1283FF',
  blueDark: '#0F6BCC',
  blueBg: '#E4F0FF',
  aqua: '#02BBB5',
  aquaBg: '#E2F8F6',
  emerald: '#01C4A2',
  green: '#3FC366',
  greenBg: '#E8F9EE',
  violet: '#724DD0',
  violetDark: '#5C3AB0',
  violetBg: '#ECE6FA',
  amber: '#D9A020',
  amberBg: '#FDF5DC',
  mint: '#55D77F',
  danger: '#D44A3C',
  dark: '#22221D',
  grayDot: '#C9C9C0',
  ltTagBg: '#F0F0E8',
  ltTagText: '#78776C',
} as const;

export const FONT = {
  cairo: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
  arabic: "'IBM Plex Sans Arabic', 'Cairo', sans-serif",
  display: "'Montserrat', system-ui, sans-serif",
  body: "'IBM Plex Sans', system-ui, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
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
