import type { Country, InboxItem, MyListing, OrgType, Role, TagKey, Workspace } from './data';
import { SEED_INBOX } from './data';

export type View =
  | 'directory' | 'detail' | 'auth' | 'verify' | 'legal' | 'waitlist' | 'newws' | 'workspace'
  | 'wstype' | 'notvendor' | 'form' | 'mine' | 'team' | 'account' | 'emailv';

// A message key under the `marketplace` namespace plus its values. `vk` holds
// values that are themselves message keys (seeded names); `strip` drops a
// trailing " *" (field labels reused as error items).
export type Msg = { k: string; v?: Record<string, string>; vk?: Record<string, string>; strip?: boolean };

export type CompanyForm = {
  name: string;
  country: Country | '';
  site: string;
  email: string;
  agree: boolean;
  ws?: string; // a workspace id, or '__new'
  wsName?: string;
  evStep?: '' | 'code';
  evCode?: string;
  evSentTo?: string;
  evOkEmail?: string;
};

export type ListingImage = { id: string; name: string; url: string };
export type Waitlist = { type: OrgType; name: string; city: string; branches: string; email: string; phone: string; msg: string };
export type NextStep = 'workspace' | 'list' | 'form';

export type State = {
  view: View;
  q: string;
  filters: TagKey[];
  selected: string | null;
  active: number;

  signedIn: boolean;
  authStep: 'form' | 'code';
  authMode: 'signup' | 'signin';
  authNext: 'list' | 'browse' | '';
  uname: string;
  email: string;
  pass: string;
  uagree: boolean;
  code: string;
  authErr: string;

  company: CompanyForm;
  cevErr: string;
  cevResent: boolean;
  wsMenuOpen: boolean;
  wsQuery: string;
  wsModal: boolean;
  wsModalName: string;
  wsModalErr: string;

  legal: { reg: string; tax: string; doc: string; confirm: boolean };
  legalFor: string | null;
  legalNext: NextStep;
  legalDocErr: boolean;

  wsType: OrgType | '';
  wsTypeErr: boolean;
  wl: Waitlist;
  wlSent: boolean;
  wsName: string;
  wsNameErr: string;
  wsHandle: string;
  handleTouched: boolean;
  wsOrgOk: boolean;
  wsNote: Msg[];
  flowList: boolean;

  companies: Workspace[];
  activeCo: string | null;
  pubId: string | null;
  inbox: InboxItem[];

  invEmail: string;
  invRole: Exclude<Role, 'owner'>;
  invErr: string;
  savedNote: boolean;

  evFor: string | null;
  evNext: NextStep;
  evNote: Msg[];
  evEmail: string;
  evStep: 'email' | 'code';
  evCode: string;
  evErr: string;
  evResent: boolean;

  f: { name: string; short: string; desc: string; site: string; yt: string };
  images: ListingImage[];
  imgSkipped: boolean;
  customers: string[];
  custName: string;
  platforms: string[];
  compat: string[];
  tags: string[];
  tagInput: string;
  pubMenuOpen: boolean;

  errors: Msg[];
  mine: MyListing[];
  justSubmitted: boolean;
};

export const EMPTY_COMPANY: CompanyForm = { name: '', country: '', site: '', email: '', agree: false };
export const EMPTY_LISTING = { f: { name: '', short: '', desc: '', site: '', yt: '' }, images: [], imgSkipped: false, customers: [], custName: '', platforms: [], compat: [], tags: [], tagInput: '' };

export const INITIAL: State = {
  view: 'directory', q: '', filters: [], selected: null, active: 0,
  signedIn: false, authStep: 'form', authMode: 'signup', authNext: '', uname: '', email: '', pass: '', uagree: false, code: '', authErr: '',
  company: EMPTY_COMPANY, cevErr: '', cevResent: false, wsMenuOpen: false, wsQuery: '', wsModal: false, wsModalName: '', wsModalErr: '',
  legal: { reg: '', tax: '', doc: '', confirm: false }, legalFor: null, legalNext: 'workspace', legalDocErr: false,
  wsType: '', wsTypeErr: false, wl: { type: 'hospital', name: '', city: '', branches: '1', email: '', phone: '', msg: '' }, wlSent: false,
  wsName: '', wsNameErr: '', wsHandle: '', handleTouched: false, wsOrgOk: false, wsNote: [], flowList: false,
  companies: [], activeCo: null, pubId: null, inbox: SEED_INBOX,
  invEmail: '', invRole: 'editor', invErr: '', savedNote: false,
  evFor: null, evNext: 'workspace', evNote: [], evEmail: '', evStep: 'email', evCode: '', evErr: '', evResent: false,
  ...EMPTY_LISTING, pubMenuOpen: false,
  errors: [], mine: [], justSubmitted: false,
};

export const activeCompany = (s: State) => s.companies.find((c) => c.id === s.activeCo) || null;

export function findEntity(s: State, eid: string | null) {
  for (const w of s.companies) {
    const e = w.entities.find((x) => x.id === eid);
    if (e) return { w, e };
  }
  return null;
}

export function targetWs(s: State) {
  const c = s.company;
  const ids = s.companies.map((w) => w.id);
  if (c.ws === '__new') return '__new';
  if (c.ws && ids.includes(c.ws)) return c.ws;
  if (s.activeCo && ids.includes(s.activeCo)) return s.activeCo;
  return ids[0] || '__new';
}
