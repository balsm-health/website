import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable strict mode for better error handling
  reactStrictMode: true,
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
