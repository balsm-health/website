'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FONT } from './theme';
import Reveal from './Reveal';
import AnimatedLogo from './AnimatedLogo';
import {
  Github, GitBranch, Users, MapPin, Tag, HeartHandshake, Copy, Mail, HeartPulse, ArrowUpLeft,
  CodeXml, BrainCircuit, PenTool, Megaphone, Scale, Stethoscope, Kanban, Bug,
} from './CloudIcons';
import { GITHUB_ISSUES_URL, GITHUB_ORG_URL, type GithubIssue } from '@/lib/github';

type Card = { title: string; desc: string };
type Stat = { value: string; label: string };

/**
 * GitHub label colours are a solid hex meant for a light chip. On the dark
 * panel we use the colour for text and a translucent wash of it for the
 * background, which keeps each label recognisably itself while staying legible.
 */
function labelChip(hex: string): React.CSSProperties {
  const c = /^[0-9a-f]{6}$/i.test(hex) ? hex : 'ADACA0';
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16));
  // Lift very dark label colours toward the panel's foreground so they don't
  // disappear against it.
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const text = lum < 0.42 ? `rgb(${[r, g, b].map((v) => Math.round(v + (255 - v) * 0.55)).join(',')})` : `#${c}`;
  return {
    fontFamily: FONT.mono,
    fontSize: 12,
    color: text,
    background: `rgba(${r},${g},${b},.16)`,
    border: `1px solid rgba(${r},${g},${b},.28)`,
    padding: '3px 9px',
    borderRadius: 999,
    whiteSpace: 'nowrap',
  };
}

const container: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
const eyebrow = (color: string): React.CSSProperties => ({ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color, textAlign: 'start' });

// Eight roles, icons per Contributors.dc.html
const ROLE_ICONS = [
  { Icon: CodeXml, bg: C.blueBg, color: C.blue },
  { Icon: BrainCircuit, bg: C.aquaBg, color: C.aqua },
  { Icon: PenTool, bg: C.violetBg, color: C.violet },
  { Icon: Megaphone, bg: C.aquaBg, color: C.aqua },
  { Icon: Scale, bg: C.amberBg, color: C.amber },
  { Icon: Stethoscope, bg: C.greenBg, color: C.green },
  { Icon: Kanban, bg: C.blueBg, color: C.blueDark },
  { Icon: Bug, bg: C.violetBg, color: C.violetDark },
];
const WHY_ICONS = [
  { Icon: GitBranch, bg: C.violetBg, color: C.violet },
  { Icon: Users, bg: C.greenBg, color: C.green },
  { Icon: MapPin, bg: C.blueBg, color: C.blue },
];

export default function ContributorsSections({ issues = [] }: { issues?: GithubIssue[] }) {
  const t = useTranslations('contributors');
  const stats = t.raw('stats') as Stat[];
  const whyCards = t.raw('why.cards') as Card[];
  const roles = t.raw('roles.cards') as Card[];
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
        <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', left: -100, top: -80, width: 320, opacity: 0.1, animation: 'balsm-spin 80s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', ...container }}>
          <Reveal style={{ maxWidth: 780 }}>
            <div style={eyebrow('#5C3AB0')}>{t('hero.eyebrow')}</div>
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
              <a href="#roles" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 8px', color: C.ink2, fontFamily: FONT.cairo, fontWeight: 600, fontSize: 16 }}>
                {t('hero.ctaRoles')}<ArrowUpLeft style={{ width: 17, height: 17 }} />
              </a>
            </div>
            {/* "every contribution may one day reach someone you love" */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 26, padding: '14px 20px', background: C.violetBg, borderRadius: 14, maxWidth: 'fit-content' }}>
              <HeartPulse style={{ width: 22, height: 22, color: C.violet, flex: 'none' }} />
              <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16, color: '#4A2F94' }}>{t('hero.callout')}</span>
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
            <div style={eyebrow(C.violet)}>{t('why.eyebrow')}</div>
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

      {/* WAYS TO CONTRIBUTE */}
      <section id="roles" style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}` }}>
        <div style={container}>
          <Reveal style={{ maxWidth: 700, marginBottom: 46 }}>
            <div style={eyebrow(C.emerald)}>{t('roles.eyebrow')}</div>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.2vw,50px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 0' }}>{t('roles.title')}</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: 16, marginBottom: 32 }}>
            {roles.map((role, i) => {
              const s = ROLE_ICONS[i];
              return (
                <Reveal key={i} delay={i * 60} className="balsm-lift" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 26, boxShadow: '0 2px 6px rgba(43,43,37,.05)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 16 }}>
                    <s.Icon style={{ width: 22, height: 22 }} />
                  </div>
                  <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 18, color: C.ink, margin: '0 0 6px' }}>{role.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: C.ink2, margin: 0 }}>{role.desc}</p>
                </Reveal>
              );
            })}
          </div>

          {/* "these are only examples" note + contact */}
          <Reveal style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 22px', marginBottom: 44 }}>
            <span style={{ fontSize: 15, color: C.ink2 }}>{t('roles.note')}</span>
            <a href="mailto:contact@balsm.health" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 999, background: C.ink, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14.5, flex: 'none' }}>
              <Mail style={{ width: 16, height: 16 }} />{t('roles.cta')}
            </a>
          </Reveal>

          <Reveal style={{ maxWidth: 700, marginBottom: 24 }}>
            <div style={eyebrow(C.violet)}>{t('dev.eyebrow')}</div>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(24px,3.4vw,36px)', lineHeight: 1.2, color: C.ink, margin: '10px 0 0' }}>{t('dev.title')}</h2>
          </Reveal>

          <Reveal style={{ background: C.dark, borderRadius: 22, padding: 'clamp(24px,4vw,38px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Tag style={{ width: 20, height: 20, color: C.mint }} />
              <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 18, color: '#fff' }}>{t('dev.issuesTitle')}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {issues.length === 0 ? (
                // Every issue is either closed or in a private repo — say so
                // plainly rather than rendering an empty box.
                <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 14, padding: '20px 18px', fontSize: 15, color: 'rgba(255,255,255,.72)', lineHeight: 1.7 }}>
                  {t('dev.issuesEmpty')}
                </div>
              ) : (
                issues.map((issue) => (
                  <a key={issue.id} href={issue.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 14, padding: '15px 18px' }}>
                    {/* Issue titles are written in English in the repos, so this
                        stays LTR even on the Arabic page. */}
                    <span dir="ltr" style={{ fontSize: 15.5, color: '#fff', textAlign: 'left', flex: '1 1 260px', minWidth: 0 }}>{issue.title}</span>
                    <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      {issue.labels.slice(0, 2).map((label) => (
                        <span key={label.name} dir="ltr" style={labelChip(label.color)}>{label.name}</span>
                      ))}
                      <span dir="ltr" style={{ fontFamily: FONT.mono, fontSize: 12, color: C.muted }}>{issue.repo}#{issue.number}</span>
                    </span>
                  </a>
                ))
              )}
            </div>

            <a href={issues.length === 0 ? GITHUB_ORG_URL : GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14.5, color: C.mint }}>
              <Github style={{ width: 16, height: 16 }} />
              {issues.length === 0 ? t('dev.issuesBrowse') : t('dev.issuesAll')}
            </a>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
        <Reveal style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, margin: '0 auto 22px' }}>
            <AnimatedLogo size={60} idle="breathe" />
          </div>
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
