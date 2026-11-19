'use client';

import { C, FONT } from '../theme';
import { Check } from '../CloudIcons';
import { WAITLIST_TYPES, type OrgType } from './data';
import type { State } from './state';
import type { MkActions } from './useMarketplace';
import { BackButton, css, ErrorList, h1, kicker, lead, ltrInput, MK, page, useMt } from './ui';

// Healthcare providers can't add an organization yet: they join a waitlist.
// Nothing is sent anywhere — the confirmation is shown from local state only.
export default function Waitlist({ s, a }: { s: State; a: MkActions }) {
  const { t } = useMt();
  const w = s.wl;
  return (
    <section className={css.view} style={{ padding: 'clamp(40px,6vw,72px) 0', background: `linear-gradient(180deg,${C.aquaBg} 0%,${C.bg} 100%)`, minHeight: '60vh' }}>
      <div style={page(680)}>
        <BackButton onClick={a.backToWsType}>{t('common.changeType')}</BackButton>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={kicker(MK.teal)}>{t('waitlist.kicker')}</div>
          <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12, padding: '3px 10px', borderRadius: 999, background: '#fff', border: `1px solid ${C.aquaBorder}`, color: MK.teal }}>{t('waitlist.soon')}</span>
        </div>
        <h1 style={h1('clamp(26px,3.6vw,38px)', '8px 0 10px')}>{t('waitlist.title')}</h1>
        <p style={lead}>{t('waitlist.lead')}</p>

        {s.wlSent ? (
          <div role="status" className={css.pop} style={{ background: '#fff', border: `1px solid ${C.aquaBorder}`, borderRadius: 22, padding: 'clamp(24px,4vw,34px)', textAlign: 'center', boxShadow: '0 8px 24px rgba(20,32,43,.06)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.aquaBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MK.teal, margin: '0 auto 16px' }}>
              <Check style={{ width: 30, height: 30 }} />
            </div>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 23, margin: '0 0 8px', color: C.ink }}>{t('waitlist.doneTitle')}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: C.ink2, margin: '0 0 20px' }}>
              {t.rich('waitlist.done', { email: w.email, type: t(`types.${w.type}.label`), ltr: (ch) => <span dir="ltr" style={{ fontWeight: 600 }}>{ch}</span> })}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {s.companies.some((c) => c.id === s.activeCo) && (
                <button type="button" onClick={a.goWorkspace} className={css.primary} style={{ width: 'auto', padding: '12px 22px' }}>{t('waitlist.backWs')}</button>
              )}
              <button type="button" onClick={a.goDirectory} className={css.ghost}>{t('waitlist.browse')}</button>
            </div>
          </div>
        ) : (
          <form noValidate onSubmit={(e) => { e.preventDefault(); a.submitWaitlist(); }}>
            <div className={css.box} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 14 }}>
              <div>
                <label htmlFor="mk-wl-type" className={css.label}>{t('waitlist.type')}</label>
                <select id="mk-wl-type" value={w.type} onChange={(e) => a.setWl('type', e.target.value as OrgType)} className={css.input}>
                  {WAITLIST_TYPES.map((k) => <option key={k} value={k}>{t(`types.${k}.label`)}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="mk-wl-name" className={css.label}>{t('waitlist.name')}</label>
                <input id="mk-wl-name" value={w.name} onChange={(e) => a.setWl('name', e.target.value)} autoComplete="organization" className={css.input} />
              </div>
              <div>
                <label htmlFor="mk-wl-city" className={css.label}>{t('waitlist.city')}</label>
                <input id="mk-wl-city" value={w.city} onChange={(e) => a.setWl('city', e.target.value)} autoComplete="address-level2" className={css.input} />
              </div>
              <div>
                <label htmlFor="mk-wl-branches" className={css.label}>{t('waitlist.branches')}</label>
                <select id="mk-wl-branches" value={w.branches} onChange={(e) => a.setWl('branches', e.target.value)} className={css.input}>
                  <option value="1">{t('waitlist.b1')}</option>
                  <option value="2-5">{t('waitlist.b2')}</option>
                  <option value="6+">{t('waitlist.b6')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="mk-wl-email" className={css.label}>{t('waitlist.email')}</label>
                <input id="mk-wl-email" value={w.email} onChange={(e) => a.setWl('email', e.target.value)} type="email" dir="ltr" autoComplete="email" className={css.input} style={ltrInput} />
              </div>
              <div>
                <label htmlFor="mk-wl-phone" className={css.label}>{t('waitlist.phone')}</label>
                <input id="mk-wl-phone" value={w.phone} onChange={(e) => a.setWl('phone', e.target.value)} type="tel" dir="ltr" autoComplete="tel" placeholder="+20" className={css.input} style={ltrInput} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="mk-wl-msg" className={css.label}>{t('waitlist.msg')}</label>
                <textarea id="mk-wl-msg" value={w.msg} onChange={(e) => a.setWl('msg', e.target.value)} rows={3} placeholder={t('common.optional')} className={css.input} style={{ resize: 'vertical' }} />
              </div>
            </div>
            <ErrorList errors={s.errors} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
              <span style={{ fontSize: 13, color: MK.muted }}>{t('waitlist.privacy')}</span>
              <button type="submit" className={css.primary} style={{ width: 'auto', padding: '14px 26px', background: MK.teal, boxShadow: '0 10px 24px rgba(1,134,111,.22)' }}>{t('waitlist.submit')}</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
