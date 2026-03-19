'use client';

import { useTranslations } from 'next-intl';

const features = [
  {
    key: 'appointments',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'prescriptions',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    key: 'records',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    key: 'providers',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    key: 'privacy',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    key: 'offline',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
  },
];

export default function Features() {
  const t = useTranslations('features');

  return (
    <section
      className="w-full max-w-5xl mx-auto px-4 py-20"
      aria-labelledby="features-heading"
    >
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-bg dark:bg-primary/10 text-primary border border-primary/20 dark:border-primary/30">
          Features
        </span>
        <h2
          id="features-heading"
          className="text-3xl sm:text-4xl font-bold text-text-primary"
        >
          {t('title')}
        </h2>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        role="list"
      >
        {features.map((feature, index) => (
          <article
            key={feature.key}
            className={`group relative p-8 rounded-3xl bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 shadow-lg shadow-black/5 dark:shadow-black/20 card-hover fade-in stagger-${index + 1}`}
            style={{ opacity: 0, animationFillMode: 'forwards' }}
            role="listitem"
          >
            {/* Gradient background on hover */}
            <div
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-primary-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />

            {/* Icon */}
            <div
              className="relative w-14 h-14 rounded-2xl bg-primary-bg dark:bg-primary/20 text-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/10 dark:shadow-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300"
              aria-hidden="true"
            >
              {feature.icon}
            </div>

            {/* Content */}
            <h3 className="relative text-xl font-bold text-text-primary dark:text-white mb-3 group-hover:text-primary transition-colors">
              {t(`${feature.key}.title`)}
            </h3>
            <p className="relative text-text-secondary dark:text-slate-300 leading-relaxed">
              {t(`${feature.key}.description`)}
            </p>

          </article>
        ))}
      </div>
    </section>
  );
}
