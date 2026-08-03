'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FONT } from './theme';
import Reveal from './Reveal';
import { captureError } from '@/lib/observability';
import {
  ArrowRight, Terminal, Server, ShieldCheck, BadgeDollarSign, WifiOff, ScanBarcode, Package,
  ClipboardList, ShieldAlert, UsersRound, BarChart3, Check, AlertCircle,
} from './CloudIcons';

type Card = { title: string; desc: string };
type Trust = { title: string; sub: string };

const container: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
const eyebrow = (color: string): React.CSSProperties => ({ fontFamily: FONT.display, fontWeight: 700, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color, textAlign: 'start' });

const TRUST_ICONS = [
  { Icon: Server, bg: C.aquaBg, color: C.aqua },
  { Icon: ShieldCheck, bg: C.blueBg, color: C.blue },
  { Icon: BadgeDollarSign, bg: C.greenBg, color: C.green },
  { Icon: WifiOff, bg: C.violetBg, color: C.violet },
];
const FEATURE_ICONS = [
  { Icon: ScanBarcode, bg: C.aquaBg, color: C.aqua },
  { Icon: Package, bg: C.blueBg, color: C.blue },
  { Icon: ClipboardList, bg: C.greenBg, color: C.green },
  { Icon: ShieldAlert, bg: C.violetBg, color: C.violet },
  { Icon: UsersRound, bg: C.amberBg, color: C.amber },
  { Icon: BarChart3, bg: C.aquaBg, color: C.aqua },
];

