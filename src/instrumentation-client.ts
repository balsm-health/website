// Browser-side Sentry init. Loaded automatically by Next.js on the client.
// Server/worker errors are captured separately via @sentry/cloudflare (see worker.ts) —
// the Next.js server SDK is intentionally NOT used, as it is unstable on the
// Cloudflare Workers runtime under OpenNext.
import * as Sentry from '@sentry/nextjs';

const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/g;

// Defense-in-depth PII scrubbing — this is a healthcare org; telemetry must not
// carry identifiable data even accidentally. Redacts email-like strings.
function scrub<T>(value: T): T {
  if (typeof value === 'string') return value.replace(EMAIL_RE, '[redacted-email]') as unknown as T;
  return value;
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV,

  // Never send default PII (IP, cookies, request bodies with user data).
  sendDefaultPii: false,

  // Performance tracing — modest sample rate.
  tracesSampleRate: 0.2,

  // Session Replay is OFF: it can capture on-screen PHI/PII. Do not enable
  // without a privacy review + input masking policy.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Only run when a DSN is configured.
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.message) breadcrumb.message = scrub(breadcrumb.message);
    // Drop request bodies from fetch/xhr breadcrumbs entirely.
    if (breadcrumb.category === 'fetch' || breadcrumb.category === 'xhr') {
      if (breadcrumb.data) delete breadcrumb.data.body;
    }
    return breadcrumb;
  },

  beforeSend(event) {
    if (event.request?.data) delete event.request.data;
    if (event.message) event.message = scrub(event.message);
    return event;
  },
});

// Instruments App Router client-side navigations for tracing.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
