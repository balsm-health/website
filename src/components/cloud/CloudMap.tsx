'use client';

import { useTranslations } from 'next-intl';
import { C, DISPLAY, FONT, MOTION } from './theme';
import { useInView } from './useReveal';
import { Info } from './CloudIcons';
import { MAP_ASSET, MAP_VIEWBOX, MAP_DOTS, MAP_EGYPT, MAP_RED_SEA, MAP_GULF_LABEL } from './mapData';

// The <image> is placed to fill the viewBox exactly, derived from it rather
// than repeated as literals so the asset and the overlay can't drift apart.
const [mapX, mapY, mapW, mapH] = MAP_VIEWBOX.split(/\s+/).map(Number);

export default function CloudMap() {
  const t = useTranslations('cloud.map');
  const tc = useTranslations('cloud.map.countries');
  const { ref, inView } = useInView(MOTION.threshold, MOTION.rootMargin);

  // The design's three [data-reveal] siblings in this section cascade at 90ms.
  const reveal = (i = 0): React.CSSProperties => ({
    transition: MOTION.revealTransition,
    transitionDelay: `${i * 90}ms`,
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : `translateY(${MOTION.revealY}px)`,
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

  const phase2Tags = t.raw('phase2.tags') as string[];
  const longTermTags = t.raw('longterm.tags') as string[];

  return (
    <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }} ref={ref}>
        <div style={{ maxWidth: 720, marginBottom: 44, ...reveal() }}>
          <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color: DISPLAY.blue }}>{t('eyebrow')}</div>
          <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.2vw,50px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 14px' }}>
            {t('title')}
          </h2>
          <p style={{ fontSize: 'clamp(16px,1.7vw,19px)', lineHeight: 1.85, color: C.ink2, margin: 0 }}>{t('desc')}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px,4vw,48px)', alignItems: 'center', ...reveal(1) }}>
          {/* Map — geometry is Mercator-projected at build time (see mapData.ts) */}
          <div dir="ltr" style={{ flex: '1 1 460px', minWidth: 280 }}>
            <svg
              viewBox={MAP_VIEWBOX}
              width="100%"
              height="auto"
              role="img"
              aria-label={t('mapLabel')}
              style={{ display: 'block', overflow: 'visible' }}
            >
              {/* The landmass, fill/stroke and drop shadow all live inside the
                  asset, so the whole map is one <image> here. */}
              <image href={MAP_ASSET} x={mapX} y={mapY} width={mapW} height={mapH} aria-hidden="true" />

              <text
                x={MAP_RED_SEA.x}
                y={MAP_RED_SEA.y}
                fontFamily={FONT.arabic}
                fontSize={11}
                fill={C.muted2}
                transform={`rotate(60 ${MAP_RED_SEA.x} ${MAP_RED_SEA.y})`}
                textAnchor="middle"
              >
                {t('seaRed')}
              </text>

              {MAP_DOTS.map((c) => (
                <circle
                  key={c.key}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.tier === 'gcc' ? 6 : 4.5}
                  fill={c.tier === 'gcc' ? C.violet : C.grayDot}
                >
                  <title>{tc(c.key)}</title>
                </circle>
              ))}

              <text
                x={MAP_GULF_LABEL.x}
                y={MAP_GULF_LABEL.y}
                fontFamily={FONT.cairo}
                fontSize={12}
                fontWeight={700}
                fill={C.violetDark}
                textAnchor="middle"
              >
                {t('gccLabel')}
              </text>

              {/* Egypt — launch focus */}
              <circle
                cx={MAP_EGYPT.cx}
                cy={MAP_EGYPT.cy}
                r={9}
                fill={C.blue}
                opacity={0.5}
                style={{
                  transformOrigin: `${MAP_EGYPT.cx}px ${MAP_EGYPT.cy}px`,
                  animation: 'balsm-map-pulse 2.6s cubic-bezier(.16,1,.3,1) infinite',
                }}
              />
              <circle cx={MAP_EGYPT.cx} cy={MAP_EGYPT.cy} r={9} fill={C.blue} stroke="#fff" strokeWidth={2}>
                <title>{tc('egypt')}</title>
              </circle>
              <text
                x={MAP_EGYPT.cx}
                y={MAP_EGYPT.cy - 26}
                fontFamily={FONT.cairo}
                fontSize={15}
                fontWeight={800}
                fill={C.ink}
                textAnchor="middle"
              >
                {tc('egypt')}
              </text>
              <text
                x={MAP_EGYPT.cx}
                y={MAP_EGYPT.cy - 12}
                fontFamily={FONT.cairo}
                fontSize={11}
                fontWeight={700}
                fill={C.blueDark}
                textAnchor="middle"
              >
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
                <h3 style={cardTitle}>{t('phase2.title')}</h3>
              </div>
              <p style={cardDesc}>{t('phase2.desc')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {phase2Tags.map((tag) => (
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

        {/* Not a [data-reveal] in the design — this footnote stays put. */}
        <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.muted, margin: '28px 0 0' }}>
          <Info style={{ width: 14, height: 14, flex: 'none' }} />
          {t('note')}
        </p>
      </div>
    </section>
  );
}
