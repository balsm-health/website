'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import WaitlistForm from './WaitlistForm';
import ThemeSwitcher from './ThemeSwitcher';

export default function Hero() {
  const t = useTranslations('hero');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const enter = 'will-change-transform transition-[opacity,transform] duration-700';
  const ease = { transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' };

  return (
    <section
      className="relative flex flex-col items-center justify-center px-6 pt-24 pb-24 min-h-[90vh]"
      aria-label="Hero section"
    >
      {/* Theme toggle — top right */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeSwitcher />
      </div>

      {/* Flower mark — settle animation on load */}
      <div
        className={`mb-10 ${enter} ${loaded ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-[0.88] -rotate-6'}`}
        style={ease}
      >
        <img
          src="/balsm-logo.svg"
          alt="Balsm — Community-Owned Healthcare OS"
          width="192"
          height="192"
          className="w-[148px] h-[148px] sm:w-[188px] sm:h-[188px] md:w-[210px] md:h-[210px] select-none"
          draggable={false}
        />
      </div>

      {/* Arabic wordmark — line reveal (overflow-hidden clips the slide) */}
      <div className="overflow-hidden mb-2" aria-hidden="true">
        <div
          className={`transition-transform duration-700 ${loaded ? 'translate-y-0' : 'translate-y-full'}`}
          style={{ ...ease, transitionDelay: '140ms' }}
        >
          <span
            className="block text-center select-none"
            lang="ar"
            style={{
              fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
              fontSize: 'clamp(4.2rem, 10vw, 7.5rem)',
              fontWeight: 900,
              color: 'var(--color-wordmark)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
            }}
          >
            بَلسَم
          </span>
        </div>
      </div>

      {/* Screen-reader h1 — provides semantic heading for crawlers + AT */}
      <h1 className="sr-only">Balsm — نظام التشغيل الصحي للعالم العربي · The Healthcare OS for the Arab World</h1>

      {/* Balsm Roman — small caps treatment */}
      <div
        className={`mb-12 ${enter} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
        style={{ ...ease, transitionDelay: '200ms' }}
      >
        <p
          className="text-center text-xs sm:text-sm font-semibold tracking-[0.28em] uppercase"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
        >
          Balsm
        </p>
      </div>

      {/* Hero copy */}
      <div
        className={`mb-10 text-center ${enter} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ ...ease, transitionDelay: '290ms' }}
      >
        <p
          className="text-xl sm:text-2xl font-semibold mb-3 leading-snug"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-primary)',
            maxWidth: '44ch',
            textWrap: 'balance',
          } as React.CSSProperties}
        >
          {t('title')}
        </p>
        <p
          className="text-base sm:text-lg leading-relaxed"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-secondary)',
            maxWidth: '52ch',
            textWrap: 'pretty',
          } as React.CSSProperties}
        >
          {t('subtitle')}
        </p>
      </div>

      {/* Rule */}
      <div
        className={`mb-8 transition-[opacity,transform] duration-500 ${loaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '360ms' }}
        aria-hidden="true"
      >
        <div className="w-20 h-px" style={{ background: 'var(--color-border)' }} />
      </div>

      {/* Coming soon + waitlist */}
      <div
        className={`w-full max-w-xl ${enter} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ ...ease, transitionDelay: '420ms' }}
      >
        {/* Coming soon indicator */}
        <div className="flex items-center justify-center gap-3 mb-7" role="status" aria-live="polite">
          <span
            className="flex-1 max-w-[3rem] h-px"
            style={{ background: 'var(--color-border)' }}
            aria-hidden="true"
          />
          <span
            className="text-[11px] font-semibold tracking-[0.22em] uppercase"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
          >
            {t('comingSoon')}
          </span>
          <span
            className="flex-1 max-w-[3rem] h-px"
            style={{ background: 'var(--color-border)' }}
            aria-hidden="true"
          />
        </div>

        <WaitlistForm />
      </div>
    </section>
  );
}
