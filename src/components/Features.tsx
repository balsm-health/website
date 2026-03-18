'use client';

import { useTranslations } from 'next-intl';

const features = [
  {
    key: 'appointments',
    gradient: 'from-teal-400 to-emerald-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'prescriptions',
    gradient: 'from-cyan-400 to-teal-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: 'records',
    gradient: 'from-emerald-400 to-cyan-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    key: 'providers',
    gradient: 'from-teal-500 to-emerald-400',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function Features() {
  const t = useTranslations('features');

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-bg text-primary">
          Features
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
          {t('title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div
            key={feature.key}
            className={`group relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-black/5 card-hover fade-in stagger-${index + 1}`}
            style={{ opacity: 0, animationFillMode: 'forwards' }}
          >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-primary-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon */}
            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>

            {/* Content */}
            <h3 className="relative text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
              {t(`${feature.key}.title`)}
            </h3>
            <p className="relative text-text-secondary leading-relaxed">
              {t(`${feature.key}.description`)}
            </p>

            {/* Arrow icon */}
            <div className="absolute bottom-8 right-8 rtl:right-auto rtl:left-8 w-10 h-10 rounded-full bg-primary-bg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              <svg className="w-5 h-5 text-primary rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
