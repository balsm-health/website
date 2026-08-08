import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

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
