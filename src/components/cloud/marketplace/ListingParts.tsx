'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { C, FONT } from '../theme';
import { Check, ChevronDown, ImagePlus } from '../CloudIcons';
import { COMPAT_KEYS, initialOf, PLATFORM_KEYS, vendorsOf, ytEmbed, ytId } from './data';
import { activeCompany, type State } from './state';
import type { MkActions } from './useMarketplace';
import { moveFocus } from './WsPicker';
import { css, FieldError, MK, useMt } from './ui';

const stColor = (st: string) => (st === 'verified' ? MK.okFg : MK.muted);

export function PubPicker({ s, a }: { s: State; a: MkActions }) {
  const { t, name } = useMt();
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (s.pubMenuOpen) list.current?.querySelector<HTMLElement>('[aria-selected="true"], [role="option"]')?.focus();
    else if (wasOpen.current) btn.current?.focus();
    wasOpen.current = s.pubMenuOpen;
  }, [s.pubMenuOpen]);

  const ws = activeCompany(s);
  const vendors = vendorsOf(ws);
  const sel = vendors.find((v) => v.id === s.pubId) || vendors[0];
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); a.closePubMenu(); return; }
    moveFocus(e, list.current);
  };

  return (
    <div className={css.box}>
      <span id="mk-pub-label" className={css.label}>{t('form.publisher')}</span>
      <div style={{ position: 'relative' }}>
        <button ref={btn} type="button" id="mk-pub" aria-haspopup="listbox" aria-expanded={s.pubMenuOpen} aria-labelledby="mk-pub-label mk-pub" onClick={a.togglePubMenu} className={css.wsbtn}>
          <span aria-hidden className={css.wsav} style={{ background: C.blue }}>{sel ? initialOf(name(sel)) : '+'}</span>
          <span style={{ flex: 1, minWidth: 0, textAlign: 'start' }}>
            <span style={{ display: 'block', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sel ? name(sel) : t('form.chooseCo')}</span>
            {sel && <span style={{ display: 'block', fontSize: 12.5, color: stColor(sel.status) }}>{t(`status.${sel.status}`)}</span>}
          </span>
          <ChevronDown style={{ width: 18, height: 18, flex: 'none', color: MK.muted }} />
        </button>
        {s.pubMenuOpen && (
          <>
            <div onClick={a.closePubMenu} aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div className={`${css.wsmenu} ${css.pop}`} onKeyDown={onKey}>
              <div ref={list} role="listbox" aria-labelledby="mk-pub-label" className={css.wslist}>
                {vendors.map((v) => (
                  <button key={v.id} type="button" role="option" aria-selected={v.id === sel?.id} onClick={() => a.pickPub(v.id)} className={css.wsopt}>
                    <span aria-hidden className={css.wsav} style={{ background: C.blue }}>{initialOf(name(v))}</span>
                    <span style={{ flex: 1, minWidth: 0, textAlign: 'start' }}>
                      <span style={{ display: 'block', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14.5, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name(v)}</span>
                      <span style={{ display: 'block', fontSize: 12, color: stColor(v.status) }}>{t(`status.${v.status}`)}</span>
                    </span>
                    {v.id === sel?.id && <Check strokeWidth={2.5} style={{ width: 18, height: 18, flex: 'none', color: C.blue }} />}
                  </button>
                ))}
              </div>
              <div style={{ height: 1, background: C.borderHair, margin: '6px 4px' }} />
              <button type="button" onClick={a.addVendor} className={css.wsopt} style={{ color: C.blueDark }}>
                <span aria-hidden className={css.wsav} style={{ background: C.blueBg, color: C.blueDark, fontSize: 20 }}>+</span>
                <span style={{ flex: 1, textAlign: 'start', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14.5 }}>{t('notVendor.addVendor')}</span>
              </button>
            </div>
          </>
        )}
      </div>
      <div className={css.hint}>{t('form.pubHint', { name: name(ws) })}</div>
    </div>
  );
}

export function Images({ s, a }: { s: State; a: MkActions }) {
  const { t } = useMt();
  const [over, setOver] = useState(false);
  return (
    <div className={css.box}>
      <h2 className={css.h2} id="mk-img-title">{t('form.images')}</h2>
      <label
        className={css.drop} style={over ? { borderColor: C.blue, background: '#F1F6FC' } : undefined}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); void a.addFiles(e.dataTransfer?.files); }}
      >
        <input type="file" accept="image/png,image/jpeg,image/webp" multiple aria-labelledby="mk-img-title" aria-describedby="mk-img-hint"
          onChange={(e) => { void a.addFiles(e.target.files); e.target.value = ''; }} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
        <ImagePlus style={{ width: 28, height: 28, color: C.blueDark }} />
        <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color: C.ink }}>{t('form.drop')}</span>
        <span id="mk-img-hint" className={css.hint} style={{ margin: 0 }}>{t('form.dropHint')}</span>
      </label>
      <FieldError>{s.imgSkipped ? t('form.imagesSkipped') : null}</FieldError>
      {s.images.length > 0 && (
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10, margin: '14px 0 0', padding: 0, listStyle: 'none' }}>
          {s.images.map((im, i) => (
            <li key={im.id} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, background: '#fff' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt={im.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
              {i === 0 && <span style={{ position: 'absolute', top: 6, insetInlineStart: 6, padding: '2px 8px', borderRadius: 999, background: C.ink, color: '#fff', fontSize: 11.5, fontFamily: FONT.cairo, fontWeight: 700 }}>{t('form.cover')}</span>}
              <div style={{ display: 'flex', borderTop: `1px solid ${C.borderHair}` }}>
                <button type="button" onClick={() => a.coverImage(im.id)} className={css.mini}>{t('form.makeCover')}</button>
                <button type="button" onClick={() => a.removeImage(im.id)} className={css.mini} aria-label={t('common.deleteNamed', { name: im.name })} style={{ color: MK.errFg, flex: '0 0 44px' }}>×</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Video({ s, a }: { s: State; a: MkActions }) {
  const { t } = useMt();
  const id = ytId(s.f.yt);
  const bad = !!s.f.yt.trim() && !id;
  return (
    <div className={css.box}>
      <h2 className={css.h2}>{t('form.video')}</h2>
      <label htmlFor="mk-yt" className={css.label}>{t('form.videoLabel')}</label>
      <input id="mk-yt" value={s.f.yt} onChange={(e) => a.setF('yt', e.target.value)} dir="ltr" type="url" placeholder="https://www.youtube.com/watch?v=…" className={css.input} style={{ textAlign: 'left' }} aria-invalid={bad} aria-describedby={bad ? 'mk-yt-err' : undefined} />
      {bad && <div id="mk-yt-err" className={css.err}>{t('form.ytBad')}</div>}
      {id && (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', background: C.ink, marginTop: 12 }}>
          <iframe src={ytEmbed(id)} title={t('form.ytPreview')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        </div>
      )}
    </div>
  );
}

export function Platforms({ s, a }: { s: State; a: MkActions }) {
  const { t } = useMt();
  return (
    <div className={css.box}>
      <h2 className={css.h2}>{t('form.platformsTitle')}</h2>
      <div className={css.label} id="mk-plat-label">{t('form.platforms')}</div>
      <div role="group" aria-labelledby="mk-plat-label" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {PLATFORM_KEYS.map((k) => <button key={k} type="button" className={css.pill} aria-pressed={s.platforms.includes(k)} onClick={() => a.toggleIn('platforms', k)}>{t(`platforms.${k}`)}</button>)}
      </div>
      <div className={css.label} id="mk-compat-label">{t('form.compat')}</div>
      <div role="group" aria-labelledby="mk-compat-label" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {COMPAT_KEYS.map((k) => <button key={k} type="button" className={css.pill} aria-pressed={s.compat.includes(k)} onClick={() => a.toggleIn('compat', k)}>{t(`compat.${k}`)}</button>)}
      </div>
    </div>
  );
}

export function Customers({ s, a }: { s: State; a: MkActions }) {
  const { t } = useMt();
  return (
    <div className={css.box}>
      <h2 className={css.h2}>{t('form.customers')} <span style={{ fontWeight: 600, fontSize: 14, color: MK.muted }}>{t('form.optional')}</span></h2>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: MK.muted, margin: '-4px 0 12px' }}>{t('form.customersLead')}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <label htmlFor="mk-cust" className={css.srOnly}>{t('form.custLabel')}</label>
        <input id="mk-cust" value={s.custName} onChange={(e) => a.setCustName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); a.addCustomer(); } }} placeholder={t('form.custPh')} className={css.input} style={{ flex: 1, minWidth: 0 }} />
        <button type="button" onClick={a.addCustomer} className={css.ghost} style={{ flex: 'none', padding: '0 18px', fontSize: 14.5 }}>{t('common.add')}</button>
      </div>
      {s.customers.length > 0 && (
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '12px 0 0', padding: 0, listStyle: 'none' }}>
          {s.customers.map((n) => (
            <li key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 6px', paddingInlineStart: 12, borderRadius: 999, background: MK.chipBg, fontSize: 14, color: C.ink }}>
              {n}
              <button type="button" onClick={() => a.removeCustomer(n)} aria-label={t('common.deleteNamed', { name: n })} className={css.hit} style={{ width: 24, height: 24, border: 'none', borderRadius: '50%', background: 'transparent', cursor: 'pointer', color: MK.muted, fontSize: 16, lineHeight: 1 }}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
