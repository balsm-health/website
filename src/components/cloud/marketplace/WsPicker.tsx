'use client';

import { useEffect, useRef, type KeyboardEvent } from 'react';
import { C, FONT } from '../theme';
import { Check, ChevronDown, Search, X } from '../CloudIcons';
import { initialOf, WS_COLORS } from './data';
import { targetWs, type State } from './state';
import type { MkActions } from './useMarketplace';
import { css, FieldError, MK, useMt } from './ui';

// Arrow-key movement between the options of an open listbox.
export function moveFocus(e: KeyboardEvent, list: HTMLElement | null) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return false;
  const opts = Array.from(list?.querySelectorAll<HTMLElement>('[role="option"]') || []);
  if (!opts.length) return false;
  e.preventDefault();
  const i = opts.indexOf(document.activeElement as HTMLElement);
  const n = e.key === 'ArrowDown' ? (i + 1) % opts.length : (i <= 0 ? opts.length - 1 : i - 1);
  opts[n].focus();
  return true;
}

function NewWsDialog({ s, a, returnTo }: { s: State; a: MkActions; returnTo: React.RefObject<HTMLButtonElement | null> }) {
  const { t } = useMt();
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    input.current?.focus();
    const back = returnTo.current;
    return () => back?.focus();
  }, [returnTo]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      a.closeWsModal();
    } else if (e.key === 'Tab') {
      const f = Array.from(box.current?.querySelectorAll<HTMLElement>('button, input') || []);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) a.closeWsModal(); }} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,32,43,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="mk-wsm-title" onKeyDown={onKey} className={css.pop} style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 22, padding: 24, boxShadow: '0 30px 70px rgba(20,32,43,.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
          <h2 id="mk-wsm-title" style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 21, margin: 0, color: C.ink }}>{t('wsModal.title')}</h2>
          <button type="button" onClick={a.closeWsModal} aria-label={t('common.close')} style={{ width: 44, height: 44, border: 'none', borderRadius: 10, background: MK.chipBg, color: C.ink2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: C.ink2, margin: '0 0 16px' }}>{t('wsModal.lead')}</p>
        <form noValidate onSubmit={(e) => { e.preventDefault(); a.confirmWsModal(); }}>
          <label htmlFor="mk-wsm-name" className={css.label}>{t('wsModal.label')}</label>
          <input ref={input} id="mk-wsm-name" value={s.wsModalName} onChange={(e) => a.setWsModalName(e.target.value)} placeholder={t('newWs.namePh')} autoComplete="off" className={css.input} />
          <FieldError>{s.wsModalErr ? t(s.wsModalErr) : null}</FieldError>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
            <button type="button" onClick={a.closeWsModal} className={css.ghost}>{t('common.cancel')}</button>
            <button type="submit" className={css.primary} style={{ width: 'auto', padding: '12px 24px' }}>{t('common.add')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WsPicker({ s, a }: { s: State; a: MkActions }) {
  const { t, name } = useMt();
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (s.wsMenuOpen) search.current?.focus();
    else if (wasOpen.current && !s.wsModal) btn.current?.focus();
    wasOpen.current = s.wsMenuOpen;
  }, [s.wsMenuOpen, s.wsModal]);

  const tgt = targetWs(s);
  const choices = s.companies.map((w, i) => ({ id: w.id, name: name(w), color: WS_COLORS[i % WS_COLORS.length], handle: '@' + w.handle, count: w.entities.length, isNew: false }));
  if (tgt === '__new') {
    const nn = (s.company.wsName || '').trim() || s.company.name.trim() || t('org.newWs');
    choices.push({ id: '__new', name: nn, color: MK.okFg, handle: '', count: 0, isNew: true });
  }
  const sel = choices.find((o) => o.id === tgt) || choices[0];
  const q = s.wsQuery.trim().toLowerCase().replace(/^@/, '');
  const shown = q ? choices.filter((o) => o.name.toLowerCase().includes(q) || o.handle.toLowerCase().includes(q)) : choices;
  const hint = tgt === '__new' ? ((s.company.wsName || '').trim() ? 'org.hintNamed' : 'org.hintAuto') : 'org.hintExisting';

  const sub = (o: (typeof choices)[number], size: number) => o.isNew
    ? <span style={{ display: 'block', fontSize: size, color: MK.okFg }}>{t('org.newWsSub')}</span>
    : <span style={{ display: 'block', fontSize: size, color: MK.muted }}><span dir="ltr" style={{ fontFamily: FONT.mono }}>{o.handle}</span> · <span>{t('common.orgsCount', { count: o.count })}</span></span>;

  const onMenuKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); a.closeWsMenu(); return; }
    moveFocus(e, list.current);
  };
  const onSearchKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (shown.length) a.pickWs(shown[0].id);
    }
  };

  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <span id="mk-cws-label" className={css.label}>{t('org.wsLabel')}</span>
      <div style={{ position: 'relative' }}>
        <button ref={btn} type="button" id="mk-cws" aria-haspopup="listbox" aria-expanded={s.wsMenuOpen} aria-labelledby="mk-cws-label mk-cws" onClick={a.toggleWsMenu} className={css.wsbtn}>
          {sel && <span aria-hidden className={css.wsav} style={{ background: sel.color }}>{initialOf(sel.name)}</span>}
          <span style={{ flex: 1, minWidth: 0, textAlign: 'start' }}>
            <span style={{ display: 'block', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sel?.name}</span>
            {sel && sub(sel, 12.5)}
          </span>
          <ChevronDown style={{ width: 18, height: 18, flex: 'none', color: MK.muted }} />
        </button>
        {s.wsMenuOpen && (
          <>
            <div onClick={a.closeWsMenu} aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div className={`${css.wsmenu} ${css.pop}`} onKeyDown={onMenuKey}>
              <div className={css.wssearch}>
                <Search style={{ width: 17, height: 17, flex: 'none', color: MK.muted }} />
                <input ref={search} type="search" value={s.wsQuery} onChange={(e) => a.setWsQuery(e.target.value)} onKeyDown={onSearchKey} placeholder={t('org.searchPh')} aria-label={t('org.searchAria')} aria-controls="mk-wslist" autoComplete="off" spellCheck={false} />
              </div>
              <div ref={list} id="mk-wslist" role="listbox" aria-labelledby="mk-cws-label" className={css.wslist}>
                {shown.map((o) => (
                  <button key={o.id} type="button" role="option" aria-selected={o.id === tgt} onClick={() => a.pickWs(o.id)} className={css.wsopt}>
                    <span aria-hidden className={css.wsav} style={{ background: o.color }}>{initialOf(o.name)}</span>
                    <span style={{ flex: 1, minWidth: 0, textAlign: 'start' }}>
                      <span style={{ display: 'block', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14.5, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.name}</span>
                      {sub(o, 12)}
                    </span>
                    {o.id === tgt && <Check strokeWidth={2.5} style={{ width: 18, height: 18, flex: 'none', color: C.blue }} />}
                  </button>
                ))}
                {q && shown.length === 0 && <div role="status" style={{ padding: '14px 10px', fontSize: 13.5, color: MK.muted, textAlign: 'center' }}>{t('org.noWs')}</div>}
              </div>
              <div style={{ height: 1, background: C.borderHair, margin: '6px 4px' }} />
              <button type="button" onClick={a.openWsModal} className={css.wsopt} style={{ color: C.blueDark }}>
                <span aria-hidden className={css.wsav} style={{ background: C.blueBg, color: C.blueDark, fontSize: 20 }}>+</span>
                <span style={{ flex: 1, textAlign: 'start', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14.5 }}>{t('org.newWs')}</span>
              </button>
            </div>
          </>
        )}
      </div>
      <div className={css.hint}>{t(hint)}</div>
      {s.wsModal && <NewWsDialog s={s} a={a} returnTo={btn} />}
    </div>
  );
}
