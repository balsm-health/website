import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/cloudflare';
import { getSupabase, getSupabaseAdmin, missingSupabaseConfig } from '@/lib/supabase';

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

    const { email, message, locale, source, organization } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required', code: 'invalid' },
        { status: 400 }
      );
    }

    // Length caps before anything else. This endpoint is public and
    // unauthenticated, the forms carry no maxLength, and the regex below is
    // happy to match a megabyte-long address — so without these a single POST
    // can write an arbitrarily large row. 254 is the RFC 5321 limit for an
    // address; the other two are generous for what the forms ask for.
    const LIMITS = { email: 254, organization: 200, message: 2000 } as const;

    if (email.length > LIMITS.email) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'invalid' },
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

    // `locale` gets the same allowlist treatment as `source`. It was previously
    // taken straight from the request body and written to the column, so any
    // string a caller sent was persisted — the one field on this endpoint with
    // no validation at all.
    const LOCALES = ['ar', 'en'] as const;
    type Locale = (typeof LOCALES)[number];

    const insertData: {
      email: string;
      locale: Locale;
      message?: string;
      source: Source;
      organization?: string;
    } = {
      email: email.toLowerCase().trim(),
      locale: LOCALES.includes(locale) ? (locale as Locale) : 'ar',
      source: SOURCES.includes(source) ? (source as Source) : 'home',
    };

    if (message && typeof message === 'string' && message.trim()) {
      insertData.message = message.trim().slice(0, LIMITS.message);
    }

    if (organization && typeof organization === 'string' && organization.trim()) {
      insertData.organization = organization.trim().slice(0, LIMITS.organization);
    }

    // No .select() on either path. Returning the inserted row sends
    // `Prefer: return=representation`, and Postgres requires a SELECT policy to
    // return it — so an insert-only table rejects the whole statement with
    // 42501. Production only avoided that because it grants anon SELECT, which
    // also exposes every signup email. Nothing consumes the id, so don't ask
    // for it.
    //
    // Upsert when the service role is configured, so someone who signs up again
    // can correct their details — a plain insert hits the UNIQUE(email)
    // constraint and silently discards whatever they just typed. The anon
    // client can't do this: an upsert needs UPDATE, and granting that to the
    // publishable key would let anyone overwrite a row by guessing its email.
    // Without the secret we fall back to insert-only, which still works.
    const admin = getSupabaseAdmin();
    const { error } = admin
      ? await admin.from('waiting_list').upsert([insertData], { onConflict: 'email' })
      : await supabase.from('waiting_list').insert([insertData]);

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
      // Generic body. Postgres puts the offending row's values in `details` on
      // a constraint violation, so returning it echoed the submitter's own
      // email and organization back in a 500 — and `message` leaks column and
      // constraint names. Sentry above already has the code and context; the
      // caller gets nothing it can act on anyway.
      return NextResponse.json(
        { error: 'Failed to register', code: 'server_error' },
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
