'use client';

import { useTranslations } from 'next-intl';
import { C, FONT, EASE } from './theme';
import { useInView } from './useReveal';
import CountUp from './CountUp';
import { Target, Repeat, LockKeyhole, Mail } from './CloudIcons';

type Stat = { value: string; label: string };
type Card = { title: string; desc: string };

const STAT_COLORS = [C.mint, C.aqua, C.blue, C.violet];
const CARD_STYLES = [
  { icon: Target, color: C.mint },
  { icon: Repeat, color: C.aqua },
  { icon: LockKeyhole, color: C.blue },
];

export default function CloudInvestors() {
  const t = useTranslations('cloud.invest');
  const stats = t.raw('stats') as Stat[];
  const cards = t.raw('cards') as Card[];
  const { ref, inView } = useInView(0.12);

  const reveal = (delay = 0): React.CSSProperties => ({
    transition: `opacity .7s ${EASE}, transform .7s ${EASE}`,
    transitionDelay: `${delay}ms`,
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(18px)',
  });

  const glassCard: React.CSSProperties = {
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.09)',
    borderRadius: 18,
    padding: 26,
  };

  return (
    <section id="invest" style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.dark }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }} ref={ref}>
        <div style={{ maxWidth: 760, marginBottom: 48, ...reveal() }}>
          <div
            dir="ltr"
            style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: C.mint, textAlign: 'start' }}
          >
            {t('eyebrow')}
          </div>
          <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,52px)', lineHeight: 1.15, color: '#fff', margin: '12px 0 14px' }}>
            {t('title')}
          </h2>
          <p style={{ fontSize: 'clamp(16px,1.8vw,20px)', lineHeight: 1.8, color: 'rgba(255,255,255,.7)', margin: 0 }}>{t('desc')}</p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(200px,100%),1fr))',
            gap: 16,
            marginBottom: 36,
            ...reveal(80),
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} style={glassCard}>
              <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 'clamp(28px,3.6vw,40px)', color: STAT_COLORS[i] }}>
                <CountUp value={stat.value} inView={inView} />
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.66)', marginTop: 6 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))',
            gap: 16,
            ...reveal(140),
          }}
        >
          {cards.map((card, i) => {
            const s = CARD_STYLES[i];
            const Icon = s.icon;
            return (
              <div key={i} style={glassCard}>
                <Icon style={{ width: 24, height: 24, color: s.color }} />
                <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color: '#fff', margin: '14px 0 6px' }}>{card.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'rgba(255,255,255,.66)', margin: 0 }}>{card.desc}</p>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 36, ...reveal(200) }}>
          <a
            href="mailto:invest@balsm.health"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 30px',
              borderRadius: 999,
              background: C.mint,
              color: '#1B3B27',
              fontFamily: FONT.cairo,
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            <Mail style={{ width: 19, height: 19 }} />
            {t('cta')}
          </a>
        </div>
      </div>
    </section>
  );
}
