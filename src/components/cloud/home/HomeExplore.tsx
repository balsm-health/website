'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FONT } from '../theme';
import Reveal from '../Reveal';
import {
  Building2, CodeXml, Gem, GitBranch, HandCoins, HandHelping, Handshake, Landmark, Languages,
  LayoutGrid, Mail, Network, ShieldCheck, Stethoscope, Users, Wrench,
} from '../CloudIcons';
import { anchored, container, eyebrow, Forward, h2, h3, lead, sectionPad, V2 } from './shared';

type Card = { title: string; desc: string };
type LinkCard = Card & { cta: string };

const EXPLORE = [
  { Icon: LayoutGrid, href: '/products', wash: C.blueBg, border: V2.blueBorder, fill: C.blue, text: C.blueDark },
  { Icon: Network, href: '/ecosystem', wash: C.aquaBg, border: C.aquaBorder, fill: V2.emeraldIcon, text: V2.emeraldText },
  { Icon: Handshake, href: '/partners', wash: V2.pinkBg, border: V2.pinkBorder, fill: V2.pink, text: V2.pinkText },
  { Icon: Users, href: '/contributors', wash: C.violetBg, border: V2.violetBorder, fill: C.violet, text: C.violetDark },
];
const VALUES = [
  { Icon: GitBranch, color: C.mint },
  { Icon: ShieldCheck, color: C.emerald },
  { Icon: Languages, color: V2.violetLight },
  { Icon: Gem, color: V2.blueLight },
];
const VALUE_WORD_COLORS = [C.mint, C.emerald, V2.blueLight];
const WHO = [
  { Icon: Landmark, href: '/partners#partner', bg: C.blueBg, color: C.blueDark },
  { Icon: HandCoins, href: '/partners#partner', bg: V2.pinkBg, color: V2.pinkText },
  { Icon: Building2, href: '/providers', bg: C.aquaBg, color: V2.emeraldText },
  { Icon: Wrench, href: '/partners#partner', bg: C.greenBg, color: V2.greenText },
  { Icon: CodeXml, href: '/contributors', bg: C.violetBg, color: C.violetDark },
  { Icon: Stethoscope, href: '/contributors', bg: C.amberBg, color: V2.amberText },
];

const ctaLine = (fontSize: number, color: string) =>
  ({ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT.cairo, fontWeight: 700, fontSize, color }) as const;