export default function ProvidersSections() {
  const t = useTranslations('providers');
  const locale = useLocale();
  const trust = t.raw('trust') as Trust[];
  const features = t.raw('features.cards') as Card[];
  const selfFeatures = t.raw('pricing.selfHost.features') as string[];
  const cloudFeatures = t.raw('pricing.cloud.features') as string[];
  const arrowFlip = locale === 'ar' ? 'rotate(180deg)' : 'none';

  return (
    <>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(44px,7vw,88px) 0 clamp(48px,7vw,92px)', background: 'linear-gradient(180deg,#E2F8F6 0%, #FAFAF7 100%)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', insetInlineStart: -100, top: -80, width: 320, opacity: 0.1, animation: 'balsm-spin 80s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', ...container }}>
          <Reveal style={{ maxWidth: 760 }}>
            <div dir="ltr" style={eyebrow('#019A7F')}>{t('hero.eyebrow')}</div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(34px,5.6vw,64px)', lineHeight: 1.12, color: C.ink, margin: '14px 0 18px' }}>
              {t('hero.title1')}<br />{t('hero.title2')}
            </h1>
            <p style={{ fontSize: 'clamp(17px,1.9vw,21px)', lineHeight: 1.75, color: C.ink2, margin: '0 0 30px', maxWidth: 600 }}>{t('hero.subtitle')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <a href="#demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 30px', borderRadius: 999, background: C.aqua, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17, boxShadow: '0 12px 28px rgba(2,187,181,.28)' }}>
                {t('hero.ctaDemo')}<ArrowRight style={{ width: 19, height: 19, transform: arrowFlip }} />
              </a>
              <a href="https://github.com/balsm-health" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 28px', borderRadius: 999, background: C.white, color: C.ink, border: `1.5px solid ${C.borderSoft}`, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17 }}>
                <Terminal style={{ width: 19, height: 19 }} />{t('hero.ctaSelf')}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ background: C.white, borderTop: `1px solid ${C.borderHair}`, borderBottom: `1px solid ${C.borderHair}` }}>
        <div style={{ ...container, padding: 'clamp(26px,4vw,40px) clamp(20px,5vw,56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: 22 }}>
          {trust.map((tr, i) => {
            const s = TRUST_ICONS[i];
            return (
              <Reveal key={i} delay={i * 60} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flex: 'none' }}>
                  <s.Icon style={{ width: 22, height: 22 }} />
                </span>
                <div>
                  <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16, color: C.ink }}>{tr.title}</div>
                  <div style={{ fontSize: 13, color: C.muted }}>{tr.sub}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg }}>
        <div style={container}>
          <Reveal style={{ maxWidth: 700, marginBottom: 46 }}>
            <div dir="ltr" style={eyebrow(C.emerald)}>{t('features.eyebrow')}</div>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.2vw,50px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 0' }}>{t('features.title')}</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 20 }}>
            {features.map((card, i) => {
              const s = FEATURE_ICONS[i];
              return (
                <Reveal key={i} delay={i * 60} className="balsm-lift" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, boxShadow: '0 2px 6px rgba(43,43,37,.05)' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 16 }}>
                    <s.Icon style={{ width: 23, height: 23 }} />
                  </div>
                  <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 20, color: C.ink, margin: '0 0 7px' }}>{card.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{card.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* OFFLINE BAND */}
      <section style={{ padding: 'clamp(56px,8vw,100px) 0', background: C.dark }}>
        <Reveal style={{ maxWidth: 980, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 18, background: 'rgba(2,187,181,.18)', color: C.aqua, marginBottom: 24 }}>
            <WifiOff style={{ width: 32, height: 32 }} />
          </span>
          <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.6vw,52px)', lineHeight: 1.2, color: '#fff', margin: '0 0 16px' }}>{t('offline.quote')}</h2>
          <p style={{ fontSize: 'clamp(16px,1.8vw,20px)', lineHeight: 1.8, color: 'rgba(255,255,255,.7)', margin: '0 auto', maxWidth: 620 }}>{t('offline.desc')}</p>
        </Reveal>
      </section>

      {/* PRICING */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}` }}>
        <div style={container}>
          <Reveal style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 46px' }}>
            <div dir="ltr" style={{ ...eyebrow(C.emerald), textAlign: 'center' }}>{t('pricing.eyebrow')}</div>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.2vw,50px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 0' }}>{t('pricing.title')}</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 22, maxWidth: 880, margin: '0 auto' }}>
            {/* Self-host */}
            <Reveal className="balsm-lift" style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 22, padding: 34 }}>
              <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 22, marginBottom: 6, color: C.ink }}>{t('pricing.selfHost.title')}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 18 }}>
                <span style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 40, color: C.ink }}>{t('pricing.selfHost.price')}</span>
                <span style={{ color: C.muted, fontSize: 15 }}>{t('pricing.selfHost.per')}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 15, color: '#3D3D34' }}>
                {selfFeatures.map((f) => (
                  <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Check style={{ width: 18, height: 18, color: C.green }} />{f}</div>
                ))}
              </div>
              <a href="https://github.com/balsm-health" target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', marginTop: 24, padding: 13, borderRadius: 999, border: `1.5px solid ${C.borderSoft}`, background: C.white, fontFamily: FONT.cairo, fontWeight: 700, color: C.ink }}>{t('pricing.selfHost.cta')}</a>
            </Reveal>
            {/* Cloud */}
            <Reveal delay={80} className="balsm-lift" style={{ background: 'linear-gradient(160deg,#E4F0FF,#fff)', border: `1.5px solid ${C.blue}`, borderRadius: 22, padding: 34, position: 'relative', boxShadow: '0 14px 36px rgba(18,131,255,.12)' }}>
              <span dir="ltr" style={{ position: 'absolute', top: 20, insetInlineEnd: 24, fontFamily: FONT.mono, fontSize: 11, letterSpacing: '.08em', color: C.blueDark, background: '#fff', padding: '4px 10px', borderRadius: 999 }}>{t('pricing.cloud.badge')}</span>
              <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 22, marginBottom: 6, color: C.ink }}>{t('pricing.cloud.title')}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 18 }}>
                <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 26, color: C.blue }}>{t('pricing.cloud.price')}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 15, color: '#3D3D34' }}>
                {cloudFeatures.map((f) => (
                  <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Check style={{ width: 18, height: 18, color: C.blue }} />{f}</div>
                ))}
              </div>
              <Link href="/cloud" style={{ display: 'block', textAlign: 'center', marginTop: 24, padding: 13, borderRadius: 999, background: C.blue, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, boxShadow: '0 10px 24px rgba(18,131,255,.24)' }}>{t('pricing.cloud.cta')}</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <ProvidersDemo />
    </>
  );
}

function ProvidersDemo() {
  const t = useTranslations('providers.demo');
  const locale = useLocale();
  const [clinic, setClinic] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const clear = () => { if (status === 'error') { setStatus('idle'); setError(''); } };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const c = clinic.trim();
    const v = email.trim();
    if (!c) { setStatus('error'); setError(t('errorClinic')); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setStatus('error'); setError(t('errorInvalid')); return; }
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: v, message: `[providers] ${c}${message.trim() ? ' — ' + message.trim() : ''}`, locale, source: 'providers' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok && data.code !== 'duplicate') {
        setStatus('error');
        setError(t('errorInvalid'));
        captureError(new Error(`providers demo failed: ${res.status}`), { source: 'providers', status: res.status });
        return;
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(t('errorInvalid'));
      captureError(err, { source: 'providers', phase: 'network' });
    }
  };

  const inputStyle: React.CSSProperties = { padding: '15px 18px', borderRadius: 14, border: `1.5px solid ${C.borderSoft}`, background: C.white, fontSize: 16, color: C.ink, outline: 'none' };

  return (
    <section id="demo" style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
        <Reveal>
          <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,50px)', lineHeight: 1.15, color: C.ink, margin: '0 0 14px' }}>{t('title')}</h2>
          <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', lineHeight: 1.8, color: C.ink2, margin: '0 auto 30px', maxWidth: 520 }}>{t('desc')}</p>
        </Reveal>
        {status === 'success' ? (
          <div style={{ background: C.white, border: '1px solid #CDEFEC', borderRadius: 20, padding: 34, boxShadow: '0 8px 24px rgba(43,43,37,.06)', maxWidth: 520, margin: '0 auto' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.aquaBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.aqua, margin: '0 auto 16px' }}>
              <Check style={{ width: 30, height: 30 }} strokeWidth={2.5} />
            </div>
            <h3 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 23, color: C.ink, margin: '0 0 8px' }}>{t('successTitle')}</h3>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{t('successDesc')}</p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ maxWidth: 520, margin: '0 auto', textAlign: 'start' }} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input value={clinic} onChange={(e) => { setClinic(e.target.value); clear(); }} placeholder={t('clinicPlaceholder')} disabled={status === 'loading'} aria-label={t('clinicPlaceholder')} style={{ ...inputStyle, fontFamily: FONT.arabic }} />
              <input value={email} onChange={(e) => { setEmail(e.target.value); clear(); }} type="email" dir="ltr" placeholder={t('emailPlaceholder')} disabled={status === 'loading'} aria-label={t('emailPlaceholder')} style={{ ...inputStyle, fontFamily: FONT.body, textAlign: 'left' }} />
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder={t('messagePlaceholder')} disabled={status === 'loading'} aria-label={t('messagePlaceholder')} style={{ ...inputStyle, fontFamily: FONT.arabic, resize: 'vertical', boxSizing: 'border-box' }} />
              <button type="submit" disabled={status === 'loading'} style={{ padding: 16, borderRadius: 14, border: 'none', background: C.aqua, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17, cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, boxShadow: '0 10px 24px rgba(2,187,181,.24)' }}>{t('button')}</button>
            </div>
            {status === 'error' && error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', marginTop: 14, color: C.danger, fontSize: 14 }}>
                <AlertCircle style={{ width: 16, height: 16 }} /><span>{error}</span>
              </div>
            )}
            <p style={{ fontSize: 13, color: C.muted, margin: '16px 0 0', textAlign: 'center' }}>{t('privacy')}</p>
          </form>
        )}
      </div>
    </section>
  );
}
