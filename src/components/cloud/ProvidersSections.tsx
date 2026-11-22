'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, DISPLAY, FILL, FONT, ON } from './theme';
import Reveal from './Reveal';
import { captureError } from '@/lib/observability';
import {
  ArrowRight, Terminal, Server, ShieldCheck, BadgeDollarSign, WifiOff, ScanBarcode, Package,
  ClipboardList, ShieldAlert, UsersRound, BarChart3, Check, AlertCircle,
  Stethoscope, Building2, Pill, Wifi,
} from './CloudIcons';

type Card = { title: string; desc: string };
type Trust = { title: string; sub: string };

const container: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
// Kickers are 19px bold, not 13px. Bold at >=18.66px is WCAG "large text",
// where the contrast bar drops from 4.5:1 to 3:1 — which is enough for the
// blue, violet and danger hues to be compliant at full strength. The rest
// remain part of the documented palette exception. Don't shrink these.
const eyebrow = (color: string): React.CSSProperties => ({ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color, textAlign: 'start' });

// Providers.dc.html motion: the site easing, and the form's error red (not a
// theme token — darker than C.danger so the per-field message clears AA).
const EASE = 'cubic-bezier(0.16,1,0.3,1)';
const FIELD_ERR = '#B83A2E';
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        {/* Physical `left`, matching the design: the bloom stays
            top-left in both directions. `insetInlineStart` flipped it to the
            right-hand corner under RTL, which is the locale that actually ships. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', left: -100, top: -80, width: 320, opacity: 0.1, animation: 'balsm-spin 80s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', ...container }}>
          <Reveal style={{ maxWidth: 760 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Hero kickers take the hue's -600 step, not the base hue —
                  the rule every design page follows (Cloud #0F6BCC, Contributors
                  #5C3AB0, here #019A7F). Section kickers further down stay on the
                  base hue. It also clears the 3:1 large-text bar this kicker
                  was missing: 2.02:1 → 3.20:1 on the hero gradient's #E2F8F6. */}
              <div style={eyebrow(C.emeraldDark)}>{t('hero.eyebrow')}</div>
              <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 11.5, padding: '3px 10px', borderRadius: 999, background: C.white, border: `1px solid ${C.aquaBorder}`, color: C.emeraldDark }}>
                {t('hero.roadmap')}
              </span>
            </div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(34px,5.6vw,64px)', lineHeight: 1.12, color: C.ink, margin: '14px 0 18px' }}>
              {t('hero.title1')}<br />{t('hero.title2')}
            </h1>
            <p style={{ fontSize: 'clamp(17px,1.9vw,21px)', lineHeight: 1.75, color: C.ink2, margin: '0 0 24px', maxWidth: 600 }}>{t('hero.subtitle')}</p>
            {/* Facility types, spelled out — the page now addresses hospitals and
                medical-supply stores, not just clinics and pharmacies. */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '0 0 28px' }}>
              {(t.raw('hero.facilities') as string[]).map((label, i) => {
                const Icon = [Stethoscope, Building2, Pill, Package][i] ?? Stethoscope;
                return (
                  <span
                    key={label}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 999, background: C.white, border: `1.5px solid ${C.aquaBorder}`, fontFamily: FONT.cairo, fontWeight: 600, fontSize: 14.5, color: C.emeraldDark }}
                  >
                    <Icon style={{ width: 16, height: 16 }} />
                    {label}
                  </span>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <a href="#demo" onClick={focusDemoField} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 30px', borderRadius: 999, background: C.aqua, color: ON.aqua, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17, boxShadow: '0 12px 28px rgba(2,187,181,.28)' }}>
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
            <div style={eyebrow(DISPLAY.emerald)}>{t('features.eyebrow')}</div>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.2vw,50px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 0' }}>{t('features.title')}</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 20 }}>
            {features.map((card, i) => {
              const s = FEATURE_ICONS[i];
              return (
                <Reveal key={i} delay={i * 60} className="balsm-lift" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, boxShadow: '0 2px 6px rgba(20, 32, 43,.05)' }}>
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
      <OfflineBand />

      {/* PRICING */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}` }}>
        <div style={container}>
          <Reveal style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 46px' }}>
            <div style={{ ...eyebrow(DISPLAY.emerald), textAlign: 'center' }}>{t('pricing.eyebrow')}</div>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 15, color: '#1F2D3D' }}>
                {selfFeatures.map((f) => (
                  <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Check style={{ width: 18, height: 18, color: C.green }} />{f}</div>
                ))}
              </div>
              <a href="https://github.com/balsm-health" target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', marginTop: 24, padding: 13, borderRadius: 999, border: `1.5px solid ${C.borderSoft}`, background: C.white, fontFamily: FONT.cairo, fontWeight: 700, color: C.ink }}>{t('pricing.selfHost.cta')}</a>
            </Reveal>
            {/* Cloud */}
            <Reveal delay={80} className="balsm-lift" style={{ background: 'linear-gradient(160deg,#E4F0FF,#fff)', border: `1.5px solid ${C.blue}`, borderRadius: 22, padding: 34, position: 'relative', boxShadow: '0 14px 36px rgba(18,131,255,.12)' }}>
              {/* Opposite corner from the title, not the same one. The design
                  hard-codes `right:24px`, but this page is RTL — so that is the
                  side the title starts on, and the chip lands on top of
                  "سحابة بلسم" (measured: 50×17px of glyph overlap).
                  insetInlineEnd keeps it clear in both directions. */}
              <span style={{ position: 'absolute', top: 20, insetInlineEnd: 24, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12, color: C.blueDark, background: '#fff', padding: '4px 10px', borderRadius: 999 }}>{t('pricing.cloud.badge')}</span>
              <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 22, marginBottom: 6, color: C.ink }}>{t('pricing.cloud.title')}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 18 }}>
                <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 26, color: C.blue }}>{t('pricing.cloud.price')}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 15, color: '#1F2D3D' }}>
                {cloudFeatures.map((f) => (
                  <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Check style={{ width: 18, height: 18, color: C.blue }} />{f}</div>
                ))}
              </div>
              <Link href="/products#network" style={{ display: 'block', textAlign: 'center', marginTop: 24, padding: 13, borderRadius: 999, background: FILL.blue, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, boxShadow: '0 10px 24px rgba(18,131,255,.24)' }}>{t('pricing.cloud.cta')}</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <ProvidersDemo />
    </>
  );
}

// The hero CTA scrolls to #demo; once the smooth scroll lands, put the caret
// in the first field (Providers.dc.html).
function focusDemoField() {
  window.setTimeout(() => document.getElementById('pv-clinic')?.focus({ preventScroll: true }), 650);
}

/** Play a one-off entrance on mount via WAAPI — the design's keyframes, no stylesheet needed. */
function useEntrance<T extends HTMLElement>(frames: Keyframe[], duration: number, delay = 0) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.animate !== 'function') return;
    const reduce = reducedMotion();
    el.animate(reduce ? [{ opacity: 0 }, { opacity: 1 }] : frames, { duration: reduce ? 200 : duration, delay: reduce ? 0 : delay, easing: reduce ? 'ease-out' : EASE, fill: 'both' });
    // Mount-only by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

/**
 * "The internet will go down someday" band. When it scrolls into view the wifi
 * icon swaps to wifi-off and a "still working" pill fades in.
 *
 * The server renders the end state (wifi-off + pill), so nothing is hidden
 * without JS. Only when the band starts below the fold, and motion is allowed,
 * do we rewind it to the start state and play the swap once it is 45% visible.
 */
function OfflineBand() {
  const t = useTranslations('providers.offline');
  const ref = useRef<HTMLElement>(null);
  const [rewound, setRewound] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !('IntersectionObserver' in window)) return;
    let first = true;
    let armed = false;
    let timer: number | undefined;
    const io = new IntersectionObserver(([entry]) => {
      const visible = entry.intersectionRatio >= 0.45;
      if (first) {
        first = false;
        // Already on screen, or already scrolled past: leave the end state.
        if (visible || entry.boundingClientRect.top < 0) { io.disconnect(); return; }
        armed = true;
        setRewound(true);
        return;
      }
      if (armed && visible) {
        io.disconnect();
        timer = window.setTimeout(() => setRewound(false), 250);
      }
    }, { threshold: [0, 0.45] });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(timer); };
  }, []);

  const iconSwap = (shown: boolean): React.CSSProperties => ({ position: 'absolute', inset: 0, margin: 'auto', width: 32, height: 32, opacity: shown ? 1 : 0, transition: `opacity 400ms ${EASE}` });

  return (
    <section ref={ref} style={{ padding: 'clamp(56px,8vw,100px) 0', background: C.dark }}>
      <Reveal style={{ maxWidth: 980, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
        <span aria-hidden style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 18, background: 'rgba(2,187,181,.18)', color: C.aqua, marginBottom: 14 }}>
          <Wifi style={iconSwap(rewound)} />
          <WifiOff style={iconSwap(!rewound)} />
        </span>
        <div style={{ marginBottom: 20 }}>
          {/* #8BE8A8 on a mint wash — Providers.dc.html; not a theme token. */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 999, background: 'rgba(85,215,127,.16)', color: '#8BE8A8', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, opacity: rewound ? 0 : 1, transform: rewound ? 'translateY(4px)' : 'none', transition: rewound ? 'none' : `opacity 240ms ${EASE} 520ms, transform 240ms ${EASE} 520ms` }}>
            <span aria-hidden style={{ width: 7, height: 7, borderRadius: '50%', background: C.mint }} />
            {t('still')}
          </span>
        </div>
        <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.6vw,52px)', lineHeight: 1.2, color: '#fff', margin: '0 0 16px', whiteSpace: 'pre-line' }}>{t('quote')}</h2>
        <p style={{ fontSize: 'clamp(16px,1.8vw,20px)', lineHeight: 1.8, color: 'rgba(255,255,255,.7)', margin: '0 auto', maxWidth: 620 }}>{t('desc')}</p>
      </Reveal>
    </section>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  const ref = useEntrance<HTMLSpanElement>([{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], 180);
  return (
    <div id={id} aria-live="polite" style={{ minHeight: 22, marginTop: 6, fontSize: 13.5, color: FIELD_ERR }}>
      {message && <span key={message} ref={ref} style={{ display: 'inline-block' }}>{message}</span>}
    </div>
  );
}

function DemoSuccess() {
  const t = useTranslations('providers.demo');
  const card = useEntrance<HTMLDivElement>([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], 320);
  const check = useEntrance<HTMLDivElement>([{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'scale(1.04)', offset: 0.7 }, { opacity: 1, transform: 'none' }], 280, 60);
  return (
    <div ref={card} role="status" style={{ background: C.white, border: `1px solid ${C.aquaBorder}`, borderRadius: 20, padding: 34, boxShadow: '0 8px 24px rgba(20, 32, 43,.06)', maxWidth: 520, margin: '0 auto' }}>
      <div ref={check} style={{ width: 56, height: 56, borderRadius: '50%', background: C.aquaBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.aqua, margin: '0 auto 16px' }}>
        <Check style={{ width: 30, height: 30 }} strokeWidth={2.5} />
      </div>
      <h3 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 23, color: C.ink, margin: '0 0 8px' }}>{t('successTitle')}</h3>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{t('successDesc')}</p>
    </div>
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
  const [errClinic, setErrClinic] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const clinicRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const clear = () => { if (status === 'error') { setStatus('idle'); setError(''); } };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    const c = clinic.trim();
    const v = email.trim();
    // Validate both fields at once and show each message under its field.
    const ec = c ? '' : t('errorClinic');
    const ee = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : t('errorInvalid');
    setErrClinic(ec);
    setErrEmail(ee);
    if (ec || ee) {
      (ec ? clinicRef : emailRef).current?.focus();
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The clinic name goes in its own column rather than being prefixed
        // onto the message, which used to make it unqueryable and mangled
        // whatever the person actually wrote.
        body: JSON.stringify({
          email: v,
          organization: c,
          message: message.trim() || undefined,
          locale,
          source: 'providers',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok && data.code !== 'duplicate') {
        setStatus('error');
        setError(t('errorGeneric'));
        captureError(new Error(`providers demo failed: ${res.status}`), { source: 'providers', status: res.status });
        return;
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(t('errorGeneric'));
      captureError(err, { source: 'providers', phase: 'network' });
    }
  };

  const busy = status === 'loading';
  const inputStyle = (name: string, invalid = false): React.CSSProperties => ({
    width: '100%',
    padding: '15px 18px',
    borderRadius: 14,
    border: `1.5px solid ${invalid ? FIELD_ERR : focused === name ? C.aqua : C.borderSoft}`,
    boxShadow: focused === name ? '0 0 0 3px rgba(2,187,181,.22)' : 'none',
    background: C.white,
    fontSize: 16,
    color: C.ink,
    outline: 'none',
    boxSizing: 'border-box',
  });
  const focusProps = (name: string) => ({ onFocus: () => setFocused(name), onBlur: () => setFocused((f) => (f === name ? null : f)) });
  const label: React.CSSProperties = { display: 'block', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14.5, color: C.ink, marginBottom: 6 };
  const swap = (shown: boolean): React.CSSProperties => ({ gridArea: '1 / 1', opacity: shown ? 1 : 0, transition: `opacity 150ms ${EASE}` });

  return (
    <section id="demo" style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}`, scrollMarginTop: 84 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
        <Reveal>
          <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,50px)', lineHeight: 1.15, color: C.ink, margin: '0 0 14px' }}>{t('title')}</h2>
          <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', lineHeight: 1.8, color: C.ink2, margin: '0 auto 30px', maxWidth: 520 }}>{t('desc')}</p>
        </Reveal>
        {status === 'success' ? (
          <DemoSuccess />
        ) : (
          <form onSubmit={submit} style={{ maxWidth: 520, margin: '0 auto', textAlign: 'start' }} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>
                <label htmlFor="pv-clinic" style={label}>{t('clinicLabel')}</label>
                <input id="pv-clinic" ref={clinicRef} autoComplete="organization" required aria-describedby="pv-clinic-err" aria-invalid={errClinic ? true : undefined} value={clinic} onChange={(e) => { setClinic(e.target.value); setErrClinic(''); clear(); }} placeholder={t('clinicPlaceholder')} disabled={busy} {...focusProps('clinic')} style={{ ...inputStyle('clinic', !!errClinic), fontFamily: FONT.arabic }} />
                <FieldError id="pv-clinic-err" message={errClinic} />
              </div>
              <div>
                <label htmlFor="pv-email" style={label}>{t('emailLabel')}</label>
                <input id="pv-email" ref={emailRef} autoComplete="email" required aria-describedby="pv-email-err" aria-invalid={errEmail ? true : undefined} value={email} onChange={(e) => { setEmail(e.target.value); setErrEmail(''); clear(); }} type="email" dir="ltr" placeholder={t('emailPlaceholder')} disabled={busy} {...focusProps('email')} style={{ ...inputStyle('email', !!errEmail), fontFamily: FONT.body, textAlign: 'left' }} />
                <FieldError id="pv-email-err" message={errEmail} />
              </div>
              <label htmlFor="pv-msg" style={label}>{t('messageLabel')}</label>
              <textarea id="pv-msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder={t('messagePlaceholder')} disabled={busy} {...focusProps('msg')} style={{ ...inputStyle('msg'), marginBottom: 12, fontFamily: FONT.arabic, fontSize: 15, resize: 'vertical' }} />
              <button type="submit" aria-busy={busy} disabled={busy} style={{ padding: 16, borderRadius: 14, border: 'none', background: C.aqua, color: ON.aqua, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17, cursor: busy ? 'wait' : 'pointer', boxShadow: '0 10px 24px rgba(2,187,181,.24)' }}>
                {/* Idle and busy labels share one grid cell and cross-fade, so the button never changes width. */}
                <span style={{ display: 'grid', justifyItems: 'center' }}>
                  <span aria-hidden={busy} style={swap(!busy)}>{t('button')}</span>
                  <span aria-hidden={!busy} style={swap(busy)}>{t('sending')}</span>
                </span>
              </button>
            </div>
            {status === 'error' && error && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', marginTop: 14, color: C.danger, fontSize: 14 }}>
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
