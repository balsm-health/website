'use client';

import { useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { C, FONT, TEXT } from './theme';
import { AlertCircle, CheckCircle2, Lock } from './CloudIcons';
import { captureError } from '@/lib/observability';

/**
 * Early-access sign-up for the patient app beta, shown on /download while
 * nothing is installable yet. Makes the same waitlist call as the Home form,
 * `source: 'home'` included: it is a value the table's CHECK constraint already
 * accepts. A dedicated source would need a schema change first, and without it
 * every submit failed.
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
        body: JSON.stringify({ email: v, locale, source: 'home' }),
      });
      const data = await res.json().catch(() => ({}));
      // Already on the list is a success from the reader's side.
      if (!res.ok && data.code !== 'duplicate') {
        setStatus('error');
        setError(t('errorGeneric'));
        captureError(new Error(`beta signup failed: ${res.status} ${data.code ?? ''}`), { source: 'download', status: res.status });
        return;
      }
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setError(t('errorGeneric'));
      captureError(err, { source: 'download', phase: 'network' });
    }
  };

  // Download.dc.html: one green line in place of the form, not a card.
  if (status === 'success') {
    return (
      <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', background: '#E6F8EC', borderRadius: 14, maxWidth: 520 }}>
        <CheckCircle2 style={{ width: 22, height: 22, color: '#1F8A47', flex: 'none' }} />
        <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color: '#145C30' }}>{t('success')}</span>
      </div>
    );
  }

  const invalid = status === 'error' && !!error;

  return (
    <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 520, marginTop: 4 }}>
      <label htmlFor={`${id}-email`} style={{ fontFamily: FONT.cairo, fontWeight: 600, fontSize: 14, color: C.ink2 }}>
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
          // An LTR address, but it sits on the reading edge of the page.
          style={{ flex: '1 1 240px', minWidth: 0, height: 52, padding: '0 16px', borderRadius: 14, border: `1.5px solid ${invalid ? C.danger : C.borderSoft}`, background: C.white, fontFamily: FONT.body, fontSize: 16, color: C.ink, textAlign: locale === 'ar' ? 'right' : 'left', boxSizing: 'border-box' }}
        />
        {/* FILL.blue with a white label — the documented exception, as .links-save. */}
        <button
          type="submit"
          className="dl-join"
          disabled={status === 'loading'}
          style={{ flex: '0 0 auto', height: 52, padding: '0 24px', border: 'none', borderRadius: 999, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16, cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.75 : 1, boxShadow: '0 8px 20px rgba(18,131,255,.22)' }}
        >
          {status === 'loading' ? t('sending') : t('button')}
        </button>
      </div>
      {invalid && (
        <div id={`${id}-error`} role="alert" style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4, color: TEXT.danger, fontSize: 14.5 }}>
          <AlertCircle style={{ width: 16, height: 16, flex: 'none' }} /><span>{error}</span>
        </div>
      )}
      <div id={`${id}-privacy`} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, lineHeight: 1.6, color: C.ltTagText }}>
        <Lock style={{ width: 15, height: 15, flex: 'none', marginTop: 3 }} />
        <span>{t('privacy')}</span>
      </div>
    </form>
  );
}