export function HomeExploreCards() {
  const t = useTranslations('home.explore');
  const cards = t.raw('cards') as LinkCard[];
  return (
    <section style={{ padding: sectionPad, background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
      <div style={container}>
        <Reveal style={{ maxWidth: 640, marginBottom: 40 }}>
          <div style={eyebrow(C.blueDark)}>{t('eyebrow')}</div>
          <h2 style={{ ...h2, margin: '12px 0 0' }}>{t('title')}</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(270px,100%),1fr))', gap: 18 }}>
          {cards.map((card, i) => {
            const s = EXPLORE[i];
            return (
              <Reveal key={s.href} delay={i * 80}>
                <Link href={s.href} className="balsm-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 250, borderRadius: 22, padding: 30, background: `linear-gradient(160deg,${s.wash},#fff 70%)`, border: `1px solid ${s.border}` }}>
                  <div style={{ width: 52, height: 52, borderRadius: 15, background: s.fill, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, marginBottom: 20 }}>
                    <s.Icon style={{ width: 25, height: 25 }} />
                  </div>
                  <h3 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 23, color: C.ink, margin: '0 0 8px' }}>{card.title}</h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.7, color: C.ink2, margin: '0 0 18px', flex: 1 }}>{card.desc}</p>
                  <span style={ctaLine(15, s.text)}>{card.cta}<Forward size={16} /></span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeValues() {
  const t = useTranslations('home.values');
  const words = t.raw('words') as string[];
  const cards = t.raw('cards') as Card[];
  return (
    <section id="values" style={{ ...anchored, padding: sectionPad, background: C.dark }}>
      <div style={container}>
        <Reveal style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ ...eyebrow('rgba(255,255,255,.7)'), textAlign: 'center' }}>{t('eyebrow')}</div>
          <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(40px,7vw,80px)', lineHeight: 1.1, color: C.white, marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: '14px 32px', justifyContent: 'center' }}>
            {words.map((w, i) => <span key={i} style={{ color: VALUE_WORD_COLORS[i] }}>{w}</span>)}
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 14 }}>
          {cards.map((card, i) => {
            const { Icon, color } = VALUES[i];
            return (
              <Reveal key={i} delay={i * 80} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 18, padding: 24 }}>
                <Icon style={{ width: 24, height: 24, color }} />
                <h3 style={{ ...h3(19, '14px 0 6px'), color: C.white }}>{card.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'rgba(255,255,255,.72)', margin: 0 }}>{card.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeWho() {
  const t = useTranslations('home.who');
  const cards = t.raw('cards') as LinkCard[];
  return (
    <section id="who" style={{ ...anchored, padding: sectionPad, background: C.white }}>
      <div style={container}>
        <Reveal style={{ display: 'flex', flexWrap: 'wrap', gap: '16px clamp(32px,6vw,88px)', alignItems: 'flex-end', marginBottom: 44 }}>
          <div style={{ flex: '1 1 340px', minWidth: 0 }}>
            <div style={eyebrow(V2.emeraldText)}>{t('eyebrow')}</div>
            <h2 style={{ ...h2, margin: '12px 0 0' }}>{t('title')}</h2>
          </div>
          <p style={{ ...lead, flex: '1.4 1 480px', minWidth: 0 }}>{t('desc')}</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 16 }}>
          {cards.map((card, i) => {
            const s = WHO[i];
            return (
              <Reveal key={i} delay={i * 80}>
                <Link href={s.href} className="balsm-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 20, padding: 26 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 18 }}>
                    <s.Icon style={{ width: 22, height: 22 }} />
                  </div>
                  <h3 style={h3(20, '0 0 6px')}>{card.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: '0 0 18px', flex: 1 }}>{card.desc}</p>
                  <span style={ctaLine(14.5, s.color)}>{card.cta}<Forward size={15} /></span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const onBlue = { display: 'inline-flex', alignItems: 'center', gap: 9, padding: '15px 28px', borderRadius: 999, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16.5 } as const;
const onBlueGhost = { ...onBlue, background: 'rgba(255,255,255,.14)', border: '1.5px solid rgba(255,255,255,.4)', color: C.white } as const;

export function HomeClosing() {
  const t = useTranslations('home.cta');
  return (
    <section style={{ padding: sectionPad, background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }}>
        <Reveal style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: 'clamp(36px,6vw,64px)', background: `linear-gradient(135deg,${C.blueDark} 0%,${C.blue} 45%,${C.violet} 100%)`, color: C.white, textAlign: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/balsm-logo-mono-white.svg" alt="" aria-hidden style={{ position: 'absolute', right: -70, top: -70, width: 260, opacity: 0.12, pointerEvents: 'none' }} />
          <h2 style={{ position: 'relative', fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,48px)', lineHeight: 1.2, margin: '0 0 14px' }}>{t('title')}</h2>
          <p style={{ position: 'relative', fontSize: 'clamp(16px,1.8vw,19px)', lineHeight: 1.8, color: 'rgba(255,255,255,.9)', margin: '0 auto 30px', maxWidth: 620 }}>{t('desc')}</p>
          <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link href="/partners#partner" style={{ ...onBlue, background: C.white, color: C.ink }}>
              <Handshake style={{ width: 19, height: 19 }} />{t('partner')}
            </Link>
            <Link href="/partners#partner" style={onBlueGhost}>
              <HandHelping style={{ width: 19, height: 19 }} />{t('support')}
            </Link>
            <a href="mailto:contact@balsm.health" style={onBlueGhost}>
              <Mail style={{ width: 19, height: 19 }} />{t('contact')}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
