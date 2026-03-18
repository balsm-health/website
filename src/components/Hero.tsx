import { useTranslations } from 'next-intl';
import WaitlistForm from './WaitlistForm';
import ThemeSwitcher from './ThemeSwitcher';

export default function Hero() {
  const t = useTranslations('hero');
  const tWaitlist = useTranslations('waitlist');

  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-20 pb-12 min-h-[70vh]">
      {/* Theme Switcher - Fixed in top-right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeSwitcher />
      </div>

      {/* Animated Background */}
      <div className="animated-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Logo */}
      <div className="mb-10 float-animation fade-in">
        <div className="relative">
          <div className="text-6xl sm:text-7xl md:text-8xl font-extrabold gradient-text drop-shadow-sm">
            بلسم
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary-light/20 blur-2xl rounded-full -z-10" />
        </div>
        <div className="text-sm text-text-muted text-center mt-3 tracking-[0.3em] uppercase font-medium">
          Balsm
        </div>
      </div>

      {/* Coming Soon Badge */}
      <span className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-sm font-semibold rounded-full bg-primary-bg text-primary border border-primary/30 pulse-glow fade-in-delay-1">
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        {t('comingSoon')}
      </span>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-text-primary max-w-4xl mb-6 leading-tight fade-in-delay-1">
        {t('title')}
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-center text-text-secondary max-w-2xl mb-12 fade-in-delay-2 leading-relaxed">
        {t('subtitle')}
      </p>

      {/* Waitlist section */}
      <div className="w-full max-w-lg fade-in-delay-3">
        <p className="text-center text-sm text-text-muted mb-4 font-medium">
          {tWaitlist('subtitle')}
        </p>
        <WaitlistForm />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
