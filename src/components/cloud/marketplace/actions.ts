// Navigation, account, workspace and team actions — the prototype's handlers,
// one for one. Organization and listing actions live in actionsOrg.ts.
import { defaultOrg, handleProblem, isEmail, slugify, vendorsOf, type Org, type OrgType, type Workspace } from './data';
import { activeCompany, findEntity, type Msg, type State, type View } from './state';

export type Get = () => State;
export type Patch = (p: Partial<State> | ((s: State) => Partial<State>)) => void;
export type Go = (view: View, extra?: Partial<State>) => void;

// Display name of a seeded or typed record, as a note value.
export const nameRef = (o: { name: string; nameKey?: string } | undefined): Pick<Msg, 'v' | 'vk'> =>
  o?.nameKey ? { vk: { name: o.nameKey } } : { v: { name: o?.name || '' } };

export function createActions(get: Get, set: Patch, go: Go) {
  const setEntity = (eid: string | null, patch: Partial<Org>) => set((s) => ({
    companies: s.companies.map((w) => ({ ...w, entities: w.entities.map((e) => (e.id === eid ? { ...e, ...patch } : e)) })),
  }));
  const updateActive = (fn: (w: Workspace) => Workspace) => set((s) => ({ companies: s.companies.map((c) => (c.id === s.activeCo ? fn(c) : c)) }));

  const goList = () => {
    const s = get();
    if (!s.signedIn) return go('auth', { authNext: 'list' });
    if (!s.companies.length) return go('verify', { wsType: 'software', flowList: true });
    const ws = activeCompany(s);
    const vendors = vendorsOf(ws);
    if (!vendors.length) return go('notvendor', { flowList: true });
    const cur = ws?.entities.find((e) => e.id === s.pubId);
    go('form', { pubId: cur && cur.type === 'software' ? cur.id : vendors[0].id, flowList: false });
  };

  const goWorkspace = () => (get().companies.length ? go('workspace', { wsNote: [] }) : go('directory'));

  const afterAuth = () => {
    const s = get();
    if (s.authNext === 'list') return goList();
    if (s.inbox.length) return go('account');
    go('directory');
  };

  const acceptInvite = (id: string) => set((s) => {
    const iv = s.inbox.find((x) => x.id === id);
    if (!iv) return {};
    const co: Workspace = {
      id: 'ws-' + id, name: iv.company, nameKey: iv.companyKey, handle: iv.handle, role: iv.role, invites: [], entities: iv.entities,
      members: iv.members.concat([{ name: s.uname.trim() || s.email.trim(), email: s.email.trim(), role: iv.role, you: true }]),
    };
    return {
      inbox: s.inbox.filter((x) => x.id !== id), companies: s.companies.concat([co]),
      activeCo: s.activeCo || co.id, pubId: s.activeCo ? s.pubId : defaultOrg(co),
    };
  });

  const sso = (fallbackName: string) => {
    set((s) => ({ signedIn: true, authErr: '', email: s.email || 'you@example.com', uname: s.uname || fallbackName }));
    afterAuth();
  };

  return {
    go, goList, goWorkspace, acceptInvite, setEntity, updateActive,
    goDirectory: () => go('directory', { justSubmitted: false }),
    goMine: () => go('mine', { justSubmitted: false }),
    newListing: () => go('form', { justSubmitted: false }),
    open: (id: string) => go('detail', { selected: id, active: 0 }),
    pickImage: (i: number) => set({ active: i }),
    setQ: (q: string) => set({ q }),
    clearFilters: () => set({ filters: [] }),
    toggleFilter: (t: State['filters'][number]) => set((s) => ({ filters: s.filters.includes(t) ? s.filters.filter((x) => x !== t) : s.filters.concat([t]) })),

    // ── personal account (simulated) ──
    setMode: (authMode: State['authMode']) => set({ authMode, authErr: '' }),
    setUname: (uname: string) => set({ uname, authErr: '', savedNote: false }),
    setEmail: (email: string) => set({ email, authErr: '' }),
    setPass: (pass: string) => set({ pass, authErr: '' }),
    setUagree: (uagree: boolean) => set({ uagree, authErr: '' }),
    setCode: (v: string) => set({ code: v.replace(/\D/g, '').slice(0, 6), authErr: '' }),
    submitAuth: () => {
      const s = get();
      const v = s.email.trim();
      if (s.authMode === 'signup' && !s.uname.trim()) return set({ authErr: 'auth.errName' });
      if (!isEmail(v)) return set({ authErr: 'auth.errEmail' });
      if (s.authMode === 'signup') {
        if (s.pass.length < 8) return set({ authErr: 'auth.errPass' });
        if (!s.uagree) return set({ authErr: 'auth.errAgree' });
        return set({ authStep: 'code', code: '', authErr: '' });
      }
      if (!s.pass) return set({ authErr: 'auth.errPassMissing' });
      set({ signedIn: true, authErr: '' });
      afterAuth();
    },
    verifyCode: () => {
      if (get().code.length !== 6) return set({ authErr: 'auth.errCode' });
      set({ signedIn: true, authErr: '' });
      afterAuth();
    },
    backToEmail: () => set({ authStep: 'form', code: '', authErr: '' }),
    sso,
    goSignIn: () => go('auth', { authNext: 'browse', authMode: 'signin', authStep: 'form', authErr: '' }),
    signOut: () => go('directory', { signedIn: false, authStep: 'form', authMode: 'signin', pass: '', code: '', authErr: '', justSubmitted: false }),

    // ── workspaces ──
    switchCompany: (i: number) => {
      const c = get().companies[i];
      if (c) set({ activeCo: c.id, pubId: defaultOrg(c) });
    },
    switchOrg: (i: number) => {
      const e = activeCompany(get())?.entities[i];
      if (e) set({ pubId: e.id });
    },
    actAs: (eid: string) => set({ pubId: eid }),
    openCompany: (id: string) => {
      set({ activeCo: id });
      goWorkspace();
    },
    goTeam: () => (get().companies.length ? go('team', { invErr: '' }) : go('verify')),
    goAccount: () => go('account', { savedNote: false }),
    addCompany: () => (get().companies.length
      ? go('newws', { wsName: '', wsNameErr: '', wsHandle: '', handleTouched: false, wsOrgOk: false, flowList: false })
      : go('wstype', { wsType: '', wsTypeErr: false, flowList: false })),
    addEntity: () => go('wstype', { wsType: '', wsTypeErr: false }),
    newVendorWs: () => go('verify', { wsType: 'software', flowList: true }),
    setWsName: (v: string) => set((s) => ({ wsName: v, wsNameErr: '', wsHandle: s.handleTouched ? s.wsHandle : slugify(v) })),
    setWsHandle: (v: string) => set({ wsHandle: v.toLowerCase().replace(/^@/, '').replace(/\s+/g, '-').slice(0, 30), handleTouched: true, wsNameErr: '' }),
    setWsOrgOk: (wsOrgOk: boolean) => set({ wsOrgOk, wsNameErr: '' }),
    createWorkspace: () => {
      const s = get();
      const n = s.wsName.trim();
      if (!n) return set({ wsNameErr: 'newWs.errName' });
      if (!s.wsOrgOk) return set({ wsNameErr: 'newWs.errOrgOk' });
      const h = s.wsHandle.trim();
      const problem = handleProblem(h, s.companies, s.inbox);
      if (problem !== null) return set({ wsNameErr: problem ? 'newWs.' + problem : 'newWs.errHandle' });
      const id = 'ws' + Date.now();
      const ws: Workspace = {
        id, name: n, handle: h, role: 'owner', entities: [], invites: [],
        members: [{ name: s.uname.trim() || s.email.trim(), email: s.email.trim(), role: 'owner', you: true }],
      };
      set({ companies: s.companies.concat([ws]), activeCo: id, wsName: '', wsHandle: '', handleTouched: false });
      if (s.flowList) go('verify', { wsType: 'software' });
      else go('wstype', { wsType: '', wsTypeErr: false });
    },
    pickWsType: (t: OrgType) => set({ wsType: t, wsTypeErr: false }),
    backToWsType: () => go('wstype', { wsTypeErr: false }),
    confirmWsType: () => {
      const s = get();
      if (!s.wsType) return set({ wsTypeErr: true });
      if (s.wsType !== 'software') return go('waitlist', { wlSent: false, wl: { ...s.wl, type: s.wsType, email: s.wl.email || s.email } });
      go('verify');
    },
    joinInvite: (id: string) => {
      acceptInvite(id);
      go('workspace', { wsNote: [{ k: 'workspace.joined' }] });
    },
    declineInvite: (id: string) => set((s) => ({ inbox: s.inbox.filter((x) => x.id !== id) })),
    saveProfile: () => set({ savedNote: true }),

    // ── waitlist ──
    setWl: (k: keyof State['wl'], v: string) => set((s) => ({ wl: { ...s.wl, [k]: v } })),
    submitWaitlist: () => {
      const w = get().wl;
      const err: Msg[] = [];
      if (!w.name.trim()) err.push({ k: 'waitlist.eName' });
      if (!w.city.trim()) err.push({ k: 'waitlist.eCity' });
      if (!isEmail(w.email.trim())) err.push({ k: 'waitlist.eEmail' });
      if (w.phone.trim() && !/^\+?[0-9\s-]{7,16}$/.test(w.phone.trim())) err.push({ k: 'waitlist.ePhone' });
      if (err.length) return set({ errors: err });
      set({ wlSent: true, errors: [] });
    },

    // ── team ──
    setInvEmail: (invEmail: string) => set({ invEmail, invErr: '' }),
    setInvRole: (invRole: State['invRole']) => set({ invRole }),
    sendInvite: () => {
      const s = get();
      const v = s.invEmail.trim().toLowerCase();
      const c = activeCompany(s);
      if (!c) return;
      if (!isEmail(v)) return set({ invErr: 'team.errEmail' });
      if (c.members.some((m) => m.email.toLowerCase() === v) || c.invites.some((x) => x.email === v)) return set({ invErr: 'team.errDup' });
      const role = s.invRole;
      updateActive((co) => ({ ...co, invites: co.invites.concat([{ email: v, role }]) }));
      set({ invEmail: '', invErr: '' });
    },
    cancelInvite: (email: string) => updateActive((co) => ({ ...co, invites: co.invites.filter((x) => x.email !== email) })),
    removeMember: (email: string) => updateActive((co) => ({ ...co, members: co.members.filter((m) => m.email !== email) })),

    // ── legal verification (optional) ──
    startLegal: (eid: string) => go('legal', { legalFor: eid, legalNext: 'workspace', legal: { reg: '', tax: '', doc: '', confirm: false }, legalDocErr: false }),
    approveEntity: (eid: string) => setEntity(eid, { status: 'verified' }),
    findEntity: (eid: string | null) => findEntity(get(), eid),
  };
}

export type Actions = ReturnType<typeof createActions>;
