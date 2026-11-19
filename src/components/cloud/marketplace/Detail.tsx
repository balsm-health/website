'use client';

import { C, FONT } from '../theme';
import { ArrowRight, ArrowUpLeft, BadgeCheck } from '../CloudIcons';
import { PLATFORM_KEYS, SAMPLES, ytEmbed, ytId } from './data';
import type { State } from './state';
import type { MkActions } from './useMarketplace';
import { chip, css, MK, useMt } from './ui';

const card = { background: '#fff', border: `1px solid ${C.border}`, borderRadius: 20, padding: 22 } as const;

export default function Detail({ s, a }: { s: State; a: MkActions }) {
  const { t } = useMt();
  const sel = SAMPLES.find((x) => x.id === s.selected) || SAMPLES[0];
  const name = t(`samples.${sel.id}.name`);
  const vid = ytId(sel.video);
  const tagLabel = (k: string) => ((PLATFORM_KEYS as readonly string[]).includes(k) ? t(`platforms.${k}`) : t(`compat.${k}`));

  return (
    <section className={css.view} style={{ padding: 'clamp(28px,4vw,48px) 0 clamp(56px,8vw,96px)', background: C.bg }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }}>
        <button type="button" onClick={a.goDirectory} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '8px 0', border: 'none', background: 'none', color: C.blueDark, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 18 }}>
          <ArrowRight className="v2-flip" style={{ width: 17, height: 17 }} />
          {t('detail.allSystems')}
        </button>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px,4vw,48px)', alignItems: 'flex-start' }}>
          <div style={{ flex: '1.6 1 520px', minWidth: 0 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {sel.areas.map((k) => <span key={k} style={{ ...chip(C.borderHair, C.ink2, 12.5), padding: '4px 11px' }}>{t(`tags.${k}`)}</span>)}
              <span style={{ ...chip(C.amberBg, MK.amberText, 12.5), padding: '4px 11px' }}>{t('browse.sample')}</span>
            </div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(30px,4.4vw,48px)', lineHeight: 1.15, color: C.ink, margin: '0 0 10px' }}>{name}</h1>
            <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', lineHeight: 1.75, color: C.ink2, margin: '0 0 24px' }}>{t(`samples.${sel.id}.short`)}</p>
            <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.border}`, background: '#fff' }}>
              {sel.images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sel.images[s.active] || sel.images[0]} alt={name} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '16/9', background: sel.bg }} />
              )}
            </div>
            {sel.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
                {sel.images.map((u, i) => (
                  <button key={u} type="button" onClick={() => a.pickImage(i)} aria-label={t('detail.image', { n: String(i + 1) })} aria-pressed={i === s.active} className={css.thumb} style={{ flex: 'none', width: 96, height: 60, padding: 0, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', background: '#fff' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 22, margin: '34px 0 10px', color: C.ink }}>{t('detail.about')}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.9, color: C.ink2, margin: 0, whiteSpace: 'pre-line' }}>{t(`samples.${sel.id}.desc`)}</p>
            {vid && (
              <>
                <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 22, margin: '34px 0 12px', color: C.ink }}>{t('detail.video')}</h2>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 18, overflow: 'hidden', background: C.ink }}>
                  <iframe src={ytEmbed(vid)} title={t('detail.video')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                </div>
              </>
            )}
          </div>
          <aside style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={card}>
              <div style={{ fontSize: 13, color: MK.muted, marginBottom: 6 }}>{t('detail.company')}</div>
              <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 19, marginBottom: 8, color: C.ink }}>{t(`samples.${sel.id}.company`)}</div>
              {sel.verified && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: C.aquaBg, color: MK.teal, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13 }}>
                  <BadgeCheck style={{ width: 15, height: 15 }} />
                  {t('detail.verifiedByBalsm')}
                </div>
              )}
              {sel.site && (
                <a href={sel.site} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, padding: 13, borderRadius: 12, background: C.ink, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15 }}>
                  {t('detail.visitSite')}
                  <ArrowUpLeft className="v2-flip" style={{ width: 16, height: 16 }} />
                </a>
              )}
            </div>
            <div style={card}>
              <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, marginBottom: 12, color: C.ink }}>{t('detail.platforms')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {sel.tags.map((g) => <span key={g} style={{ fontSize: 13, padding: '5px 11px', borderRadius: 999, background: MK.chipBg, color: C.ink2 }}>{tagLabel(g)}</span>)}
              </div>
            </div>
            {sel.customers.length > 0 && (
              <div style={card}>
                <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, marginBottom: 12, color: C.ink }}>{t('detail.customers')}</div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                  {sel.customers.map((cu) => <li key={cu} style={{ padding: '10px 12px', borderRadius: 12, background: C.bg, border: `1px solid ${C.borderHair}`, fontSize: 14.5, color: C.ink }}>{cu}</li>)}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
