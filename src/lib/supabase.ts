import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase access for the waitlist.
 *
 * Two things here are deliberate, and both exist because staging broke:
 *
 * 1. `NEXT_PUBLIC_*` values are inlined at build time. A deploy produced on a
 *    machine without `.env.local` — CI, or anyone who hasn't set it up — bakes
 *    in empty strings, and every submit then fails at runtime with "Database
 *    not configured". The non-public `SUPABASE_URL` / `SUPABASE_ANON_KEY` are
 *    NOT inlined, so they resolve from the Worker's own vars per request and
 *    keep the route working however the bundle was built. Set those two on the
 *    Cloudflare Worker and the deploy stops depending on build-machine state.
 *
 * 2. The client is created lazily rather than at module scope. On Cloudflare,
 *    `process.env` is populated from the Worker environment as part of handling
 *    a request; reading it while the module is first evaluated can happen too
 *    early and would capture empty values permanently.
 *
 * The anon key is publishable — it is designed to be exposed and the table is
 * protected by RLS — but it still isn't committed; it comes from the
 * environment in every case.
 */

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached;

  // Runtime vars win over the build-time ones deliberately. NEXT_PUBLIC_* is
  // whatever happened to be in .env.local on the machine that produced the
  // bundle, so a staging deploy built locally would otherwise carry production
  // credentials and quietly write real signups to the production table. The
  // Worker's own secrets are the only per-environment source of truth.
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !anonKey) return null;

  cached = createClient(url, anonKey);
  return cached;
}

/** Which piece of configuration is missing, for logging. Never includes values. */
export function missingSupabaseConfig(): string[] {
  const missing: string[] = [];
  if (!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)) {
    missing.push('SUPABASE_URL');
  }
  if (!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) {
    missing.push('SUPABASE_ANON_KEY');
  }
  return missing;
}

export type WaitlistSource = 'home' | 'cloud' | 'providers';

export type WaitlistEntry = {
  id: string;
  email: string;
  locale: string;
  /** Which form the signup came from. */
  source: WaitlistSource;
  /** Clinic, pharmacy or lab name — providers form only. */
  organization?: string;
  message?: string;
  created_at: string;
};
