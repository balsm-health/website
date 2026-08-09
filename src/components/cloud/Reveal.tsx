'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useInView } from './useReveal';

/**
 * Reveal-on-scroll wrapper (replaces the design's data-reveal).
 *
 * The hidden state is expressed in CSS, keyed off `data-inview` and a `.js`
 * class on <html>, rather than as inline styles. Two reasons:
 *
 * 1. It used to render `opacity: 0` into the server HTML, so all 47 wrappers on
 *    the home page shipped invisible and only appeared once JS had run and an
 *    IntersectionObserver had fired. With scripting off the page was blank. The
 *    `.js` gate inverts that: the markup is visible by default and only hides
 *    itself when there is something around to un-hide it.
 * 2. An inline `transform` beats every stylesheet rule, so `.balsm-lift:hover`
 *    — which also animates transform — silently did nothing on the 11 cards
 *    that are both a Reveal and a lift. Moving transform into CSS lets the
 *    hover rule apply again.
 */
export default function Reveal({
  children,
  style,
  delay = 0,
  className,
  y = 18,
  threshold = 0.14,
}: {
  children: ReactNode;
  style?: CSSProperties;
  delay?: number;
  className?: string;
  y?: number;
  threshold?: number;
}) {
  const { ref, inView } = useInView(threshold);
  return (
    <div
      ref={ref}
      className={className ? `balsm-reveal ${className}` : 'balsm-reveal'}
      data-inview={inView ? 'true' : 'false'}
      style={{
        transitionDelay: `${delay}ms`,
        ...({ '--reveal-y': `${y}px` } as CSSProperties),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
