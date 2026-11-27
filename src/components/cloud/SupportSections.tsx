'use client';

import { useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FONT } from './theme';

/**
 * The help center at /support (Support.dc.html): FAQ with topic filters and
 * search, a medical-emergency note, the account deletion request (the web
 * route app stores ask for) and the contact / problem-report form.
 *
 * Both forms save to Supabase through /api/support/*; the website sends no
 * email, so the team answers from contact@balsm.health and confirms each
 * deletion by hand. Copy says "we'll email you", never "we've emailed you".
 */

const TOPICS = ['start', 'record', 'share', 'mother', 'privacy', 'account'] as const;
type Topic = (typeof TOPICS)[number];
const SUBJECTS = ['bug', 'account', 'privacy', 'idea', 'other'] as const;
type Subject = (typeof SUBJECTS)[number];
type Faq = { topic: Topic; q: string; a: string };
type Status = 'idle' | 'loading' | 'error' | 'done';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISCORD = 'https://discord.gg/cNd7QBU26a';

// Search folds Arabic diacritics, tatweel and letter variants (أ/إ/آ→ا, ة→ه,
// ى→ي) so "حذف الحساب" matches however it was typed.
const norm = (s: string) =>
  s.toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');

// Topic tile colours: the design's hue-100 wash with its 600-step ink.
const TOPIC_TINT: Record<Topic, { bg: string; fg: string }> = {
  start: { bg: C.blueBg, fg: C.blueDark },
  record: { bg: C.aquaBg, fg: '#01866F' },
  share: { bg: C.violetBg, fg: C.violetDark },
  mother: { bg: '#FCE7F1', fg: '#B8336F' },
  privacy: { bg: C.greenBg, fg: '#2A8C47' },
  account: { bg: C.amberBg, fg: '#8A6410' },
};

const svg = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

const TOPIC_ICON: Record<Topic, React.ReactNode> = {
  start: <svg {...svg}><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4" /></svg>,
  record: <svg {...svg}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M12 18v-6M9 15h6" /></svg>,
  share: <svg {...svg}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v1M14 20h1M17 20h4v-3" /></svg>,
  mother: <svg {...svg}><path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" /><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" /></svg>,
  privacy: <svg {...svg}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>,
  account: <svg {...svg}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>,
};

const wrap: React.CSSProperties = { maxWidth: 1120, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
const eyebrow = (color: string): React.CSSProperties => ({ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14, color });
const h2: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(26px,3.4vw,38px)', lineHeight: 1.2, margin: '10px 0 14px' };
const lead: React.CSSProperties = { fontSize: 16, lineHeight: 1.85, color: C.ink2 };
const label: React.CSSProperties = { display: 'block', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 6 };
const optional: React.CSSProperties = { fontWeight: 400, color: '#5F6B77' };
const errText: React.CSSProperties = { minHeight: 20, marginTop: 5, fontSize: 13, color: '#B83A2E' };
const button = (bg: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', minHeight: 50, marginTop: 6, padding: '0 26px',
  borderRadius: 999, border: 'none', background: bg, color: '#fff', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16, cursor: 'pointer',
});
const srOnly: React.CSSProperties = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' };

function Done({ title, desc, children }: { title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div role="status" style={{ textAlign: 'center', padding: '12px 4px' }}>
      <div aria-hidden style={{ width: 52, height: 52, margin: '0 auto 14px', borderRadius: '50%', background: C.greenBg, color: '#2A8C47', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22 }}>✓</div>
      <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 20, marginBottom: 6 }}>{title}</div>
      <p style={{ margin: children ? '0 0 16px' : 0, fontSize: 15, lineHeight: 1.75, color: C.ink2 }}>{desc}</p>
      {children}
    </div>
  );
}

async function post(url: string, body: Record<string, unknown>): Promise<{ ok: boolean; code?: string }> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, code: data.code };
  } catch {
    return { ok: false, code: 'network' };
  }
}

