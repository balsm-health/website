'use client';

import { useLocale, useTranslations } from 'next-intl';
import { C, FONT, MOTION } from './theme';
import { useInView } from './useReveal';
import { ArrowRight, TrendingUp } from './CloudIcons';

export default function CloudHero() {
  const t = useTranslations('cloud.hero');
  const locale = useLocale();
  const { ref, inView } = useInView(MOTION.threshold, MOTION.rootMargin);

  const reveal: React.CSSProperties = {
    transition: MOTION.revealTransition,
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : `translateY(${MOTION.revealY}px)`,
  };

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(44px,7vw,88px) 0 clamp(48px,7vw,92px)',
        background: 'linear-gradient(180deg,#E4F0FF 0%, #FAFAF7 100%)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/balsm-logo.svg"
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          // Physical `left`, not `insetInlineStart` — the design is an RTL page and
          // still anchors the bloom top-left, so it must not flip with direction.
          left: -100,
          top: -80,
          width: 320,
          opacity: 0.1,
          animation: 'balsm-spin 80s linear infinite',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }}>
        <div ref={ref} style={{ maxWidth: 780, ...reveal }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color: C.blueDark }}>{t('badge')}</div>
            <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 11.5, padding: '3px 10px', borderRadius: 999, background: '#fff', border: '1px solid #DDD2F4', color: C.violetDark }}>
              {t('roadmap')}
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT.cairo,
              fontWeight: 800,
              fontSize: 'clamp(34px,5.6vw,64px)',
              lineHeight: 1.12,
              color: C.ink,
              margin: '14px 0 18px',
            }}
          >
            {t('titleLine1')}
            <br />
            {t('titleLine2')}
          </h1>
          <p
            style={{
              fontSize: 'clamp(17px,1.9vw,21px)',
              lineHeight: 1.75,
              color: C.ink2,
              margin: '0 0 30px',
              maxWidth: 620,
            }}
          >
            {t('subtitle')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <a
              href="#join"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                padding: '16px 30px',
                borderRadius: 999,
                background: C.blue,
                color: C.white,
                fontFamily: FONT.cairo,
                fontWeight: 700,
                fontSize: 17,
                boxShadow: '0 12px 28px rgba(18,131,255,.28)',
              }}
            >
              {t('ctaJoin')}
              <ArrowRight style={{ width: 19, height: 19, transform: locale === 'ar' ? 'rotate(180deg)' : 'none' }} />
            </a>
            <a
              href="#invest"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                padding: '16px 28px',
                borderRadius: 999,
                background: C.white,
                color: C.ink,
                border: `1.5px solid ${C.borderSoft}`,
                fontFamily: FONT.cairo,
                fontWeight: 700,
                fontSize: 17,
              }}
            >
              <TrendingUp style={{ width: 19, height: 19 }} />
              {t('ctaInvest')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
