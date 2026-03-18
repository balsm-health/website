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
        <div className="flex justify-center mb-6">
          <div className="text-2xl font-bold gradient-text glow-hover cursor-default transition-transform duration-300 hover:scale-110">
            بلسم
          </div>
        </div>

        {/* Language switcher */}
        <div className="flex flex-row items-center justify-center gap-4 mb-8">
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
