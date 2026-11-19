'use client';

import { useEffect, useRef } from 'react';
import { C, FONT } from '../theme';
import { Check } from '../CloudIcons';
import { COUNTRIES, type Country } from './data';
import type { State } from './state';
import type { MkActions } from './useMarketplace';
import WsPicker from './WsPicker';
import { BackButton, css, ErrorList, FieldError, h1, kicker, lead, linkBtn, ltrInput, MK, page, section, useMt } from './ui';

// The "add an organization" form (the prototype's `verify` view).
export default function OrgForm({ s, a }: { s: State; a: MkActions }) {
  const { t } = useMt();
  const type = s.wsType || 'software';
  const c = s.company;
  const ok = a.cevIsOk(c);
  const codeStep = !ok && c.evStep === 'code';
  const codeRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (codeStep) codeRef.current?.focus();
  }, [codeStep]);

  return (
    <section className={css.view} style={section()}>
      <div style={page(720)}>
        <BackButton onClick={a.backToWsType}>{t('common.changeType')}</BackButton>
        <div style={kicker(MK.teal)}>{t('common.addOrg')}</div>
        <h1 style={h1()}>{t('org.title', { type: t(`types.${type}.label`) })}</h1>
        <p style={{ ...lead, margin: '0 0 26px' }}>{t('org.lead')}</p>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 22, padding: 'clamp(20px,3vw,30px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 16 }}>
          <div>
            <label htmlFor="mk-cname" className={css.label}>{t(`types.${type}.nameLabel`)}</label>
            <input id="mk-cname" value={c.name} onChange={(e) => a.setC('name', e.target.value)} className={css.input} />
          </div>
          <WsPicker s={s} a={a} />
          <div>
            <label htmlFor="mk-ccountry" className={css.label}>{t('org.country')}</label>
            <select id="mk-ccountry" value={c.country} onChange={(e) => a.setC('country', e.target.value as Country | '')} className={css.input}>
              <option value="">{t('org.chooseCountry')}</option>
              {COUNTRIES.map((k) => <option key={k} value={k}>{t(`countries.${k}`)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="mk-csite" className={css.label}>{t(`types.${type}.siteLabel`)}</label>
            <input id="mk-csite" value={c.site} onChange={(e) => a.setC('site', e.target.value)} dir="ltr" type="url" placeholder="https://" className={css.input} style={ltrInput} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="mk-cemail" className={css.label}>{t(`types.${type}.emailLabel`)}</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <input id="mk-cemail" value={c.email} onChange={(e) => a.setC('email', e.target.value)} type="email" dir="ltr" placeholder="name@organization.com" className={css.input} style={{ ...ltrInput, paddingRight: 42 }} aria-describedby="mk-cemail-hint" />
                {ok && (
                  <span role="img" aria-label={t('org.verifiedAria')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, borderRadius: '50%', background: MK.okFg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check strokeWidth={3} style={{ width: 14, height: 14 }} />
                  </span>
                )}
              </div>
              {!ok && !codeStep && (
                <button type="button" onClick={a.cevSend} style={{ flex: 'none', minHeight: 48, padding: '0 18px', borderRadius: 12, border: `1.5px solid ${C.blue}`, background: '#fff', color: C.blueDark, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14.5, cursor: 'pointer', whiteSpace: 'nowrap' }}>{t('org.verify')}</button>
              )}
              {ok && <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', padding: '0 14px', borderRadius: 12, background: C.greenBg, color: MK.okDark, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>{t('org.verified')}</span>}
            </div>
            {codeStep && (
              <div className={css.pop} style={{ marginTop: 10, padding: '12px 14px', borderRadius: 14, background: '#F7FAFE', border: '1px solid #C9DCF5' }}>
                <div style={{ fontSize: 13.5, color: C.ink2, marginBottom: 8 }}><span>{t('org.codeSentTo')}</span> <span dir="ltr" style={{ fontWeight: 600, color: C.ink }}>{c.email}</span></div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    ref={codeRef} id="mk-cev-code" aria-label={t('common.codeLabel')} value={c.evCode || ''} onChange={(e) => a.setCevCode(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); a.cevConfirm(); } }}
                    inputMode="numeric" autoComplete="one-time-code" dir="ltr" maxLength={6} placeholder="••••••" className={css.input}
                    style={{ flex: '1 1 160px', width: 'auto', minWidth: 0, textAlign: 'center', letterSpacing: '.45em', fontFamily: FONT.mono, fontSize: 18 }}
                  />
                  <button type="button" onClick={a.cevConfirm} className={css.primary} style={{ width: 'auto', padding: '0 20px' }}>{t('org.confirm')}</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 12px', marginTop: 8, fontSize: 13, color: MK.muted }}>
                  <span>{t('common.codeHint')}</span>
                  <button type="button" onClick={a.cevResend} className={css.hit} style={{ ...linkBtn, fontSize: 13 }}>{t('common.resend')}</button>
                  {s.cevResent && <span role="status" style={{ color: MK.okFg }}>✓ <span>{t('common.resent')}</span></span>}
                  <button type="button" onClick={a.cevCancel} className={css.hit} style={{ ...linkBtn, fontSize: 13, color: MK.muted }}>{t('common.cancel')}</button>
                </div>
              </div>
            )}
            <FieldError>{s.cevErr ? t(s.cevErr) : null}</FieldError>
            <div id="mk-cemail-hint" className={css.hint}>{t(`types.${type}.emailHint`)}</div>
          </div>
          <label style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14.5, lineHeight: 1.6, color: C.ink2, cursor: 'pointer' }}>
            <input type="checkbox" checked={c.agree} onChange={(e) => a.setC('agree', e.target.checked)} style={{ marginTop: 4, width: 18, height: 18, accentColor: C.blue }} />
            <span>{t('org.agree')}</span>
          </label>
        </div>
        <ErrorList errors={s.errors} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button type="button" onClick={a.submitCompany} className={css.primary} style={{ width: 'auto', padding: '14px 28px' }}>{t('org.submit')}</button>
        </div>
      </div>
    </section>
  );
}
