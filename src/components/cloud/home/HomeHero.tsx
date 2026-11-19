'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FILL, FONT } from '../theme';
import Reveal from '../Reveal';
import { CodeXml, Handshake } from '../CloudIcons';
import { Forward, V2 } from './shared';

const PARTNERS = [
  { href: '/partners#shift', src: '/partners/partner-the-shift.png', name: 'The Shift · e& egypt' },
  { href: '/partners#flat6labs', src: '/partners/partner-flat6labs-h.png', name: 'Flat6Labs' },
  { href: '/partners#unfpa', src: '/partners/partner-unfpa.png', name: 'UNFPA' },
  { href: '/partners#norway', src: '/partners/partner-norway.png', name: 'Royal Norwegian Embassy' },
];

// Order, heights and opacities per HomeV2.dc.html.
const SPONSORS = [
  { src: '/sponsor-aws.svg', name: 'AWS', h: 22, o: 0.8 },
  { src: '/sponsor-github.svg', name: 'GitHub', h: 24, o: 0.8 },
  { src: '/sponsor-claude.svg', name: 'Claude', h: 22, o: 0.85 },
  { src: '/sponsor-sentry.svg', name: 'Sentry', h: 22, o: 0.8 },
  { src: '/sponsor-mosalam.svg', name: 'Mosalam', h: 22, o: 0.8 },
  { src: '/sponsor-kiro.svg', name: 'Kiro', h: 22, o: 0.8 },
  { src: '/sponsor-google-cloud.svg', name: 'Google Cloud', h: 22, o: 0.85 },
  { src: '/sponsor-posthog.svg', name: 'PostHog', h: 22, o: 0.85 },
  { src: '/sponsor-cursor.svg', name: 'Cursor', h: 20, o: 0.85 },
  { src: '/sponsor-manus.svg', name: 'Manus', h: 22, o: 0.85 },
  { src: '/sponsor-impostarz.svg', name: 'Impostarz', h: 22, o: 0.85 },
];

const pill = { display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 28px', borderRadius: 999, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17 } as const;
const ghost = { ...pill, background: C.white, color: C.ink, border: `1.5px solid ${C.border}` } as const;

export function HomeHero() {
  const t = useTranslations('home.hero');
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(56px,9vw,112px) 0 clamp(56px,8vw,96px)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/balsm-background.png" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right top', opacity: 0.9, pointerEvents: 'none' }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', left: -90, bottom: -110, width: 340, opacity: 0.1, animation: 'balsm-spin 80s linear infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
        <Reveal style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 16px', borderRadius: 999, background: C.white, border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(20,32,43,.05)', marginBottom: 26 }}>
          <span aria-hidden style={{ display: 'inline-flex', gap: 4 }}>
            {[C.aqua, C.emerald, C.blue, C.mint, C.violet].map((c) => (
              <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
            ))}
          </span>
          <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14, color: C.ink2 }}>{t('badge')}</span>
        </Reveal>
        <Reveal delay={60}>
          {/* Brand line: the first line hugs the start edge, the second the end edge. */}
          <h1 className="b-brand-line" style={{ fontFamily: FONT.arabic, fontWeight: 700, fontSize: 'clamp(38px,6.6vw,78px)', lineHeight: 1.32, color: C.ink, margin: '0 auto', display: 'flex', flexDirection: 'column', width: 'fit-content', maxWidth: '100%', gap: '.04em' }}>
            <span style={{ display: 'block', alignSelf: 'flex-start' }}>{t('title1')}</span>
            <span style={{ alignSelf: 'flex-end', paddingInlineStart: '1.2em', color: C.blue, display: 'flex', alignItems: 'center', gap: '.25em' }}>
              <span>{t('title2')}</span>
              <span className="b-brand-trail" aria-hidden style={{ display: 'block', width: '1.6em', height: '.09em', borderRadius: '1em', flex: 'none' }} />
            </span>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p style={{ fontFamily: FONT.arabic, fontSize: 'clamp(17px,2.1vw,22px)', lineHeight: 1.7, color: C.ink2, maxWidth: 680, margin: '24px auto 0' }}>{t('subtitle')}</p>
        </Reveal>
        <Reveal delay={160}>
          <p style={{ fontFamily: FONT.arabic, fontWeight: 500, fontSize: 14, letterSpacing: '.02em', color: V2.muted, margin: '14px 0 0' }}>{t('tagline')}</p>
        </Reveal>
        <Reveal delay={220} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 38 }}>
          <Link href="/ecosystem" style={{ ...pill, background: FILL.blue, color: C.white, boxShadow: '0 12px 28px rgba(18,131,255,.26)' }}>
            {t('ctaExplore')}<Forward size={19} />
          </Link>
          <Link href="/partners#partner" style={ghost}>
            <Handshake style={{ width: 19, height: 19 }} />{t('ctaPartner')}
          </Link>
          <Link href="/contributors" style={ghost}>
            <CodeXml style={{ width: 19, height: 19 }} />{t('ctaCode')}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function HomePartnersStrip() {
  const t = useTranslations('home.partners');
  return (
    <section aria-labelledby="home-partners-strip" style={{ background: C.white, borderTop: `1px solid ${C.borderHair}`, borderBottom: `1px solid ${C.borderHair}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(30px,4vw,44px) clamp(20px,5vw,56px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px 24px', marginBottom: 22 }}>
          <h2 id="home-partners-strip" style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color: V2.muted, margin: 0 }}>{t('title')}</h2>
          <Link href="/partners" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14.5, color: C.blueDark }}>
            {t('all')}<Forward size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(200px,100%),1fr))', gap: 14 }}>
          {PARTNERS.map((p, i) => (
            <Reveal key={p.href} delay={i * 80}>
              <Link href={p.href} className="balsm-lift" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '20px 16px', border: `1px solid ${C.borderHair}`, borderRadius: 16, background: C.bg, height: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" loading="lazy" style={{ width: '100%', height: 56, objectFit: 'contain' }} />
                <span dir="ltr" style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 12.5, color: V2.muted, textAlign: 'center' }}>{p.name}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px 28px', marginTop: 22, paddingTop: 20, borderTop: `1px dashed ${C.border}` }}>
          <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color: V2.muted }}>{t('tech')}</span>
          {SPONSORS.map((s) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.src} src={s.src} alt={s.name} loading="lazy" style={{ height: s.h, width: 'auto', opacity: s.o }} />
          ))}
        </div>
      </div>
    </section>
  );
}
