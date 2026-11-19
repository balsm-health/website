// The only place the marketplace touches browser storage. There is no backend
// yet: the account, workspaces, organizations, invites and submitted listings
// live in this browser alone, and nothing is ever sent anywhere. When a real
// API lands, replace loadSnapshot/saveSnapshot and keep the
// shape. Every access is wrapped: storage can be missing, blocked or full
// (private windows, cleared site data), and the page must still work.
import type { InboxItem, MyListing, Workspace } from './data';

export const STORAGE_KEY = 'balsm.marketplace.v1';

export type Snapshot = {
  signedIn: boolean;
  uname: string;
  email: string;
  companies: Workspace[];
  activeCo: string | null;
  pubId: string | null;
  inbox: InboxItem[];
  mine: MyListing[];
};

function isSnapshot(v: unknown): v is Snapshot {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return typeof s.signedIn === 'boolean' && typeof s.uname === 'string' && typeof s.email === 'string'
    && Array.isArray(s.companies) && Array.isArray(s.inbox) && Array.isArray(s.mine);
}

export function loadSnapshot(): Snapshot | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSnapshot(s: Snapshot): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // Most likely over quota: listing covers are data URLs and can be large.
    // Keep everything else rather than lose the whole account.
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...s, mine: s.mine.map((m) => ({ ...m, cover: '' })) }));
    } catch {
      // Storage unavailable: state stays in memory for this visit.
    }
  }
}

