'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useInView } from './useReveal';
import { EASE } from './theme';

// Reveal-on-scroll wrapper (replaces the design's data-reveal).
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
      className={className}
      style={{
        transition: `opacity .7s ${EASE}, transform .7s ${EASE}`,
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
