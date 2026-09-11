import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Single source of truth for locales and prefixing — see i18n/routing.ts.
const handleI18n = createMiddleware(routing);

/**
 * Hosts that must never be indexed. Staging serves the same content as
 * production and advertises production URLs in its sitemap, so without this it
 * competes with the real site for the same queries.
 */
const isIndexable = (host: string | null) =>
  !host || !(host.startsWith('stg.') || host.startsWith('staging.') || host.endsWith('.workers.dev'));

export default function middleware(request: NextRequest) {
  const response = handleI18n(request);
  if (!isIndexable(request.headers.get('host'))) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const config = {
  // `apps` is the Flutter web shell (public/apps/balsm). Paths without a
  // file extension (the index, and hash-less deep links) must skip i18n
  // or next-intl treats them as locale routes and 404s.
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|apps|.*\\..*).*)'],
};
