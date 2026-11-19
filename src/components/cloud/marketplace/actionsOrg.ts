// Organization form (with its inline email check and workspace picker),
// organization email verification, legal verification and the listing form.
import {
  domainOf, IMAGE_TYPES, isEmail, isPersonal, MAX_CUSTOMERS, MAX_DOC_BYTES, MAX_IMAGE_BYTES, MAX_IMAGES, MAX_TAGS,
  readAsDataUrl, slugify, uniqueHandle, validUrl, ytId, type MyListing, type Org, type Workspace,
} from './data';
import { EMPTY_COMPANY, EMPTY_LISTING, findEntity, targetWs, type CompanyForm, type Msg, type NextStep, type State } from './state';
import { nameRef, type Actions, type Get, type Patch } from './actions';

export function createOrgActions(get: Get, set: Patch, base: Actions) {
  const { go, goList, setEntity } = base;
  const patchC = (p: Partial<CompanyForm>) => set((s) => ({ company: { ...s.company, ...p } }));
  const cevIsOk = (c: CompanyForm) => !!c.evOkEmail && c.evOkEmail === (c.email || '').trim().toLowerCase();

  // Where to go once an organization's email step is done (or skipped).
  const afterEv = (note: Msg[], startsWithEvNote = false) => {
    const s = get();
    if (s.evNext === 'list') {
      set({ pubId: s.evFor });
      return goList();
    }
    if (s.evNext === 'form') return go('form');
    go('workspace', { wsNote: s.evNote.length && !startsWithEvNote ? s.evNote.concat(note) : note });
  };
  const afterLegal = (note: Msg[]) => {
    const s = get();
    if (s.legalNext === 'list') {
      set({ pubId: s.legalFor });
      return goList();
    }
    if (s.legalNext === 'form') return go('form');
    go('workspace', { wsNote: note });
  };
  const startEv = (eid: string, next: NextStep) => {
    const em = findEntity(get(), eid)?.e.email || '';
    go('emailv', { evFor: eid, evNext: next, evNote: [], evEmail: em, evStep: em ? 'code' : 'email', evCode: '', evErr: '', evResent: false });
  };

  return {
    cevIsOk,
    setC: <K extends keyof CompanyForm>(k: K, v: CompanyForm[K]) => patchC({ [k]: v } as Partial<CompanyForm>),

    // ── inline work-email check on the organization form ──
    cevSend: () => {
      const v = (get().company.email || '').trim().toLowerCase();
      if (!isEmail(v)) return set({ cevErr: 'org.errCevEmail' });
      if (isPersonal(v)) return set({ cevErr: 'emailV.errPersonal' });
      set({ cevErr: '', cevResent: false });
      patchC({ evStep: 'code', evCode: '', evSentTo: v });
    },
    setCevCode: (v: string) => {
      set({ cevErr: '' });
      patchC({ evCode: v.replace(/\D/g, '').slice(0, 6) });
    },
    cevConfirm: () => {
      const c = get().company;
      if ((c.evCode || '').length !== 6) return set({ cevErr: 'auth.errCode' });
      set({ cevErr: '' });
      patchC({ evOkEmail: c.evSentTo || (c.email || '').trim().toLowerCase(), evStep: '', evCode: '' });
    },
    cevResend: () => {
      set({ cevResent: true, cevErr: '' });
      patchC({ evCode: '' });
    },
    cevCancel: () => {
      set({ cevErr: '', cevResent: false });
      patchC({ evStep: '', evCode: '' });
    },

    // ── workspace picker + "new workspace" dialog ──
    toggleWsMenu: () => set((s) => ({ wsMenuOpen: !s.wsMenuOpen, wsQuery: '' })),
    closeWsMenu: () => set({ wsMenuOpen: false, wsQuery: '' }),
    setWsQuery: (wsQuery: string) => set({ wsQuery }),
    pickWs: (id: string) => set((s) => ({ wsMenuOpen: false, wsQuery: '', company: { ...s.company, ws: id } })),
    openWsModal: () => set((s) => ({ wsMenuOpen: false, wsModal: true, wsModalErr: '', wsModalName: s.company.ws === '__new' ? s.company.wsName || '' : '' })),
    closeWsModal: () => set({ wsModal: false, wsModalErr: '' }),
    setWsModalName: (wsModalName: string) => set({ wsModalName, wsModalErr: '' }),
    confirmWsModal: () => {
      const s = get();
      const n = s.wsModalName.trim();
      if (!n) return set({ wsModalErr: 'newWs.errName' });
      if (s.companies.some((w) => (w.name || '').trim() === n)) return set({ wsModalErr: 'wsModal.errDup' });
      set({ wsModal: false, company: { ...s.company, ws: '__new', wsName: n } });
    },

    submitCompany: () => {
      const s = get();
      const c = s.company;
      const type = s.wsType || 'software';
      const vendor = type === 'software';
      const err: Msg[] = [];
      if (!c.name.trim()) err.push({ k: `types.${type}.nameLabel`, strip: true });
      if (!c.country) err.push({ k: 'org.eCountry' });
      if (vendor ? !validUrl(c.site) : c.site.trim() && !validUrl(c.site)) err.push({ k: 'org.eSite' });
      const ce = c.email.trim().toLowerCase();
      const dom = domainOf(ce);
      let siteHost = '';
      try { siteHost = new URL(c.site.trim()).hostname.replace(/^www\./, ''); } catch { siteHost = ''; }
      if (vendor || ce) {
        if (!isEmail(ce) || (vendor && isPersonal(ce))) err.push({ k: vendor ? 'org.eEmailVendor' : 'org.eEmailWork' });
        else if (vendor && siteHost && !(dom === siteHost || dom.endsWith('.' + siteHost) || siteHost.endsWith('.' + dom))) err.push({ k: 'org.eEmailDomain' });
      }
      if (!c.agree) err.push({ k: 'org.eAgree' });
      if (err.length) return set({ errors: err });

      const emailOk = cevIsOk(c);
      const ent: Org = {
        id: 'e' + Date.now(), type, name: c.name.trim(), email: ce, emailVerified: emailOk, country: c.country,
        status: emailOk ? 'verified' : 'unverified', site: c.site.trim(),
      };
      const target = targetWs(s);
      const wasNew = target === '__new';
      let companies: Workspace[];
      let activeCo: string;
      if (wasNew) {
        activeCo = 'ws' + Date.now();
        const wsName = (c.wsName || '').trim() || ent.name;
        const handle = uniqueHandle(slugify(wsName) || slugify(siteHost.split('.')[0] || '') || slugify(ent.name), s.companies, s.inbox);
        companies = s.companies.concat([{
          id: activeCo, name: wsName, handle, role: 'owner', invites: [], entities: [ent],
          members: [{ name: s.uname.trim() || s.email.trim(), email: s.email.trim(), role: 'owner', you: true }],
        }]);
      } else {
        activeCo = target;
        companies = s.companies.map((w) => (w.id === target ? { ...w, entities: w.entities.concat([ent]) } : w));
      }
      const evNote: Msg[] = wasNew
        ? [{ k: 'workspace.addedNew', v: { name: ent.name } }, { k: 'workspace.autoWs' }]
        : [{ k: 'workspace.added', v: { name: ent.name } }];
      // Email confirmation is optional: continue straight away; it can be done later from the card.
      set({
        companies, activeCo, pubId: ent.id, errors: [], company: EMPTY_COMPANY, cevErr: '', cevResent: false,
        evFor: ent.id, evNext: vendor && s.flowList ? 'list' : 'workspace', evNote,
      });
      afterEv([{ k: emailOk ? 'workspace.emailOk' : 'workspace.confirmLater' }]);
    },

    // ── organization email verification (6-digit code) ──
    verifyEntity: (eid: string) => startEv(eid, 'workspace'),
    verifyPub: () => {
      const id = get().pubId;
      if (id) startEv(id, 'form');
    },
    setEvEmail: (evEmail: string) => set({ evEmail, evErr: '' }),
    setEvCode: (v: string) => set({ evCode: v.replace(/\D/g, '').slice(0, 6), evErr: '' }),
    sendEvCode: () => {
      const v = (get().evEmail || '').trim().toLowerCase();
      if (!isEmail(v)) return set({ evErr: 'emailV.errEmail' });
      if (isPersonal(v)) return set({ evErr: 'emailV.errPersonal' });
      setEntity(get().evFor, { email: v });
      set({ evEmail: v, evStep: 'code', evCode: '', evErr: '', evResent: false });
    },
    resendEvCode: () => set({ evResent: true, evCode: '', evErr: '' }),
    evChangeEmail: () => set({ evStep: 'email', evCode: '', evErr: '' }),
    confirmEvCode: () => {
      const s = get();
      if (s.evCode.length !== 6) return set({ evErr: 'auth.errCode' });
      const f = findEntity(s, s.evFor);
      setEntity(s.evFor, { status: 'verified', emailVerified: true });
      afterEv([{ k: 'workspace.emailConfirmed', ...nameRef(f?.e) }, { k: 'workspace.badgeNow' }]);
    },
    skipEv: () => {
      const n = get().evNote;
      afterEv(n.length ? n.concat([{ k: 'workspace.confirmLater' }]) : [], true);
    },

    // ── legal verification ──
    setLg: <K extends keyof State['legal']>(k: K, v: State['legal'][K]) => set((s) => ({ legal: { ...s.legal, [k]: v } })),
    setLgDoc: (file: File | undefined) => {
      if (!file) return;
      const ok = (file.type === 'application/pdf' || file.type.startsWith('image/')) && file.size <= MAX_DOC_BYTES;
      set((s) => ({ legalDocErr: !ok, legal: { ...s.legal, doc: ok ? file.name : '' } }));
    },
    submitLegal: () => {
      const s = get();
      const l = s.legal;
      const err: Msg[] = [];
      if (!l.reg.trim()) err.push({ k: 'legal.eReg' });
      if (!l.doc) err.push({ k: 'legal.eDoc' });
      if (!l.confirm) err.push({ k: 'legal.eConfirm' });
      if (err.length) return set({ errors: err });
      const f = findEntity(s, s.legalFor);
      setEntity(s.legalFor, { status: 'pending' });
      afterLegal([{ k: 'workspace.docsSent', ...nameRef(f?.e) }, { k: 'workspace.badgeSoon' }]);
    },
    skipLegal: () => afterLegal([]),

    // ── listing form ──
    setF: (k: keyof State['f'], v: string) => set((s) => ({ f: { ...s.f, [k]: v } })),
    togglePubMenu: () => set((s) => ({ pubMenuOpen: !s.pubMenuOpen })),
    closePubMenu: () => set({ pubMenuOpen: false }),
    pickPub: (id: string) => set({ pubId: id, pubMenuOpen: false }),
    addVendor: () => {
      set({ pubMenuOpen: false });
      base.newVendorWs();
    },
    addFiles: async (files: FileList | null | undefined) => {
      const list = Array.from(files || []);
      const ok = list.filter((f) => IMAGE_TYPES.test(f.type) && f.size <= MAX_IMAGE_BYTES);
      const room = Math.max(0, MAX_IMAGES - get().images.length);
      const take = ok.slice(0, room);
      const skipped = take.length < list.length;
      const read = await Promise.all(take.map((f) => readAsDataUrl(f).catch(() => '')));
      const stamp = Date.now();
      const add = take.map((f, i) => ({ id: stamp + '-' + i + '-' + f.name, name: f.name, url: read[i] })).filter((x) => x.url);
      set((s) => ({ images: s.images.concat(add).slice(0, MAX_IMAGES), imgSkipped: skipped }));
    },
    removeImage: (id: string) => set((s) => ({ images: s.images.filter((i) => i.id !== id) })),
    coverImage: (id: string) => set((s) => {
      const im = s.images.find((i) => i.id === id);
      return im ? { images: [im].concat(s.images.filter((i) => i.id !== id)) } : {};
    }),
    toggleIn: (key: 'platforms' | 'compat' | 'tags', val: string) => set((s) => ({ [key]: s[key].includes(val) ? s[key].filter((x) => x !== val) : s[key].concat([val]) })),
    toggleTag: (t: string) => set((s) => {
      if (!s.tags.includes(t) && s.tags.length >= MAX_TAGS) return {};
      return { tags: s.tags.includes(t) ? s.tags.filter((x) => x !== t) : s.tags.concat([t]) };
    }),
    setTagInput: (tagInput: string) => set({ tagInput }),
    addTag: () => set((s) => {
      const t = s.tagInput.trim().replace(/\s+/g, ' ');
      if (!t || s.tags.includes(t) || s.tags.length >= MAX_TAGS) return { tagInput: '' };
      return { tags: s.tags.concat([t]), tagInput: '' };
    }),
    setCustName: (custName: string) => set({ custName }),
    addCustomer: () => set((s) => {
      const n = s.custName.trim();
      if (!n) return {};
      if (s.customers.includes(n) || s.customers.length >= MAX_CUSTOMERS) return { custName: '' };
      return { customers: s.customers.concat([n]), custName: '' };
    }),
    removeCustomer: (n: string) => set((s) => ({ customers: s.customers.filter((x) => x !== n) })),
    submitListing: () => {
      const s = get();
      const f = s.f;
      const err: Msg[] = [];
      if (!f.name.trim()) err.push({ k: 'form.eName' });
      if (!s.tags.length) err.push({ k: 'form.eTags' });
      if (!f.short.trim()) err.push({ k: 'form.eShort' });
      if (f.desc.trim().length < 40) err.push({ k: 'form.eDesc' });
      if (!s.images.length) err.push({ k: 'form.eImages' });
      if (f.yt.trim() && !ytId(f.yt)) err.push({ k: 'form.eYt' });
      if (f.site.trim() && !validUrl(f.site)) err.push({ k: 'form.eSite' });
      if (err.length) return set({ errors: err });
      const item: MyListing = {
        id: 'm' + Date.now(), coId: s.activeCo, pubId: s.pubId, name: f.name.trim(), areas: s.tags.slice(), short: f.short.trim(),
        cover: s.images[0] ? s.images[0].url : '',
      };
      set({ mine: [item].concat(s.mine), ...EMPTY_LISTING });
      go('mine', { justSubmitted: true });
    },
  };
}

export type OrgActions = ReturnType<typeof createOrgActions>;
