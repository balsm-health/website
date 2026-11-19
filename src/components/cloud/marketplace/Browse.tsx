'use client';

import { C, FONT } from '../theme';
import { LayoutDashboard, Plus } from '../CloudIcons';
import { SAMPLES, TAG_KEYS, type Sample } from './data';
import type { State } from './state';
import type { MkActions } from './useMarketplace';
import { chip, css, MK, useMt } from './ui';

export default function Browse({ s, a }: { s: State; a: MkActions }) {
  const { t } = useMt();
  const text = (x: Sample, k: 'name' | 'company' | 'short') => t(`samples.${x.id}.${k}`);
  const q = s.q.trim().toLowerCase();
  const results = SAMPLES
    .filter((x) => !s.filters.length || s.filters.some((f) => x.areas.includes(f)))
    .filter((x) => !q || [text(x, 'name'), text(x, 'company'), text(x, 'short'), ...x.areas.map((k) => t(`tags.${k}`))].join(' ').toLowerCase().includes(q));

  return (
    <div className={css.view}>
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(44px,7vw,84px) 0 clamp(32px,5vw,56px)', background: `linear-gradient(180deg,${C.aquaBg} 0%,${C.bg} 100%)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', left: -100, top: -90, width: 320, opacity: 0.09, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', display: 'flex', flexWrap: 'wrap', gap: '24px 48px', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 520px', minWidth: 0 }}>
            <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14, color: MK.teal }}>{t('browse.kicker')}</div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 14px' }}>{t('browse.title')}</h1>
            <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', lineHeight: 1.8, color: C.ink2, margin: 0, maxWidth: 620 }}>{t('browse.lead')}</p>
          </div>
          <button type="button" onClick={a.goList} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, minHeight: 48, padding: '15px 26px', border: 'none', borderRadius: 999, background: C.ink, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            <Plus style={{ width: 19, height: 19 }} />
            {t('browse.cta')}
          </button>
        </div>
      </section>

      <section style={{ padding: '0 0 clamp(56px,8vw,96px)', background: C.bg }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 18 }}>
            <label htmlFor="mk-search" className={css.srOnly}>{t('browse.searchLabel')}</label>
            <input
              id="mk-search" type="search" value={s.q} onChange={(e) => a.setQ(e.target.value)} placeholder={t('browse.searchPh')}
              className={css.input} style={{ flex: '1 1 320px', minWidth: 0, width: 'auto', padding: '14px 18px', borderRadius: 14 }}
            />
            {s.signedIn && s.companies.length > 0 && (
              <button type="button" onClick={a.goMine} className={css.ghost} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 18px', borderRadius: 14 }}>
                <LayoutDashboard style={{ width: 17, height: 17 }} />
                {t('browse.mine')}
              </button>
            )}
          </div>
          <div role="group" aria-label={t('browse.tagsGroup')} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
            <button type="button" className={css.pill} aria-pressed={s.filters.length === 0} onClick={a.clearFilters}>{t('browse.all')}</button>
            {TAG_KEYS.map((k) => (
              <button key={k} type="button" className={css.pill} aria-pressed={s.filters.includes(k)} onClick={() => a.toggleFilter(k)}>{t(`tags.${k}`)}</button>
            ))}
          </div>
          <div role="status" style={{ fontSize: 14, color: MK.muted, marginBottom: 14 }}>
            {t('browse.count', { count: results.length, n: String(results.length) })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(300px,100%),1fr))', gap: 18 }}>
            {results.map((x) => {
              const shown = x.areas.slice(0, 3);
              const more = x.areas.length - shown.length;
              return (
                <button key={x.id} type="button" onClick={() => a.open(x.id)} className={css.card} style={{ display: 'flex', flexDirection: 'column', textAlign: 'start', padding: 0, border: `1px solid ${C.border}`, borderRadius: 20, background: '#fff', overflow: 'hidden', cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
                  {x.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={x.images[0]} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '16/9', background: x.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/balsm-logo-mono-white.svg" alt="" style={{ width: 64, opacity: 0.55 }} />
                    </div>
                  )}
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {shown.map((k) => <span key={k} style={chip(C.borderHair, C.ink2)}>{t(`tags.${k}`)}</span>)}
                      {more > 0 && <span style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 12, padding: '3px 9px', borderRadius: 999, background: MK.chipBg, color: MK.muted }}>+{more}</span>}
                      <span style={chip(C.amberBg, MK.amberText)}>{t('browse.sample')}</span>
                    </div>
                    <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 19, color: C.ink }}>{text(x, 'name')}</div>
                    <div style={{ fontSize: 14.5, lineHeight: 1.65, color: C.ink2, flex: 1 }}>{text(x, 'short')}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: MK.muted, paddingTop: 10, borderTop: `1px solid ${C.borderHair}` }}>
                      <span>{text(x, 'company')}</span>
                      {x.verified && <span style={{ color: MK.teal, fontWeight: 600 }}>{t('browse.verifiedCo')}</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', border: `1.5px dashed ${C.border}`, borderRadius: 20, color: MK.muted }}>{t('browse.empty')}</div>
          )}
        </div>
      </section>
    </div>
  );
}
