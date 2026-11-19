'use client';

import { Link } from '@/i18n/navigation';
import { C, FONT } from '../theme';
import { handleProblem } from './data';
import type { State } from './state';
import type { MkActions } from './useMarketplace';
import { css, FieldError, h1, kicker, lead, MK, page, section, useMt } from './ui';

const AV = { width: 22, height: 22, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.cairo, fontWeight: 800, fontSize: 10.5, border: '2px solid #F9F7FF' } as const;
const SOON = { padding: '3px 10px', borderRadius: 999, background: '#fff', border: `1px dashed ${MK.border2}`, color: MK.muted, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12.5 } as const;

// The "how a workspace works" example card from the create-workspace view.
function Example() {
  const { t } = useMt();
  return (
    // #C9B8F2 / #F9F7FF / #E6DFF8: violet tints from Marketplace.dc.html.
    <figure aria-label={t('newWs.exampleAria')} style={{ margin: '0 0 16px', border: '1.5px dashed #C9B8F2', borderRadius: 18, background: '#F9F7FF', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <span aria-hidden style={{ width: 28, height: 28, borderRadius: 8, background: C.violet, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.cairo, fontWeight: 800, fontSize: 13 }}>م</span>
        <span style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 14.5, color: C.ink }}>{t('newWs.exName')}</span>
        <span dir="ltr" style={{ fontFamily: FONT.mono, fontSize: 12, color: MK.violetText }}>@alnour-medical</span>
        <span style={{ marginInlineStart: 'auto', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 11.5, padding: '2px 9px', borderRadius: 999, background: C.violetBg, color: MK.violetText }}>{t('newWs.example')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 13, color: C.ink2, marginBottom: 8 }}>
        <b style={{ fontFamily: FONT.cairo, color: C.ink, minWidth: 56 }}>{t('newWs.team')}</b>
        <span aria-hidden style={{ display: 'flex' }}>
          <span style={{ ...AV, background: 'linear-gradient(135deg,#1283FF,#724DD0)' }}>ح</span>
          <span style={{ ...AV, background: '#01A88B', marginInlineStart: -6 }}>س</span>
          <span style={{ ...AV, background: '#E8478F', marginInlineStart: -6 }}>م</span>
        </span>
        <span>{t('newWs.rolesLine')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 13 }}>
        <b style={{ fontFamily: FONT.cairo, color: C.ink, minWidth: 56 }}>{t('newWs.orgs')}</b>
        <span style={{ padding: '3px 10px', borderRadius: 999, background: '#fff', border: `1.5px solid ${C.blue}`, color: C.blueDark, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12.5 }}>{t('newWs.softwareNow')}</span>
        <span style={SOON}>{t('newWs.hospital')}</span>
        <span style={SOON}>{t('newWs.clinic')}</span>
        <span style={SOON}>{t('newWs.pharmacy')}</span>
        <span style={{ fontSize: 12, color: MK.amberText }}>{t('newWs.soon')}</span>
      </div>
      <figcaption style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #E6DFF8' }}>
        <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 13, lineHeight: 1.7, color: C.ink2 }}>
          <li>{t('newWs.b1')}</li>
          <li>{t('newWs.b2')}</li>
          <li>{t('newWs.b3')}</li>
        </ul>
      </figcaption>
    </figure>
  );
}

export function OrgsOnlyNote({ title, care, invite }: { title: string; care: string; invite?: string }) {
  const { t } = useMt();
  return (
    <div role="note" style={{ padding: '12px 14px', borderRadius: 14, background: C.amberBg, border: `1px solid ${MK.noteBorder}`, margin: '0 0 18px', fontSize: 13.5, lineHeight: 1.7, color: MK.noteFg }}>
      <b style={{ fontFamily: FONT.cairo }}>{title}</b> <span>{care}</span>{' '}
      <Link href="/download" style={{ color: MK.noteFg, fontWeight: 700, textDecoration: 'underline' }}>{t('common.downloadApp')}</Link>
      {invite && <><br /><span>{invite}</span></>}
    </div>
  );
}

