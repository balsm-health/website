'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Mission() {
  const t = useTranslations('mission');
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const enter = 'will-change-transform transition-[opacity,transform] duration-700';
  const ease = 'ease-[cubic-bezier(0.16,1,0.3,1)]';

  const values = [
    { key: 'openness' as const },
    { key: 'sovereignty' as const },
    { key: 'resilience' as const },
  ] as const;

  return (
    <section
      ref={ref}
      aria-labelledby="mission-heading"
      style={{ background: 'var(--color-text-primary)' }}
      className="w-full py-24 px-6"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">

        {/* Arabic brand promise — always shown in Arabic regardless of locale */}
        <div
          className={`overflow-hidden mb-4 ${enter} ${ease} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '0ms' }}
        >
          <p
            lang="ar"
            style={{
              fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
              fontSize: 'clamp(2.6rem, 6vw, 4.8rem)',
              fontWeight: 800,
              color: '#F6F6F2',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
            aria-hidden="true"
          >
            رعايتك. بياناتك. نظامك.
          </p>
        </div>

        {/* English translation */}
        <p
          id="mission-heading"
          className={`text-base sm:text-lg font-medium mb-12 ${enter} ${ease} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            color: '#ADAEA4',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.01em',
            transitionDelay: '120ms',
          }}
        >
          {t('promise')}
        </p>

        {/* Description */}
        <p
          className={`text-sm sm:text-base leading-relaxed max-w-[52ch] mb-14 ${enter} ${ease} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            color: '#8C8C82',
            fontFamily: 'var(--font-body)',
            transitionDelay: '200ms',
            textWrap: 'pretty',
          } as React.CSSProperties}
        >
          {t('description')}
        </p>

        {/* Rule */}
        <div
          className={`mb-14 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
          style={{ transitionDelay: '280ms' }}
          aria-hidden="true"
        >
          <div className="w-16 h-px" style={{ background: '#3D3D34' }} />
        </div>

        {/* Three values */}
        <div
          className={`w-full grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0 ${enter} ${ease} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '360ms' }}
        >
          {values.map((v, i) => (
            <div
              key={v.key}
              className={`flex flex-col items-center gap-3 px-6 ${
                i < 2 ? 'sm:border-e' : ''
              }`}
              style={{ borderColor: '#3D3D34' }}
            >
              {/* Arabic value name */}
              <span
                lang="ar"
                style={{
                  fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#F6F6F2',
                  lineHeight: 1.2,
                }}
              >
                {t(`${v.key}.titleAr`)}
              </span>

              {/* English name */}
              <span
                className="text-xs font-semibold tracking-[0.18em] uppercase"
                style={{ color: '#56564C', fontFamily: 'var(--font-display)' }}
              >
                {t(`${v.key}.title`)}
              </span>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: '#6B6B60',
                  fontFamily: 'var(--font-body)',
                  maxWidth: '22ch',
                  textWrap: 'pretty',
                } as React.CSSProperties}
              >
                {t(`${v.key}.body`)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
