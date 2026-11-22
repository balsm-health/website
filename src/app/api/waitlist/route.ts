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
    const SOURCES = ['home', 'providers'] as const;
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

    // Through the join_list database function rather than an insert: the
    // table is UNIQUE(email) and also holds newsletter sign-ups, so someone
    // who is already on it (on the waitlist, or newsletter-only) is merged
    // into their existing row instead of hitting a duplicate. The public key
    // has no UPDATE on the table, so the merge has to live in the function.
    // Schema: supabase/migrations/20261122_waiting_list_newsletter_flag.sql.
    const { error } = await supabase.rpc('join_list', {
      p_email: insertData.email,
      p_list: 'waitlist',
      p_locale: insertData.locale,
      p_source: insertData.source,
      p_message: insertData.message ?? null,
      p_organization: insertData.organization ?? null,
    });

    if (error) {
      // join_list raises 22023 for input it refuses; everything else is ours.
      if (error.code === '22023') {
        return NextResponse.json({ error: 'Invalid email format', code: 'invalid' }, { status: 400 });
      }
      // Capture the DB failure (no PII — email is not attached to the event).
      Sentry.captureException(new Error(`waitlist join failed: ${error.code || 'unknown'}`), {
        extra: { code: error.code, locale, source: insertData.source },
      });
      // Generic body: Postgres error details can echo the submitter's own
      // values and leak column names. Sentry above already has the context.
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
