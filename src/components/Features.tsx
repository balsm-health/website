'use client';

import { useTranslations } from 'next-intl';

const features = [
  {
    key: 'appointments',
    petalColor: '#1283FF',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'prescriptions',
    petalColor: '#01C4A2',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    key: 'records',
    petalColor: '#55D77F',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    key: 'providers',
    petalColor: '#02BBB5',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    key: 'privacy',
    petalColor: '#724DD0',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    key: 'offline',
    petalColor: '#1283FF',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
  },
];

const rows = [
  features.slice(0, 2),
  features.slice(2, 4),
  features.slice(4, 6),
];

export default function Features() {
  const t = useTranslations('features');

  return (
    <section
      className="w-full max-w-5xl mx-auto px-4 py-24"
      aria-labelledby="features-heading"
    >
      <h2
        id="features-heading"
        className="text-4xl sm:text-5xl font-bold text-text-primary text-center mb-16 leading-tight"
        style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' } as React.CSSProperties}
      >
        {t('title')}
      </h2>

      <div role="list">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid grid-cols-1 sm:grid-cols-2 sm:gap-x-14 ${
              rowIndex < rows.length - 1 ? 'border-b border-border' : ''
            }`}
            role="presentation"
          >
            {row.map((feature, featureIndex) => (
              <article
                key={feature.key}
                className={`flex gap-4 items-start py-11 ${
                  featureIndex === 0 && row.length === 2
                    ? 'border-b sm:border-b-0 border-border'
                    : ''
                }`}
                role="listitem"
              >
                {/* Petal-colored icon — no background container */}
                <div
                  className="mt-0.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ color: feature.petalColor }}
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold text-text-primary mb-1.5 leading-snug"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p
                    className="text-text-secondary leading-relaxed text-base"
                    style={{ fontFamily: 'var(--font-body)', maxWidth: '42ch' } as React.CSSProperties}
                  >
                    {t(`${feature.key}.description`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
