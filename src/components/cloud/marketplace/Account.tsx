'use client';

import { C, FONT } from '../theme';
import { initialOf } from './data';
import type { State } from './state';
import type { MkActions } from './useMarketplace';
import { chip, css, kicker, ltrInput, MK, useMt } from './ui';

const btn = { minHeight: 40, padding: '7px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.ink, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, cursor: 'pointer' } as const;
const handleStyle = { fontFamily: FONT.mono, fontWeight: 500, fontSize: 13, color: MK.muted } as const;

export default function Account({ s, a }: { s: State; a: MkActions }) {
  const { t, name } = useMt();
  return (
    <section className={css.view} style={{ padding: 'clamp(36px,5vw,64px) 0 clamp(56px,8vw,96px)', background: C.bg, minHeight: '60vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={kicker(C.blueDark)}>{t('account.kicker')}</div>
          <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(26px,3.4vw,34px)', margin: '6px 0 0', color: C.ink }}>{t('account.title')}</h1>
        </div>

        {s.inbox.length > 0 && (
          <div className={css.box} style={{ borderColor: '#C9DCF5', background: '#F7FAFE' }}>
            <h2 className={css.h2}>{t('account.inboxTitle')}</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {s.inbox.map((ib) => (
                <li key={ib.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 14px', alignItems: 'center', padding: '10px 0' }}>
                  <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                    <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 16, color: C.ink }}>
                      <span>{ib.companyKey ? t(ib.companyKey) : ib.company}</span> <span dir="ltr" style={handleStyle}>@{ib.handle}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: MK.muted }}>{t('account.invitedAs', { role: t(`roles.${ib.role}`) })}</div>
                  </div>
                  <button type="button" onClick={() => a.acceptInvite(ib.id)} className={css.primary} style={{ width: 'auto', minHeight: 44, padding: '10px 18px', fontSize: 14.5 }}>{t('account.accept')}</button>
                  <button type="button" onClick={() => a.declineInvite(ib.id)} className={css.ghost} style={{ padding: '10px 16px', color: C.ink2, fontSize: 14.5 }}>{t('account.decline')}</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form className={css.box} noValidate onSubmit={(e) => { e.preventDefault(); a.saveProfile(); }}>
          <h2 className={css.h2}>{t('account.profile')}</h2>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
            <span aria-hidden style={{ width: 64, height: 64, flex: 'none', borderRadius: '50%', background: `linear-gradient(135deg,${C.blue},${C.violet})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.cairo, fontWeight: 800, fontSize: 24 }}>{initialOf(s.uname || s.email)}</span>
            <div style={{ fontSize: 13.5, color: MK.muted, lineHeight: 1.6 }}>{t('account.initialsHint')}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 14 }}>
            <div>
              <label htmlFor="mk-acc-name" className={css.label}>{t('auth.name')}</label>
              <input id="mk-acc-name" value={s.uname} onChange={(e) => a.setUname(e.target.value)} autoComplete="name" className={css.input} />
            </div>
            <div>
              <label htmlFor="mk-acc-email" className={css.label}>{t('auth.email')}</label>
              <input id="mk-acc-email" value={s.email} readOnly dir="ltr" className={css.input} style={{ ...ltrInput, background: MK.hover, color: MK.muted }} />
            </div>
          </div>
          {s.savedNote && <div role="status" className={css.hint} style={{ color: MK.okFg }}>{t('account.saved')}</div>}
          <button type="submit" className={css.primary} style={{ width: 'auto', padding: '12px 22px', marginTop: 14 }}>{t('account.save')}</button>
        </form>

        <div className={css.box}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h2 className={css.h2} style={{ margin: 0 }}>{t('account.workspaces')}</h2>
            <button type="button" onClick={a.addCompany} className={css.ghost} style={{ padding: '9px 16px', fontSize: 14, borderRadius: 10 }}>{t('account.createWs')}</button>
          </div>
          {s.companies.length === 0 && <div style={{ fontSize: 14.5, color: MK.muted, padding: '8px 0' }}>{t('account.none')}</div>}
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {s.companies.map((co, i) => (
              <li key={co.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 14px', alignItems: 'center', padding: '12px 0', borderTop: `1px solid ${C.borderHair}` }}>
                <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                  <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 16, color: C.ink }}>
                    <span>{name(co)}</span> <span dir="ltr" style={handleStyle}>@{co.handle}</span>
                  </div>
                  <div style={{ fontSize: 13.5, color: MK.muted }}><span>{t(`roles.${co.role}`)}</span> · <span>{t('common.orgsCount', { count: co.entities.length })}</span></div>
                </div>
                {co.id === s.activeCo
                  ? <span style={{ ...chip(C.aquaBg, MK.teal, 13), padding: '5px 12px' }}>{t('account.current')}</span>
                  : <button type="button" onClick={() => a.switchCompany(i)} style={btn}>{t('account.switch')}</button>}
                <button type="button" onClick={() => a.openCompany(co.id)} style={btn}>{t('account.open')}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
