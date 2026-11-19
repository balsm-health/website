'use client';

import { C, FONT } from '../theme';
import { Clock } from '../CloudIcons';
import { MAX_TAGS, SHORT_MAX, TAG_KEYS } from './data';
import { activeCompany, type State } from './state';
import type { MkActions } from './useMarketplace';
import { Customers, Images, Platforms, PubPicker, Video } from './ListingParts';
import { chip, css, ErrorList, MK, useMt } from './ui';

const BADGE = { verified: 'form.badgeVerified', pending: 'form.badgePending', unverified: 'form.badgeUnverified' } as const;

// Built-in tags are stored as keys, custom ones as typed.
export function useTagLabel() {
  const { t } = useMt();
  return (x: string) => ((TAG_KEYS as readonly string[]).includes(x) ? t(`tags.${x}`) : x);
}

export default function ListingForm({ s, a }: { s: State; a: MkActions }) {
  const { t, name } = useMt();
  const tagLabel = useTagLabel();
  const pub = activeCompany(s)?.entities.find((e) => e.id === s.pubId) || null;
  const custom = s.tags.filter((x) => !(TAG_KEYS as readonly string[]).includes(x));
  const full = s.tags.length >= MAX_TAGS;

  return (
    <section className={css.view} style={{ padding: 'clamp(36px,5vw,64px) 0 clamp(56px,8vw,96px)', background: C.bg }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            {/* #B8336F: the design's rose kicker on this view. */}
            <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color: '#B8336F' }}>{t('form.kicker')}</div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(26px,3.6vw,38px)', margin: '6px 0 0', color: C.ink }}>{t('form.title')}</h1>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: C.amberBg, color: MK.amberText, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13.5 }}>
            <Clock style={{ width: 15, height: 15 }} />
            {t(pub ? BADGE[pub.status] : 'form.badgeNone')}
            {pub?.status === 'unverified' && (
              <> · <button type="button" onClick={a.verifyPub} className={css.hit} style={{ border: 'none', background: 'none', padding: 0, color: C.blueDark, font: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>{t('form.confirmEmail')}</button></>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: '1.6 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <PubPicker s={s} a={a} />

            <div className={css.box}>
              <h2 className={css.h2}>{t('form.basics')}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 14 }}>
                <div>
                  <label htmlFor="mk-name" className={css.label}>{t('form.name')}</label>
                  <input id="mk-name" value={s.f.name} onChange={(e) => a.setF('name', e.target.value)} className={css.input} />
                </div>
                <div>
                  <label htmlFor="mk-site" className={css.label}>{t('form.site')}</label>
                  <input id="mk-site" value={s.f.site} onChange={(e) => a.setF('site', e.target.value)} dir="ltr" type="url" placeholder="https://" className={css.input} style={{ textAlign: 'left' }} />
                </div>
              </div>
              <label htmlFor="mk-short" className={css.label} style={{ marginTop: 14 }}>{t('form.short')}</label>
              <input id="mk-short" value={s.f.short} onChange={(e) => a.setF('short', e.target.value)} maxLength={SHORT_MAX} className={css.input} aria-describedby="mk-short-count" />
              <div id="mk-short-count" className={css.hint}>{t('form.shortCount', { n: String(s.f.short.length) })}</div>
              <label htmlFor="mk-desc" className={css.label} style={{ marginTop: 10 }}>{t('form.desc')}</label>
              <textarea id="mk-desc" value={s.f.desc} onChange={(e) => a.setF('desc', e.target.value)} rows={6} className={css.input} style={{ resize: 'vertical' }} aria-describedby="mk-desc-hint" />
              <div id="mk-desc-hint" className={css.hint}>{t('form.descHint')}</div>
              <div className={css.label} style={{ marginTop: 14 }} id="mk-tags-label">{t('form.tags')}</div>
              <div className={css.hint} style={{ margin: '-2px 0 10px' }}>{t('form.tagsHint')}</div>
              <div role="group" aria-label={t('form.tagsGroup')} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TAG_KEYS.map((k) => {
                  const on = s.tags.includes(k);
                  return <button key={k} type="button" className={css.pill} aria-pressed={on} aria-disabled={!on && full} onClick={() => a.toggleTag(k)}>{t(`tags.${k}`)}</button>;
                })}
              </div>
              {custom.length > 0 && (
                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '8px 0 0', padding: 0, listStyle: 'none' }}>
                  {custom.map((ct) => (
                    <li key={ct} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '7px 6px', paddingInlineStart: 13, borderRadius: 999, background: C.ink, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14 }}>
                      {ct}
                      <button type="button" onClick={() => a.toggleIn('tags', ct)} aria-label={t('common.deleteNamed', { name: ct })} className={css.hit} style={{ width: 22, height: 22, border: 'none', borderRadius: '50%', background: 'rgba(255,255,255,.15)', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>×</button>
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <label htmlFor="mk-tag" className={css.srOnly}>{t('form.newTag')}</label>
                <input id="mk-tag" value={s.tagInput} onChange={(e) => a.setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); a.addTag(); } }} maxLength={30} placeholder={t('form.newTagPh')} className={css.input} style={{ flex: 1, minWidth: 0 }} />
                <button type="button" onClick={a.addTag} className={css.ghost} style={{ flex: 'none', padding: '0 18px', fontSize: 14.5 }}>{t('common.add')}</button>
              </div>
            </div>

            <Images s={s} a={a} />
            <Video s={s} a={a} />
            <Platforms s={s} a={a} />
            <Customers s={s} a={a} />

            <ErrorList errors={s.errors} style={{ marginTop: 0 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" onClick={a.goDirectory} className={css.ghost} style={{ padding: '14px 22px' }}>{t('common.cancel')}</button>
              <button type="button" onClick={a.submitListing} className={css.primary} style={{ width: 'auto', padding: '14px 28px' }}>{t('form.submit')}</button>
            </div>
          </div>

          <aside className={css.sticky} style={{ flex: '1 1 300px', minWidth: 0 }} aria-labelledby="mk-pv-title">
            <div id="mk-pv-title" style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color: MK.muted, marginBottom: 10 }}>{t('form.preview')}</div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 20, background: '#fff', overflow: 'hidden' }}>
              {s.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.images[0].url} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '16/9', background: `linear-gradient(135deg,${C.blueBg},${C.violetBg})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MK.muted, fontSize: 13.5 }}>{t('form.coverPh')}</div>
              )}
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(s.tags.length ? s.tags.map(tagLabel) : [t('form.pvTags')]).map((x) => <span key={x} style={chip(C.borderHair, C.ink2)}>{x}</span>)}
                </div>
                <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 18, color: C.ink }}>{s.f.name.trim() || t('form.pvName')}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: C.ink2 }}>{s.f.short.trim() || t('form.pvShort')}</div>
                <div style={{ fontSize: 13, color: MK.muted, paddingTop: 8, borderTop: `1px solid ${C.borderHair}`, marginTop: 4 }}>{(pub && name(pub)) || t('form.pvCompany')}</div>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: '14px 16px', borderRadius: 14, background: MK.chipBg, fontSize: 13.5, lineHeight: 1.65, color: C.ink2 }}>
              {t.rich('form.reviewNote', { email: s.email, ltr: (ch) => <span dir="ltr">{ch}</span> })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
