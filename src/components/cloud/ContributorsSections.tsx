'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FONT } from './theme';
import Reveal from './Reveal';
import { Github, GitBranch, Users, MapPin, Tag, HeartHandshake, Copy } from './CloudIcons';

type Card = { title: string; desc: string };
type Stat = { value: string; label: string };
type Step = { num: string; title: string; desc: string };
type Issue = { text: string; tag: string; tag2: string };

const container: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
const eyebrow = (color: string): React.CSSProperties => ({ fontFamily: FONT.display, fontWeight: 700, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color, textAlign: 'start' });

const WHY_ICONS = [
  { Icon: GitBranch, bg: C.violetBg, color: C.violet },
  { Icon: Users, bg: C.greenBg, color: C.green },
  { Icon: MapPin, bg: C.blueBg, color: C.blue },
];

export default function ContributorsSections() {
  const t = useTranslations('contributors');
  const stats = t.raw('stats') as Stat[];
  const whyCards = t.raw('why.cards') as Card[];
  const steps = t.raw('how.steps') as Step[];
  const issues = t.raw('how.issues') as Issue[];
  const [copied, setCopied] = useState(false);

  const copyCmd = () => {
    try { navigator.clipboard?.writeText(t('hero.command')); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(44px,7vw,88px) 0 clamp(48px,7vw,92px)', background: 'linear-gradient(180deg,#ECE6FA 0%, #FAFAF7 100%)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', insetInlineStart: -100, top: -80, width: 320, opacity: 0.1, animation: 'balsm-spin 80s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', ...container }}>
          <Reveal style={{ maxWidth: 780 }}>
            <div dir="ltr" style={eyebrow('#5C3AB0')}>{t('hero.eyebrow')}</div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(34px,5.6vw,64px)', lineHeight: 1.12, color: C.ink, margin: '14px 0 18px' }}>
              {t('hero.title1')}<br />{t('hero.title2')}
            </h1>
            <p style={{ fontSize: 'clamp(17px,1.9vw,21px)', lineHeight: 1.75, color: C.ink2, margin: '0 0 28px', maxWidth: 620 }}>{t('hero.subtitle')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
              <a href="https://github.com/balsm-health" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 28px', borderRadius: 999, background: C.violet, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17, boxShadow: '0 12px 28px rgba(114,77,208,.28)' }}>
                <Github style={{ width: 20, height: 20 }} /><span dir="ltr">{t('hero.ctaStar')}</span>
              </a>
              <div style={{ display: 'flex', alignItems: 'stretch', maxWidth: '100%', background: C.ink, borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 14px rgba(43,43,37,.12)' }}>
                <code dir="ltr" style={{ display: 'flex', flex: '1 1 auto', minWidth: 0, overflowX: 'auto', whiteSpace: 'nowrap', alignItems: 'center', padding: '0 18px', fontFamily: FONT.mono, fontSize: 14.5, color: C.borderSoft }}>{t('hero.command')}</code>
                <button onClick={copyCmd} aria-label={t('hero.copy')} style={{ display: 'inline-flex', flex: 'none', alignItems: 'center', gap: 7, padding: '14px 18px', border: 'none', borderInlineStart: '1px solid rgba(255,255,255,.12)', background: '#3D3D34', color: '#fff', cursor: 'pointer', fontFamily: FONT.cairo, fontWeight: 600, fontSize: 14 }}>
                  <Copy style={{ width: 16, height: 16 }} /><span>{copied ? t('hero.copied') : t('hero.copy')}</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: C.white, borderTop: `1px solid ${C.borderHair}`, borderBottom: `1px solid ${C.borderHair}` }}>
        <div style={{ ...container, padding: 'clamp(28px,4vw,44px) clamp(20px,5vw,56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(170px,100%),1fr))', gap: 24, textAlign: 'center' }}>
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 50}>
              <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 'clamp(28px,4vw,42px)', color: [C.violet, C.blue, C.aqua, C.green][i] }}>{s.value}</div>
              <div style={{ fontSize: 14, color: C.ink2, marginTop: 4 }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg }}>
        <div style={container}>
          <Reveal style={{ maxWidth: 700, marginBottom: 46 }}>
            <div dir="ltr" style={eyebrow(C.violet)}>{t('why.eyebrow')}</div>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.2vw,50px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 0' }}>{t('why.title')}</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 20 }}>
            {whyCards.map((card, i) => {
              const s = WHY_ICONS[i];
              return (
                <Reveal key={i} delay={i * 70} className="balsm-lift" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 30, boxShadow: '0 2px 6px rgba(43,43,37,.05)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 18 }}>
                    <s.Icon style={{ width: 24, height: 24 }} />
                  </div>
                  <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 21, color: C.ink, margin: '0 0 8px' }}>{card.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{card.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}` }}>
        <div style={container}>
          <Reveal style={{ maxWidth: 700, marginBottom: 46 }}>
            <div dir="ltr" style={eyebrow(C.emerald)}>{t('how.eyebrow')}</div>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.2vw,50px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 0' }}>{t('how.title')}</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 20 }}>
            {steps.map((step, i) => (
              <Reveal key={i} delay={i * 60} className="balsm-lift" style={{ borderRadius: 20, padding: 28, background: C.bg, border: `1px solid ${C.border}` }}>
                <div dir="ltr" style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 15, color: C.violet, marginBottom: 14 }}>{step.num}</div>
                <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color: C.ink, margin: '0 0 7px' }}>{step.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{step.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal style={{ marginTop: 36, background: C.dark, borderRadius: 22, padding: 'clamp(24px,4vw,38px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Tag style={{ width: 20, height: 20, color: C.mint }} />
              <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 18, color: '#fff' }}>{t('how.issuesTitle')}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {issues.map((issue, i) => (
                <a key={i} href="https://github.com/balsm-health" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 14, padding: '15px 18px' }}>
                  <span style={{ fontSize: 15.5, color: '#fff' }}>{issue.text}</span>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span dir="ltr" style={{ fontFamily: FONT.mono, fontSize: 12, color: issue.tag === 'help wanted' ? C.aqua : C.mint, background: issue.tag === 'help wanted' ? 'rgba(2,187,181,.12)' : 'rgba(85,215,127,.12)', padding: '3px 9px', borderRadius: 999 }}>{issue.tag}</span>
                    <span dir="ltr" style={{ fontFamily: FONT.mono, fontSize: 12, color: C.muted }}>{issue.tag2}</span>
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
        <Reveal style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/balsm-logo.svg" alt="" aria-hidden style={{ width: 60, height: 60, margin: '0 auto 22px', display: 'block' }} />
          <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.6vw,52px)', lineHeight: 1.14, color: C.ink, margin: '0 0 14px' }}>{t('cta.title')}</h2>
          <p style={{ fontSize: 'clamp(16px,1.8vw,20px)', lineHeight: 1.8, color: C.ink2, margin: '0 auto 30px', maxWidth: 540 }}>{t('cta.desc')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <a href="https://github.com/balsm-health" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 30px', borderRadius: 999, background: C.violet, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17, boxShadow: '0 12px 28px rgba(114,77,208,.26)' }}>
              <Github style={{ width: 19, height: 19 }} />{t('cta.ctaGit')}
            </a>
            <Link href="/sponsor" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 28px', borderRadius: 999, background: C.white, color: C.ink, border: `1.5px solid ${C.borderSoft}`, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17 }}>
              <HeartHandshake style={{ width: 19, height: 19 }} />{t('cta.ctaDonate')}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
