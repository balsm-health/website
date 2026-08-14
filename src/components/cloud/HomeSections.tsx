'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, DISPLAY, FILL, FONT, ON, TEXT } from './theme';
import { useInView } from './useReveal';
import Reveal from './Reveal';
import CountUp from './CountUp';
import { captureError } from '@/lib/observability';
import {
  ArrowRight, Smartphone, ArrowUpLeft, FileX, Lock, CloudOff, Pill, HeartPulse, Network,
  Apple, Play, AppGallery, User, Home as HomeIcon, Bell, PlusCircle, Plus, Flame, Activity, Droplet,
  GitBranch, ShieldCheck, Users, Languages, WifiOff, Gem, UserRound, Building2, CodeXml,
  HeartHandshake, Check, AlertCircle, Bug, Unplug, LifeBuoy,
} from './CloudIcons';

type Card = { title: string; desc: string };
type Product = { badge: string; title: string; desc: string; tags: string[] };
type Stat = { value: string; label: string };
type PathCard = { title: string; desc: string; cta: string };

// Kickers are 19px bold, not 13px. Bold at >=18.66px is WCAG "large text",
// where the contrast bar drops from 4.5:1 to 3:1 — which is enough for the
// blue, violet and danger petals to be compliant at full strength. The rest
// remain part of the documented palette exception. Don't shrink these.
const eyebrow = (color: string): React.CSSProperties => ({
  fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color, textAlign: 'start',
});
const h2 = (color = C.ink): React.CSSProperties => ({
  fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(30px,4.4vw,52px)', lineHeight: 1.15, color, margin: '12px 0 14px',
});
const container: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };

// Six failure modes, icons per Home.dc.html (file-x, lock, cloud-off, bug, unplug, life-buoy).
const PROBLEM_ICONS = [
  { Icon: FileX, bg: '#FBEBE7', color: C.danger },
  { Icon: Lock, bg: C.amberBg, color: C.amber },
  { Icon: CloudOff, bg: C.violetBg, color: C.violet },
  { Icon: Bug, bg: '#FBEBE7', color: C.danger },
  { Icon: Unplug, bg: C.amberBg, color: C.amber },
  { Icon: LifeBuoy, bg: C.violetBg, color: C.violet },
];
// One entry per product card, index-aligned with the `how.products` messages.
// `badgeInk` is the badge's label colour; it resolves to white, matching the
// design — the ON group exists so it can be darkened without touching call sites.
const PRODUCT_STYLES = [
  { Icon: HeartPulse, grad: 'linear-gradient(160deg,#E4F0FF,#fff)', border: '#CFE3FF', chipBorder: '#CFE3FF', chipText: '#0F6BCC', dot: C.blue, badgeFilled: true, badgeInk: ON.blue },
  { Icon: Building2, grad: 'linear-gradient(160deg,#E2F8F6,#fff)', border: '#CDEFEC', chipBorder: '#CDEFEC', chipText: '#019A7F', dot: C.aqua, badgeFilled: false, badgeInk: ON.aqua },
  { Icon: Network, grad: 'linear-gradient(160deg,#ECE6FA,#fff)', border: '#DDD2F4', chipBorder: '#DDD2F4', chipText: '#5C3AB0', dot: C.violet, badgeFilled: false, badgeInk: ON.violet },
];
const STORES = [
  { Icon: Apple, key: 'appStore', size: 24 },
  { Icon: Play, key: 'play', size: 22 },
  { Icon: AppGallery, key: 'appGallery', size: 22 },
] as const;
const VALUE_ICONS = [GitBranch, ShieldCheck, Users, Languages, WifiOff, Gem];
const VALUE_COLORS = [C.mint, C.aqua, C.blue, C.violet, C.mint, C.aqua];
// Four paths — the design dropped the investor card from Home (it lives in the
// Cloud page's investor section instead).
// `color` paints the icon inside the tinted chip; `text` paints the card's CTA
// line. They were one field, which is why a 14px CTA was being drawn in a fill
// colour — 2.2:1 for the amber card. Same hue in both roles, different weight.
const PATH_STYLES = [
  { Icon: UserRound, bg: C.blueBg, color: C.blue, text: TEXT.blue, href: '/#app' },
  { Icon: Building2, bg: C.aquaBg, color: C.aqua, text: TEXT.aqua, href: '/providers' },
  { Icon: CodeXml, bg: C.violetBg, color: C.violet, text: TEXT.violet, href: '/contributors' },
  { Icon: HeartHandshake, bg: C.amberBg, color: C.amber, text: TEXT.amber, href: '/sponsor' },
];

