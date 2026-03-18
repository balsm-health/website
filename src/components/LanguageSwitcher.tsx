'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`) || `/${newLocale}`;
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-black/5 hover:bg-primary-bg hover:border-primary/30 hover:text-primary transition-all duration-300 disabled:opacity-50"
      aria-label="Switch language"
    >
      <svg className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {isPending ? (
        <span className="animate-pulse">...</span>
      ) : (
        label
      )}
    </button>
  );
}
