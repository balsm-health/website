'use client';

import { useEffect, useRef } from 'react';
import { C, FONT } from '../theme';
import { findEntity, type State } from './state';
import type { MkActions } from './useMarketplace';
import { Alert, CenterLink, codeInput, css, h1, kicker, lead, linkBtn, ltrInput, MK, page, section, useMt } from './ui';

const soonChip = { padding: '4px 10px', borderRadius: 999, background: MK.chipBg, color: MK.muted, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12.5 } as const;

export default function EmailVerify({ s, a }: { s: State; a: MkActions }) {
  const { t, name } = useMt();
  const codeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const codeStep = s.evStep === 'code';
  // Move focus with the step (send → enter code, "change" → email), not on arrival.
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) (codeStep ? codeRef : emailRef).current?.focus();
    mounted.current = true;
  }, [codeStep]);

  return (
    <section className={css.view} style={{ ...section(), minHeight: '60vh' }}>
      <div style={page(520)}>
        <div style={kicker(MK.teal)}><span>{t('emailV.kicker')}</span> · <span>{name(findEntity(s, s.evFor)?.e)}</span></div>
        <h1 style={h1()}>{t('emailV.title')}</h1>
        <p style={{ ...lead, margin: '0 0 20px' }}>{t('emailV.lead')}</p>
        <form className={css.box} noValidate onSubmit={(e) => { e.preventDefault(); if (codeStep) a.confirmEvCode(); else a.sendEvCode(); }}>
          {!codeStep ? (
            <>
              <label htmlFor="mk-ev-email" className={css.label}>{t('emailV.workEmail')}</label>
              <input ref={emailRef} id="mk-ev-email" type="email" dir="ltr" value={s.evEmail} onChange={(e) => a.setEvEmail(e.target.value)} autoComplete="email" placeholder="name@company.com" className={css.input} style={ltrInput} aria-describedby="mk-ev-email-hint" />
              <div id="mk-ev-email-hint" className={css.hint}>{t('emailV.hint')}</div>
              <button type="submit" className={css.primary} style={{ marginTop: 16 }}>{t('emailV.send')}</button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 10px', padding: '12px 14px', borderRadius: 12, background: MK.chipBg, fontSize: 14, color: C.ink2, marginBottom: 16 }}>
                <span>{t('emailV.sentTo')}</span> <span dir="ltr" style={{ fontWeight: 600, color: C.ink }}>{s.evEmail}</span>{' '}
                <button type="button" onClick={a.evChangeEmail} className={css.hit} style={{ ...linkBtn, textDecoration: 'underline' }}>{t('emailV.change')}</button>
              </div>
              <label htmlFor="mk-ev-code" className={css.label}>{t('common.codeLabel')}</label>
              <input ref={codeRef} id="mk-ev-code" value={s.evCode} onChange={(e) => a.setEvCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" dir="ltr" maxLength={6} placeholder="••••••" className={css.input} style={codeInput} aria-describedby="mk-ev-code-hint" />
              <div id="mk-ev-code-hint" className={css.hint}>{t('common.codeHint')}</div>
              <button type="submit" className={css.primary} style={{ marginTop: 16 }}>{t('common.confirmEmail')}</button>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 13.5, color: MK.muted }}>
                <span>{t('emailV.notReceived')}</span>
                <button type="button" onClick={a.resendEvCode} className={css.hit} style={linkBtn}>{t('common.resend')}</button>
                {s.evResent && <span role="status" style={{ color: MK.okFg }}>✓ <span>{t('common.resent')}</span></span>}
              </div>
            </>
          )}
          <Alert>{s.evErr ? t(s.evErr) : null}</Alert>
        </form>
        <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 16, border: `1px dashed ${MK.border2}`, background: '#fff' }}>
          <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13.5, color: C.ink, marginBottom: 8 }}>{t('emailV.moreTitle')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <span style={soonChip}>{t('emailV.domain')}</span>
            <span style={soonChip}>{t('emailV.phone')}</span>
            <span style={soonChip}>{t('emailV.docs')}</span>
          </div>
        </div>
        <CenterLink onClick={a.skipEv}>{t('emailV.later')}</CenterLink>
      </div>
    </section>
  );
}
