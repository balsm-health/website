'use client';

import { useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { C, FONT, TEXT } from './theme';
import { AlertCircle, Check } from './CloudIcons';
import { captureError } from '@/lib/observability';

/**
 * Early-access sign-up for the patient app beta, shown on /download while
 * nothing is installable yet. Writes to the same waitlist as Home and Cloud,
 * tagged `app_beta` so these people can be invited on their own.
 */
export default function BetaSignup() {
  const t = useTranslations('download.beta');
  const locale = useLocale();
  const id = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setStatus('error');
      setError(t('errorInvalid'));
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: v, locale, source: 'app_beta' }),
      });
      const data = await res.json().catch(() => ({}));
      // Already on the list is a success from the reader's side.
      if (!res.ok && data.code !== 'duplicate') {
        setStatus('error');
        setError(t('errorGeneric'));
        captureError(new Error(`beta signup failed: ${res.status} ${data.code ?? ''}`), { source: 'app_beta', status: res.status });
        return;
      }
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setError(t('errorGeneric'));
      captureError(err, { source: 'app_beta', phase: 'network' });
    }
  };

  if (status === 'success') {
    return (
      <div role="status" style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: C.white, border: `1px solid ${C.aquaBorder}`, borderRadius: 18, padding: '22px 24px', maxWidth: 560, boxShadow: '0 8px 24px rgba(20,32,43,.06)' }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, flex: 'none' }}>
          <Check style={{ width: 24, height: 24 }} strokeWidth={2.5} />
        </span>
        <div>
          <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 20, color: C.ink, margin: '2px 0 4px' }}>{t('successTitle')}</div>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{t('successDesc')}</p>
        </div>
      </div>
    );
  }

  const invalid = status === 'error' && !!error;

  return (
    <form onSubmit={submit} noValidate style={{ maxWidth: 560 }}>
      <label htmlFor={`${id}-email`} style={{ display: 'block', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color: C.ink2, marginBottom: 10 }}>
        {t('label')}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <input
          id={`${id}-email`}
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setError(''); } }}
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          required
          maxLength={254}
          placeholder={t('placeholder')}
          disabled={status === 'loading'}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : `${id}-privacy`}
          // Takes the spare width beside the button; the button only fills a row
          // of its own, i.e. once it has wrapped on a phone.
          style={{ flex: '999 1 240px', minWidth: 0, minHeight: 56, padding: '14px 18px', borderRadius: 14, border: `1.5px solid ${invalid ? C.danger : C.borderSoft}`, background: C.white, fontFamily: FONT.body, fontSize: 16, color: C.ink, textAlign: 'left', boxSizing: 'border-box' }}
        />
        {/* Ink, not the blue petal: white on #1283FF is 3.67:1, under AA at 16px. */}
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{ flex: '1 0 auto', minHeight: 56, padding: '14px 26px', borderRadius: 14, border: 'none', background: C.ink, color: C.white, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16, cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.75 : 1, boxShadow: '0 10px 24px rgba(20,32,43,.16)' }}
        >
          {status === 'loading' ? t('sending') : t('button')}
        </button>
      </div>
      {invalid && (
        <div id={`${id}-error`} role="alert" style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12, color: TEXT.danger, fontSize: 14.5 }}>
          <AlertCircle style={{ width: 16, height: 16, flex: 'none' }} /><span>{error}</span>
        </div>
      )}
      <p id={`${id}-privacy`} style={{ fontSize: 13.5, lineHeight: 1.7, color: C.ink2, margin: '14px 0 0' }}>{t('privacy')}</p>
    </form>
  );
}
