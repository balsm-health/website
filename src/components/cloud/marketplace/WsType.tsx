'use client';

import { useRef, type KeyboardEvent } from 'react';
import { C, FONT } from '../theme';
import { Store } from '../CloudIcons';
import { ORG_TYPES } from './data';
import { activeCompany, type State } from './state';
import type { MkActions } from './useMarketplace';
import { OrgsOnlyNote } from './NewWorkspace';
import { Alert, chip, css, h1, kicker, lead, MK, page, section, useMt } from './ui';

export default function WsType({ s, a }: { s: State; a: MkActions }) {
  const { t } = useMt();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const checked = s.wsType ? ORG_TYPES.indexOf(s.wsType) : -1;

  // Radio-group keyboard model: arrows move and select, one tab stop.
  const onKey = (e: KeyboardEvent, i: number) => {
    const rtl = document.documentElement.dir === 'rtl';
    const fwd = e.key === 'ArrowDown' || e.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
    const back = e.key === 'ArrowUp' || e.key === (rtl ? 'ArrowRight' : 'ArrowLeft');
    if (!fwd && !back) return;
    e.preventDefault();
    const n = (i + (fwd ? 1 : -1) + ORG_TYPES.length) % ORG_TYPES.length;
    a.pickWsType(ORG_TYPES[n]);
    refs.current[n]?.focus();
  };

  return (
    <section className={css.view} style={section()}>
      <div style={page(920)}>
        <div style={kicker(MK.teal)}>{t('common.addOrg')}</div>
        <h1 style={h1()}>{t('common.addOrg')}</h1>
        <p style={lead}>{t('wsType.lead')}</p>
        <div style={{ marginTop: -8 }}>
          <OrgsOnlyNote title={t('wsType.noteTitle')} care={t('wsType.noteCare')} />
        </div>
        <div role="radiogroup" aria-label={t('wsType.group')} aria-describedby={s.wsTypeErr ? 'mk-wstype-err' : undefined} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 14 }}>
          {ORG_TYPES.map((k, i) => (
            <button
              key={k} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={s.wsType === k}
              tabIndex={checked === -1 ? (i === 0 ? 0 : -1) : checked === i ? 0 : -1}
              onClick={() => a.pickWsType(k)} onKeyDown={(e) => onKey(e, i)} className={css.ws}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%' }}>
                <span style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 18, color: C.ink }}>{t(`types.${k}.label`)}</span>
                <span className={css.dot} aria-hidden />
              </span>
              <span style={{ fontSize: 14, lineHeight: 1.6, color: C.ink2 }}>{t(`types.${k}.desc`)}</span>
              {k === 'software'
                ? <span style={{ ...chip(C.blueBg, C.blueDark), alignSelf: 'flex-start' }}>{t('wsType.badgeNow')}</span>
                : <span style={{ ...chip(C.amberBg, MK.amberText), alignSelf: 'flex-start' }}>{t('wsType.badgeSoon')}</span>}
            </button>
          ))}
        </div>
        <Alert>{s.wsTypeErr ? <span id="mk-wstype-err">{t('wsType.err')}</span> : null}</Alert>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22, justifyContent: 'space-between' }}>
          <button type="button" onClick={a.goWorkspace} className={css.ghost} style={{ padding: '14px 22px' }}>{t('common.cancel')}</button>
          <button type="button" onClick={a.confirmWsType} className={css.primary} style={{ width: 'auto', padding: '14px 28px' }}>
            {t(s.wsType && s.wsType !== 'software' ? 'wsType.ctaWaitlist' : 'wsType.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}

export function NotVendor({ s, a }: { s: State; a: MkActions }) {
  const { t, name } = useMt();
  return (
    <section className={css.view} style={{ padding: 'clamp(48px,8vw,96px) 0', background: C.bg, minHeight: '60vh' }}>
      <div style={{ ...page(560), textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: C.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blueDark, margin: '0 auto 18px' }}>
          <Store style={{ width: 28, height: 28 }} />
        </div>
        <h1 style={h1('clamp(24px,3.2vw,32px)', '0 0 10px')}>{t('notVendor.title')}</h1>
        <p style={lead}>{t('notVendor.body', { name: name(activeCompany(s)) })}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          <button type="button" onClick={a.newVendorWs} className={css.primary} style={{ width: 'auto', padding: '14px 24px' }}>{t('notVendor.addVendor')}</button>
          <button type="button" onClick={a.goDirectory} className={css.ghost} style={{ padding: '14px 22px' }}>{t('common.back')}</button>
        </div>
      </div>
    </section>
  );
}
