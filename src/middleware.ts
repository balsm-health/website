import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { TARGETS, autoRedirect, channelUrls, detectPlatform, withReferrer, type Channel } from './lib/appDistribution';

// Single source of truth for locales and prefixing — see i18n/routing.ts.
const handleI18n = createMiddleware(routing);

/**
 * Hosts that must never be indexed. Staging serves the same content as
 * production and advertises production URLs in its sitemap, so without this it
 * competes with the real site for the same queries.
 */
const isIndexable = (host: string | null) =>
  !host || !(host.startsWith('stg.') || host.startsWith('staging.') || host.endsWith('.workers.dev'));

// `/download`, `/en/download`, and direct links like `/download/android`.
const DOWNLOAD = /^(?:\/(en|ar))?\/download(?:\/([a-z]+))?\/?$/;

/**
 * The redirect depends on the User-Agent, so it must never be cached against
 * the URL alone — one Android visit would otherwise send every iPhone to Play.
 */
function redirect(url: URL | string) {
  const response = NextResponse.redirect(url, 302);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Vary', 'User-Agent');
  return response;
}

/**
 * Sends a device straight to its store, before any page renders. Returns null
 * to fall through to the /download chooser page: on desktop, when no store is
 * live for the device yet, for bots and link previews, and on `?choose`.
 */
function handleDownload(request: NextRequest): NextResponse | null {
  const match = DOWNLOAD.exec(request.nextUrl.pathname);
  if (!match) return null;
  const [, locale, target] = match;
  const search = request.nextUrl.searchParams;
  const urls = channelUrls();
  const go = (channel: Channel) => redirect(withReferrer(new URL(urls[channel]!, request.url).toString(), channel, search));

  if (target) {
    const channel = TARGETS[target];
    // Unknown segment: let it 404 like any other missing route.
    if (!channel) return null;
    if (urls[channel]) return go(channel);
    // Not live yet — the chooser shows what is, rather than a dead end.
    const chooser = new URL(locale === 'en' ? '/en/download' : '/download', request.url);
    search.forEach((v, k) => chooser.searchParams.set(k, v));
    chooser.searchParams.set('choose', '1');
    return redirect(chooser);
  }

  if (search.has('choose')) return null;
  const channel = autoRedirect(detectPlatform(request.headers.get('user-agent')), urls);
  return channel ? go(channel) : null;
}

export default function middleware(request: NextRequest) {
  const response = handleDownload(request) ?? handleI18n(request);
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