export default function SupportSections() {
  const t = useTranslations('support');
  const locale = useLocale();
  const faq = t.raw('faq.items') as Faq[];

  // ── FAQ ──────────────────────────────────────────────────────────────
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<Topic | null>(null);
  const q = norm(query.trim());
  const items = useMemo(
    () => faq.filter((f) => (!topic || f.topic === topic) && (!q || norm(`${f.q} ${f.a}`).includes(q))),
    [faq, topic, q],
  );
  const faqTitle = topic ? t(`topics.${topic}`) : q ? t('faq.results') : t('faq.title');

  // ── Delete account ───────────────────────────────────────────────────
  const [delEmail, setDelEmail] = useState('');
  const [delReason, setDelReason] = useState('');
  const [delAck, setDelAck] = useState(false);
  const [delStatus, setDelStatus] = useState<Status>('idle');
  const [delErr, setDelErr] = useState({ email: '', ack: '', form: '' });
  const delEmailRef = useRef<HTMLInputElement>(null);
  const delAckRef = useRef<HTMLInputElement>(null);

  const submitDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = delEmail.trim();
    const errs = { email: EMAIL.test(email) ? '' : t('delete.emailErr'), ack: delAck ? '' : t('delete.ackErr'), form: '' };
    if (errs.email || errs.ack) {
      setDelErr(errs);
      (errs.email ? delEmailRef : delAckRef).current?.focus();
      return;
    }
    setDelStatus('loading');
    setDelErr({ email: '', ack: '', form: '' });
    const res = await post('/api/support/delete', { email, reason: delReason.trim() || undefined, acknowledged: true, locale });
    if (res.ok) return setDelStatus('done');
    setDelStatus('error');
    if (res.code === 'invalid_email') {
      setDelErr({ email: t('delete.emailErr'), ack: '', form: '' });
      delEmailRef.current?.focus();
    } else {
      setDelErr({ email: '', ack: '', form: t('form.error') });
    }
  };

  // ── Contact ──────────────────────────────────────────────────────────
  const [cName, setCName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cSubject, setCSubject] = useState<Subject>('bug');
  const [cDevice, setCDevice] = useState('');
  const [cMsg, setCMsg] = useState('');
  const [cStatus, setCStatus] = useState<Status>('idle');
  const [cErr, setCErr] = useState({ email: '', msg: '', form: '' });
  const cEmailRef = useRef<HTMLInputElement>(null);
  const cMsgRef = useRef<HTMLTextAreaElement>(null);
  const subjectRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = cEmail.trim();
    const msg = cMsg.trim();
    const errs = { email: EMAIL.test(email) ? '' : t('contact.emailErr'), msg: msg.length >= 10 ? '' : t('contact.msgErr'), form: '' };
    if (errs.email || errs.msg) {
      setCErr(errs);
      (errs.email ? cEmailRef : cMsgRef).current?.focus();
      return;
    }
    setCStatus('loading');
    setCErr({ email: '', msg: '', form: '' });
    const res = await post('/api/support/contact', {
      name: cName.trim() || undefined, email, subject: cSubject,
      device: cSubject === 'bug' ? cDevice.trim() || undefined : undefined, message: msg, locale,
    });
    if (res.ok) return setCStatus('done');
    setCStatus('error');
    if (res.code === 'invalid_email') setCErr({ email: t('contact.emailErr'), msg: '', form: '' });
    else if (res.code === 'invalid_message') setCErr({ email: '', msg: t('contact.msgErr'), form: '' });
    else setCErr({ email: '', msg: '', form: t('form.error') });
  };

  // Radio-group keyboard pattern for the subject chips: arrows move and select.
  const onSubjectKey = (e: React.KeyboardEvent, i: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    // Arrow direction follows reading direction, so RTL flips left/right.
    const dir = locale === 'ar' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') ? -step : step;
    const next = (i + dir + SUBJECTS.length) % SUBJECTS.length;
    setCSubject(SUBJECTS[next]);
    subjectRefs.current[next]?.focus();
  };

  return (
    <div className="sp-page" style={{ background: C.bg, color: C.ink, overflowX: 'hidden' }}>
      {/* HERO + SEARCH */}
      <section style={{ padding: 'clamp(48px,7vw,88px) 0 clamp(32px,4vw,48px)', background: `linear-gradient(180deg,${C.blueBg} 0%,${C.bg} 100%)` }}>
        <div style={{ ...wrap, textAlign: 'center' }}>
          <div style={eyebrow(C.blueDark)}>{t('hero.eyebrow')}</div>
          <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(34px,5.4vw,60px)', lineHeight: 1.15, margin: '12px 0 14px' }}>{t('hero.title')}</h1>
          <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', lineHeight: 1.8, color: C.ink2, margin: '0 auto 26px', maxWidth: 620 }}>{t('hero.desc')}</p>
          <div style={{ position: 'relative', maxWidth: 620, margin: '0 auto' }}>
            <svg {...svg} style={{ position: 'absolute', insetInlineStart: 18, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, color: '#5F6B77', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <label htmlFor="sp-search" style={srOnly}>{t('hero.searchLabel')}</label>
            <input
              id="sp-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={t('hero.searchPlaceholder')} aria-controls="sp-faq-list" className="sp-input"
              style={{ paddingInlineStart: 50, minHeight: 58, borderRadius: 999, fontSize: 16.5 }}
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px', marginTop: 8, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14 }}>
            <a href="#delete-account" className="sp-link">{t('hero.linkDelete')}</a>
            <a href="#contact" className="sp-link">{t('hero.linkReport')}</a>
            <Link href="/download" className="sp-link">{t('hero.linkApp')}</Link>
          </div>
        </div>
      </section>

      {/* TOPICS + FAQ */}
      <section id="faq" style={{ padding: 'clamp(24px,4vw,40px) 0 clamp(56px,8vw,96px)', scrollMarginTop: 90 }}>
        <div style={wrap}>
          <div role="group" aria-label={t('faq.topicsLabel')} className="sp-topics" style={{ marginBottom: 26 }}>
            {TOPICS.map((id) => (
              <button key={id} type="button" className="sp-topic" aria-pressed={topic === id} aria-controls="sp-faq-list" onClick={() => setTopic(topic === id ? null : id)}>
                <span className="sp-ico" style={{ background: TOPIC_TINT[id].bg, color: TOPIC_TINT[id].fg }}>{TOPIC_ICON[id]}</span>
                <span>{t(`topics.${id}`)}</span>
              </button>
            ))}
          </div>

          <div className="sp-card">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
              <h2 aria-live="polite" style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(22px,2.6vw,28px)', margin: 0 }}>{faqTitle}</h2>
              {(topic || q) && (
                <button type="button" onClick={() => { setTopic(null); setQuery(''); }} className="sp-link" style={{ border: 'none', background: 'none', padding: '0 4px', minHeight: 44, cursor: 'pointer', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14 }}>{t('faq.showAll')}</button>
              )}
            </div>
            <div id="sp-faq-list">
              {items.length > 0 ? (
                <div className="sp-faq">
                  {items.map((f) => (
                    // Keyed on the search too, so a new search remounts the
                    // rows open (matches are easier to scan) and clearing it
                    // closes them again.
                    <details key={`${f.q}|${q ? 1 : 0}`} open={q ? true : undefined}>
                      <summary>
                        <span dir="auto">{f.q}</span>
                        <span className="sp-chev" aria-hidden><svg {...svg} stroke={C.ink2} strokeWidth={2.2} style={{ width: 16, height: 16 }}><path d="m6 9 6 6 6-6" /></svg></span>
                      </summary>
                      <div className="sp-ans" dir="auto">{f.a}</div>
                    </details>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '28px 4px 8px', fontSize: 15.5, lineHeight: 1.8, color: C.ink2 }}>
                  <span>{t('faq.empty')}</span> <a href="#contact" className="sp-link" style={{ fontWeight: 700 }}>{t('faq.emptyCta')}</a>
                </div>
              )}
            </div>
          </div>

          {/* Emergency note */}
          <div role="note" style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: 16, padding: '16px 20px', borderRadius: 16, background: '#FDF1EF', border: '1px solid #F3CFC9' }}>
            <span aria-hidden style={{ flex: 'none', width: 34, height: 34, borderRadius: 10, background: '#B83A2E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.cairo, fontWeight: 800 }}>!</span>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: '#5A1F18' }}>
              <strong style={{ fontFamily: FONT.cairo }}>{t('emergency.title')}</strong>{' '}
              <span>{t('emergency.before')}</span>{' '}
              <a href="tel:123" dir="ltr" style={{ fontWeight: 700, color: '#5A1F18', textDecoration: 'underline' }}>123</a>{' '}
              <span>{t('emergency.after')}</span>
            </p>
          </div>
        </div>
      </section>

      {/* DELETE ACCOUNT */}
      <section id="delete-account" style={{ padding: 'clamp(56px,8vw,96px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}`, scrollMarginTop: 90 }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(360px,100%),1fr))', gap: 'clamp(28px,5vw,64px)', alignItems: 'start' }}>
          <div>
            <div style={eyebrow('#B83A2E')}>{t('delete.eyebrow')}</div>
            <h2 style={h2}>{t('delete.title')}</h2>
            <p style={{ ...lead, margin: '0 0 18px' }}>{t('delete.desc')}</p>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(['step1', 'step2', 'step3'] as const).map((k, i) => (
                <li key={k} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span aria-hidden style={{ flex: 'none', width: 28, height: 28, borderRadius: '50%', background: '#F2F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.mono, fontWeight: 600, fontSize: 13 }}>{i + 1}</span>
                  <span style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2 }}>{t(`delete.${k}`)}</span>
                </li>
              ))}
            </ol>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: '#5F6B77', margin: '18px 0 0' }}>{t('delete.deviceNote')}</p>
          </div>
          <div className="sp-card" style={{ background: C.bg }}>
            {delStatus === 'done' ? (
              <Done title={t('delete.doneTitle')} desc={t('delete.doneDesc')} />
            ) : (
              <form onSubmit={submitDelete} noValidate>
                <label htmlFor="sp-del-email" style={label}>{t('delete.email')} <span aria-hidden>*</span></label>
                <input
                  ref={delEmailRef} id="sp-del-email" type="email" dir="ltr" autoComplete="email" placeholder="name@email.com" required
                  value={delEmail} onChange={(e) => { setDelEmail(e.target.value); setDelErr((x) => ({ ...x, email: '' })); }}
                  aria-invalid={!!delErr.email} aria-describedby="sp-del-email-err" className="sp-input" style={{ textAlign: 'left' }}
                />
                <div id="sp-del-email-err" style={errText} aria-live="polite">{delErr.email}</div>
                <label htmlFor="sp-del-reason" style={{ ...label, marginTop: 6 }}>{t('delete.reason')} <span style={optional}>{t('form.optional')}</span></label>
                <textarea id="sp-del-reason" rows={3} dir="auto" maxLength={1000} value={delReason} onChange={(e) => setDelReason(e.target.value)} className="sp-input" style={{ resize: 'vertical', lineHeight: 1.6 }} />
                <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', margin: '16px 0 4px', cursor: 'pointer' }}>
                  <input
                    ref={delAckRef} type="checkbox" checked={delAck} onChange={(e) => { setDelAck(e.target.checked); setDelErr((x) => ({ ...x, ack: '' })); }}
                    aria-invalid={!!delErr.ack} aria-describedby="sp-del-ack-err" style={{ width: 18, height: 18, marginTop: 3, flex: 'none', accentColor: '#B83A2E' }}
                  />
                  <span style={{ fontSize: 14.5, lineHeight: 1.7, color: C.ink2 }}>{t('delete.ack')}</span>
                </label>
                <div id="sp-del-ack-err" style={errText} aria-live="polite">{delErr.ack || delErr.form}</div>
                <button type="submit" disabled={delStatus === 'loading'} style={button('#B83A2E')}>{delStatus === 'loading' ? t('form.sending') : t('delete.cta')}</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT / REPORT */}
      <section id="contact" style={{ padding: 'clamp(56px,8vw,96px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}`, scrollMarginTop: 90 }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'clamp(28px,5vw,64px)', alignItems: 'start' }}>
          <div>
            <div style={eyebrow(C.blueDark)}>{t('contact.eyebrow')}</div>
            <h2 style={h2}>{t('contact.title')}</h2>
            <p style={{ ...lead, margin: '0 0 22px' }}>{t('contact.desc')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="mailto:contact@balsm.health" className="sp-row">
                <span className="sp-ico" style={{ background: C.blueBg, color: C.blueDark }}><svg {...svg}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg></span>
                <span>
                  <span style={{ display: 'block', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15 }}>{t('contact.emailTitle')}</span>
                  <span dir="ltr" style={{ display: 'block', fontSize: 14, color: '#5F6B77', textAlign: 'start' }}>contact@balsm.health</span>
                </span>
              </a>
              <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="sp-row">
                <span className="sp-ico" style={{ background: '#ECEEFE', color: '#4752C4' }}><svg {...svg}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></span>
                <span>
                  <span style={{ display: 'block', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15 }}>{t('contact.discordTitle')} <span dir="ltr">Discord</span></span>
                  <span style={{ display: 'block', fontSize: 14, color: '#5F6B77' }}>{t('contact.discordDesc')}</span>
                </span>
              </a>
            </div>
          </div>
          <div className="sp-card">
            {cStatus === 'done' ? (
              <Done title={t('contact.doneTitle')} desc={t('contact.doneDesc')}>
                <button type="button" onClick={() => { setCStatus('idle'); setCMsg(''); setCDevice(''); }} className="sp-link" style={{ border: 'none', background: 'none', minHeight: 44, cursor: 'pointer', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14.5 }}>{t('contact.again')}</button>
              </Done>
            ) : (
              <form onSubmit={submitContact} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(200px,100%),1fr))', gap: '0 14px' }}>
                  <div>
                    <label htmlFor="sp-c-name" style={label}>{t('contact.name')} <span style={optional}>{t('form.optional')}</span></label>
                    <input id="sp-c-name" dir="auto" autoComplete="name" maxLength={120} value={cName} onChange={(e) => setCName(e.target.value)} className="sp-input" />
                    <div style={errText} />
                  </div>
                  <div>
                    <label htmlFor="sp-c-email" style={label}>{t('contact.email')} <span aria-hidden>*</span></label>
                    <input
                      ref={cEmailRef} id="sp-c-email" type="email" dir="ltr" autoComplete="email" placeholder="name@email.com" required
                      value={cEmail} onChange={(e) => { setCEmail(e.target.value); setCErr((x) => ({ ...x, email: '' })); }}
                      aria-invalid={!!cErr.email} aria-describedby="sp-c-email-err" className="sp-input" style={{ textAlign: 'left' }}
                    />
                    <div id="sp-c-email-err" style={errText} aria-live="polite">{cErr.email}</div>
                  </div>
                </div>
                <span id="sp-c-subject" style={label}>{t('contact.subject')}</span>
                <div role="radiogroup" aria-labelledby="sp-c-subject" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {SUBJECTS.map((s, i) => (
                    <button
                      key={s} ref={(el) => { subjectRefs.current[i] = el; }} type="button" role="radio"
                      aria-checked={cSubject === s} tabIndex={cSubject === s ? 0 : -1}
                      onClick={() => setCSubject(s)} onKeyDown={(e) => onSubjectKey(e, i)} className="sp-chip"
                    >
                      {t(`subjects.${s}`)}
                    </button>
                  ))}
                </div>
                {cSubject === 'bug' && (
                  <>
                    <label htmlFor="sp-c-device" style={label}>{t('contact.device')} <span style={optional}>{t('form.optional')}</span></label>
                    <input id="sp-c-device" dir="auto" maxLength={120} placeholder={t('contact.devicePlaceholder')} value={cDevice} onChange={(e) => setCDevice(e.target.value)} className="sp-input" />
                    <div style={errText} />
                  </>
                )}
                <label htmlFor="sp-c-msg" style={label}>{t('contact.message')} <span aria-hidden>*</span></label>
                <textarea
                  ref={cMsgRef} id="sp-c-msg" rows={5} dir="auto" maxLength={2000} required
                  value={cMsg} onChange={(e) => { setCMsg(e.target.value); setCErr((x) => ({ ...x, msg: '' })); }}
                  aria-invalid={!!cErr.msg} aria-describedby="sp-c-msg-err" className="sp-input" style={{ resize: 'vertical', lineHeight: 1.6 }}
                />
                <div id="sp-c-msg-err" style={errText} aria-live="polite">{cErr.msg || cErr.form}</div>
                <button type="submit" disabled={cStatus === 'loading'} style={button(C.ink)}>{cStatus === 'loading' ? t('form.sending') : t('contact.cta')}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
