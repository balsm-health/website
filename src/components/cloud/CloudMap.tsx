'use client';

import { useTranslations } from 'next-intl';
import { C, FONT, EASE } from './theme';
import { useInView } from './useReveal';
import { Info } from './CloudIcons';

const LONG_TERM: { key: string; cx: number; cy: number }[] = [
  { key: 'morocco', cx: 148.1, cy: 126.9 },
  { key: 'mauritania', cx: 107.1, cy: 244.8 },
  { key: 'algeria', cx: 240.4, cy: 157.6 },
  { key: 'tunisia', cx: 312.1, cy: 101.3 },
  { key: 'libya', cx: 394.1, cy: 173 },
  { key: 'sudan', cx: 542.8, cy: 262.2 },
  { key: 'palestine', cx: 575.6, cy: 122.8 },
  { key: 'jordan', cx: 588.9, cy: 130 },
  { key: 'lebanon', cx: 581.7, cy: 102.3 },
  { key: 'syria', cx: 609.4, cy: 91 },
  { key: 'iraq', cx: 665.8, cy: 111.5 },
  { key: 'yemen', cx: 701.6, cy: 290.9 },
];

const GCC: { key: string; cx: number; cy: number }[] = [
  { key: 'kuwait', cx: 704.7, cy: 149.4 },
  { key: 'saudi', cx: 676, cy: 203.8 },
  { key: 'bahrain', cx: 732.9, cy: 183.3 },
  { key: 'qatar', cx: 739.6, cy: 190.4 },
  { key: 'uae', cx: 773.4, cy: 203.8 },
  { key: 'oman', cx: 799, cy: 229.4 },
];

