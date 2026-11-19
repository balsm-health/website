'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FONT, MOTION } from './theme';
import Reveal from './Reveal';
import { ArrowLeft, Building2, CodeXml, Github, Handshake, Wrench } from './CloudIcons';

type Card = { title: string; desc: string };
type Tier = { name: string; desc: string; tags: string[] };

// Values from Ecosystem.dc.html that theme.ts has no token for.
const EMERALD_TEXT = '#01866F'; // Ecosystem.dc.html — aqua-family kicker/chip ink
const EMERALD_ICON = '#01A88B'; // Ecosystem.dc.html — facilities card icon
const ROSE_TEXT = '#B8336F'; // Ecosystem.dc.html — licensing kicker
const ROSE_FILL = '#E8478F'; // Ecosystem.dc.html — partners card icon
const AGPL_INK = '#2A8C47'; // Ecosystem.dc.html — AGPL pill on greenBg
const COST_LABEL = '#5F6B77'; // Ecosystem.dc.html — "license cost" caption
const DPG_INK = '#8BE8A8'; // Ecosystem.dc.html — DPG chip on the dark band

const container: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
// 19px bold is WCAG large text, same as every other page's kicker (the design
// draws these at 14px; see HomeSections for why the site doesn't).
const eyebrow = (color: string): React.CSSProperties => ({ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color });
const sectionH2: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(30px,4.4vw,50px)', lineHeight: 1.18, color: C.ink, margin: '12px 0 14px' };
const lead: React.CSSProperties = { fontSize: 'clamp(16px,1.7vw,19px)', lineHeight: 1.85, color: C.ink2, margin: 0 };
const cardH2: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(24px,3.2vw,34px)', color: C.ink, margin: '10px 0 12px' };
const tierChip: React.CSSProperties = { fontSize: 12, padding: '4px 10px', borderRadius: 999, background: C.white, border: `1px solid ${C.border}`, color: C.ink2 };
const textLink = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 44, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color,
});

// Index-aligned with `ecosystem.architecture.tiers`. Tech chips are Latin
// names in both locales, so they live here rather than in the messages.
const TIERS = [
  { n: '01', color: C.blueDark, tech: ['Flutter'] },
  { n: '02', color: EMERALD_TEXT, tech: ['.NET', 'FHIR R4', 'UUID v7'] },
  { n: '03', color: C.violetDark, tech: [] as string[] },
];
const STANDARDS = ['HL7 FHIR R4', 'OpenID Connect', 'OAuth 2.0', 'UUID v7', 'AGPL v3'];
// Index-aligned with `ecosystem.who.cards`.
const WHO = [
  { Icon: Building2, color: EMERALD_ICON, href: '/providers' },
  { Icon: CodeXml, color: C.violet, href: '/contributors' },
  { Icon: Wrench, color: C.blue, href: '/partners#partner' },
  { Icon: Handshake, color: ROSE_FILL, href: '/partners' },
];

