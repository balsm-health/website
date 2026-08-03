'use client';

import { useTranslations } from 'next-intl';
import { C, FONT, EASE } from './theme';
import { useInView } from './useReveal';
import { RefreshCw, DatabaseBackup, FlaskConical, LineChart, Headset, LogOut } from './CloudIcons';

type Item = { title: string; desc: string };

const STYLES = [
  { icon: RefreshCw, chip: C.blueBg, color: C.blue },
  { icon: DatabaseBackup, chip: C.greenBg, color: C.green },
  { icon: FlaskConical, chip: C.aquaBg, color: C.aqua },
  { icon: LineChart, chip: C.violetBg, color: C.violet },
  { icon: Headset, chip: C.amberBg, color: C.amber },
  { icon: LogOut, chip: C.blueBg, color: C.blue },
];

export default function CloudFeatures() {
  const t = useTranslations('cloud.adds');
  const items = t.raw('items') as Item[];
  const { ref, inView } = useInView(0.12);

  return (
    <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }} ref={ref}>
        <div
          style={{
            maxWidth: 700,
            marginBottom: 46,
            transition: `opacity .7s ${EASE}, transform .7s ${EASE}`,
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <div
            dir="ltr"
            style={{
              fontFamily: FONT.display,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: C.emerald,
              textAlign: 'start',
            }}
          >
            {t('eyebrow')}
          </div>
          <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.2vw,50px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 0' }}>
            {t('title')}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(270px,100%),1fr))',
            gap: 20,
          }}
        >
          {items.map((item, i) => {
            const s = STYLES[i];
            const Icon = s.icon;
            return (
              <div
                key={i}
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                  padding: 28,
                  transition: `opacity .6s ${EASE}, transform .6s ${EASE}`,
                  transitionDelay: `${i * 70}ms`,
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 13,
                    background: s.chip,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: s.color,
                    marginBottom: 16,
                  }}
                >
                  <Icon style={{ width: 23, height: 23 }} />
                </div>
                <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 20, margin: '0 0 7px', color: C.ink }}>{item.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
