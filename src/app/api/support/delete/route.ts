import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/cloudflare';
import { getSupabase, missingSupabaseConfig } from '@/lib/supabase';

/**
 * The help center's account deletion request (Support.dc.html,
 * #delete-account) — the web route app stores require for deleting an account
 * without the app. Saved through request_account_deletion; the team confirms
 * each request by email before deleting anything. A repeat request for an
 * address that already has one pending is accepted and ignored, so the
 * response never reveals whether an address has an account or a request.
 * Schema: supabase/migrations/20261127_support_requests.sql.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      const missing = missingSupabaseConfig();
      console.error(`support/delete: Supabase not configured, missing ${missing.join(', ')}`);
      Sentry.captureException(new Error(`support/delete: Supabase not configured (${missing.join(', ')})`));
      return NextResponse.json({ error: 'Database not configured', code: 'server_error' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email || email.length > 254 || !EMAIL.test(email)) {
      return NextResponse.json({ error: 'Invalid email format', code: 'invalid_email' }, { status: 400 });
    }
    // The checkbox is a UI promise, but a request without it isn't one the
    // visitor knowingly made.
    if (body.acknowledged !== true) {
      return NextResponse.json({ error: 'Acknowledgement required', code: 'invalid' }, { status: 400 });
    }

    const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 1000) : '';
    const { error } = await supabase.rpc('request_account_deletion', {
      p_email: email,
      p_reason: reason || null,
      p_locale: body.locale === 'en' ? 'en' : 'ar',
    });

    if (error) {
      if (error.code === '22023') {
        return NextResponse.json({ error: 'Invalid email format', code: 'invalid_email' }, { status: 400 });
      }
      Sentry.captureException(new Error(`support/delete failed: ${error.code || 'unknown'}`), {
        extra: { code: error.code },
      });
      return NextResponse.json({ error: 'Failed to send', code: 'server_error' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Internal server error', code: 'server_error' }, { status: 500 });
  }
}
