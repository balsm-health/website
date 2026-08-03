'use client';

import { useEffect, useState } from 'react';

const NUM_RE = /^(\D*)(\d[\d,]*)(\D*)$/;

// Animate a numeric value (with optional prefix/suffix like "+100M", "27", "100%").
// Non-numeric values (e.g. "FHIR", "AGPL") render as-is.
export default function CountUp({ value, inView }: { value: string; inView: boolean }) {
  const [display, setDisplay] = useState(() => {
    const m = value.match(NUM_RE);
    return m ? `${m[1]}0${m[3]}` : value;
  });

  // Deps are only [value, inView] — NOT the match array (a new object each render,
  // which would restart the animation on every re-render and leave it stuck near 0).
  useEffect(() => {
    const m = value.match(NUM_RE);
    if (!m || !inView) return;
    const prefix = m[1];
    const target = parseInt(m[2].replace(/,/g, ''), 10);
    const suffix = m[3];
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const duration = reduce ? 0 : 1100;
    let raf = 0;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = duration <= 0 ? 1 : Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <>{display}</>;
}
