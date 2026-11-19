'use client';

import { C, FONT } from '../theme';
import { ArrowUpNarrowWide, BadgeCheck, ShieldCheck } from '../CloudIcons';
import { findEntity, type State } from './state';
import type { MkActions } from './useMarketplace';
import { css, ErrorList, FieldError, h1, kicker, lead, MK, page, section, useMt } from './ui';

// Optional legal verification of a software company. The prototype ships this
// view but never links to it; here it opens from the organization card.
export default function Legal({ s, a }: { s: State; a: MkActions }) {
  const { t, name } = useMt();
  const l = s.legal;
  const benefits = [
    { Icon: BadgeCheck, bg: C.greenBg, color: MK.okFg, text: t('legal.ben1') },
    { Icon: ArrowUpNarrowWide, bg: C.blueBg, color: C.blueDark, text: t('legal.ben2') },
    { Icon: ShieldCheck, bg: C.violetBg, color: MK.violetText, text: t('legal.ben3') },
  ];
  return (
    <section className={css.view} style={section()}>
      <div style={page(720)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={kicker(MK.teal)}>{t('legal.kicker')}</div>
          <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12, padding: '3px 10px', borderRadius: 999, background: '#fff', border: `1px solid ${C.border}`, color: C.ink2 }}>{t('legal.optional')}</span>
        </div>
        <h1 style={h1()}>{t('legal.title', { name: name(findEntity(s, s.legalFor)?.e) })}</h1>
        <p style={{ ...lead, margin: '0 0 20px' }}>{t('legal.lead')}</p>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(200px,100%),1fr))', gap: 10, margin: '0 0 20px', padding: 0, listStyle: 'none' }}>
          {benefits.map(({ Icon, bg, color, text }) => (
            <li key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 14, background: bg }}>
              <Icon style={{ width: 20, height: 20, color, flex: 'none' }} />
              <span style={{ fontSize: 14, lineHeight: 1.55, color: C.ink }}>{text}</span>
            </li>
          ))}
        </ul>
        <div className={css.box} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 16 }}>
          <div>
            <label htmlFor="mk-lreg" className={css.label}>{t('legal.reg')}</label>
            <input id="mk-lreg" value={l.reg} onChange={(e) => a.setLg('reg', e.target.value)} dir="ltr" className={css.input} />
          </div>
          <div>
            <label htmlFor="mk-ltax" className={css.label}>{t('legal.tax')}</label>
            <input id="mk-ltax" value={l.tax} onChange={(e) => a.setLg('tax', e.target.value)} dir="ltr" className={css.input} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <span id="mk-ldoc-label" className={css.label}>{t('legal.doc')}</span>
            <label className={css.drop} style={{ padding: 18 }}>
              <input type="file" accept=".pdf,application/pdf,image/*" aria-labelledby="mk-ldoc-label" onChange={(e) => { a.setLgDoc(e.target.files?.[0]); e.target.value = ''; }} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
              <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color: C.ink }}>{l.doc || t('legal.docChoose')}</span>
              <span className={css.hint} style={{ margin: 0 }}>{t('legal.docHint')}</span>
            </label>
            <FieldError>{s.legalDocErr ? t('legal.docBad') : null}</FieldError>
          </div>
          <label style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14.5, lineHeight: 1.6, color: C.ink2, cursor: 'pointer' }}>
            <input type="checkbox" checked={l.confirm} onChange={(e) => a.setLg('confirm', e.target.checked)} style={{ marginTop: 4, width: 18, height: 18, accentColor: C.blue }} />
            <span>{t('legal.confirm')}</span>
          </label>
        </div>
        <ErrorList errors={s.errors} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20, justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={a.skipLegal} className={css.ghost} style={{ padding: '14px 20px' }}>{t('legal.notNow')}</button>
          <button type="button" onClick={a.submitLegal} className={css.primary} style={{ width: 'auto', padding: '14px 28px' }}>{t('legal.submit')}</button>
        </div>
      </div>
    </section>
  );
}
