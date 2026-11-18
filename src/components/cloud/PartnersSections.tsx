'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { C, FONT, MOTION } from './theme';
import Reveal from './Reveal';
import { HandCoins, Hospital, Server, GraduationCap, Mail } from './CloudIcons';

const container: CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
// Kickers are 19px bold, as on every other ported page:
// bold >=18.66px is WCAG large text, so the hue kickers clear 3:1.
const eyebrow = (color: string, center = false): CSSProperties => ({ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color, textAlign: center ? 'center' : 'start' });
const h2: CSSProperties = { fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4vw,46px)', lineHeight: 1.18, margin: '12px 0 0' };

// Literal values from Partners.dc.html that theme.ts has no token for.
const PINK = '#B8336F';      // hero + "become a partner" kicker, funding chip
const PINK_BG = '#FCE7F1';
const SUBTLE = '#5F6B77';    // .pg-head count, .pp-sub
const CARD_EDGE = '#E6E9EC'; // .pp / .sp border
const CARD_RULE = '#EEF0F2'; // .pp-logo underline, sponsors divider

type LogoProps = { src: string; alt: string; style?: CSSProperties };
function Logo({ src, alt, style }: LogoProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', ...style }} />;
}

// ── Programs ─────────────────────────────────────────────────────────────────

type ProgramPartner = { id: string; key: string; name: string; logo: string; role: string };

// Role dot + label colour per partner card (.pp-role in the design).
const SHIFT_PARTNERS: ProgramPartner[] = [
  { id: 'eand', key: 'eand', name: 'e& Egypt Foundation', logo: '/partners/partner-eand-foundation.png', role: '#B83A2E' },
  { id: 'etisalat-business', key: 'etisalatBusiness', name: 'Etisalat Business', logo: '/partners/partner-etisalat-business.png', role: '#B83A2E' },
  { id: 'flat6labs', key: 'flat6labs', name: 'Flat6Labs', logo: '/partners/partner-flat6labs-h.png', role: '#01866F' },
  { id: 'unfpa', key: 'unfpa', name: 'UNFPA', logo: '/partners/partner-unfpa.png', role: PINK },
  { id: 'norway', key: 'norway', name: 'Royal Norwegian Embassy', logo: '/partners/partner-norway.png', role: C.violetDark },
];
const GROWTH_PARTNERS: ProgramPartner[] = [
  { id: 'odc', key: 'odc', name: 'Orange Digital Center', logo: '/partners/partner-odc.png', role: '#A04E00' },
  { id: 'career180', key: 'career180', name: 'Career180', logo: '/partners/partner-career180.png', role: C.blueDark },
];
const SHIFT_SPONSORS = [
  { name: 'Cisco', logo: '/partners/shift-sponsor-cisco.png' },
  { name: 'Fortinet', logo: '/partners/shift-sponsor-fortinet.png' },
  { name: 'Zoho', logo: '/partners/shift-sponsor-zoho.png' },
  { name: 'Salesforce', logo: '/partners/shift-sponsor-salesforce.png' },
  { name: 'HealthTag', logo: '/partners/shift-sponsor-healthtag.png' },
  { name: 'Erada Finance', logo: '/partners/shift-sponsor-erada.png' },
  { name: 'O7 Therapy', logo: '/partners/shift-sponsor-o7.png' },
];

const JUMPS = [
  { href: '#shift', label: 'The Shift', dot: '#D7141A' },
  { href: '#startup-growth', label: 'Startup Growth', dot: '#FF7900' },
];

const pgHead: CSSProperties = { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, margin: '0 2px 16px' };
const pgHeadTitle: CSSProperties = { fontFamily: FONT.cairo, fontWeight: 800, fontSize: 16, color: C.ink };
const pgHeadCount: CSSProperties = { fontSize: 13, color: SUBTLE };

