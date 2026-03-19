import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Footer() {
  const t = useTranslations('footer');
  const tLang = useTranslations('language');

  return (
    <footer className="relative w-full py-12 px-4 mt-auto">
      {/* Animated gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />

      <div className="max-w-4xl mx-auto">
        {/* Logo with hover effect */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-12 h-12 transition-transform duration-300 hover:scale-110 cursor-default mb-2">
            <img
              src="/balsm-logo.svg"
              alt="Balsm Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-lg font-bold gradient-text glow-hover cursor-default">
            بلسم
          </div>
        </div>

        {/* Links & Contact */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <a
            href="mailto:info@balsm.health"
            className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span dir="ltr">info@balsm.health</span>
          </a>
          <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
          <LanguageSwitcher label={tLang('switch')} />
        </div>

        {/* Copyright with hover */}
        <p className="text-sm text-text-muted text-center transition-colors duration-300 hover:text-text-secondary cursor-default">
          {t('copyright')}
        </p>

        {/* Made with love - animated heart */}
        <p className="text-xs text-text-muted text-center mt-4 flex items-center justify-center gap-1 group cursor-default">
          {t('madeWith')}
          <svg className="w-4 h-4 text-danger heartbeat group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span className="transition-colors duration-300 group-hover:text-primary">{t('madeIn')}</span>
        </p>
      </div>
    </footer>
  );
}
