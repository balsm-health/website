'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * IntersectionObserver reveal — mirrors the site's existing pattern
 * (Features/Mission/Contacts) and replaces the design's balsm-motion.js
 * `data-reveal` / `data-stagger` behaviour.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.14, rootMargin?: string) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
