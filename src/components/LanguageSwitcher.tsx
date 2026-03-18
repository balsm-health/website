'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="group relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 shadow-lg shadow-black/5 dark:shadow-black/20 hover:bg-primary-bg dark:hover:bg-primary-bg hover:border-primary/30 hover:text-primary hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-wait overflow-hidden text-text-secondary dark:text-slate-300"
      aria-label="Switch language"
    >
      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-primary/10 dark:via-white/20 to-transparent" />

      {/* Globe icon with spin on pending */}
      <svg
        className={`w-4 h-4 text-text-tertiary dark:text-slate-400 group-hover:text-primary transition-all duration-300 ${isPending ? 'animate-spin' : 'group-hover:rotate-12'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      {/* Label with fade transition */}
      <span className={`relative transition-opacity duration-200 ${isPending ? 'opacity-60' : ''}`}>
        {label}
      </span>

      {/* Language indicator dot */}
      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${locale === 'ar' ? 'bg-emerald-500' : 'bg-blue-500'} group-hover:scale-125`} />
    </button>
  );
}
