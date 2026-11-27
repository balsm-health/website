import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/cloudflare';
import { getSupabase, missingSupabaseConfig } from '@/lib/supabase';

/**
 * The help center's "Write to us, or report a problem" form
 * (Support.dc.html, #contact). Saved through submit_support_message for the
 * team to answer by email. Schema: supabase/migrations/20261127_support_requests.sql.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBJECTS = ['bug', 'account', 'privacy', 'idea', 'other'] as const;

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      const missing = missingSupabaseConfig();
      console.error(`support/contact: Supabase not configured, missing ${missing.join(', ')}`);
      Sentry.captureException(new Error(`support/contact: Supabase not configured (${missing.join(', ')})`));
      return NextResponse.json({ error: 'Database not configured', code: 'server_error' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    // Public, unauthenticated endpoint: cap and check before touching the DB.
    if (!email || email.length > 254 || !EMAIL.test(email)) {
      return NextResponse.json({ error: 'Invalid email format', code: 'invalid_email' }, { status: 400 });
    }
    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json({ error: 'Message must be 10–2000 characters', code: 'invalid_message' }, { status: 400 });
    }

    const subject = SUBJECTS.includes(body.subject) ? body.subject : 'other';
    const { error } = await supabase.rpc('submit_support_message', {
      p_email: email,
      p_message: message,
      p_subject: subject,
      p_name: str(body.name, 120) || null,
      p_device: subject === 'bug' ? str(body.device, 120) || null : null,
      p_locale: body.locale === 'en' ? 'en' : 'ar',
    });

    if (error) {
      if (error.code === '22023') {
        return NextResponse.json({ error: 'Invalid input', code: 'invalid' }, { status: 400 });
      }
      // No PII on the event: code and subject only.
      Sentry.captureException(new Error(`support/contact failed: ${error.code || 'unknown'}`), {
        extra: { code: error.code, subject },
      });
      return NextResponse.json({ error: 'Failed to send', code: 'server_error' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Internal server error', code: 'server_error' }, { status: 500 });
  }
}
