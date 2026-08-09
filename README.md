This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

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

So deployed environments set the non-public names as Worker secrets instead.
`src/lib/supabase.ts` reads those per request, which makes the deploy
independent of whichever machine produced the bundle:

```bash
npx wrangler secret put SUPABASE_URL --env staging
npx wrangler secret put SUPABASE_ANON_KEY --env staging
# omit --env for production
```

Staging points at the `Balsm-Dev-Db` Supabase project so it never writes to the
production signup table. Local development currently uses production — worth
pointing `.env.local` at the dev project too.

## Deploy

Deployment is Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare),
not Vercel.

```bash
npm run deploy:staging   # → stg.balsm.health (balsm-website-stg)
npm run deploy           # → balsm.health     (balsm-website)
```

Both build locally and upload, so `wrangler login` (or `CLOUDFLARE_API_TOKEN`)
is required. There is no CI deploy for staging yet.

## Generated assets

Some files in `public/` are generated and should be regenerated rather than
hand-edited:

```bash
node scripts/generate-brand-assets.mjs   # og-image, favicon, app icons
node scripts/generate-map-svg.mjs        # arab-world-map.svg (Natural Earth)
node scripts/generate-map-dots.mjs       # map marker coordinates in mapData.ts
```
