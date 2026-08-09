import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Security headers.
 *
 * These live here, not only in `public/_headers`. That file is applied by
 * Cloudflare to **static assets** only, and OpenNext renders every HTML page
 * from the Worker — so the policy reached `balsm-logo.svg` and `humans.txt`
 * while every actual page shipped with no CSP and no framing protection.
 * Verified against staging: `curl -I /humans.txt` returned the full set,
 * `curl -I /` returned none of it.
 *
 * `_headers` stays as-is so static assets keep their copy; this covers the
 * rendered routes, which is where framing and script policy actually matter.
 *
 * Known gap, deliberately unchanged here so this stays a like-for-like fix:
 * `script-src` still allows 'unsafe-eval' and 'unsafe-inline', which removes
 * most of CSP's XSS value. Tightening it needs a nonce/hash pass over the
 * inline JSON-LD and the Sentry bootstrap — worth doing, but not silently.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

const nextConfig: NextConfig = {
  // Enable strict mode for better error handling
  reactStrictMode: true,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
};

const configWithIntl = withNextIntl(nextConfig);

export default withSentryConfig(configWithIntl, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Only upload source maps when an auth token is present (CI / release builds).
  // Without it the build proceeds normally with no upload step.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // Route Sentry events through a first-party path to dodge ad blockers.
  tunnelRoute: '/monitoring',
  disableLogger: true,
});

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
