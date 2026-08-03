'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type ContactItem = {
  key: string;
  href: string;
  labelEn: string;
  labelAr: string;
  icon: ReactNode;
  color: string;
};

const contacts: ContactItem[] = [
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/company/balsm-health',
    labelEn: 'LinkedIn',
    labelAr: 'لينكدإن',
    color: '#0A66C2',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" />
      </svg>
    ),
  },
  {
    key: 'github',
    href: 'https://github.com/balsm-health',
    labelEn: 'GitHub',
    labelAr: 'جيت هب',
    color: '#2B2B25',
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
    color: '#FF424D',
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

  const enter = 'will-change-transform transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full py-24 px-6"
      aria-labelledby="contacts-heading"
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center">

        <h2
          id="contacts-heading"
          className={`text-3xl sm:text-4xl font-bold mb-4 ${enter} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)', textWrap: 'balance' } as React.CSSProperties}
        >
          {t('title')}
        </h2>

        <p
          className={`text-base sm:text-lg leading-relaxed mb-14 ${enter} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-secondary)',
            maxWidth: '44ch',
            textWrap: 'pretty',
            transitionDelay: '80ms',
          } as React.CSSProperties}
        >
          {t('description')}
        </p>

        {/* Social links — flat, no border boxes */}
        <div
          className={`flex items-center justify-center gap-10 sm:gap-14 mb-12 ${enter} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '160ms' }}
        >
          {contacts.map((contact) => (
            <a
              key={contact.key}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isArabic ? contact.labelAr : contact.labelEn}
              className="group flex flex-col items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg p-1"
            >
              <span
                className="transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5"
                style={{ color: contact.color }}
              >
                {contact.icon}
              </span>
              <span
                className="text-[11px] font-semibold tracking-wide transition-colors duration-150 group-hover:text-primary"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                {isArabic ? contact.labelAr : contact.labelEn}
              </span>
            </a>
          ))}
        </div>

        {/* View all links */}
        <div
          className={`${enter} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          style={{ transitionDelay: '240ms' }}
        >
          <Link
            href="/links"
            className="group inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}
          >
            <span className="group-hover:underline underline-offset-2">{t('viewAllLinks')}</span>
            <svg
              className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
