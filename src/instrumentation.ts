// Server instrumentation entry.
//
// We deliberately do NOT initialize the Sentry Next.js *server* SDK here, and we
// do NOT export `onRequestError` with Sentry.captureRequestError. On the Cloudflare
// Workers runtime (OpenNext) that path triggers AsyncLocalStorage failures and
// "Server failed to respond" errors.
// See: https://github.com/getsentry/sentry-javascript/issues/14931
//
// Server-side errors and tracing are instead captured by wrapping the worker with
// @sentry/cloudflare's `withSentry` (see ../worker.ts at the repo root).
export async function register() {
  // no-op
}
