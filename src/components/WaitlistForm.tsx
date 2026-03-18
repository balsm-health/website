'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export default function WaitlistForm() {
  const t = useTranslations('waitlist');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage(t('errorInvalid'));
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        if (data.code === 'duplicate') {
          setErrorMessage(t('errorDuplicate'));
        } else {
          setErrorMessage(t('errorGeneric'));
        }
        return;
      }

      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage(t('errorGeneric'));
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8 bg-gradient-to-br from-primary-bg to-white dark:to-slate-800 rounded-3xl border border-primary/20 dark:border-primary/30 shadow-xl shadow-primary/10 fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/30">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">{t('success').split('!')[0]}!</h3>
        <p className="text-text-secondary">{t('success').split('!')[1] || ''}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto" suppressHydrationWarning>
      <div className="relative flex flex-col sm:flex-row gap-3 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-white/50 dark:border-slate-700/50" suppressHydrationWarning>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') {
              setStatus('idle');
              setErrorMessage('');
            }
          }}
          placeholder={t('placeholder')}
          disabled={status === 'loading'}
          className="flex-1 px-5 py-4 rounded-xl bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-primary-bg/30 disabled:opacity-50 transition-all duration-300 input-focus text-base"
          dir="ltr"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-gradient px-8 py-4 rounded-xl font-bold text-white whitespace-nowrap min-w-[160px] text-base flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t('submitting')}
            </>
          ) : (
            <>
              {t('button')}
              <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>
      {/* Always render error container to avoid hydration issues with browser extensions */}
      <div
        className={`mt-4 flex items-center justify-center gap-2 text-sm text-danger transition-all duration-300 ${
          status === 'error' && errorMessage ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
        aria-live="polite"
        suppressHydrationWarning
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span suppressHydrationWarning>{errorMessage || '\u00A0'}</span>
      </div>
    </form>
  );
}
