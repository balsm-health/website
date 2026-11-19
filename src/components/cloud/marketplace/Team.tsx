'use client';

import { C, FONT } from '../theme';
import { initialOf } from './data';
import { activeCompany, type State } from './state';
import type { MkActions } from './useMarketplace';
import { canManage } from './Workspace';
import { chip, css, FieldError, kicker, ltrInput, MK, useMt } from './ui';

const row = { display: 'flex', flexWrap: 'wrap', gap: '10px 14px', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.borderHair}` } as const;
const roleCard = { padding: '12px 14px', borderRadius: 12, background: MK.hover, fontSize: 13.5, lineHeight: 1.6, color: C.ink2 } as const;
const smallBtn = (border: string, color: string) => ({ minHeight: 40, padding: '7px 12px', borderRadius: 10, border: `1.5px solid ${border}`, background: '#fff', color, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, cursor: 'pointer' }) as const;

export default function Team({ s, a }: { s: State; a: MkActions }) {
  const { t, name } = useMt();
  const ws = activeCompany(s);
  if (!ws) return null;
  const manage = canManage(ws.role);
  return (
    <section className={css.view} style={{ padding: 'clamp(36px,5vw,64px) 0 clamp(56px,8vw,96px)', background: C.bg, minHeight: '60vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }}>
        <div style={kicker(MK.violetText)}>{t('team.kicker')}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 16px', alignItems: 'center', justifyContent: 'space-between', margin: '6px 0 24px' }}>
          <div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(26px,3.4vw,34px)', margin: 0, color: C.ink }}>{name(ws)}</h1>
            <div dir="ltr" style={{ fontFamily: FONT.mono, fontSize: 14, color: MK.muted, textAlign: 'start' }}>@{ws.handle}</div>
          </div>
          <button type="button" onClick={a.goWorkspace} className={css.ghost} style={{ padding: '8px 14px', fontSize: 13.5, borderRadius: 10 }}>{t('team.orgs', { count: String(ws.entities.length) })}</button>
        </div>

        {manage ? (
          <form className={css.box} style={{ marginBottom: 16 }} noValidate onSubmit={(e) => { e.preventDefault(); a.sendInvite(); }}>
            <h2 className={css.h2}>{t('team.invite')}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: '2 1 260px', minWidth: 0 }}>
                <label htmlFor="mk-inv-email" className={css.label}>{t('team.email')}</label>
                <input id="mk-inv-email" value={s.invEmail} onChange={(e) => a.setInvEmail(e.target.value)} type="email" dir="ltr" placeholder="colleague@company.com" className={css.input} style={ltrInput} aria-invalid={!!s.invErr} />
              </div>
              <div style={{ flex: '1 1 160px', minWidth: 0 }}>
                <label htmlFor="mk-inv-role" className={css.label}>{t('team.role')}</label>
                <select id="mk-inv-role" value={s.invRole} onChange={(e) => a.setInvRole(e.target.value as State['invRole'])} className={css.input}>
                  <option value="admin">{t('roles.admin')}</option>
                  <option value="editor">{t('roles.editor')}</option>
                </select>
              </div>
              <button type="submit" className={css.primary} style={{ width: 'auto', padding: '13px 22px' }}>{t('team.send')}</button>
            </div>
            <FieldError>{s.invErr ? t(s.invErr) : null}</FieldError>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: 10, marginTop: 16 }}>
              <div style={roleCard}><b style={{ fontFamily: FONT.cairo }}>{t('roles.owner')}</b> {t('team.ownerDesc')}</div>
              <div style={roleCard}><b style={{ fontFamily: FONT.cairo }}>{t('roles.admin')}</b> {t('team.adminDesc')}</div>
              <div style={roleCard}><b style={{ fontFamily: FONT.cairo }}>{t('roles.editor')}</b> {t('team.editorDesc')}</div>
            </div>
          </form>
        ) : (
          <div style={{ padding: '14px 16px', borderRadius: 14, background: MK.chipBg, fontSize: 14.5, color: C.ink2, marginBottom: 16 }}>{t('team.editorNote')}</div>
        )}

        <div className={css.box} style={{ marginBottom: 16 }}>
          <h2 className={css.h2}>{t('team.members')}</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', margin: 0, padding: 0, listStyle: 'none' }}>
            {ws.members.map((m) => {
              const mName = name(m);
              return (
                <li key={m.email} style={row}>
                  <span aria-hidden style={{ width: 40, height: 40, flex: 'none', borderRadius: '50%', background: `linear-gradient(135deg,${C.blue},${C.violet})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.cairo, fontWeight: 800, fontSize: 15 }}>{initialOf(mName)}</span>
                  <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                    <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15.5, color: C.ink }}>
                      <span dir="auto">{mName}</span> {m.you && <span style={{ fontSize: 12.5, color: MK.muted, fontWeight: 600 }}>{t('team.you')}</span>}
                    </div>
                    <div dir="ltr" style={{ fontSize: 13, color: MK.muted, textAlign: 'start' }}>{m.email}</div>
                  </div>
                  <span style={{ ...chip(MK.chipBg, C.ink2, 13), padding: '5px 12px' }}>{t(`roles.${m.role}`)}</span>
                  {manage && !m.you && m.role !== 'owner' && (
                    <button type="button" onClick={() => a.removeMember(m.email)} aria-label={t('team.removeNamed', { name: mName })} style={smallBtn('#F2D3CE', MK.errFg)}>{t('team.remove')}</button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {ws.invites.length > 0 && (
          <div className={css.box}>
            <h2 className={css.h2}>{t('team.pending')}</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {ws.invites.map((iv) => (
                <li key={iv.email} style={row}>
                  <div dir="ltr" style={{ flex: '1 1 220px', minWidth: 0, fontSize: 14.5, color: C.ink, textAlign: 'start' }}>{iv.email}</div>
                  <span style={{ ...chip(C.amberBg, MK.amberText, 13), padding: '5px 12px' }}>{t('team.awaiting', { role: t(`roles.${iv.role}`) })}</span>
                  {manage && (
                    <button type="button" onClick={() => a.cancelInvite(iv.email)} aria-label={t('team.cancelNamed', { email: iv.email })} style={smallBtn(C.border, C.ink2)}>{t('team.cancelInvite')}</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
