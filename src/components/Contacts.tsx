import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ReactNode } from 'react';

type ContactItem = {
  key: string;
  href: string;
  labelEn: string;
  labelAr: string;
  icon: ReactNode;
  toneClass: string;
};

const contacts: ContactItem[] = [
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/company/balsm-health',
    labelEn: 'LinkedIn',
    labelAr: 'لينكدإن',
    toneClass: 'text-[#0A66C2] dark:text-[#7AB7FF]',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" />
      </svg>
    ),
  },
  {
    key: 'github',
    href: 'https://github.com/balsm-io',
    labelEn: 'GitHub',
    labelAr: 'جيت هب',
    toneClass: 'text-slate-900 dark:text-slate-100',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.486 2 12.017c0 4.425 2.865 8.178 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.221-.254-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.277.098-2.662 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.706.115 2.504.337 1.909-1.296 2.748-1.027 2.748-1.027.546 1.386.202 2.41.1 2.664.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.694-4.566 4.944.359.31.678.923.678 1.86 0 1.341-.012 2.422-.012 2.75 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.486 17.523 2 12 2z" />
      </svg>
    ),
  },
  {
    key: 'patreon',
    href: 'https://patreon.com/balsm_health',
    labelEn: 'Patreon',
    labelAr: 'باتريون',
    toneClass: 'text-[#FF424D] dark:text-[#FF9AA2]',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="17.5" cy="17.5" r="5.5" />
        <rect x="2" y="2" width="6" height="20" rx="3" />
      </svg>
    ),
  },
];

export default function Contacts() {
  const t = useTranslations('contacts');
  const locale = useLocale();

  const isArabic = locale === 'ar';
  return (
    <section className="relative w-full py-20 px-4" aria-label="Contact section">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/20 via-transparent to-primary-bg/10 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-3xl mx-auto">
        <div className="relative overflow-visible rounded-3xl border border-primary/20 bg-white/65 dark:bg-slate-900/35 backdrop-blur-xl px-6 py-10 sm:px-10 shadow-[0_18px_60px_rgba(1,196,162,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)] text-center">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-36 w-36 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">{t('title')}</h2>
          <p className="mb-10 text-base sm:text-lg text-text-secondary max-w-xl mx-auto">{t('description')}</p>
          <div className="flex flex-row items-center justify-center gap-x-10 sm:gap-x-14 gap-y-0">
          {contacts.map((contact, index) => (
            <a
              key={contact.key}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isArabic ? contact.labelAr : contact.labelEn}
              className="group relative inline-flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-2xl border border-primary/25 bg-white/85 dark:bg-slate-900/55 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:shadow-[0_16px_30px_rgba(1,196,162,0.22)] dark:hover:shadow-[0_16px_30px_rgba(0,0,0,0.45)] hover:border-primary/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/15 to-transparent" aria-hidden="true" />
              <div className={`relative transition-transform duration-300 group-hover:scale-110 ${contact.toneClass}`}>
                {contact.icon}
              </div>
              <span className="pointer-events-none absolute -bottom-11 left-1/2 -translate-x-1/2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2.5 py-1 text-xs font-semibold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-200 whitespace-nowrap shadow-lg">
                {isArabic ? contact.labelAr : contact.labelEn}
              </span>
            </a>
          ))}
          </div>
          <Link 
            href="/links"
            className="group relative mt-6 inline-flex items-center gap-2 rounded-full bg-white/85 dark:bg-slate-900/55 px-6 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 active:scale-95 border border-primary/25 hover:border-primary/50 shadow-md hover:shadow-[0_16px_30px_rgba(1,196,162,0.22)] dark:hover:shadow-[0_16px_30px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/15 to-transparent" aria-hidden="true" />
            <span className="relative">{t('viewAllLinks')}</span>
            <svg className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <div className="mt-6 text-xs sm:text-sm text-text-tertiary">
            {isArabic ? 'تابعنا للحصول على التحديثات' : 'Follow us for updates'}
          </div>
        </div>
      </div>
    </section>
  );
}
