<p align="center">
  <img src=".github/banner.png" alt="موقع بلسم · balsm.health" width="880">
</p>

# balsm.health

Marketing site + waitlist for the Balsm healthcare platform. Next.js 16 (App
Router) + React 19, bilingual (ar/en via `src/i18n` + `[locale]` routes), deployed
to **Cloudflare Workers** through OpenNext (`open-next.config.ts`, `worker.ts`,
`wrangler.jsonc`). Waitlist submissions go to Supabase.

## Develop

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint
```

Key paths: `src/app/[locale]/` (pages), `src/components/`, `src/messages/`
(translations), `src/middleware.ts` (locale routing), `supabase/` (waitlist schema).

## Environment

Local development reads `.env.local` (gitignored):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Defaults to `https://balsm.health`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project for the waitlist. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key. Use the **legacy anon JWT** — the newer `sb_publishable_*` format does not resolve to the `anon` role and inserts fail RLS. |

**`NEXT_PUBLIC_*` values are inlined at build time.** A bundle built without them
— in CI, or on a machine with no `.env.local` — bakes in empty strings, and no
runtime setting can correct it afterwards. That is how staging once shipped a
waitlist that returned `Database not configured` on every submit.

## Deploy (Cloudflare)

```bash
npm run preview          # local Workers runtime preview
npm run deploy           # production → balsm.health
npm run deploy:staging   # staging → stg.balsm.health
npm run cf-typegen       # regenerate CloudflareEnv types after wrangler.jsonc changes
```

Full walkthrough incl. first-time Cloudflare setup: [docs/CLOUDFLARE_DEPLOYMENT.md](docs/CLOUDFLARE_DEPLOYMENT.md).

## More docs

- [PRODUCT.md](PRODUCT.md) — what the site sells and to whom
- [DESIGN.md](DESIGN.md) — visual language
- [SEO-AI-OPTIMIZATION.md](SEO-AI-OPTIMIZATION.md), [GEO-OPTIMIZATION.md](GEO-OPTIMIZATION.md) — search strategy
- [CODING_STANDARDS.md](CODING_STANDARDS.md), [AGENTS.md](AGENTS.md) — contributor/agent rules
