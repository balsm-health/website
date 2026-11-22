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

## Link previews

Every route has its own share card (`og:image` / `twitter:image`), one per
locale, in `public/og/<card>-<locale>.png`, in the style of the design's Link
Previews page. All of it is driven by
[`src/lib/preview-cards.json`](src/lib/preview-cards.json). Per route it holds
the `path`, the panel colour `accent` and the eyebrow's darker `accentText`, an
`ar` and `en` block of `eyebrow`, `title` (≤ 60 characters) and `desc`
(≤ 155), and a `rev`; `site.tagline` is the line at the foot of every card.
`"layout": "app"` (used by `/download`) swaps in the app card: the same
panel-and-strip frame, with the app's home screen in a tilted phone in the
panel, each locale's `headline` (falling back to `title`), its `chips`, and
the store badges.
The same title and description are the page's `og:title` / `og:description`.

```bash
# 1. edit the route's entry in src/lib/preview-cards.json, and bump its "rev"
# 2. re-render (CHROME=<path> if Chrome isn't in the macOS default location)
node scripts/generate-preview-cards.mjs            # every card
node scripts/generate-preview-cards.mjs partners   # one card, both locales
# 3. check every route the way Facebook, X, LinkedIn and Slack show it
npm run dev
node scripts/preview-cards.mjs
```

The card is drawn by `scripts/og-card.js`, the design's own painter.
`src/lib/seo.ts` picks a page's card from the path it passes to `openGraph()`
and `twitter()`, so a page needs no card wiring of its own; a route with no
entry gets the home card. Social apps cache previews by URL for days, and
`rev` is in the URL (`?v=`), so bumping it is what makes them fetch the new one.
Card images resolve against the host the page was served from (balsm.health,
stg.balsm.health, a `*.workers.dev` preview, localhost; anything else falls
back to `NEXT_PUBLIC_SITE_URL`), so a branch preview shows its own cards.
A new route needs a new entry; `preview-cards.mjs` then previews it and flags it
if the page serves any other card.

## App download link (`/download`)

`balsm.health/download` is the one link to share for the patient app. The app's
own share sheet prints it. Middleware sends phones straight to their store:
iPhone/iPad to the App Store, Android to Google Play, and Huawei (no Play) to
AppGallery. Everyone else gets a page that recommends the best option for the
device and lists the rest. That covers desktop, devices whose store isn't live
yet, and link-preview bots, so WhatsApp and Telegram still render a card.

| URL | Goes to |
|---|---|
| `/download`, `/en/download` | Store for this device, else the chooser page |
| `/download?choose=1` | Always the chooser page |
| `/download/ios` · `/android` · `/appgallery` · `/apk` · `/web` | That channel directly (chooser if it isn't live) |

`utm_*` parameters are forwarded to Google Play as the install referrer.

Channels are switched on in `src/lib/appDistribution.ts` (`DISTRIBUTION`) as
they go live: the App Store, Google Play and AppGallery listing URLs, the first
**release-signed** production APK on GitHub Releases, and the web app at
`/apps/balsm/`. An APK is never downloaded without the user tapping it.

**Pre-beta (today):** with nothing live, `/download` announces the beta and
collects emails for early access, through the same `/api/waitlist` call as the
Home form (`source = 'home'`). A device whose own store isn't live yet sees the
same sign-up form.

## More docs

- [PRODUCT.md](PRODUCT.md) — what the site sells and to whom
- [DESIGN.md](DESIGN.md) — visual language
- [SEO-AI-OPTIMIZATION.md](SEO-AI-OPTIMIZATION.md), [GEO-OPTIMIZATION.md](GEO-OPTIMIZATION.md) — search strategy
- [CODING_STANDARDS.md](CODING_STANDARDS.md), [AGENTS.md](AGENTS.md) — contributor/agent rules
