'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FILL, FONT, MOTION, ON } from './theme';
import Reveal from './Reveal';
import AppPhone from './AppPhone';
import {
  ArrowLeft, Baby, Building2, Check, Cloud, Download, Droplet, FlaskConical, Pill, PlugZap, Stethoscope,
} from './CloudIcons';

type Card = { title: string; desc: string };

// Values from Products.dc.html that theme.ts has no token for. The rose family
// is Balsm Connect's hue; it appears on no other page yet.
const EMERALD_TEXT = '#01866F'; // Products.dc.html — Pro/aqua kicker + link ink
const EMERALD_ICON = '#01A88B'; // Products.dc.html — Pro module icons
const BLUE_EDGE = '#CFE3FF'; // Products.dc.html — app tile edge (as HomeSections)
const VIOLET_EDGE = '#DDD3F5'; // Products.dc.html — network tile edge
const ROSE = { bg: '#FCE7F1', edge: '#F6CFE1', fill: '#E8478F', text: '#B8336F', chip: '#9C2A5E' }; // Products.dc.html
const CHECK_INK = '#2A8C47'; // Products.dc.html — check-chip glyph on greenBg
const BULLET_INK = '#1F2D3D'; // Products.dc.html — bullet text (ink-800)

const container: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
// 19px bold is WCAG large text, same as every other page's kicker (the design
// draws these at 14px; see HomeSections for why the site doesn't).
const eyebrow = (color: string): React.CSSProperties => ({ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color });
const badge = (bg: string, color: string, edge?: string): React.CSSProperties => ({
  fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12, padding: '3px 10px', borderRadius: 999, background: bg, color,
  border: edge ? `1px solid ${edge}` : undefined,
});
const sectionH2: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(30px,4.2vw,48px)', lineHeight: 1.15, color: C.ink };
const tileName: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 800, fontSize: 17, color: C.ink };
const corePill: React.CSSProperties = { fontSize: 12.5, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,.1)' };
const textLink = (color: string, size: number): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 44, fontFamily: FONT.cairo, fontWeight: 700, fontSize: size, color,
});

const MODULE_ICONS = [Pill, Stethoscope, Building2, FlaskConical, Droplet];

