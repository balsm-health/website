// Seed data, constants and pure helpers for the marketplace, ported from the
// script class in Marketplace.dc.html. Anything shown to people is stored as a
// message key (or a `*Key` field next to free text) so it renders in either
// locale; free text people typed is stored as typed.

export type Role = 'owner' | 'admin' | 'editor';
export type OrgStatus = 'unverified' | 'pending' | 'verified';
export type OrgType = 'software' | 'hospital' | 'clinic' | 'pharmacy' | 'lab' | 'org';
export type Country = 'EG' | 'SA' | 'AE' | 'JO' | 'OTHER';

export type Member = { name: string; nameKey?: string; email: string; role: Role; you?: boolean };
export type Org = {
  id: string;
  type: OrgType;
  name: string;
  nameKey?: string;
  // Seed organizations carry a city; ones people add carry the country they picked.
  cityKey?: string;
  country?: Country | '';
  status: OrgStatus;
  site: string;
  email?: string;
  emailVerified?: boolean;
};
export type Invite = { email: string; role: Role };
export type Workspace = {
  id: string;
  name: string;
  nameKey?: string;
  handle: string;
  role: Role;
  members: Member[];
  invites: Invite[];
  entities: Org[];
};
export type InboxItem = {
  id: string;
  company: string;
  companyKey?: string;
  handle: string;
  role: Role;
  members: Member[];
  entities: Org[];
};
export type MyListing = { id: string; coId: string | null; pubId: string | null; name: string; areas: string[]; short: string; cover: string };

export type Sample = {
  id: string;
  verified: boolean;
  areas: TagKey[];
  tags: string[]; // platform/compat keys
  customers: string[];
  images: string[];
  video: string;
  site: string;
  bg: string;
};

export const TAG_KEYS = ['hospitals', 'clinics', 'pharmacies', 'labs', 'radiology', 'telecare', 'insurance', 'patientApps', 'ehr', 'billing', 'inventory'] as const;
export type TagKey = (typeof TAG_KEYS)[number];
export const PLATFORM_KEYS = ['web', 'android', 'ios', 'desktop'] as const;
export const COMPAT_KEYS = ['fhir', 'hl7', 'offline', 'arabic', 'selfHost', 'openSource'] as const;
export const ORG_TYPES: OrgType[] = ['software', 'hospital', 'clinic', 'pharmacy', 'lab', 'org'];
export const WAITLIST_TYPES: OrgType[] = ['hospital', 'clinic', 'pharmacy', 'lab', 'org'];
export const COUNTRIES: Country[] = ['EG', 'SA', 'AE', 'JO', 'OTHER'];

export const PERSONAL = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'aol.com', 'proton.me', 'protonmail.com'];
const RESERVED = ['balsm', 'admin', 'administrator', 'support', 'help', 'api', 'www', 'mail', 'root', 'system', 'settings', 'marketplace', 'market', 'login', 'signup', 'account', 'team', 'about', 'blog', 'docs', 'status'];

export const MAX_TAGS = 8;
export const MAX_IMAGES = 8;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = /^image\/(png|jpe?g|webp)$/;
export const MAX_DOC_BYTES = 10 * 1024 * 1024;
export const MAX_CUSTOMERS = 20;
export const SHORT_MAX = 140;

export const SAMPLES: Sample[] = [
  { id: 's1', verified: true, areas: ['hospitals', 'ehr', 'labs', 'billing'], tags: ['web', 'desktop', 'fhir', 'arabic'], customers: [], images: [], video: '', site: '', bg: 'linear-gradient(135deg,#1283FF,#724DD0)' },
  { id: 's2', verified: true, areas: ['pharmacies', 'inventory', 'billing'], tags: ['web', 'android', 'offline'], customers: [], images: [], video: '', site: '', bg: 'linear-gradient(135deg,#01C4A2,#1283FF)' },
  { id: 's3', verified: true, areas: ['telecare', 'clinics', 'patientApps'], tags: ['web', 'ios', 'android', 'hl7'], customers: [], images: [], video: '', site: '', bg: 'linear-gradient(135deg,#E8478F,#724DD0)' },
];

export const SEED_INBOX: InboxItem[] = [{
  id: 'inv-sample', company: '', companyKey: 'seed.inviteCompany', handle: 'sample-group', role: 'editor',
  members: [{ name: '', nameKey: 'seed.owner', email: 'owner@example.com', role: 'owner' }],
  entities: [
    { id: 'e-s1', type: 'software', name: '', nameKey: 'seed.e1', cityKey: 'seed.cairo', status: 'verified', site: '' },
    { id: 'e-s2', type: 'hospital', name: '', nameKey: 'seed.e2', cityKey: 'seed.giza', status: 'verified', site: '' },
    { id: 'e-s3', type: 'clinic', name: '', nameKey: 'seed.e3', cityKey: 'seed.alex', status: 'pending', site: '' },
  ],
}];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (v: string) => EMAIL.test(v);
export const domainOf = (v: string) => v.split('@')[1] || '';
export const isPersonal = (v: string) => PERSONAL.includes(domainOf(v));

export function ytId(url: string): string | null {
  const u = (url || '').trim();
  if (!u) return null;
  const m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
export const ytEmbed = (id: string | null) => (id ? 'https://www.youtube-nocookie.com/embed/' + id : '');
export const validUrl = (u: string) => /^https?:\/\/[^\s.]+\.[^\s]+$/i.test((u || '').trim());

export function slugify(n: string) {
  return (n || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/^[^a-z]+/, '').slice(0, 30).replace(/-+$/, '');
}

// Returns a message key under `newWs` for the problem, '' when there is nothing
// to say yet (empty), or null when the handle is fine.
export function handleProblem(h: string, companies: Workspace[], inbox: InboxItem[]): string | null {
  if (!h) return '';
  if (h.length < 3) return 'hShort';
  if (!/^[a-z][a-z0-9_-]*$/.test(h)) return 'hChars';
  if (/[-_]$/.test(h) || /[-_]{2}/.test(h)) return 'hDash';
  if (RESERVED.includes(h)) return 'hReserved';
  if (companies.some((w) => w.handle === h) || inbox.some((w) => w.handle === h) || h === 'sample-group') return 'hTaken';
  return null;
}

export function uniqueHandle(base: string, companies: Workspace[], inbox: InboxItem[]) {
  let b = (base || '').replace(/^[^a-z]+/, '').slice(0, 26).replace(/[-_]+$/, '');
  if (b.length < 3) b = (b + '-org').replace(/^-/, 'org-');
  let h = b;
  let i = 2;
  while (handleProblem(h, companies, inbox) !== null && i < 100) h = b + '-' + i++;
  return h;
}

export function initialOf(n: string) {
  const parts = (n || '').trim().split(/\s+/).filter(Boolean);
  return parts.length ? parts[0][0].toUpperCase() : '؟';
}

export const WS_COLORS = ['#724DD0', '#1283FF', '#01A88B', '#E8478F', '#2A8C47', '#B8336F'];

export const vendorsOf = (ws: Workspace | null) => (ws ? ws.entities.filter((e) => e.type === 'software') : []);
export function defaultOrg(ws: Workspace | null) {
  if (!ws || !ws.entities.length) return null;
  return (ws.entities.find((e) => e.type === 'software') || ws.entities[0]).id;
}

export function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ''));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
