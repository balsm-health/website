'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { C, FILL, FONT, MOTION } from './theme';
import { useInView } from './useReveal';
import { Check, AlertCircle } from './CloudIcons';
import AnimatedLogo from './AnimatedLogo';
import { captureError } from '@/lib/observability';

export default function CloudWaitlist() {
  const t = useTranslations('cloud.join');
  const locale = useLocale();
  const { ref, inView } = useInView(0.15);

  const [entity, setEntity] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const validate = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = entity.trim();
    const v = email.trim();
    // Entity is checked first because it's the first field on screen — erroring
    // on the email while the field above it is still blank reads as a non-sequitur.
    if (!name) {
      setStatus('error');
      setError(t('errorEntity'));
      return;
    }
    if (!validate(v)) {
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
        // `organization` is the column the API already writes (same field the
        // providers form fills with a clinic name) — no schema change needed.
        body: JSON.stringify({ email: v, organization: name, message: message.trim() || undefined, locale, source: 'cloud' }),
      });
      const data = await res.json().catch(() => ({}));
      // A duplicate means they're already on the list, so it's a success from
      // the reader's point of view — not a red error telling them off.
      if (!res.ok && data.code !== 'duplicate') {
        setStatus('error');
        setError(t('errorGeneric'));
        // Note: no email/PII in the captured context.
        captureError(new Error(`waitlist submit failed: ${res.status} ${data.code ?? ''}`), {
          source: 'cloud',
          status: res.status,
        });
        return;
      }
      setStatus('success');
      setEntity('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setError(t('errorGeneric'));
      captureError(err, { source: 'cloud', phase: 'network' });
    }
  };

  const reveal: React.CSSProperties = {
    transition: MOTION.revealTransition,
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : `translateY(${MOTION.revealY}px)`,
  };

  return (
    <section id="join" style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }} ref={ref}>
        <div style={reveal}>
          <div style={{ width: 60, height: 60, margin: '0 auto 22px', animation: 'balsm-float 6s ease-in-out infinite' }}>
            <AnimatedLogo size={60} idle="breathe" />
          </div>
          <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.6vw,52px)', lineHeight: 1.14, color: C.ink, margin: '0 0 14px' }}>
            {t('title')}
          </h2>
          <p style={{ fontSize: 'clamp(16px,1.8vw,20px)', lineHeight: 1.8, color: C.ink2, margin: '0 auto 32px', maxWidth: 540 }}>
            {t('desc')}
          </p>
        </div>

        {status === 'success' ? (
          <div
            style={{
              background: C.white,
              border: '1px solid #CFE3FF',
              borderRadius: 20,
              padding: 34,
              boxShadow: '0 8px 24px rgba(43,43,37,.06)',
              maxWidth: 520,
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: C.blueBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.blue,
                margin: '0 auto 16px',
              }}
            >
              <Check style={{ width: 30, height: 30 }} strokeWidth={2.5} />
            </div>
            <h3 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 23, margin: '0 0 8px', color: C.ink }}>{t('successTitle')}</h3>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{t('successDesc')}</p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ maxWidth: 520, margin: '0 auto', ...reveal }} noValidate>
            {/* Stacked, every control full width — the design dropped the
                email+button row so the facility name reads as the first step. */}
            <input
              value={entity}
              onChange={(e) => {
                setEntity(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setError('');
                }
              }}
              placeholder={t('entityPlaceholder')}
              disabled={status === 'loading'}
              aria-label={t('entityPlaceholder')}
              style={{ width: '100%', marginBottom: 10, padding: '15px 18px', borderRadius: 14, border: `1.5px solid ${C.borderSoft}`, background: C.white, fontFamily: FONT.arabic, fontSize: 16, color: C.ink, outline: 'none', boxSizing: 'border-box' }}
            />

            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setError('');
                }
              }}
              type="email"
              dir="ltr"
              placeholder={t('placeholder')}
              disabled={status === 'loading'}
              aria-label={t('placeholder')}
              style={{ width: '100%', marginBottom: 10, padding: '15px 18px', borderRadius: 14, border: `1.5px solid ${C.borderSoft}`, background: C.white, fontFamily: FONT.body, fontSize: 16, color: C.ink, textAlign: 'left', outline: 'none', boxSizing: 'border-box' }}
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder={t('messagePlaceholder')}
              disabled={status === 'loading'}
              aria-label={t('messagePlaceholder')}
              style={{ width: '100%', marginBottom: 10, padding: '15px 18px', borderRadius: 14, border: `1.5px solid ${C.borderSoft}`, background: C.white, fontFamily: FONT.arabic, fontSize: 15, color: C.ink, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
            />

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                width: '100%',
                padding: '15px 28px',
                borderRadius: 14,
                border: 'none',
                background: FILL.blue,
                color: C.white,
                fontFamily: FONT.cairo,
                fontWeight: 700,
                fontSize: 16,
                cursor: status === 'loading' ? 'wait' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1,
                boxShadow: '0 10px 24px rgba(18,131,255,.24)',
              }}
            >
              {t('button')}
            </button>

            {status === 'error' && error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', marginTop: 14, color: C.danger, fontSize: 14 }}>
                <AlertCircle style={{ width: 16, height: 16 }} />
                <span>{error}</span>
              </div>
            )}

            <p style={{ fontSize: 13, color: C.muted, margin: '16px 0 0' }}>{t('privacy')}</p>
          </form>
        )}
      </div>
    </section>
  );
}