export default function CloudMap() {
  const t = useTranslations('cloud.map');
  const tc = useTranslations('cloud.map.countries');
  const { ref, inView } = useInView(0.1);

  const reveal = (delay = 0): React.CSSProperties => ({
    transition: `opacity .7s ${EASE}, transform .7s ${EASE}`,
    transitionDelay: `${delay}ms`,
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(16px)',
  });

  const cardBase: React.CSSProperties = {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 18,
    padding: 22,
  };
  const dotRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 };
  const cardTitle: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17, color: C.ink, margin: 0 };
  const cardDesc: React.CSSProperties = { fontSize: 14, lineHeight: 1.7, color: C.ink2, margin: '0 0 12px' };
  const chip = (bg: string, color: string): React.CSSProperties => ({
    fontSize: 12.5,
    padding: '5px 12px',
    borderRadius: 999,
    background: bg,
    color,
    fontWeight: 600,
  });

  const phase3Tags = t.raw('phase3.tags') as string[];
  const longTermTags = t.raw('longterm.tags') as string[];

  return (
    <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }} ref={ref}>
        <div style={{ maxWidth: 720, marginBottom: 44, ...reveal() }}>
          <div
            dir="ltr"
            style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: C.blue, textAlign: 'start' }}
          >
            {t('eyebrow')}
          </div>
          <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.2vw,50px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 14px' }}>
            {t('title')}
          </h2>
          <p style={{ fontSize: 'clamp(16px,1.7vw,19px)', lineHeight: 1.85, color: C.ink2, margin: 0 }}>{t('desc')}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px,4vw,48px)', alignItems: 'center', ...reveal(120) }}>
          {/* Map */}
          <div dir="ltr" style={{ flex: '1 1 460px', minWidth: 280 }}>
            <svg
              viewBox="0 0 860 390"
              width="100%"
              height="auto"
              role="img"
              aria-label={t('desc')}
              style={{ display: 'block', overflow: 'visible' }}
            >
              <defs>
                <filter id="mapSoft" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#2B2B25" floodOpacity="0.07" />
                </filter>
              </defs>
              <polygon
                points="155.3,81.8 185,87.9 196.3,82.8 245.5,72.6 302.9,67.4 327.5,67.4 332.6,104.3 350.1,112.5 404.4,137.1 449.5,115.6 473.1,126.9 521.2,130 535.6,125.8 545.8,128.9 565.3,128.9 566.3,163.8 547.9,143.3 561.2,171 591.9,224.3 596.1,248.9 599.1,265.3 522.3,296 450.5,290.9 368.5,280.6 266,285.8 50.8,264.2 51.8,206.8 66.1,173 114.3,118.7 136.9,101.3"
                fill="#EFEFE7"
                stroke="#DCDBD1"
                strokeWidth={1.5}
                filter="url(#mapSoft)"
              />
              <polygon
                points="573.5,147.4 568.4,126.9 573.5,113.6 578.6,102.3 582.7,85.9 604.3,71.5 645.3,67.4 681.1,91 703.7,116.6 711.9,142.3 710.9,143.3 706.8,148.4 712.9,157.6 725.2,175.1 733.4,187.4 734.4,190.4 740.6,182.2 743.7,193.5 768.3,198.6 778.5,191.5 788.8,185.3 790.8,183.3 792.9,178.1 791.8,188.4 815.4,207.9 827.7,219.1 819.5,234.5 817.4,240.7 768.3,275.5 718,301.1 676,318.6 659.6,319.6 654.5,289.9 651.4,272.4 616.6,229.4 605.3,202.7 589.9,163.8"
                fill="#EFEFE7"
                stroke="#DCDBD1"
                strokeWidth={1.5}
                filter="url(#mapSoft)"
              />

              <text x="586" y="192" fontFamily={FONT.arabic} fontSize={11} fill="#ADACA0" transform="rotate(65 586 192)" textAnchor="middle">
                {t('seaRed')}
              </text>
              <text x="778" y="128" fontFamily={FONT.arabic} fontSize={11} fill="#ADACA0" textAnchor="middle">
                {t('gulf')}
              </text>

              {LONG_TERM.map((c) => (
                <circle key={c.key} cx={c.cx} cy={c.cy} r={4.5} fill={C.grayDot}>
                  <title>{tc(c.key)}</title>
                </circle>
              ))}

              {GCC.map((c) => (
                <circle key={c.key} cx={c.cx} cy={c.cy} r={6} fill={C.violet}>
                  <title>{tc(c.key)}</title>
                </circle>
              ))}
              <text x="822" y="162" fontFamily={FONT.cairo} fontSize={12} fontWeight={700} fill={C.violetDark} textAnchor="middle">
                {t('gccLabel')}
              </text>

              {/* Egypt — launch focus */}
              <circle
                cx="534.6"
                cy="142.3"
                r={9}
                fill={C.blue}
                opacity={0.5}
                style={{ transformOrigin: '534.6px 142.3px', animation: 'balsm-map-pulse 2.6s cubic-bezier(.16,1,.3,1) infinite' }}
              />
              <circle cx="534.6" cy="142.3" r={9} fill={C.blue} stroke="#fff" strokeWidth={2}>
                <title>{tc('egypt')}</title>
              </circle>
              <text x="493" y="110" fontFamily={FONT.cairo} fontSize={15} fontWeight={800} fill={C.ink} textAnchor="middle">
                {tc('egypt')}
              </text>
              <text x="493" y="127" fontFamily={FONT.cairo} fontSize={11} fontWeight={700} fill={C.blueDark} textAnchor="middle">
                {t('egyptFocus')}
              </text>
            </svg>
          </div>

          {/* Phase cards */}
          <div style={{ flex: '1 1 300px', minWidth: 260, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={cardBase}>
              <div style={dotRow}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: C.blue, flex: 'none' }} />
                <h3 style={cardTitle}>{t('launch.title')}</h3>
              </div>
              <p style={cardDesc}>{t('launch.desc')}</p>
              <span style={{ display: 'inline-block', ...chip(C.blueBg, C.blueDark) }}>{t('launch.tag')}</span>
            </div>

            <div style={cardBase}>
              <div style={dotRow}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: C.violet, flex: 'none' }} />
                <h3 style={cardTitle}>{t('phase3.title')}</h3>
              </div>
              <p style={cardDesc}>{t('phase3.desc')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {phase3Tags.map((tag) => (
                  <span key={tag} style={chip(C.violetBg, C.violetDark)}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={cardBase}>
              <div style={dotRow}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: C.grayDot, flex: 'none' }} />
                <h3 style={cardTitle}>{t('longterm.title')}</h3>
              </div>
              <p style={cardDesc}>{t('longterm.desc')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {longTermTags.map((tag) => (
                  <span key={tag} style={chip(C.ltTagBg, C.ltTagText)}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.muted, margin: '28px 0 0', ...reveal(180) }}>
          <Info style={{ width: 14, height: 14, flex: 'none' }} />
          {t('note')}
        </p>
      </div>
    </section>
  );
}