export default function HomeSections() {
  const t = useTranslations('home');
  const locale = useLocale();
  const stats = t.raw('stats') as Stat[];
  const problemCards = t.raw('problem.cards') as Card[];
  const products = t.raw('how.products') as Product[];
  const bullets = t.raw('app.bullets') as string[];
  const valueWords = t.raw('values.words') as string[];
  const valueCards = t.raw('values.cards') as Card[];
  const pathCards = t.raw('paths.cards') as PathCard[];

  const { ref: statsRef, inView: statsInView } = useInView(0.2);
  const arrowFlip = locale === 'ar' ? 'rotate(180deg)' : 'none';

  return (
    <>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(48px,8vw,96px) 0 clamp(56px,8vw,104px)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/balsm-background.png" alt="" aria-hidden style={{ position: 'absolute', inset: '0 auto 0 0', width: '62%', height: '100%', objectFit: 'cover', opacity: 0.9, transform: 'scaleX(-1)', pointerEvents: 'none' }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', insetInlineStart: -90, bottom: -110, width: 340, opacity: 0.1, animation: 'balsm-spin 80s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 980, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
          <Reveal style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 16px', borderRadius: 999, background: C.white, border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(20, 32, 43,.05)', marginBottom: 26 }}>
            <span style={{ display: 'inline-flex', gap: 4 }}>
              {[C.aqua, C.emerald, C.blue, C.mint, C.violet].map((c) => (
                <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
              ))}
            </span>
            <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14, color: C.ink2 }}>{t('hero.badge')}</span>
          </Reveal>
          <Reveal delay={60}>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(40px,7.2vw,84px)', lineHeight: 1.08, letterSpacing: '-.01em', color: C.ink, margin: 0 }}>
              {t('hero.title1')}<br />
              <span style={{ color: C.blue }}>{t('hero.title2')}</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontFamily: FONT.arabic, fontSize: 'clamp(17px,2.1vw,22px)', lineHeight: 1.7, color: C.ink2, maxWidth: 680, margin: '24px auto 0' }}>{t('hero.subtitle')}</p>
          </Reveal>
          <Reveal delay={160}>
            {/* No dir override: the tagline is prose in the page's own language now
                ("من مصر، إلى كل العالم العربي."), so forcing LTR would strand the
                full stop on the wrong side under RTL. */}
            <p style={{ fontFamily: FONT.arabic, fontWeight: 500, fontSize: 14, letterSpacing: '.02em', color: C.muted, margin: '14px 0 0' }}>{t('hero.tagline')}</p>
          </Reveal>
          <Reveal delay={220} style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginTop: 38 }}>
            <Link href="/cloud" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 30px', borderRadius: 999, background: FILL.blue, color: C.white, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17, boxShadow: '0 12px 28px rgba(18,131,255,.26)' }}>
              {t('hero.ctaJoin')}<ArrowRight style={{ width: 19, height: 19, transform: arrowFlip }} />
            </Link>
            <a href="#app" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 28px', borderRadius: 999, background: C.white, color: C.ink, border: `1.5px solid ${C.borderSoft}`, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17 }}>
              <Smartphone style={{ width: 19, height: 19 }} />{t('hero.ctaApp')}
            </a>
            <Link href="/contributors" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 8px', color: C.ink2, fontFamily: FONT.cairo, fontWeight: 600, fontSize: 16 }}>
              {t('hero.ctaCode')}<ArrowUpLeft style={{ width: 17, height: 17 }} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ borderTop: `1px solid ${C.borderHair}`, borderBottom: `1px solid ${C.borderHair}`, background: C.white }}>
        <div ref={statsRef} style={{ ...container, padding: 'clamp(28px,4vw,44px) clamp(20px,5vw,56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(170px,100%),1fr))', gap: 24, textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={i}>
              {/* DISPLAY is the role for large type; it resolves to the petals.
                  See the contrast exception in theme.ts before changing these. */}
              <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 'clamp(30px,4vw,44px)', color: [DISPLAY.blue, DISPLAY.aqua, DISPLAY.mint, DISPLAY.violet][i] }}>
                <CountUp value={s.value} inView={statsInView} />
              </div>
              <div style={{ fontSize: 14, color: C.ink2, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg }}>
        <div style={container}>
          <Reveal style={{ maxWidth: 720, marginBottom: 48 }}>
            <div style={eyebrow(DISPLAY.danger)}>{t('problem.eyebrow')}</div>
            <h2 style={h2()}>{t('problem.title')}</h2>
            <p style={{ fontFamily: FONT.arabic, fontSize: 'clamp(16px,1.7vw,19px)', lineHeight: 1.85, color: C.ink2, margin: 0 }}>{t('problem.desc')}</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 20 }}>
            {problemCards.map((card, i) => {
              const s = PROBLEM_ICONS[i];
              return (
                <Reveal key={i} delay={i * 70} className="balsm-lift" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 30, boxShadow: '0 2px 6px rgba(20, 32, 43,.05)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 18 }}>
                    <s.Icon style={{ width: 24, height: 24 }} />
                  </div>
                  <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 21, color: C.ink, margin: '0 0 8px' }}>{card.title}</h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{card.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW — the three products */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}` }}>
        <div style={container}>
          <Reveal style={{ maxWidth: 720, marginBottom: 48 }}>
            <div style={eyebrow(DISPLAY.emerald)}>{t('how.eyebrow')}</div>
            <h2 style={h2()}>{t('how.title')}</h2>
            <p style={{ fontFamily: FONT.arabic, fontSize: 'clamp(16px,1.7vw,19px)', lineHeight: 1.85, color: C.ink2, margin: 0 }}>{t('how.desc')}</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(290px,100%),1fr))', gap: 22 }}>
            {products.map((pr, i) => {
              const s = PRODUCT_STYLES[i];
              return (
                <Reveal key={i} delay={i * 80} className="balsm-lift" style={{ borderRadius: 22, padding: 32, background: s.grad, border: `1px solid ${s.border}` }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <span
                      style={{
                        fontFamily: FONT.cairo,
                        fontWeight: 700,
                        fontSize: 11.5,
                        padding: '3px 10px',
                        borderRadius: 999,
                        ...(s.badgeFilled
                          ? { background: s.dot, color: s.badgeInk }
                          : { background: '#fff', border: `1px solid ${s.chipBorder}`, color: s.chipText }),
                      }}
                    >
                      {pr.badge}
                    </span>
                  </div>
                  <div style={{ width: 52, height: 52, borderRadius: 15, background: s.dot, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 18, boxShadow: `0 8px 20px ${s.dot}4d` }}>
                    <s.Icon style={{ width: 26, height: 26 }} />
                  </div>
                  <h3 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 24, color: C.ink, margin: '0 0 8px' }}>{pr.title}</h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.75, color: C.ink2, margin: '0 0 16px' }}>{pr.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {pr.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: 12.5, padding: '5px 11px', borderRadius: 999, background: '#fff', border: `1px solid ${s.chipBorder}`, color: s.chipText }}>{tag}</span>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* APP SECTION */}
      <section id="app" style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
        <div style={{ ...container, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'clamp(36px,6vw,80px)' }}>
          <Reveal style={{ flex: '1 1 380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={eyebrow(DISPLAY.blue)}>{t('app.eyebrow')}</div>
              <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 11.5, padding: '3px 10px', borderRadius: 999, background: FILL.blue, color: '#fff' }}>{t('app.badge')}</span>
            </div>
            <h2 style={{ ...h2(), fontSize: 'clamp(28px,4vw,46px)', margin: '12px 0 16px' }}>{t('app.title')}</h2>
            <p style={{ fontSize: 'clamp(16px,1.7vw,19px)', lineHeight: 1.85, color: C.ink2, margin: '0 0 24px' }}>{t('app.desc')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 30 }}>
              {bullets.map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 9, background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, flex: 'none' }}>
                    <Check style={{ width: 18, height: 18 }} />
                  </span>
                  <span style={{ fontSize: 16, color: '#1F2D3D' }}>{b}</span>
                </div>
              ))}
            </div>
            {/* Three store badges, per the design — none of them link out yet,
                so they all point at the waitlist. */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {STORES.map(({ Icon, key, size }) => (
                <a
                  key={key}
                  href="#join"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 11, padding: '12px 20px', borderRadius: 14, background: C.ink, color: '#fff' }}
                >
                  <Icon style={{ width: size, height: size }} />
                  <span style={{ textAlign: 'start', lineHeight: 1.1 }}>
                    <span style={{ display: 'block', fontSize: 10, opacity: 0.7, fontFamily: FONT.cairo }}>{t('app.storeSoon')}</span>
                    <span dir="ltr" style={{ display: 'block', fontSize: 17, fontWeight: 600, fontFamily: FONT.display, textAlign: 'start' }}>{t(`app.${key}`)}</span>
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Phone mockup — patient tracking dashboard */}
          <Reveal style={{ flex: '0 0 auto', margin: '0 auto', maxWidth: '100%' }}>
            <div style={{ width: 'min(280px,74vw)', aspectRatio: '280 / 560', borderRadius: 42, background: C.ink, padding: 11, boxShadow: '0 30px 70px rgba(20, 32, 43,.22)', boxSizing: 'border-box', animation: 'balsm-float 6s ease-in-out infinite' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: 32, background: C.bg, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {/* header */}
                <div style={{ background: '#fff', padding: '16px 16px 12px', borderBottom: '1px solid #EEEEE6', display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
                  <span style={{ width: 36, height: 36, borderRadius: '50%', background: C.aqua, color: ON.aqua, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, flex: 'none' }}>{t('app.phone.initials')}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: C.muted }}>{t('app.phone.greeting')}</div>
                    <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16, color: C.ink }}>{t('app.phone.name')}</div>
                  </div>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#F4F3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink2, flex: 'none' }}>
                    <Bell style={{ width: 15, height: 15 }} />
                  </span>
                </div>
                {/* body */}
                <div style={{ padding: 12, overflow: 'hidden', flex: 1 }}>
                  <div style={{ background: 'linear-gradient(135deg,#1283FF,#0F6BCC)', borderRadius: 16, padding: 14, color: '#fff', marginBottom: 10 }}>
                    <div style={{ fontSize: 10.5, opacity: 0.85, marginBottom: 4 }}>{t('app.phone.followTitle')}</div>
                    <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{t('app.phone.followQ')}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.18)', padding: '7px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                      <PlusCircle style={{ width: 14, height: 14 }} />{t('app.phone.followCta')}
                    </div>
                  </div>
                  <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '11px 13px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 34, height: 34, borderRadius: '50%', background: C.amberBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.amber, flex: 'none' }}>
                      <Flame style={{ width: 17, height: 17 }} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.ink }}>{t('app.phone.streakNum')} <span style={{ fontWeight: 500 }}>{t('app.phone.streakUnit')}</span></div>
                      <div style={{ fontSize: 10.5, color: C.muted, marginTop: 1 }}>{t('app.phone.streakSub')}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 9.5, letterSpacing: '.08em', color: C.muted, marginBottom: 6 }}>{t('app.phone.measures')}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: C.muted, marginBottom: 4 }}><Activity style={{ width: 12, height: 12, color: C.violet }} />{t('app.phone.bpLabel')}</div>
                      <div dir="ltr" style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{t('app.phone.bpVal')}</div>
                    </div>
                    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: C.muted, marginBottom: 4 }}><Droplet style={{ width: 12, height: 12, color: C.aqua }} />{t('app.phone.sugarLabel')}</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{t('app.phone.sugarVal')}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 9.5, letterSpacing: '.08em', color: C.muted, marginBottom: 6 }}>{t('app.phone.medsTitle')}</div>
                  <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '2px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 0', borderBottom: '1px solid #EEEEE6' }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: C.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blue, flex: 'none' }}><Pill style={{ width: 14, height: 14 }} /></span>
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 12.5, color: C.ink }}>{t('app.phone.med1')}</div><div style={{ fontSize: 10, color: C.muted }}>{t('app.phone.med1dose')}</div></div>
                      <Check style={{ width: 14, height: 14, color: C.green }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 0' }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: C.violetBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.violet, flex: 'none' }}><HeartPulse style={{ width: 14, height: 14 }} /></span>
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 12.5, color: C.ink }}>{t('app.phone.med2')}</div><div style={{ fontSize: 10, color: C.muted }}>{t('app.phone.med2dose')}</div></div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.ink, background: C.ltTagBg, padding: '5px 10px', borderRadius: 999, flex: 'none' }}>{t('app.phone.taken')}</span>
                    </div>
                  </div>
                </div>
                {/* bottom nav — raised center "+" FAB between activity and pill */}
                <div style={{ background: '#fff', borderTop: '1px solid #EEEEE6', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none', position: 'relative' }}>
                  <HomeIcon style={{ width: 19, height: 19, color: C.blue }} />
                  <Activity style={{ width: 19, height: 19, color: C.grayDot }} />
                  <span style={{ width: 38, height: 38, borderRadius: '50%', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginTop: -22, boxShadow: '0 6px 14px rgba(18,131,255,.35)', flex: 'none' }}>
                    <Plus style={{ width: 18, height: 18 }} />
                  </span>
                  <Pill style={{ width: 19, height: 19, color: C.grayDot }} />
                  <User style={{ width: 19, height: 19, color: C.grayDot }} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALUES BAND */}
      <section style={{ padding: 'clamp(60px,9vw,112px) 0', background: C.dark }}>
        <div style={container}>
          <Reveal style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ ...eyebrow('rgba(255,255,255,.6)'), textAlign: 'center' }}>{t('values.eyebrow')}</div>
            <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(40px,7vw,80px)', lineHeight: 1.1, color: '#fff', marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: '18px 32px', justifyContent: 'center' }}>
              <span style={{ color: C.mint }}>{valueWords[0]}</span>
              <span style={{ color: C.aqua }}>{valueWords[1]}</span>
              <span style={{ color: C.blue }}>{valueWords[2]}</span>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(250px,100%),1fr))', gap: 14 }}>
            {valueCards.map((card, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <Reveal key={i} delay={i * 60} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 18, padding: 24 }}>
                  <Icon style={{ width: 24, height: 24, color: VALUE_COLORS[i] }} />
                  <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color: '#fff', margin: '14px 0 6px' }}>{card.title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'rgba(255,255,255,.66)', margin: 0 }}>{card.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PATHS */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.white }}>
        <div style={container}>
          <Reveal style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 48px' }}>
            <div style={{ ...eyebrow(DISPLAY.emerald), textAlign: 'center' }}>{t('paths.eyebrow')}</div>
            <h2 style={{ ...h2(), margin: '12px 0 0' }}>{t('paths.title')}</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: 18 }}>
            {pathCards.map((card, i) => {
              const s = PATH_STYLES[i];
              return (
                <Reveal key={i} delay={i * 60}>
                  <Link href={s.href} className="balsm-lift" style={{ display: 'block', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 20, padding: 26, height: '100%' }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 16 }}>
                      <s.Icon style={{ width: 23, height: 23 }} />
                    </div>
                    <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 20, color: C.ink, margin: '0 0 6px' }}>{card.title}</h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.ink2, margin: '0 0 14px' }}>{card.desc}</p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT.cairo, fontWeight: 600, fontSize: 14, color: s.text }}>
                      {card.cta}<ArrowUpLeft style={{ width: 15, height: 15 }} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* JOIN */}
      <HomeJoin />
    </>
  );
}

function HomeJoin() {
  const t = useTranslations('home.join');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setStatus('error');
      setError(t('errorInvalid'));
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: v, message: message.trim() || undefined, locale, source: 'home' }),
      });
      const data = await res.json().catch(() => ({}));
      // A duplicate means they're already on the list, so it's a success from
      // the reader's point of view — not a red error telling them off.
      if (!res.ok && data.code !== 'duplicate') {
        setStatus('error');
        setError(t('errorGeneric'));
        captureError(new Error(`waitlist failed: ${res.status}`), { source: 'home', status: res.status });
        return;
      }
      setStatus('success');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setError(t('errorGeneric'));
      captureError(err, { source: 'home', phase: 'network' });
    }
  };

  return (
    <section id="join" style={{ padding: 'clamp(60px,9vw,112px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
        <Reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/balsm-logo.svg" alt="" aria-hidden style={{ width: 64, height: 64, margin: '0 auto 22px', display: 'block', animation: 'balsm-float 6s ease-in-out infinite' }} />
          <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(30px,4.6vw,54px)', lineHeight: 1.12, color: C.ink, margin: '0 0 14px' }}>{t('title')}</h2>
          <p style={{ fontFamily: FONT.arabic, fontSize: 'clamp(16px,1.8vw,20px)', lineHeight: 1.8, color: C.ink2, margin: '0 auto 32px', maxWidth: 540 }}>{t('desc')}</p>
        </Reveal>

        {status === 'success' ? (
          <div style={{ background: C.white, border: '1px solid #CDEFEC', borderRadius: 20, padding: 34, boxShadow: '0 8px 24px rgba(20, 32, 43,.06)', maxWidth: 520, margin: '0 auto' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, margin: '0 auto 16px' }}>
              <Check style={{ width: 30, height: 30 }} strokeWidth={2.5} />
            </div>
            <h3 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 24, color: C.ink, margin: '0 0 8px' }}>{t('successTitle')}</h3>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{t('successDesc')}</p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ maxWidth: 520, margin: '0 auto' }} noValidate>
            {/* Stacked full-width, button last — matches the Cloud waitlist.
                The email+button row is gone. */}
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setError(''); } }}
              type="email"
              dir="ltr"
              placeholder={t('placeholder')}
              disabled={status === 'loading'}
              aria-label={t('placeholder')}
              style={{ width: '100%', marginBottom: 10, padding: '15px 18px', borderRadius: 14, border: `1.5px solid ${C.borderSoft}`, background: C.white, fontFamily: FONT.body, fontSize: 16, color: C.ink, textAlign: 'left', outline: 'none', boxSizing: 'border-box' }}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder={t('messagePlaceholder')}
              disabled={status === 'loading'}
              aria-label={t('messagePlaceholder')}
              style={{ width: '100%', marginBottom: 10, padding: '15px 18px', borderRadius: 14, border: `1.5px solid ${C.borderSoft}`, background: C.white, fontFamily: FONT.arabic, fontSize: 15, color: C.ink, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
            />
            <button type="submit" disabled={status === 'loading'} style={{ width: '100%', padding: '15px 28px', borderRadius: 14, border: 'none', background: FILL.blue, color: C.white, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16, cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, boxShadow: '0 10px 24px rgba(18,131,255,.24)' }}>
              {t('button')}
            </button>
            {status === 'error' && error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', marginTop: 14, color: C.danger, fontSize: 14 }}>
                <AlertCircle style={{ width: 16, height: 16 }} /><span>{error}</span>
              </div>
            )}
            <p style={{ fontSize: 13, color: C.muted, margin: '16px 0 0' }}>{t('privacy')}</p>
          </form>
        )}
      </div>
    </section>
  );
}
