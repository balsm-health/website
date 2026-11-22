import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/cloudflare';
import { getSupabase, getSupabaseAdmin, missingSupabaseConfig } from '@/lib/supabase';

/**
 * Newsletter sign-up from the footer (BalsmFooter.dc.html, "ابقَ قريباً من
 * بلسم"). Its own table rather than a `source` on waiting_list: that table is
 * UNIQUE(email), so subscribing would overwrite a waitlist row, and its
 * source CHECK would reject a new value. Schema:
 * supabase/migrations/20261122_newsletter_subscribers.sql.
 */
export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      const missing = missingSupabaseConfig();
      console.error(`newsletter: Supabase not configured, missing ${missing.join(', ')}`);
      Sentry.captureException(new Error(`newsletter: Supabase not configured (${missing.join(', ')})`));
      return NextResponse.json({ error: 'Database not configured', code: 'server_error' }, { status: 500 });
    }

    const { email, locale, page } = await request.json();

    // Same caps and checks as /api/waitlist: this endpoint is public too.
    if (!email || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format', code: 'invalid' }, { status: 400 });
    }

    const LOCALES = ['ar', 'en'] as const;
    type Locale = (typeof LOCALES)[number];
    const row = {
      email: email.toLowerCase().trim(),
      locale: LOCALES.includes(locale) ? (locale as Locale) : 'ar',
      // The path the visitor signed up from, for nothing more than "which page
      // converts". Capped and path-shaped only.
      page: typeof page === 'string' && /^\/[\w\-/]{0,120}$/.test(page) ? page : null,
    };

    // Insert-only without the service role (see /api/waitlist for why no
    // .select() and why upsert needs the admin client).
    const admin = getSupabaseAdmin();
    const { error } = admin
      ? await admin.from('newsletter_subscribers').upsert([row], { onConflict: 'email', ignoreDuplicates: true })
      : await supabase.from('newsletter_subscribers').insert([row]);

    if (error) {
      // Already subscribed is success from the visitor's side.
      if (error.code === '23505') return NextResponse.json({ success: true }, { status: 200 });
      Sentry.captureException(new Error(`newsletter insert failed: ${error.code || 'unknown'}`), {
        extra: { code: error.code, locale: row.locale },
      });
      return NextResponse.json({ error: 'Failed to subscribe', code: 'server_error' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Internal server error', code: 'server_error' }, { status: 500 });
  }
}
