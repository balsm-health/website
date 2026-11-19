'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FONT } from '../theme';
import Reveal from '../Reveal';
import { Building2, Globe, Languages, Link2, Unplug, WifiOff } from '../CloudIcons';
import { anchored, container, eyebrow, Forward, h2, h3, lead, RevealLi, sectionPad, useWide, V2 } from './shared';

type Card = { title: string; desc: string };

const VISION_ICONS = [
  { Icon: Link2, color: C.blue },
  { Icon: Building2, color: V2.emeraldIcon },
  { Icon: Languages, color: C.violet },
  { Icon: WifiOff, color: V2.pinkText },
];
const MISSION_ICONS = [
  { Icon: Unplug, bg: V2.dangerBg, color: V2.dangerText },
  { Icon: WifiOff, bg: C.amberBg, color: V2.amberText },
  { Icon: Globe, bg: C.violetBg, color: C.violet },
];
const FOUNDATION_COLORS = [V2.emeraldIcon, C.blue, C.violet, V2.greenText, V2.pinkText];
const SCALE_COLORS = [C.blue, V2.emeraldIcon, C.violet, V2.pinkText];

const num = (n: number) => String(n + 1).padStart(2, '0');

export function HomeVision() {
  const t = useTranslations('home.vision');
  const cards = t.raw('cards') as Card[];
  return (
    <section id="vision" style={{ ...anchored, padding: sectionPad, background: V2.violetWash, borderBottom: `1px solid ${C.borderHair}` }}>
      <div style={{ ...container, display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px,6vw,80px)', alignItems: 'center' }}>
        <Reveal style={{ flex: '1.2 1 420px', minWidth: 0 }}>
          <div style={eyebrow(C.violetDark)}>{t('eyebrow')}</div>
          <h2 style={{ ...h2, lineHeight: 1.2 }}>{t('title')}</h2>
          <p style={lead}>{t('desc')}</p>
        </Reveal>
        <div style={{ flex: '1 1 360px', minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(160px,100%),1fr))', gap: 12 }}>
          {cards.map((card, i) => {
            const { Icon, color } = VISION_ICONS[i];
            return (
              <Reveal key={i} delay={i * 80} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 20 }}>
                <Icon style={{ width: 22, height: 22, color }} />
                <h3 style={h3(16.5, '10px 0 4px')}>{card.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: C.ink2, margin: 0 }}>{card.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeMission() {
  const t = useTranslations('home.mission');
  const cards = t.raw('cards') as Card[];
  return (
    <section id="mission" style={{ ...anchored, padding: sectionPad, background: C.bg }}>
      <div style={{ ...container, display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px,6vw,80px)', alignItems: 'flex-start' }}>
        <Reveal style={{ flex: '1 1 360px', minWidth: 0 }}>
          <div style={eyebrow(V2.dangerText)}>{t('eyebrow')}</div>
          <h2 style={h2}>{t('title')}</h2>
          <p style={{ ...lead, margin: '0 0 16px' }}>{t('p1')}</p>
          <p style={lead}>{t('p2')}</p>
        </Reveal>
        <div style={{ flex: '1 1 440px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {cards.map((card, i) => {
            const { Icon, bg, color } = MISSION_ICONS[i];
            return (
              <Reveal key={i} delay={i * 80} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: '22px 24px' }}>
                <div style={{ width: 46, height: 46, flex: 'none', borderRadius: 13, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                  <Icon style={{ width: 22, height: 22 }} />
                </div>
                <div>
                  <h3 style={h3(19, '0 0 4px')}>{card.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{card.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeFoundation() {
  const t = useTranslations('home.foundation');
  const items = t.raw('items') as Card[];
  const wide = useWide();
  return (
    <section id="foundation" style={{ ...anchored, padding: sectionPad, background: C.white, borderTop: `1px solid ${C.borderHair}` }}>
      <div style={{ ...container, display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px,6vw,88px)', alignItems: 'flex-start' }}>
        <Reveal style={{ flex: '1 1 340px', minWidth: 0, ...(wide ? { position: 'sticky', top: 110 } : null) }}>
          <div style={eyebrow(V2.emeraldText)}>{t('eyebrow')}</div>
          <h2 style={h2}>{t('title')}</h2>
          <p style={{ ...lead, margin: '0 0 24px' }}>{t('desc')}</p>
          <Link href="/ecosystem#licensing" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 44, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15.5, color: V2.emeraldText }}>
            {t('link')}<Forward size={16} />
          </Link>
        </Reveal>
        <ol style={{ flex: '1.4 1 480px', minWidth: 0, listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${C.border}` }}>
          {items.map((item, i) => (
            <RevealLi key={i} index={i} style={{ display: 'flex', gap: 'clamp(16px,3vw,32px)', padding: '26px 0', borderBottom: `1px solid ${C.border}` }}>
              <span aria-hidden style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 'clamp(22px,2.6vw,30px)', color: FOUNDATION_COLORS[i], flex: 'none', width: '2.2em' }}>{num(i)}</span>
              <div>
                <h3 style={h3(21, '0 0 6px')}>{item.title}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.75, color: C.ink2, margin: 0 }}>{item.desc}</p>
              </div>
            </RevealLi>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function HomeScale() {
  const t = useTranslations('home.scale');
  const items = t.raw('items') as Card[];
  return (
    <section id="scale" style={{ ...anchored, padding: sectionPad, background: V2.blueWash, borderTop: `1px solid ${V2.blueWashRule}` }}>
      <div style={container}>
        <Reveal style={{ display: 'flex', flexWrap: 'wrap', gap: '16px clamp(32px,6vw,88px)', alignItems: 'flex-end', marginBottom: 44 }}>
          <div style={{ flex: '1 1 340px', minWidth: 0 }}>
            <div style={eyebrow(C.blueDark)}>{t('eyebrow')}</div>
            <h2 style={{ ...h2, margin: '12px 0 0' }}>{t('title')}</h2>
          </div>
          <p style={{ ...lead, flex: '1.4 1 480px', minWidth: 0 }}>{t('desc')}</p>
        </Reveal>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 16 }}>
          {items.map((item, i) => (
            <RevealLi key={i} index={i} style={{ background: C.white, border: `1px solid ${V2.blueCardBorder}`, borderRadius: 20, padding: 28 }}>
              <div aria-hidden style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 34, color: SCALE_COLORS[i], lineHeight: 1 }}>{num(i)}</div>
              <h3 style={h3(20, '18px 0 8px')}>{item.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: C.ink2, margin: 0 }}>{item.desc}</p>
            </RevealLi>
          ))}
        </ol>
      </div>
    </section>
  );
}
