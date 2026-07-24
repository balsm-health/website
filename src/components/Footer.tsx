import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Footer() {
  const t = useTranslations('footer');
  const tLang = useTranslations('language');

  return (
    <footer className="relative w-full py-12 px-4 mt-auto">
      {/* Separator */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)' }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto">
        {/* Logo + wordmark */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-10 h-10 transition-transform duration-200 hover:scale-110 cursor-default mb-2">
            <img
              src="/balsm-logo.svg"
              alt="Balsm Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Official wordmark color — no gradient */}
          <div
            className="text-base font-bold cursor-default"
            lang="ar"
            style={{
              color: 'var(--color-wordmark)',
              fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
            }}
          >
            بَلسَم
          </div>
          {/* Brand tagline */}
          <p
            className="mt-1 text-xs tracking-[0.2em] uppercase"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
          >
            Open · Arab · Owned
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <a
            href="mailto:info@balsm.health"
            className="text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-150 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span dir="ltr">info@balsm.health</span>
          </a>
          <div className="w-1 h-1 rounded-full bg-border hidden sm:block" aria-hidden="true" />
          <LanguageSwitcher label={tLang('switch')} />
        </div>

        {/* Copyright */}
        <p
          className="text-sm text-text-muted text-center"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {t('copyright')}
        </p>

        {/* Made with */}
        <p
          className="text-xs text-text-muted text-center mt-3 flex items-center justify-center gap-1.5 cursor-default"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {t('madeWith')}
          <svg className="w-3.5 h-3.5 text-danger" fill="currentColor" viewBox="0 0 20 20" aria-label="love" role="img">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          {t('madeIn')}
        </p>
      </div>
    </footer>
  );
}
