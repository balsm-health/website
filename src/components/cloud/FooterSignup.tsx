'use client';

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { FONT } from './theme';

type Kind = 'news' | 'wait';
type Status = 'idle' | 'loading' | 'error' | 'done';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Visually hidden but read by screen readers (the design labels the fields
// this way: the placeholder alone is not a label).
const srOnly: React.CSSProperties = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' };

/**
 * The footer's "Stay close to Balsm" block (BalsmFooter.dc.html, #newsletter):
 * one email field that either subscribes to the newsletter (/api/newsletter)
 * or joins the accounts-and-marketplace waitlist (/api/waitlist, source
 * 'home', with an optional message).
 */
export default function FooterSignup() {
  const t = useTranslations('siteFooter.newsletter');
  const locale = useLocale();
  const pathname = usePathname();
  const [kind, setKind] = useState<Kind>('news');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const radios = useRef<(HTMLButtonElement | null)[]>([]);

  const news = kind === 'news';
  const busy = status === 'loading';
  const bad = status === 'error' && !!error;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!EMAIL.test(v)) {
      setStatus('error');
      setError(t('invalid'));
      emailRef.current?.focus();
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const res = news
        ? await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: v, locale, page: pathname }),
          })
        : await fetch('/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: v, message: message.trim() || undefined, locale, source: 'home' }),
          });
      const data = await res.json().catch(() => ({}));
      // Already on the list counts as success: the visitor's goal is met.
      if (!res.ok && data.code !== 'duplicate') {
        setStatus('error');
        setError(data.code === 'invalid' ? t('invalid') : t('error'));
        return;
      }
      setStatus('done');
    } catch {
      setStatus('error');
      setError(t('error'));
    }
  };

  // Radio-group keyboard pattern: arrows move and select.
  const onRadioKey = (e: React.KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const next: Kind = news ? 'wait' : 'news';
    setKind(next);
    radios.current[next === 'news' ? 0 : 1]?.focus();
  };

  const chip = (on: boolean): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, padding: '0 16px 0 14px', border: 'none', borderRadius: 999,
    cursor: 'pointer', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13.5,
    background: on ? '#fff' : 'transparent', color: on ? '#14202B' : 'rgba(255,255,255,.78)',
  });
  const dot = (on: boolean): React.CSSProperties => ({
    width: 14, height: 14, flex: 'none', borderRadius: '50%', boxSizing: 'border-box',
    border: on ? '4.5px solid #14202B' : '2px solid rgba(255,255,255,.55)',
  });
  const field: React.CSSProperties = {
    minWidth: 0, borderRadius: 14, background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 16, outline: 'none',
  };

  return (
    <div
      id="newsletter"
      style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '22px 48px',
        padding: 'clamp(22px,3vw,32px)', marginBottom: 48, borderRadius: 22, background: 'rgba(255,255,255,.05)',
        border: '1px solid rgba(255,255,255,.1)', scrollMarginTop: 96,
      }}
    >
      <div style={{ flex: '1 1 320px', minWidth: 0 }}>
        <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(20px,2.4vw,26px)', lineHeight: 1.3, color: '#fff', margin: 0 }}>{t('title')}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,.7)', margin: '8px 0 0' }}>{t('desc')}</p>
      </div>

      <div style={{ flex: '1 1 400px', minWidth: 0 }}>
        {status === 'done' ? (
          <div role="status" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 18px', borderRadius: 16, background: 'rgba(85,215,127,.12)', border: '1px solid rgba(85,215,127,.35)' }}>
            <span aria-hidden style={{ width: 28, height: 28, flex: 'none', borderRadius: '50%', background: '#55D77F', color: '#14202B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>✓</span>
            <span style={{ fontSize: 15, lineHeight: 1.7, color: '#fff' }}>{t(news ? 'doneNews' : 'doneWait')}</span>
          </div>
        ) : (
          <>
            <div role="radiogroup" aria-label={t('kind')} style={{ display: 'inline-flex', gap: 2, padding: 3, marginBottom: 10, borderRadius: 999, background: 'rgba(255,255,255,.08)' }}>
              {(['news', 'wait'] as const).map((k, i) => (
                <button
                  key={k}
                  ref={(el) => { radios.current[i] = el; }}
                  type="button"
                  role="radio"
                  aria-checked={kind === k}
                  tabIndex={kind === k ? 0 : -1}
                  onClick={() => setKind(k)}
                  onKeyDown={onRadioKey}
                  style={chip(kind === k)}
                >
                  <span aria-hidden style={dot(kind === k)} />
                  <span>{t(k)}</span>
                </button>
              ))}
            </div>

            <form onSubmit={submit} noValidate style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <label htmlFor="bf-email" style={srOnly}>{t('email')}</label>
              <input
                ref={emailRef}
                id="bf-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                placeholder="name@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setError(''); } }}
                disabled={busy}
                aria-invalid={bad}
                aria-describedby={bad ? 'bf-error' : 'bf-note'}
                style={{ ...field, flex: '999 1 220px', minHeight: 50, padding: '0 16px', border: `1.5px solid ${bad ? '#FF8A78' : 'rgba(255,255,255,.18)'}`, fontFamily: FONT.body, textAlign: 'left' }}
              />
              <button
                type="submit"
                disabled={busy}
                style={{ flex: '1 0 auto', minHeight: 50, padding: '0 24px', border: 'none', borderRadius: 14, background: '#55D77F', color: '#14202B', fontFamily: FONT.cairo, fontWeight: 800, fontSize: 15.5, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.8 : 1 }}
              >
                {busy ? t('sending') : t(news ? 'ctaNews' : 'ctaWait')}
              </button>
              {!news && (
                <>
                  <label htmlFor="bf-msg" style={srOnly}>{t('message')}</label>
                  <textarea
                    id="bf-msg"
                    rows={2}
                    dir="auto"
                    maxLength={500}
                    placeholder={t('message')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={busy}
                    style={{ ...field, flex: '1 1 100%', padding: '12px 16px', border: '1.5px solid rgba(255,255,255,.18)', fontFamily: FONT.arabic, lineHeight: 1.6, resize: 'vertical' }}
                  />
                </>
              )}
            </form>
            {bad && <div id="bf-error" role="alert" style={{ marginTop: 8, fontSize: 13.5, color: '#FFB4A8' }}>{error}</div>}
            <div id="bf-note" style={{ marginTop: 8, fontSize: 12.5, lineHeight: 1.6, color: 'rgba(255,255,255,.6)' }}>{t(news ? 'noteNews' : 'noteWait')}</div>
          </>
        )}
      </div>
    </div>
  );
}