function PartnerCard({ p, ns, delay }: { p: ProgramPartner; ns: 'shift' | 'growth'; delay: number }) {
  const t = useTranslations(`partners.${ns}.items.${p.key}`);
  return (
    <Reveal delay={delay} className="balsm-lift" style={{ display: 'flex', flexDirection: 'column', background: C.white, border: `1px solid ${CARD_EDGE}`, borderRadius: 18, overflow: 'hidden' }}>
      <div id={p.id} style={{ scrollMarginTop: 96, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ height: 96, padding: '16px 22px', background: C.bg, borderBottom: `1px solid ${CARD_RULE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
          <Logo src={p.logo} alt={p.name} />
        </div>
        <div style={{ padding: '14px 18px 18px', display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12, color: p.role }}>
            <span aria-hidden style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', flex: 'none' }} />
            {t('role')}
          </span>
          <h4 dir="ltr" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 16.5, color: C.ink, margin: '4px 0 0', textAlign: 'start', overflowWrap: 'anywhere' }}>{p.name}</h4>
          <div style={{ fontSize: 13.5, color: SUBTLE, overflowWrap: 'anywhere' }}>{t('sub')}</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.65, color: C.ink2, margin: '6px 0 0', overflowWrap: 'anywhere' }}>{t('desc')}</p>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * One program: a coloured side panel (logo, tag, title, org, blurb, topics) and
 * a main panel of partner cards. The design switches the two-column grid to one
 * column at 900px; inline styles have no media queries, so this is a wrapping
 * flex row instead: the side wants 340px, the main wants 520px and takes all
 * the growth, so they sit side by side above ~900px of container and stack
 * below it.
 */
function Program({ id, titleId, title, side, children }: { id: string; titleId: string; title: string; side: { bg: string; logo: ReactNode; tag: ReactNode; org: ReactNode; desc: string; meta: string[] }; children: ReactNode }) {
  return (
    <Reveal>
      <article id={id} aria-labelledby={titleId} style={{ display: 'flex', flexWrap: 'wrap', background: C.white, border: `1px solid ${C.border}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 1px 2px rgba(20,32,43,.04), 0 18px 40px rgba(20,32,43,.05)', scrollMarginTop: 96 }}>
        <div style={{ flex: '1 1 340px', position: 'relative', overflow: 'hidden', padding: 'clamp(24px,3vw,34px)', color: '#fff', display: 'flex', flexDirection: 'column', background: side.bg, boxSizing: 'border-box' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/balsm-logo-mono-white.svg" alt="" aria-hidden style={{ position: 'absolute', insetInlineEnd: -70, bottom: -70, width: 230, opacity: 0.08, pointerEvents: 'none' }} />
          {side.logo}
          {side.tag}
          <h3 id={titleId} dir="ltr" style={{ position: 'relative', fontFamily: FONT.display, fontWeight: 800, fontSize: 24, lineHeight: 1.25, margin: '0 0 6px', textAlign: 'start', color: '#fff' }}>{title}</h3>
          <div style={{ position: 'relative', fontSize: 14, color: 'rgba(255,255,255,.82)', marginBottom: 14 }}>{side.org}</div>
          <p style={{ position: 'relative', fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,.92)', margin: '0 0 20px' }}>{side.desc}</p>
          <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
            {side.meta.map((m) => (
              <span key={m} style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12.5, padding: '5px 11px', borderRadius: 999, background: 'rgba(255,255,255,.12)', color: '#fff' }}>{m}</span>
            ))}
          </div>
        </div>
        <div style={{ flex: '999 1 520px', padding: 'clamp(20px,2.6vw,30px)', minWidth: 0, boxSizing: 'border-box' }}>{children}</div>
      </article>
    </Reveal>
  );
}

const pgLogo: CSSProperties = { position: 'relative', width: '100%', maxWidth: 380, boxSizing: 'border-box', marginBottom: 24, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const pgTag: CSSProperties = { position: 'relative', alignSelf: 'flex-start', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12, padding: '4px 11px', borderRadius: 999, color: '#fff', background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.3)', marginBottom: 14 };
const partnerGrid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(220px,100%),1fr))', gap: 12 };

function ProgramsSection() {
  const t = useTranslations('partners');
  const step = MOTION.staggerStep;
  return (
    <section id="programs" style={{ padding: 'clamp(48px,7vw,88px) 0', background: C.bg }}>
      <div style={container}>
        <Reveal style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px 40px', marginBottom: 34 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={eyebrow(C.blueDark)}>{t('programs.eyebrow')}</div>
            <h2 style={{ ...h2, color: C.ink }}>{t('programs.title')}</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {JUMPS.map((j) => (
              <a key={j.href} href={j.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, boxSizing: 'border-box', padding: '9px 15px', borderRadius: 999, background: C.white, border: `1px solid ${C.border}`, fontFamily: FONT.display, fontWeight: 700, fontSize: 13.5, color: C.ink }}>
                <span aria-hidden style={{ width: 9, height: 9, borderRadius: '50%', flex: 'none', background: j.dot }} />
                <span dir="ltr">{j.label}</span>
              </a>
            ))}
          </div>
        </Reveal>

        {/* The Shift Innovation Challenge — e& egypt's red */}
        <Program
          id="shift"
          titleId="pg-shift-title"
          title="The Shift Innovation Challenge"
          side={{
            bg: 'linear-gradient(165deg,#7E0B0B 0%,#B3121A 55%,#D7141A 100%)',
            logo: (
              <div style={{ ...pgLogo, padding: '18px 22px', background: '#fff', boxShadow: '0 12px 26px rgba(0,0,0,.14)' }}>
                <Logo src="/partners/partner-the-shift.png" alt="The Shift Innovation Challenge — e& egypt" style={{ height: 'auto', aspectRatio: '600 / 388' }} />
              </div>
            ),
            tag: <span style={pgTag}>{t('shift.tag')}</span>,
            org: <>{t('shift.org')} <span dir="ltr">(e&amp; egypt)</span></>,
            desc: t('shift.desc'),
            meta: [t('shift.meta.digital'), t('shift.meta.women')],
          }}
        >
          <div style={pgHead}><b style={pgHeadTitle}>{t('programs.partnersTitle')}</b><span style={pgHeadCount}>{t('shift.partnersCount')}</span></div>
          <div style={partnerGrid}>
            {SHIFT_PARTNERS.map((p, i) => <PartnerCard key={p.id} p={p} ns="shift" delay={i * step} />)}
          </div>
          <div id="shift-sponsors" style={{ ...pgHead, marginTop: 26, paddingTop: 20, borderTop: `1px solid ${CARD_RULE}`, scrollMarginTop: 96 }}>
            <b style={pgHeadTitle}>{t('shift.sponsorsTitle')}</b><span style={pgHeadCount}>{t('shift.sponsorsCount')}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(150px,100%),1fr))', gap: 10 }}>
            {SHIFT_SPONSORS.map((s, i) => (
              <Reveal key={s.name} delay={i * step} className="balsm-lift" style={{ height: 78, boxSizing: 'border-box', padding: '14px 18px', background: C.white, border: `1px solid ${CARD_EDGE}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Logo src={s.logo} alt={s.name} />
              </Reveal>
            ))}
          </div>
        </Program>

        {/* Startup Growth Program — Orange's black + orange */}
        <div style={{ marginTop: 28 }}>
          <Program
            id="startup-growth"
            titleId="pg-sgp-title"
            title="Startup Growth Program"
            side={{
              bg: 'radial-gradient(120% 90% at 100% 0%,#3A3A3A 0%,#232323 60%,#1A1A1A 100%)',
              logo: (
                <div style={{ ...pgLogo, padding: '8px 10px', background: '#2A2A2A', border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 12px 26px rgba(0,0,0,.25)' }}>
                  <Logo src="/partners/program-startup-growth.png" alt="Startup Growth Program" style={{ height: 'auto', aspectRatio: '750 / 330' }} />
                </div>
              ),
              // Design: white 12px on #FF7900 (2.9:1). Ink on the same orange
              // keeps the chip and clears AA (6.6:1).
              tag: <span style={{ ...pgTag, background: '#FF7900', borderColor: '#FF7900', color: C.ink }}>{t('growth.tag')}</span>,
              org: <span dir="ltr" style={{ display: 'block', textAlign: 'start' }}>Orange Digital Center · Career180</span>,
              desc: t('growth.desc'),
              meta: [t('growth.meta.entrepreneurship'), t('growth.meta.tech')],
            }}
          >
            <div style={pgHead}><b style={pgHeadTitle}>{t('programs.partnersTitle')}</b><span style={pgHeadCount}>{t('growth.partnersCount')}</span></div>
            <div style={partnerGrid}>
              {GROWTH_PARTNERS.map((p, i) => <PartnerCard key={p.id} p={p} ns="growth" delay={i * step} />)}
            </div>
          </Program>
        </div>
      </div>
    </section>
  );
}

// ── Technology supporters ────────────────────────────────────────────────────

const TECH = [
  { key: 'aws', name: 'AWS', logo: '/sponsor-aws.svg', alt: 'AWS' },
  { key: 'claude', name: 'Claude', logo: '/sponsor-claude.svg', alt: 'Claude' },
  { key: 'github', name: 'GitHub', logo: '/sponsor-github.svg', alt: 'GitHub' },
  { key: 'sentry', name: 'Sentry', logo: '/sponsor-sentry.svg', alt: 'Sentry' },
  { key: 'mosalam', name: 'Mosalam', logo: '/sponsor-mosalam.svg', alt: 'Mosalam' },
  { key: 'kiro', name: 'Kiro', logo: '/sponsor-kiro.svg', alt: 'Kiro' },
  { key: 'googleCloud', name: 'Google for Startups Cloud', logo: '/sponsor-google-cloud.svg', alt: 'Google Cloud' },
  { key: 'posthog', name: 'PostHog', logo: '/sponsor-posthog.svg', alt: 'PostHog' },
  { key: 'cursor', name: 'Cursor', logo: '/sponsor-cursor.svg', alt: 'Cursor' },
  { key: 'manus', name: 'Manus', logo: '/sponsor-manus.svg', alt: 'Manus' },
  { key: 'impostarz', name: 'Impostarz', logo: '/sponsor-impostarz.svg', alt: 'Impostarz' },
];

function TechSection() {
  const t = useTranslations('partners.tech');
  return (
    <section style={{ padding: 'clamp(56px,8vw,100px) 0', background: C.dark }}>
      <div style={container}>
        <Reveal style={{ maxWidth: 720, marginBottom: 36 }}>
          <div style={eyebrow(C.mint)}>{t('eyebrow')}</div>
          <h2 style={{ ...h2, color: '#fff', margin: '12px 0 12px' }}>{t('title')}</h2>
          <p style={{ fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.8, color: 'rgba(255,255,255,.72)', margin: 0 }}>{t('desc')}</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(200px,100%),1fr))', gap: 14 }}>
          {TECH.map((s, i) => (
            <Reveal key={s.key} delay={i * MOTION.staggerStep} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 18, padding: 22, textAlign: 'center' }}>
              <div style={{ height: 48, margin: '0 auto 14px', background: '#fff', borderRadius: 10, padding: '8px 14px', boxSizing: 'border-box' }}>
                <Logo src={s.logo} alt={s.alt} />
              </div>
              <div dir="ltr" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 4 }}>{s.name}</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,.72)', margin: 0 }}>{t(`items.${s.key}`)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Become a partner ─────────────────────────────────────────────────────────

const WAYS = [
  { key: 'funding', Icon: HandCoins, bg: PINK_BG, color: PINK },
  { key: 'pilot', Icon: Hospital, bg: C.aquaBg, color: '#01866F' },
  { key: 'tech', Icon: Server, bg: C.blueBg, color: C.blueDark },
  { key: 'academic', Icon: GraduationCap, bg: C.violetBg, color: C.violetDark },
];

function BecomeSection() {
  const t = useTranslations('partners.become');
  return (
    <section id="partner" style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.white }}>
      <div style={container}>
        <Reveal style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 44px' }}>
          <div style={eyebrow(PINK, true)}>{t('eyebrow')}</div>
          <h2 style={{ ...h2, fontSize: 'clamp(30px,4.4vw,50px)', color: C.ink, margin: '12px 0 14px' }}>{t('title')}</h2>
          <p style={{ fontSize: 'clamp(16px,1.7vw,19px)', lineHeight: 1.8, color: C.ink2, margin: 0 }}>{t('desc')}</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 16, marginBottom: 40 }}>
          {WAYS.map((w, i) => (
            <Reveal key={w.key} delay={i * MOTION.staggerStep} style={{ borderRadius: 20, padding: 26, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: w.color, marginBottom: 16 }}>
                <w.Icon style={{ width: 22, height: 22 }} />
              </div>
              <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color: C.ink, margin: '0 0 6px' }}>{t(`cards.${w.key}.title`)}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: C.ink2, margin: 0 }}>{t(`cards.${w.key}.desc`)}</p>
            </Reveal>
          ))}
        </div>
        <Reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <a href="mailto:contact@balsm.health?subject=Partnership" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 30px', borderRadius: 999, background: C.ink, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17 }}>
            <Mail style={{ width: 19, height: 19 }} />{t('cta')}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PartnersSections() {
  const t = useTranslations('partners.hero');
  return (
    <>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(48px,8vw,96px) 0 clamp(40px,6vw,72px)', background: `linear-gradient(180deg,${PINK_BG} 0%,${C.bg} 100%)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', left: -100, top: -90, width: 330, opacity: 0.09, animation: 'balsm-spin 90s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 980, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
          <Reveal>
            <div style={eyebrow(PINK, true)}>{t('eyebrow')}</div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(34px,5.6vw,64px)', lineHeight: 1.15, color: C.ink, margin: '14px 0 18px' }}>{t('title')}</h1>
            <p style={{ fontSize: 'clamp(17px,1.9vw,21px)', lineHeight: 1.8, color: C.ink2, margin: '0 auto', maxWidth: 660 }}>{t('subtitle')}</p>
          </Reveal>
        </div>
      </section>

      <ProgramsSection />
      <TechSection />
      <BecomeSection />
    </>
  );
}
