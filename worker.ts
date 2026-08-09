// Cloudflare Workers entry — wraps the OpenNext-generated handler with Sentry.
//
// `.open-next/worker.js` is produced by `opennextjs-cloudflare build`; wrangler
// bundles THIS file (see wrangler.jsonc `main`) and resolves that import at build
// time. This is the stable server-side Sentry path on the Workers runtime — the
// Next.js server SDK is not used here (see src/instrumentation.ts).
//
// This file is excluded from the Next.js tsconfig because it references the
// generated worker, which only exists after a build.
import * as Sentry from '@sentry/cloudflare';
// @ts-expect-error - generated at build time by opennextjs-cloudflare
import openNextHandler from './.open-next/worker.js';

// Re-export any named exports the generated worker declares (e.g. Durable Object
// classes for queue / tag cache). `export *` does not re-export the default, so
// there is no conflict with the wrapped default below.
export * from './.open-next/worker.js';

export default Sentry.withSentry(
  (env: { SENTRY_DSN?: string; NEXT_PUBLIC_SENTRY_DSN?: string; SENTRY_ENV?: string }) => ({
    dsn: env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN,
    environment: env.SENTRY_ENV,
    enabled: Boolean(env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN),
    sendDefaultPii: false,
    tracesSampleRate: 0.2,
  }),
  openNextHandler as ExportedHandler
);
