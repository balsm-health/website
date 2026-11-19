'use client';

import { C, FONT } from '../theme';
import { activeCompany, type State } from './state';
import type { MkActions } from './useMarketplace';
import { useTagLabel } from './ListingForm';
import { chip, css, MK, SuccessNote, useMt } from './ui';

// "My systems": listings submitted for the organization the user is acting as.
export default function Mine({ s, a }: { s: State; a: MkActions }) {
  const { t, name } = useMt();
  const tagLabel = useTagLabel();
  const ws = activeCompany(s);
  const mine = s.mine.filter((m) => m.coId === s.activeCo && m.pubId === s.pubId);
  return (
    <section className={css.view} style={{ padding: 'clamp(36px,5vw,64px) 0 clamp(56px,8vw,96px)', background: C.bg, minHeight: '60vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }}>
        {s.justSubmitted && (
          <div style={{ marginBottom: 24 }}>
            <SuccessNote title={t('mine.doneTitle')}>{t('mine.done')}</SuccessNote>
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(26px,3.4vw,34px)', margin: '0 0 4px', color: C.ink }}>{t('mine.title')}</h1>
            <div style={{ fontSize: 14, color: MK.muted }}><span>{t('mine.wsLabel')}</span> <span>{name(ws)}</span></div>
          </div>
          <button type="button" onClick={a.newListing} className={css.primary} style={{ width: 'auto', padding: '13px 22px' }}>{t('mine.newListing')}</button>
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
          {mine.map((m) => {
            const pub = ws?.entities.find((e) => e.id === m.pubId);
            return (
              <li key={m.id} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', padding: 16, borderRadius: 18, background: '#fff', border: `1px solid ${C.border}` }}>
                {m.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.cover} alt="" style={{ width: 120, height: 72, objectFit: 'cover', borderRadius: 10, flex: 'none' }} />
                ) : (
                  <div style={{ width: 120, height: 72, borderRadius: 10, background: `linear-gradient(135deg,${C.blueBg},${C.violetBg})`, flex: 'none' }} />
                )}
                <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                  <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 17, color: C.ink }}>{m.name}</div>
                  <div style={{ fontSize: 13.5, color: MK.muted }}><span>{name(pub)}</span> · <span>{m.areas.map(tagLabel).join(' · ')}</span></div>
                </div>
                <span style={chip(C.amberBg, MK.amberText, 13)}>{t('mine.review')}</span>
              </li>
            );
          })}
        </ul>
        <button type="button" onClick={a.goDirectory} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, marginTop: 22, padding: '8px 0', border: 'none', background: 'none', color: C.blueDark, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{t('common.back')}</button>
      </div>
    </section>
  );
}
