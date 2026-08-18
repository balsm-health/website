#!/usr/bin/env node
/**
 * Renders the link-preview card for local pages, the way each platform does.
 *
 *   node scripts/preview-cards.mjs                        # localhost:3000, all routes
 *   node scripts/preview-cards.mjs --base http://localhost:3100
 *   node scripts/preview-cards.mjs --base https://balsm.health /providers /en/providers
 *
 * Writes a single HTML file and opens it. Facebook, X, LinkedIn and Slack each
 * crop and truncate differently, so the same tags can be fine on one and
 * clipped on another — the point of this is to see all four at once.
 *
 * Why this exists: no social debugger can reach localhost, and tunnelling to
 * one is slow and easy to get wrong (see --base below). This needs no network
 * beyond the dev server itself.
 *
 * IMPORTANT: metadataBase comes from NEXT_PUBLIC_SITE_URL, so a dev server
 * started without it emits absolute production image URLs and you end up
 * previewing the live card. Start the server as:
 *
 *   NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run dev
 *
 * This script flags that case rather than letting it pass silently.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const argv = process.argv.slice(2);
const baseIdx = argv.indexOf('--base');
if (baseIdx >= 0 && !argv[baseIdx + 1]) {
  console.error('--base needs a value, e.g. --base http://localhost:3100');
  process.exit(1);
}
const BASE = (baseIdx >= 0 ? argv[baseIdx + 1] : 'http://localhost:3000').replace(/\/$/, '');
// Guard on `baseIdx >= 0`: with no --base, indexOf returns -1 and a bare
// `i !== baseIdx + 1` reads as `i !== 0`, which silently drops the first route
// argument — so `… /providers` previewed nothing it was asked for and fell
// through to all twelve defaults.
const routes = argv.filter((a, i) => a.startsWith('/') && (baseIdx < 0 || i !== baseIdx + 1));

const ROUTES = routes.length
  ? routes
  : ['', '/cloud', '/providers', '/contributors', '/sponsor', '/links'].flatMap((p) => [
      p || '/',
      `/en${p}`,
    ]);

const TAGS = [
  'og:title',
  'og:description',
  'og:image',
  'og:image:alt',
  'og:url',
  'og:locale',
  'twitter:card',
  'twitter:site',
  'twitter:title',
  'twitter:description',
  'twitter:image',
  'twitter:image:alt',
];

// `&amp;` must be decoded LAST. Decoding it first turns a literal `&amp;lt;`
// into `&lt;`, which the next rule then turns into `<` — one entity too many.
function decode(s) {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/** A dev server that hangs would otherwise stall the whole sequential run. */
const FETCH_TIMEOUT_MS = 15_000;