export default function EcosystemSections() {
  const t = useTranslations('ecosystem');
  const locale = useLocale();
  const tiers = t.raw('architecture.tiers') as Tier[];
  const whoCards = t.raw('who.cards') as Card[];
  const regions = t.raw('reach.regions') as string[];
  // The design's arrows point left (forward in Arabic) and flip in LTR.
  const flip: React.CSSProperties = { transform: locale === 'ar' ? 'none' : 'scaleX(-1)' };

  return (
    <>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(48px,8vw,96px) 0 clamp(48px,7vw,80px)', background: `linear-gradient(180deg,${C.aquaBg} 0%,${C.bg} 100%)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', right: -110, top: -90, width: 340, opacity: 0.09, animation: 'balsm-spin 90s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 980, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
          <Reveal>
            <div style={eyebrow(EMERALD_TEXT)}>{t('hero.eyebrow')}</div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(34px,5.6vw,64px)', lineHeight: 1.15, color: C.ink, margin: '14px 0 18px' }}>{t('hero.title')}</h1>
            <p style={{ fontSize: 'clamp(17px,1.9vw,21px)', lineHeight: 1.8, color: C.ink2, margin: '0 auto', maxWidth: 680 }}>{t('hero.subtitle')}</p>
          </Reveal>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" style={{ padding: 'clamp(56px,8vw,100px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}`, scrollMarginTop: 80 }}>
        <div style={container}>
          <Reveal style={{ maxWidth: 740, marginBottom: 44 }}>
            <div style={eyebrow(C.blueDark)}>{t('architecture.eyebrow')}</div>
            <h2 style={sectionH2}>{t('architecture.title')}</h2>
            <p style={lead}>{t('architecture.desc')}</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 18 }}>
            {tiers.map((tier, i) => {
              const s = TIERS[i];
              return (
                <Reveal key={s.n} delay={i * MOTION.staggerStep} style={{ borderRadius: 22, padding: 28, background: C.bg, border: `1px solid ${C.border}` }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 16px' }}>
                    <span style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 13, color: s.color }}>{s.n}</span>
                    <span style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 19, color: C.ink }}>{tier.name}</span>
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: C.ink2, margin: '0 0 14px' }}>{tier.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {s.tech.map((x) => (
                      <span key={x} dir="ltr" style={{ ...tierChip, fontFamily: FONT.mono }}>{x}</span>
                    ))}
                    {tier.tags.map((x) => (
                      <span key={x} style={tierChip}>{x}</span>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* STANDARDS */}
      <section id="standards" style={{ padding: 'clamp(56px,8vw,100px) 0', background: C.dark, color: C.white, scrollMarginTop: 80 }}>
        <div style={{ ...container, display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px,6vw,72px)', alignItems: 'center' }}>
          <Reveal style={{ flex: '1 1 380px', minWidth: 0 }}>
            <div style={eyebrow(C.mint)}>{t('standards.eyebrow')}</div>
            <h2 style={{ ...sectionH2, fontSize: 'clamp(30px,4.4vw,48px)', color: C.white }}>{t('standards.title')}</h2>
            <p style={{ fontSize: 'clamp(16px,1.7vw,18.5px)', lineHeight: 1.85, color: 'rgba(255,255,255,.75)', margin: 0 }}>{t('standards.desc')}</p>
          </Reveal>
          <ul style={{ flex: '1 1 440px', minWidth: 0, display: 'flex', flexWrap: 'wrap', gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
            {STANDARDS.map((name, i) => (
              <li key={name}>
                <Reveal delay={i * MOTION.staggerStep} style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 15, padding: '12px 18px', borderRadius: 14, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.14)' }}>
                  <span dir="ltr">{name}</span>
                </Reveal>
              </li>
            ))}
            <li>
              <Reveal delay={STANDARDS.length * MOTION.staggerStep} style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, padding: '12px 18px', borderRadius: 14, background: 'rgba(85,215,127,.14)', border: '1px solid rgba(85,215,127,.35)', color: DPG_INK }}>
                {t('standards.dpg')}
              </Reveal>
            </li>
          </ul>
        </div>
      </section>

      {/* LICENSING */}
      <section id="licensing" style={{ padding: 'clamp(56px,8vw,100px) 0', background: C.bg, scrollMarginTop: 80 }}>
        <div style={container}>
          <Reveal style={{ maxWidth: 740, marginBottom: 40 }}>
            <div style={eyebrow(ROSE_TEXT)}>{t('licensing.eyebrow')}</div>
            <h2 style={sectionH2}>{t('licensing.title')}</h2>
            <p style={lead}>{t('licensing.desc')}</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(360px,100%),1fr))', gap: 18 }}>
            <Reveal style={{ borderRadius: 22, padding: 30, background: C.white, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                <h3 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 22, color: C.ink, margin: 0 }}>{t('licensing.selfHosted.title')}</h3>
                <span dir="ltr" style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 13, padding: '4px 10px', borderRadius: 999, background: C.greenBg, color: AGPL_INK }}>AGPL v3</span>
              </div>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: C.ink2, margin: '0 0 14px' }}>{t('licensing.selfHosted.desc')}</p>
              <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 28, color: C.ink }}>0</div>
              <div style={{ fontSize: 13.5, color: COST_LABEL }}>{t('licensing.selfHosted.costLabel')}</div>
            </Reveal>
            <Reveal delay={MOTION.staggerStep} style={{ borderRadius: 22, padding: 30, background: C.white, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                <h3 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 22, color: C.ink, margin: 0 }}>{t('licensing.cloud.title')}</h3>
                <span dir="ltr" style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 13, padding: '4px 10px', borderRadius: 999, background: C.violetBg, color: C.violetDark }}>BCL</span>
              </div>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: C.ink2, margin: '0 0 14px' }}>{t('licensing.cloud.desc')}</p>
              <Link href="/cloud" style={textLink(C.violetDark)}>
                {t('licensing.cloud.cta')}<ArrowLeft style={{ width: 16, height: 16, ...flip }} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHO BUILDS */}
      <section style={{ padding: 'clamp(56px,8vw,100px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}` }}>
        <div style={container}>
          <Reveal style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 44px' }}>
            <div style={eyebrow(EMERALD_TEXT)}>{t('who.eyebrow')}</div>
            <h2 style={{ ...sectionH2, margin: '12px 0 0' }}>{t('who.title')}</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 16 }}>
            {whoCards.map((card, i) => {
              const s = WHO[i];
              return (
                <Reveal key={s.href} delay={i * MOTION.staggerStep}>
                  <Link href={s.href} className="balsm-lift" style={{ display: 'block', height: '100%', boxSizing: 'border-box', borderRadius: 20, padding: 26, background: C.bg, border: `1px solid ${C.border}` }}>
                    <s.Icon style={{ width: 26, height: 26, color: s.color }} />
                    <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color: C.ink, margin: '14px 0 6px' }}>{card.title}</h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.65, color: C.ink2, margin: 0 }}>{card.desc}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* MARKETPLACE CTA */}
      <section style={{ padding: '0 0 clamp(48px,7vw,80px)', background: C.white }}>
        <div style={container}>
          <Link href="/marketplace" className="balsm-lift" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '18px 32px', padding: 'clamp(24px,4vw,36px)', borderRadius: 24, background: `linear-gradient(135deg,${C.aquaBg},${C.blueBg})`, border: `1px solid ${C.aquaBorder}` }}>
            <div style={{ flex: '1 1 420px', minWidth: 0 }}>
              <div style={eyebrow(EMERALD_TEXT)}>{t('market.eyebrow')}</div>
              <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(24px,3.2vw,34px)', color: C.ink, margin: '8px 0 8px' }}>{t('market.title')}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: C.ink2, margin: 0 }}>{t('market.desc')}</p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '15px 26px', borderRadius: 999, background: C.dark, color: C.white, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16 }}>
              {t('market.cta')}<ArrowLeft style={{ width: 18, height: 18, ...flip }} />
            </span>
          </Link>
        </div>
      </section>

      {/* ROADMAP / REACH */}
      <section id="roadmap" style={{ padding: 'clamp(56px,8vw,100px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}`, scrollMarginTop: 80 }}>
        <div style={{ ...container, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(380px,100%),1fr))', gap: 20 }}>
          <Reveal style={{ borderRadius: 24, padding: 'clamp(28px,4vw,40px)', background: C.white, border: `1px solid ${C.border}` }}>
            <div style={eyebrow(C.blueDark)}>{t('roadmap.eyebrow')}</div>
            <h2 style={cardH2}>{t('roadmap.title')}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.8, color: C.ink2, margin: '0 0 18px' }}>{t('roadmap.desc')}</p>
            <a href="https://github.com/balsm-health" target="_blank" rel="noopener noreferrer" style={textLink(C.blueDark)}>
              <Github style={{ width: 17, height: 17 }} />{t('roadmap.cta')}
            </a>
          </Reveal>
          <Reveal delay={MOTION.staggerStep} style={{ borderRadius: 24, padding: 'clamp(28px,4vw,40px)', background: C.white, border: `1px solid ${C.border}` }}>
            <div style={eyebrow(EMERALD_TEXT)}>{t('reach.eyebrow')}</div>
            <h2 style={cardH2}>{t('reach.title')}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.8, color: C.ink2, margin: '0 0 18px' }}>{t('reach.desc')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {regions.map((r, i) => (
                <span key={r} style={i === 0
                  ? { fontSize: 13, padding: '5px 12px', borderRadius: 999, background: C.aquaBg, color: EMERALD_TEXT, fontWeight: 600 }
                  : { fontSize: 13, padding: '5px 12px', borderRadius: 999, background: C.ltTagBg, color: C.ink2 }}>{r}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
