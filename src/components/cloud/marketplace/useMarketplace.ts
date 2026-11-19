'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createActions, type Go, type Patch } from './actions';
import { createOrgActions } from './actionsOrg';
import { INITIAL, type State, type View } from './state';
import { loadSnapshot, saveSnapshot } from './store';

const NEEDS_WORKSPACE: View[] = ['workspace', 'team', 'mine', 'form', 'notvendor', 'legal', 'emailv'];
// Views a reload or a pasted #hash may open directly; the rest need the flow
// that leads into them (a half-filled form, a chosen organization).
const DEEP_LINKABLE: View[] = ['directory', 'account', 'workspace', 'team', 'mine'];

function allowed(v: View | undefined, s: State): v is View {
  if (!v) return false;
  if (v === 'directory') return true;
  if (v === 'detail') return !!s.selected;
  if (v === 'auth') return !s.signedIn;
  if (!s.signedIn) return false;
  return !NEEDS_WORKSPACE.includes(v) || s.companies.length > 0;
}

const viewUrl = (v: View) => window.location.pathname + window.location.search + (v === 'directory' ? '' : '#' + v);

// One store per mounted page, outside React's render path: handlers read and
// patch it synchronously (several updates in a row each see the last, like the
// prototype's chained setState callbacks) and the component subscribes to it.
function createMarketplace() {
  let state: State = INITIAL;
  let hydrated = false;
  const subs = new Set<() => void>();
  const get = () => state;
  const set: Patch = (p) => {
    const patch = typeof p === 'function' ? p(state) : p;
    state = { ...state, ...patch };
    subs.forEach((f) => f());
  };
  const go: Go = (view, extra) => {
    const prev = state.view;
    set({ view, errors: [], wsMenuOpen: false, pubMenuOpen: false, ...extra });
    if (view === prev) return;
    try {
      window.history.pushState({ mkView: view, mkSel: state.selected }, '', viewUrl(view));
    } catch {
      // History unavailable (sandboxed frame): views still switch.
    }
  };
  const base = createActions(get, set, go);
  return {
    get,
    subscribe: (f: () => void) => {
      subs.add(f);
      return () => { subs.delete(f); };
    },
    isHydrated: () => hydrated,
    markHydrated: () => { hydrated = true; },
    actions: { ...base, ...createOrgActions(get, set, base), set },
  };
}

const serverState = () => INITIAL;

export function useMarketplace() {
  const [mk] = useState(createMarketplace);
  const state = useSyncExternalStore(mk.subscribe, mk.get, serverState);
  const actions = mk.actions;

  // Restore the account from browser storage once, after hydration, so the
  // server render and the first client render agree.
  useEffect(() => {
    const snap = loadSnapshot();
    const restored: State = snap ? { ...mk.get(), ...snap } : mk.get();
    const fromHash = window.location.hash.replace(/^#/, '') as View;
    const view = DEEP_LINKABLE.includes(fromHash) && allowed(fromHash, restored) ? fromHash : 'directory';
    actions.set({ ...(snap || {}), view });
    mk.markHydrated();
    try {
      window.history.replaceState({ ...window.history.state, mkView: view, mkSel: null }, '', viewUrl(view));
    } catch {
      // ignore
    }
    const onPop = (e: PopStateEvent) => {
      const st = (e.state || {}) as { mkView?: View; mkSel?: string | null };
      const s = mk.get();
      const sel = st.mkSel ?? s.selected;
      const next = allowed(st.mkView, { ...s, selected: sel }) ? (st.mkView as View) : 'directory';
      actions.set({ view: next, selected: sel, active: 0, errors: [], wsMenuOpen: false, pubMenuOpen: false, wsModal: false });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [mk, actions]);

  const { signedIn, uname, email, companies, activeCo, pubId, inbox, mine } = state;
  useEffect(() => {
    if (!mk.isHydrated()) return;
    saveSnapshot({ signedIn, uname, email, companies, activeCo, pubId, inbox, mine });
  }, [mk, signedIn, uname, email, companies, activeCo, pubId, inbox, mine]);

  const firstView = useRef(true);
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }, [state.view]);

  return { s: state, a: actions };
}

export type Mk = ReturnType<typeof useMarketplace>;
export type MkActions = Mk['a'];
