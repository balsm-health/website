'use client';

import { useTranslations } from 'next-intl';
import { useRef, useState, useEffect } from 'react';
import WaitlistForm from './WaitlistForm';
import ThemeSwitcher from './ThemeSwitcher';

export default function Hero() {
  const t = useTranslations('hero');
  const tWaitlist = useTranslations('waitlist');
  const logoRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setMousePosition({
        x: (e.clientX - centerX) / 24,
        y: (e.clientY - centerY) / 24,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      className="relative flex flex-col items-center justify-center px-4 pt-20 pb-12 min-h-[70vh]"
      aria-label="Hero section"
    >
      {/* Theme Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeSwitcher />
      </div>

      {/* Petal bloom background */}
      <div className="animated-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Logo */}
      <div
        ref={logoRef}
        className="mb-10 float-animation fade-in cursor-default"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative group">
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/balsm-logo.svg"
              alt="Balsm — Community-Owned Healthcare OS"
              className="w-full h-full object-contain drop-shadow-sm"
              width="192"
              height="192"
            />
          </div>
          <div
            className="absolute -inset-4 rounded-full -z-10 transition-all duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(18,131,255,0.12) 0%, rgba(2,187,181,0.08) 60%, transparent 100%)',
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              opacity: isHovering ? 1 : 0.7,
            }}
            aria-hidden="true"
          />
        </div>

        {/* Wordmark — official olive-gray, with diacritics, Cairo display */}
        <div className="mt-6 text-center">
          <div
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold drop-shadow-sm mb-2 tracking-tight"
            lang="ar"
            aria-label="بَلسَم"
            style={{
              color: 'var(--color-wordmark)',
              fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
            }}
          >
            بَلسَم
          </div>
          <div
            className="text-sm tracking-[0.28em] uppercase font-semibold transition-all duration-300 hover:tracking-[0.4em] hover:text-primary"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
            aria-label="Balsm"
          >
            Balsm
          </div>
        </div>
      </div>

      {/* Coming soon badge */}
      <span
        className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-sm font-semibold rounded-full bg-primary-bg text-primary border border-primary/25 pulse-glow fade-in-delay-1 hover:scale-105 hover:bg-primary hover:text-white transition-all duration-200 cursor-default group"
        role="status"
        aria-live="polite"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse group-hover:bg-white" aria-hidden="true" />
        {t('comingSoon')}
      </span>

      {/* Headline */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-text-primary max-w-4xl mb-6 leading-tight fade-in-delay-1"
        style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' } as React.CSSProperties}
      >
        {t('title')}
      </h1>

      {/* Subtitle */}
      <p
        className="text-lg sm:text-xl text-center text-text-secondary max-w-2xl mb-12 fade-in-delay-2 leading-relaxed"
        style={{ fontFamily: 'var(--font-body)', maxWidth: '65ch' } as React.CSSProperties}
      >
        {t('subtitle')}
      </p>

      {/* Waitlist */}
      <div className="w-full max-w-lg fade-in-delay-3">
        <p
          className="text-center text-sm text-text-muted mb-4 font-medium"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {tWaitlist('subtitle')}
        </p>
        <WaitlistForm />
      </div>

      {/* Scroll indicator */}
      <button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' })}
        aria-label="Scroll down to features"
        type="button"
      >
        <svg
          className="w-6 h-6 text-text-muted hover:text-primary transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </section>
  );
}