export default function NewWorkspace({ s, a }: { s: State; a: MkActions }) {
  const { t } = useMt();
  const handle = s.wsHandle.trim();
  const problem = handleProblem(handle, s.companies, s.inbox);
  return (
    <section className={css.view} style={section()}>
      <div style={page(620)}>
        <div style={kicker(MK.violetText)}>{t('newWs.kicker')}</div>
        <h1 style={h1()}>{t('newWs.title')}</h1>
        <p style={{ ...lead, margin: '0 0 16px' }}>{t('newWs.lead')}</p>
        <Example />
        <OrgsOnlyNote title={t('newWs.noteTitle')} care={t('newWs.noteCare')} invite={t('newWs.noteInvite')} />
        <form className={css.box} onSubmit={(e) => { e.preventDefault(); a.createWorkspace(); }} noValidate id="mk-newws">
          <div style={{ fontSize: 13, color: MK.okFg, fontFamily: FONT.cairo, fontWeight: 700, marginBottom: 12 }}>
            <span>{t('newWs.account')}</span> <span dir="auto">{s.uname.trim() || s.email.trim()}</span>
          </div>
          <label htmlFor="mk-wsname" className={css.label}>{t('newWs.nameLabel')}</label>
          <input id="mk-wsname" value={s.wsName} onChange={(e) => a.setWsName(e.target.value)} placeholder={t('newWs.namePh')} className={css.input} />
          <div className={css.hint}>{t('newWs.nameHint')}</div>
          <FieldError>{s.wsNameErr ? t(s.wsNameErr) : null}</FieldError>
          <label htmlFor="mk-wshandle" className={css.label} style={{ marginTop: 16 }}>{t('newWs.handleLabel')}</label>
          <div dir="ltr" className={css.handle}>
            <span aria-hidden style={{ padding: '0 2px 0 14px', color: MK.muted, fontFamily: FONT.mono, fontSize: 16 }}>@</span>
            <input
              id="mk-wshandle" value={s.wsHandle} onChange={(e) => a.setWsHandle(e.target.value)} maxLength={30} autoComplete="off" spellCheck={false} placeholder="alnour-medical"
              aria-describedby="mk-wshandle-msg mk-wshandle-hint" aria-invalid={!!problem}
              style={{ flex: 1, minWidth: 0, minHeight: 46, padding: '13px 14px 13px 2px', border: 'none', outline: 'none', background: 'transparent', fontFamily: FONT.mono, fontSize: 15.5, color: C.ink }}
            />
            {problem === null && <span style={{ padding: '0 14px', color: MK.okFg, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>✓ <span>{t('newWs.available')}</span></span>}
          </div>
          <div id="mk-wshandle-msg" aria-live="polite" className={css.err} style={{ marginTop: problem ? 6 : 0 }}>{problem ? t('newWs.' + problem) : ''}</div>
          <div id="mk-wshandle-hint" className={css.hint}>
            <span>{t('newWs.handleHint')}</span> <span dir="ltr" style={{ fontFamily: FONT.mono, color: C.ink }}>balsm.health/@{s.wsHandle || 'handle'}</span>
          </div>
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.borderHair}`, fontSize: 14.5, lineHeight: 1.6, color: C.ink2, cursor: 'pointer' }}>
            <input type="checkbox" checked={s.wsOrgOk} onChange={(e) => a.setWsOrgOk(e.target.checked)} style={{ marginTop: 4, width: 18, height: 18, flex: 'none', accentColor: C.blue }} />
            <span>{t('newWs.orgOk')}</span>
          </label>
        </form>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20, justifyContent: 'space-between' }}>
          <button type="button" onClick={a.goDirectory} className={css.ghost} style={{ padding: '14px 22px' }}>{t('common.cancel')}</button>
          <button type="submit" form="mk-newws" className={css.primary} style={{ width: 'auto', padding: '14px 28px' }}>{t('newWs.create')}</button>
        </div>
      </div>
    </section>
  );
}