async function scrape(route) {
  const url = `${BASE}${route}`;
  const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  const html = await res.text();
  const meta = {};
  const re = /<meta[^>]*(?:property|name)="([^"]+)"[^>]*content="([^"]*)"/g;
  let m;
  while ((m = re.exec(html))) {
    if (TAGS.includes(m[1])) meta[m[1]] = decode(m[2]);
  }
  return { route, url, status: res.status, meta };
}

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Platform truncation, approximated from what each actually shows in-feed. */
const PLATFORMS = [
  { name: 'Facebook', title: 88, desc: 200, showDesc: true },
  { name: 'X', title: 70, desc: 0, showDesc: false },
  { name: 'LinkedIn', title: 119, desc: 0, showDesc: false },
  { name: 'Slack', title: 120, desc: 180, showDesc: true },
];

const clip = (s = '', n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

function card(p, r) {
  const m = r.meta;
  // X reads the twitter: tags in preference to og:, per field and independently
  // — so previewing og: for X hides exactly the divergence worth catching. Alt
  // matters most: X reads twitter:image:alt or shows nothing, it does not fall
  // back to og:image:alt (see the note in src/lib/seo.ts).
  const pick = (tw, og) => (p.name === 'X' ? (m[tw] ?? m[og]) : m[og]);
  const image = pick('twitter:image', 'og:image');
  const imageAlt = pick('twitter:image:alt', 'og:image:alt');
  const title = pick('twitter:title', 'og:title');
  const description = pick('twitter:description', 'og:description');
  const host = (() => {
    try {
      return new URL(m['og:url'] || r.url).host;
    } catch {
      return r.url;
    }
  })();
  return `<figure class="card">
  <figcaption>${p.name}</figcaption>
  <div class="frame">
    ${image ? `<img src="${esc(image)}" alt="${esc(imageAlt)}">` : '<div class="missing">no image</div>'}
    <div class="meta">
      <div class="host">${esc(host.toUpperCase())}</div>
      <div class="title">${esc(clip(title, p.title))}</div>
      ${p.showDesc ? `<div class="desc">${esc(clip(description, p.desc))}</div>` : ''}
    </div>
  </div>
</figure>`;
}

function issues(r) {
  const m = r.meta;
  const out = [];
  if (r.status !== 200) out.push(`HTTP ${r.status}`);
  for (const t of ['og:title', 'og:description', 'og:image', 'og:image:alt', 'twitter:card']) {
    if (!m[t]) out.push(`missing ${t}`);
  }
  // The trap this script exists to catch. Resolve against the page URL rather
  // than parsing bare: a relative og:image is itself a finding, and throwing
  // here would take the whole report down with it.
  if (m['og:image'] && BASE.includes('localhost')) {
    let host = null;
    try {
      host = new URL(m['og:image'], r.url).host;
    } catch {
      out.push(`og:image is not a usable URL (${m['og:image']})`);
    }
    if (host && !m['og:image'].startsWith(BASE)) {
      out.push(`og:image points off-host (${host}) — set NEXT_PUBLIC_SITE_URL`);
    }
  }
  if (m['og:image:alt'] && m['og:image:alt'] === m['og:title']) {
    out.push('og:image:alt duplicates og:title');
  }
  return out;
}

const results = [];
for (const route of ROUTES) {
  try {
    results.push(await scrape(route));
  } catch (err) {
    results.push({ route, url: `${BASE}${route}`, status: 0, meta: {}, error: err.message });
  }
}

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Link previews — ${esc(BASE)}</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 15px/1.5 -apple-system, system-ui, sans-serif; margin: 0; padding: 32px;
         background: #FAFAF7; color: #14202B; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .base { color: #78838F; font-size: 13px; margin-bottom: 28px; }
  section { margin-bottom: 40px; padding-bottom: 28px; border-bottom: 1px solid #EBEDF0; }
  h2 { font-size: 16px; margin: 0 0 4px; font-family: ui-monospace, monospace; }
  .alt { color: #384756; font-size: 13px; margin: 0 0 14px; max-width: 900px; }
  .alt b { color: #14202B; }
  .row { display: flex; gap: 18px; flex-wrap: wrap; }
  .card { margin: 0; }
  figcaption { font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
               color: #78838F; margin-bottom: 6px; }
  .frame { width: 320px; border: 1px solid #DBDFE3; border-radius: 10px; overflow: hidden;
           background: #fff; }
  .frame img { display: block; width: 100%; aspect-ratio: 1200/630; object-fit: cover; }
  .missing { display: grid; place-items: center; aspect-ratio: 1200/630; background: #FBEBE7;
             color: #D44A3C; font-size: 13px; }
  .meta { padding: 10px 12px; }
  .host { font-size: 11px; color: #78838F; }
  .title { font-weight: 600; margin: 2px 0; }
  .desc { font-size: 13px; color: #384756; }
  .flags { margin-top: 10px; }
  .flag { display: inline-block; background: #FBEBE7; color: #A6321F; border-radius: 6px;
          padding: 3px 9px; font-size: 12px; margin: 0 6px 6px 0; }
  .ok { color: #017560; font-size: 12px; }
</style></head><body>
<h1>Link previews</h1>
<div class="base">${esc(BASE)} · ${results.length} routes · cards are cropped and truncated per platform</div>
${results
  .map((r) => {
    const flags = issues(r);
    return `<section>
  <h2>${esc(r.route || '/')}</h2>
  <p class="alt"><b>alt:</b> ${esc(r.meta['og:image:alt'] || '—')}</p>
  <div class="flags">${
    flags.length
      ? flags.map((f) => `<span class="flag">${esc(f)}</span>`).join('')
      : '<span class="ok">✓ all tags present</span>'
  }</div>
  <div class="row">${PLATFORMS.map((p) => card(p, r)).join('')}</div>
</section>`;
  })
  .join('\n')}
</body></html>`;

const out = join(tmpdir(), `balsm-previews-${Date.now()}.html`);
writeFileSync(out, html);

const bad = results.filter((r) => issues(r).length);
console.log(`${results.length} routes, ${bad.length} with issues`);
for (const r of bad) console.log(`  ${r.route || '/'}  ${issues(r).join('; ')}`);
console.log(out);
try {
  execFileSync('open', [out]);
} catch {
  /* not macOS — path is printed above */
}
