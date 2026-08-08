import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/cloudflare';
import { getSupabase, missingSupabaseConfig } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      // Silent misconfiguration is how staging shipped a waitlist that failed
      // every submit, so name the missing vars in the logs and in Sentry.
      const missing = missingSupabaseConfig();
      console.error(`waitlist: Supabase not configured, missing ${missing.join(', ')}`);
      Sentry.captureException(new Error(`waitlist: Supabase not configured (${missing.join(', ')})`));
      return NextResponse.json(
        { error: 'Database not configured', code: 'server_error' },
        { status: 500 }
      );
    }

    const { email, message, locale = 'en', source, organization } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required', code: 'invalid' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'invalid' },
        { status: 400 }
      );
    }

    // Anything not in this list would fail the table's CHECK constraint and
    // surface as an opaque 500, so an unknown value falls back to the default.
    const SOURCES = ['home', 'cloud', 'providers'] as const;
    type Source = (typeof SOURCES)[number];

    const insertData: {
      email: string;
      locale: string;
      message?: string;
      source: Source;
      organization?: string;
    } = {
      email: email.toLowerCase().trim(),
      locale,
      source: SOURCES.includes(source) ? (source as Source) : 'home',
    };

    if (message && typeof message === 'string' && message.trim()) {
      insertData.message = message.trim();
    }

    if (organization && typeof organization === 'string' && organization.trim()) {
      insertData.organization = organization.trim();
    }

    // No .select() here on purpose. Returning the inserted row sends
    // `Prefer: return=representation`, and Postgres requires a SELECT policy to
    // return it — so an insert-only table rejects the whole statement with
    // 42501. Production only avoided that because it grants anon SELECT, which
    // also exposes every signup email. Nothing consumes the id, so don't ask
    // for it.
    const { error } = await supabase.from('waiting_list').insert([insertData]);

    if (error) {
      // Check for duplicate email - PostgreSQL unique constraint violation
      // Can be error.code '23505' or message containing 'duplicate' or 'unique'
      const isDuplicate =
        error.code === '23505' ||
        error.message?.toLowerCase().includes('duplicate') ||
        error.message?.toLowerCase().includes('unique') ||
        error.details?.toLowerCase().includes('already exists');

      if (isDuplicate) {
        return NextResponse.json(
          { error: 'Email already registered', code: 'duplicate' },
          { status: 409 }
        );
      }

      // Capture the DB failure (no PII — email is not attached to the event).
      Sentry.captureException(new Error(`waitlist insert failed: ${error.code || 'unknown'}`), {
        extra: { code: error.code, locale, source: insertData.source },
      });
      return NextResponse.json(
        { error: error.message || 'Failed to register', code: error.code || 'server_error', details: error.details },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'server_error' },
      { status: 500 }
    );
  }
}
