'use client';

import { useEffect, useRef } from 'react';
import { C, FONT } from '../theme';
import { ShieldCheck } from '../CloudIcons';
import type { State } from './state';
import type { MkActions } from './useMarketplace';
import { Alert, CenterLink, codeInput, css, ltrInput, MK, useMt } from './ui';

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false" style={{ flex: 'none' }}>
      <path d="M23 12.245c0-.905-.075-1.565-.236-2.25h-10.54v4.083h6.186c-.124 1.014-.797 2.542-2.294 3.569l-.021.136 3.332 2.53.23.022C21.779 18.417 23 15.593 23 12.245z" fill="#4285F4" />
      <path d="M12.225 23c3.03 0 5.574-.978 7.433-2.665l-3.542-2.688c-.948.648-2.22 1.1-3.891 1.1a6.745 6.745 0 01-6.386-4.572l-.132.011-3.465 2.628-.045.124C4.043 20.531 7.835 23 12.225 23z" fill="#34A853" />
      <path d="M5.84 14.175A6.65 6.65 0 015.463 12c0-.758.138-1.491.361-2.175l-.006-.147-3.508-2.67-.115.054A10.831 10.831 0 001 12c0 1.772.436 3.447 1.197 4.938l3.642-2.763z" fill="#FBBC05" />
      <path d="M12.225 5.253c2.108 0 3.529.892 4.34 1.638l3.167-3.031C17.787 2.088 15.255 1 12.225 1 7.834 1 4.043 3.469 2.197 7.062l3.63 2.763a6.77 6.77 0 016.398-4.572z" fill="#EB4335" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false" fill="#000" style={{ flex: 'none' }}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export default function Auth({ s, a }: { s: State; a: MkActions }) {
  const { t } = useMt();
  const signup = s.authMode === 'signup';
  const codeRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (s.authStep === 'code') codeRef.current?.focus();
  }, [s.authStep]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (s.authStep === 'code') a.verifyCode();
    else a.submitAuth();
  };

  return (
    <section className={css.view} style={{ padding: 'clamp(40px,7vw,88px) 0', background: `linear-gradient(180deg,${C.blueBg} 0%,${C.bg} 100%)`, minHeight: '70vh' }}>
      <div style={{ maxWidth: 460, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 24, padding: 'clamp(24px,4vw,36px)', boxShadow: '0 20px 50px rgba(20,32,43,.08)' }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: C.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blueDark, marginBottom: 18 }}>
            <ShieldCheck style={{ width: 26, height: 26 }} />
          </div>
          <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color: C.blueDark }}>{t('auth.kicker')}</div>
          <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 26, margin: '6px 0 8px', color: C.ink }}>{t(signup ? 'auth.titleSignup' : 'auth.titleSignin')}</h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: '0 0 18px' }}>{t('auth.lead')}</p>

          <form onSubmit={submit} noValidate>
            {s.authStep === 'form' ? (
              <>
                <div role="tablist" aria-label={t('auth.tablist')} style={{ display: 'flex', gap: 4, padding: 4, background: MK.chipBg, borderRadius: 12, marginBottom: 18 }}>
                  <button type="button" role="tab" className={css.tab} aria-selected={signup} onClick={() => a.setMode('signup')}>{t('auth.tabSignup')}</button>
                  <button type="button" role="tab" className={css.tab} aria-selected={!signup} onClick={() => a.setMode('signin')}>{t('auth.tabSignin')}</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 8 }}>
                  <button type="button" onClick={() => a.sso(t('auth.defaultUser'))} className={css.sso}><GoogleMark /><span dir="ltr">Google</span></button>
                  <button type="button" onClick={() => a.sso(t('auth.defaultUser'))} className={css.sso}><AppleMark /><span dir="ltr">Apple</span></button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0', color: MK.muted, fontSize: 13 }}>
                  <span style={{ flex: 1, height: 1, background: C.borderHair }} />
                  {t('auth.or')}
                  <span style={{ flex: 1, height: 1, background: C.borderHair }} />
                </div>
                {signup && (
                  <>
                    <label htmlFor="mk-uname" className={css.label}>{t('auth.name')}</label>
                    <input id="mk-uname" value={s.uname} onChange={(e) => a.setUname(e.target.value)} autoComplete="name" className={css.input} style={{ marginBottom: 12 }} />
                  </>
                )}
                <label htmlFor="mk-email" className={css.label}>{t('auth.email')}</label>
                <input id="mk-email" value={s.email} onChange={(e) => a.setEmail(e.target.value)} type="email" dir="ltr" autoComplete="email" placeholder="name@example.com" className={css.input} style={{ ...ltrInput, marginBottom: 12 }} />
                <label htmlFor="mk-pass" className={css.label}>{t('auth.pass')}</label>
                <input id="mk-pass" value={s.pass} onChange={(e) => a.setPass(e.target.value)} type="password" dir="ltr" autoComplete={signup ? 'new-password' : 'current-password'} className={css.input} style={ltrInput} aria-describedby={signup ? 'mk-pass-hint' : undefined} />
                {signup && (
                  <>
                    <div id="mk-pass-hint" className={css.hint}>{t('auth.passHint')}</div>
                    <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 14, fontSize: 14, lineHeight: 1.6, color: C.ink2, cursor: 'pointer' }}>
                      <input type="checkbox" checked={s.uagree} onChange={(e) => a.setUagree(e.target.checked)} style={{ marginTop: 4, width: 18, height: 18, accentColor: C.blue }} />
                      <span>{t('auth.agree')}</span>
                    </label>
                  </>
                )}
                <button type="submit" className={css.primary} style={{ marginTop: 16 }}>{t(signup ? 'auth.ctaSignup' : 'auth.ctaSignin')}</button>
              </>
            ) : (
              <>
                <div style={{ padding: '12px 14px', borderRadius: 12, background: MK.chipBg, fontSize: 14, color: C.ink2, marginBottom: 16 }}>
                  {t.rich('auth.codeSent', { email: s.email, ltr: (chunks) => <span dir="ltr" style={{ fontWeight: 600 }}>{chunks}</span> })}
                </div>
                <label htmlFor="mk-code" className={css.label}>{t('common.codeLabel')}</label>
                <input ref={codeRef} id="mk-code" value={s.code} onChange={(e) => a.setCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" dir="ltr" maxLength={6} placeholder="••••••" className={css.input} style={codeInput} aria-describedby="mk-code-hint" />
                <div id="mk-code-hint" className={css.hint}>{t('common.codeHint')}</div>
                <button type="submit" className={css.primary} style={{ marginTop: 16 }}>{t('common.confirmEmail')}</button>
                <button type="button" onClick={a.backToEmail} style={{ width: '100%', minHeight: 44, marginTop: 8, padding: 10, border: 'none', background: 'none', color: C.blueDark, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>{t('auth.changeEmail')}</button>
              </>
            )}
          </form>
          <Alert>{s.authErr ? t(s.authErr) : null}</Alert>
        </div>
        <CenterLink onClick={a.goDirectory}>{t('common.back')}</CenterLink>
      </div>
    </section>
  );
}
