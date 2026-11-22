import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/cloudflare';
import { getSupabase, missingSupabaseConfig } from '@/lib/supabase';

/**
 * Newsletter sign-up from the footer (BalsmFooter.dc.html, "ابقَ قريباً من
 * بلسم"). Same table as the waitlist, one row per person: join_list sets the
 * row's `newsletter` flag, creating a newsletter-only row (source
 * 'newsletter') if the email is new. Schema:
 * supabase/migrations/20261122_waiting_list_newsletter_flag.sql.
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

    const { email, locale } = await request.json();

    // Same caps and checks as /api/waitlist: this endpoint is public too.
    if (!email || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format', code: 'invalid' }, { status: 400 });
    }

    const { error } = await supabase.rpc('join_list', {
      p_email: email.toLowerCase().trim(),
      p_list: 'newsletter',
      p_locale: locale === 'en' ? 'en' : 'ar',
    });

    if (error) {
      // join_list raises 22023 for input it refuses; everything else is ours.
      if (error.code === '22023') {
        return NextResponse.json({ error: 'Invalid email format', code: 'invalid' }, { status: 400 });
      }
      Sentry.captureException(new Error(`newsletter join failed: ${error.code || 'unknown'}`), {
        extra: { code: error.code, locale },
      });
      return NextResponse.json({ error: 'Failed to subscribe', code: 'server_error' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Internal server error', code: 'server_error' }, { status: 500 });
  }
}