export default function ProductsSections() {
  const t = useTranslations('products');
  const locale = useLocale();
  const bullets = t.raw('app.bullets') as string[];
  const modules = t.raw('pro.modules') as Card[];
  const connectChips = t.raw('connect.chips') as string[];
  // The design's arrows point left (forward in Arabic) and flip in LTR.
  const flip: React.CSSProperties = { transform: locale === 'ar' ? 'none' : 'scaleX(-1)' };

  return (
    <>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(48px,8vw,96px) 0 clamp(40px,6vw,72px)', background: `linear-gradient(180deg,${C.blueBg} 0%,${C.bg} 100%)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', left: -100, top: -90, width: 330, opacity: 0.09, animation: 'balsm-spin 90s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 980, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
          <Reveal>
            <div style={eyebrow(C.blueDark)}>{t('hero.eyebrow')}</div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(34px,5.6vw,64px)', lineHeight: 1.15, color: C.ink, margin: '14px 0 18px' }}>{t('hero.title')}</h1>
            <p style={{ fontSize: 'clamp(17px,1.9vw,21px)', lineHeight: 1.8, color: C.ink2, margin: '0 auto', maxWidth: 660 }}>{t('hero.subtitle')}</p>
          </Reveal>
        </div>
      </section>

      {/* STACK DIAGRAM */}
      <section aria-labelledby="v2-stack" style={{ padding: '0 0 clamp(56px,8vw,96px)', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }}>
          <h2 id="v2-stack" className="sr-only">{t('stack.heading')}</h2>
          <Reveal style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 24, padding: 'clamp(20px,3vw,32px)', boxShadow: '0 10px 30px rgba(20,32,43,.05)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(200px,100%),1fr))', gap: 12 }}>
              {([
                { href: '#app', key: 'app', bg: C.blueBg, edge: BLUE_EDGE },
                { href: '#pro', key: 'pro', bg: C.aquaBg, edge: C.aquaBorder },
                { href: '#connect', key: 'connect', bg: ROSE.bg, edge: ROSE.edge },
              ] as const).map((tile) => (
                <a key={tile.key} href={tile.href} style={{ display: 'block', borderRadius: 16, padding: 18, background: tile.bg, border: `1px solid ${tile.edge}` }}>
                  <div style={tileName}>{t(`stack.${tile.key}.name`)}</div>
                  <div style={{ fontSize: 13.5, color: C.ink2, marginTop: 4 }}>{t(`stack.${tile.key}.for`)}</div>
                </a>
              ))}
            </div>
            <a href="#network" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px 16px', borderRadius: 16, padding: '16px 18px', background: C.violetBg, border: `1px solid ${VIOLET_EDGE}` }}>
              <span style={tileName}>{t('stack.network.name')}</span>
              <span style={{ fontSize: 13.5, color: C.ink2 }}>{t('stack.network.desc')}</span>
            </a>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px 16px', borderRadius: 16, padding: 18, background: C.dark, color: C.white }}>
              <span style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 17 }}>{t('stack.core.name')}</span>
              <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <span dir="ltr" style={{ ...corePill, fontFamily: FONT.mono }}>FHIR R4</span>
                <span style={corePill}>{t('stack.core.offline')}</span>
                <span style={corePill}>{t('stack.core.selfHosted')}</span>
                <span dir="ltr" style={{ ...corePill, fontFamily: FONT.mono }}>AGPL v3</span>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BALSM APP */}
      <section id="app" style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}`, scrollMarginTop: 80 }}>
        <div style={{ ...container, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'clamp(36px,6vw,80px)' }}>
          <Reveal style={{ flex: '1 1 400px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={eyebrow(C.blueDark)}>{t('app.eyebrow')}</div>
              <span style={badge(FILL.blue, ON.blue)}>{t('app.badge')}</span>
            </div>
            <h2 style={{ ...sectionH2, margin: '12px 0 16px' }}>{t('app.title')}</h2>
            <p style={{ fontSize: 'clamp(16px,1.7vw,19px)', lineHeight: 1.85, color: C.ink2, margin: '0 0 24px' }}>{t('app.desc')}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 26px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bullets.map((b) => (
                <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 9, background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: CHECK_INK, flex: 'none' }}>
                    <Check style={{ width: 18, height: 18 }} />
                  </span>
                  <span style={{ fontSize: 16, color: BULLET_INK }}>{b}</span>
                </li>
              ))}
            </ul>
            <div style={{ borderRadius: 18, padding: '20px 22px', background: ROSE.bg, border: `1px solid ${ROSE.edge}`, marginBottom: 26 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT.cairo, fontWeight: 800, fontSize: 17, color: C.ink, margin: '0 0 6px' }}>
                <Baby style={{ width: 20, height: 20, color: ROSE.text, flex: 'none' }} />{t('app.motherChild.title')}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{t('app.motherChild.desc')}</p>
            </div>
            <Link href="/download" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '15px 26px', borderRadius: 999, background: FILL.blue, color: ON.blue, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16.5, boxShadow: '0 12px 28px rgba(18,131,255,.24)' }}>
              <Download style={{ width: 19, height: 19 }} />{t('app.cta')}
            </Link>
          </Reveal>
          <Reveal style={{ flex: '0 0 auto', margin: '0 auto', maxWidth: '100%' }}>
            <AppPhone label={t('app.screenAlt')} lazy />
          </Reveal>
        </div>
      </section>

      {/* BALSM PRO */}
      <section id="pro" style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}`, scrollMarginTop: 80 }}>
        <div style={container}>
          <Reveal style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 64px', alignItems: 'flex-end', marginBottom: 40 }}>
            <div style={{ flex: '1 1 420px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={eyebrow(EMERALD_TEXT)}>{t('pro.eyebrow')}</div>
                <span style={badge(C.white, EMERALD_TEXT, C.aquaBorder)}>{t('pro.badge')}</span>
              </div>
              <h2 style={{ ...sectionH2, margin: '12px 0 0' }}>{t('pro.title')}</h2>
            </div>
            <p style={{ flex: '1 1 420px', minWidth: 0, fontSize: 'clamp(16px,1.7vw,18.5px)', lineHeight: 1.85, color: C.ink2, margin: 0 }}>{t('pro.desc')}</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(210px,100%),1fr))', gap: 14, marginBottom: 28 }}>
            {modules.map((m, i) => {
              const Icon = MODULE_ICONS[i];
              return (
                <Reveal key={m.title} delay={i * MOTION.staggerStep} className="balsm-lift" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 22 }}>
                  <Icon style={{ width: 24, height: 24, color: EMERALD_ICON }} />
                  <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 18, color: C.ink, margin: '12px 0 4px' }}>{m.title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.ink2, margin: 0 }}>{m.desc}</p>
                </Reveal>
              );
            })}
          </div>
          <Link href="/providers" style={textLink(EMERALD_TEXT, 16)}>
            {t('pro.cta')}<ArrowLeft style={{ width: 17, height: 17, ...flip }} />
          </Link>
        </div>
      </section>

      {/* CONNECT + NETWORK */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}` }}>
        <div style={{ ...container, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(400px,100%),1fr))', gap: 20 }}>
          <div id="connect" style={{ scrollMarginTop: 80 }}>
            <Reveal style={{ height: '100%', boxSizing: 'border-box', borderRadius: 24, padding: 'clamp(28px,4vw,40px)', background: `linear-gradient(160deg,${ROSE.bg},#fff 75%)`, border: `1px solid ${ROSE.edge}` }}>
              <span style={badge(C.white, ROSE.text, ROSE.edge)}>{t('connect.badge')}</span>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: ROSE.fill, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, margin: '20px 0 18px' }}>
                <PlugZap style={{ width: 25, height: 25 }} />
              </div>
              <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(26px,3.4vw,36px)', color: C.ink, margin: '0 0 10px' }}>{t('connect.title')}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: C.ink2, margin: '0 0 18px' }}>{t('connect.desc')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {connectChips.map((chip) => (
                  <span key={chip} style={{ fontSize: 13, padding: '5px 11px', borderRadius: 999, background: C.white, border: `1px solid ${ROSE.edge}`, color: ROSE.chip }}>{chip}</span>
                ))}
              </div>
            </Reveal>
          </div>
          <div id="network" style={{ scrollMarginTop: 80 }}>
            <Reveal style={{ height: '100%', boxSizing: 'border-box', borderRadius: 24, padding: 'clamp(28px,4vw,40px)', background: `linear-gradient(160deg,${C.violetBg},#fff 75%)`, border: `1px solid ${VIOLET_EDGE}` }}>
              <span style={badge(C.white, C.violetDark, VIOLET_EDGE)}>{t('network.badge')}</span>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: C.violet, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ON.violet, margin: '20px 0 18px' }}>
                <Cloud style={{ width: 25, height: 25 }} />
              </div>
              <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(26px,3.4vw,36px)', color: C.ink, margin: '0 0 10px' }}>{t('network.title')}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: C.ink2, margin: '0 0 18px' }}>{t('network.desc')}</p>
              <Link href="/cloud" style={textLink(C.violetDark, 15.5)}>
                {t('network.cta')}<ArrowLeft style={{ width: 16, height: 16, ...flip }} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* NEXT */}
      <section style={{ padding: 'clamp(48px,7vw,80px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
        <div style={{ ...container, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(24px,3.2vw,34px)', color: C.ink, margin: '0 0 6px' }}>{t('next.title')}</h2>
            <p style={{ fontSize: 16.5, color: C.ink2, margin: 0 }}>{t('next.desc')}</p>
          </div>
          <Link href="/ecosystem" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '15px 26px', borderRadius: 999, background: C.dark, color: C.white, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16 }}>
            {t('next.cta')}<ArrowLeft style={{ width: 18, height: 18, ...flip }} />
          </Link>
        </div>
      </section>
    </>
  );
}
