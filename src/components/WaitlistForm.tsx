'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export default function WaitlistForm() {
  const t = useTranslations('waitlist');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
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
        body: JSON.stringify({ email, message: message.trim() || undefined, locale }),
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
      setMessage('');
    } catch {
      setStatus('error');
      setErrorMessage(t('errorGeneric'));
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8 bg-gradient-to-br from-primary-bg to-white dark:to-slate-800 rounded-3xl border border-primary/20 dark:border-primary/30 shadow-xl shadow-primary/10 celebrate">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/30 animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">{t('success').split('!')[0]}!</h3>
        <p className="text-text-secondary">{t('success').split('!')[1] || ''}</p>
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-4 left-1/4 w-2 h-2 bg-primary/40 rounded-full particle" />
          <span className="absolute top-8 right-1/4 w-3 h-3 bg-primary-light/40 rounded-full particle" />
          <span className="absolute bottom-8 left-1/3 w-2 h-2 bg-primary/30 rounded-full particle" />
          <span className="absolute bottom-4 right-1/3 w-2 h-2 bg-primary-light/30 rounded-full particle" />
        </div>
      </div>
    );
  }

  const clearError = () => {
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto" suppressHydrationWarning>
      <div className={`relative flex flex-col gap-3 p-4 bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-slate-200 dark:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 ${status === 'error' ? 'shake' : ''}`} suppressHydrationWarning>
        {/* Email input */}
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError();
          }}
          placeholder={t('placeholder')}
          disabled={status === 'loading'}
          className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-text-secondary dark:text-slate-300 placeholder:text-text-tertiary dark:placeholder:text-slate-400 focus:outline-none focus:bg-primary-bg/30 dark:focus:bg-slate-700 disabled:opacity-50 transition-all duration-300 text-base border border-slate-200 dark:border-slate-600/50"
        />

        {/* Optional message textarea */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('messagePlaceholder')}
          disabled={status === 'loading'}
          rows={2}
          className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-text-secondary dark:text-slate-300 placeholder:text-text-tertiary dark:placeholder:text-slate-400 focus:outline-none focus:bg-primary-bg/30 dark:focus:bg-slate-700 disabled:opacity-50 transition-all duration-300 text-base border border-slate-200 dark:border-slate-600/50 resize-none"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-gradient px-6 py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 ripple w-full"
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
