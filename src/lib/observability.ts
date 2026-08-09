import * as Sentry from '@sentry/nextjs';

type Ctx = Record<string, unknown>;

/**
 * Capture a handled client-side error to Sentry. Safe to call even when no DSN
 * is configured (Sentry.init becomes a no-op). Never throws — observability must
 * not break UX. PII (e.g. raw email) must NOT be passed in `ctx`.
 */
export function captureError(error: unknown, ctx?: Ctx) {
  try {
    Sentry.captureException(error, ctx ? { extra: ctx } : undefined);
  } catch {
    // swallow — telemetry failures are never user-facing
  }
}
