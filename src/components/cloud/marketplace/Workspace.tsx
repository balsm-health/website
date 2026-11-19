'use client';

import { C, FONT } from '../theme';
import { Users } from '../CloudIcons';
import { initialOf, vendorsOf, type Org } from './data';
import { activeCompany, type State } from './state';
import type { MkActions } from './useMarketplace';
import { chip, css, kicker, MK, SuccessNote, useMt } from './ui';

export const canManage = (role: string | undefined) => role === 'owner' || role === 'admin';

const ST_BG = { verified: C.greenBg, pending: C.amberBg, unverified: C.borderHair } as const;
const ST_FG = { verified: MK.okDark, pending: MK.amberText, unverified: C.ink2 } as const;
const smallBtn = { alignSelf: 'flex-start', minHeight: 36, padding: '5px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, background: '#fff', color: C.ink, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' } as const;

export function useOrgText() {
  const { t, name } = useMt();
  const city = (e: Org) => (e.cityKey ? t(e.cityKey) : e.country && e.country !== 'OTHER' ? t(`countries.${e.country}`) : '');
  return { t, name, city };
}

function OrgCard({ e, s, a, manage }: { e: Org; s: State; a: MkActions; manage: boolean }) {
  const { t, name, city } = useOrgText();
  const current = e.id === s.pubId;
  return (
    <li style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 18, borderRadius: 16, border: `1px solid ${C.border}`, background: C.bg }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={chip(e.type === 'software' ? C.blueBg : C.aquaBg, e.type === 'software' ? C.blueDark : MK.teal)}>{t(`types.${e.type}.label`)}</span>
        <span style={chip(ST_BG[e.status], ST_FG[e.status])}>{t(`status.${e.status}`)}</span>
      </div>
      <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 17, color: C.ink }}>{name(e)}</div>
      {current
        ? <span style={{ ...chip(C.blueBg, C.blueDark), alignSelf: 'flex-start' }}>{t('workspace.actingNow')}</span>
        : <button type="button" onClick={() => a.actAs(e.id)} style={smallBtn}>{t('workspace.actAs')}</button>}
      <div style={{ fontSize: 13.5, color: MK.muted }}>{city(e)}</div>
      {e.status === 'unverified' && (
        <button type="button" onClick={() => a.verifyEntity(e.id)} style={{ alignSelf: 'flex-start', minHeight: 40, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${MK.okBorder}`, background: C.greenBg, color: MK.okDark, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}>
          {t('workspace.confirmEmail')}
        </button>
      )}
      {e.status === 'pending' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: MK.muted }}>{t('workspace.pendingDocs')}</span>
          <button type="button" onClick={() => a.approveEntity(e.id)} title={t('workspace.simulateTitle')} style={{ minHeight: 36, padding: '5px 10px', borderRadius: 8, border: `1px dashed ${MK.border2}`, background: 'transparent', color: MK.muted, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            {t('workspace.simulate')}
          </button>
        </div>
      )}
      {manage && e.type === 'software' && e.status !== 'pending' && (
        <button type="button" onClick={() => a.startLegal(e.id)} style={{ ...smallBtn, color: C.blueDark }}>{t('workspace.legal')}</button>
      )}
    </li>
  );
}

export default function Workspace({ s, a }: { s: State; a: MkActions }) {
  const { t, msg, name } = useMt();
  const ws = activeCompany(s);
  if (!ws) return null;
  const manage = canManage(ws.role);
  return (
    <section className={css.view} style={{ padding: 'clamp(36px,5vw,64px) 0 clamp(56px,8vw,96px)', background: C.bg, minHeight: '60vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {s.wsNote.length > 0 && <SuccessNote>{s.wsNote.map(msg).join(' ')}</SuccessNote>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', minWidth: 0 }}>
            <span aria-hidden style={{ width: 52, height: 52, flex: 'none', borderRadius: 15, background: `linear-gradient(135deg,${C.violet},${C.blue})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.cairo, fontWeight: 800, fontSize: 20 }}>{initialOf(name(ws))}</span>
            <div style={{ minWidth: 0 }}>
              <div style={kicker(MK.violetText)}>{t('workspace.kicker')}</div>
              <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(24px,3.2vw,32px)', margin: '2px 0 0', color: C.ink }}>{name(ws)}</h1>
              <div dir="ltr" style={{ fontFamily: FONT.mono, fontSize: 14, color: MK.muted, textAlign: 'start' }}>@{ws.handle}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button type="button" onClick={a.goTeam} className={css.ghost} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 16px', fontSize: 14.5 }}>
              <Users style={{ width: 16, height: 16 }} />
              {t('workspace.team', { count: String(ws.members.length) })}
            </button>
            {vendorsOf(ws).length > 0 && (
              <button type="button" onClick={a.goList} className={css.ghost} style={{ padding: '11px 18px', borderColor: '#CFE3FF', color: C.blueDark, fontSize: 14.5 }}>{t('workspace.list')}</button>
            )}
            {manage && <button type="button" onClick={a.addEntity} className={css.primary} style={{ width: 'auto', padding: '11px 18px', fontSize: 14.5 }}>{t('workspace.addOrg')}</button>}
          </div>
        </div>

        <div className={css.box}>
          <h2 className={css.h2}>{t('workspace.orgsTitle')}</h2>
          {ws.entities.length === 0 && (
            <div style={{ textAlign: 'center', padding: '28px 16px', border: `1.5px dashed ${C.border}`, borderRadius: 16 }}>
              <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 17, marginBottom: 6, color: C.ink }}>{t('workspace.emptyTitle')}</div>
              <div style={{ fontSize: 14.5, color: MK.muted, marginBottom: 16 }}>{t('workspace.emptyLead')}</div>
              <button type="button" onClick={a.addEntity} className={css.primary} style={{ width: 'auto', padding: '12px 22px' }}>{t('workspace.addOrg')}</button>
            </div>
          )}
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(280px,100%),1fr))', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
            {ws.entities.map((e) => <OrgCard key={e.id} e={e} s={s} a={a} manage={manage} />)}
          </ul>
        </div>
      </div>
    </section>
  );
}
