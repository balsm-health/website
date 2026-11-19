'use client';

import { useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { C, FONT, MOTION } from '../theme';
import { useInView } from '../useReveal';
import { ArrowLeft } from '../CloudIcons';

// HomeV2.dc.html values that theme.ts has no token for. The darker hues are the
// design's own text-weight siblings of the palette (kickers, card CTAs), not
// the fills — keep them paired with the hue they darken.
export const V2 = {
  muted: '#5F6B77',        // ink-550: strip heading, partner captions
  violetWash: '#F9F7FF',   // Vision band
  blueWash: '#F1F6FC',     // Scale band
  blueWashRule: '#E1EAF4',
  blueCardBorder: '#DCE6F2',
  blueBorder: '#CFE3FF',
  dangerText: '#B83A2E',
  dangerBg: '#FBEBE7',
  amberText: '#8A6410',
  emeraldText: '#01866F',
  emeraldIcon: '#01A88B',
  greenText: '#2A8C47',
  pink: '#E8478F',
  pinkText: '#B8336F',
  pinkBg: '#FCE7F1',
  pinkBorder: '#F6CFE1',
  violetBorder: '#DDD3F5',
  violetLight: '#A88BF0',  // icons on the dark Values band
  blueLight: '#4DA3FF',
} as const;

export const container: CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };

export const sectionPad = 'clamp(64px,9vw,112px) 0';

// The nav's Initiative menu links to /#vision, /#mission, … — leave room for
// the sticky header when the browser scrolls a section into view.
export const anchored: CSSProperties = { scrollMarginTop: 80 };

export const eyebrow = (color: string): CSSProperties => ({
  fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14, color,
});

export const h2: CSSProperties = {
  fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(30px,4.4vw,50px)', lineHeight: 1.18, color: C.ink, margin: '12px 0 18px',
};

export const lead: CSSProperties = {
  fontSize: 'clamp(16px,1.7vw,19px)', lineHeight: 1.85, color: C.ink2, margin: 0,
};

export const h3 = (fontSize: number, margin: string): CSSProperties => ({
  fontFamily: FONT.cairo, fontWeight: 700, fontSize, color: C.ink, margin,
});

/** The design's forward arrow: drawn pointing left (RTL), mirrored in LTR by `.v2-flip`. */
export function Forward({ size }: { size: number }) {
  return <ArrowLeft className="v2-flip" style={{ width: size, height: size, flex: 'none' }} />;
}

/**
 * A `data-stagger` child that has to be an `<li>` (Reveal renders a div, which
 * an `<ol>` can't hold). Same CSS-driven hidden state as Reveal.
 */
export function RevealLi({ index, style, children }: { index: number; style?: CSSProperties; children: ReactNode }) {
  const { ref, inView } = useInView<HTMLLIElement>(MOTION.threshold, MOTION.rootMargin);
  return (
    <li
      ref={ref}
      className="balsm-reveal"
      data-inview={inView ? 'true' : 'false'}
      style={{ transitionDelay: `${index * MOTION.staggerStep}ms`, ...({ '--reveal-y': `${MOTION.revealY}px` } as CSSProperties), ...style }}
    >
      {children}
    </li>
  );
}

const WIDE = '(min-width: 900px)';
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/** Matches the design's `@media (min-width:900px)` gate on `.v2-sticky`. */
export function useWide() {
  return useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false);
}
