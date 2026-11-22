#!/usr/bin/env node
/**
 * Renders the link-preview card (og:image / twitter:image) for every route, in
 * both locales, from src/lib/preview-cards.json:
 *
 *   public/og/<card>-<locale>.png   1200x630
 *
 *   node scripts/generate-preview-cards.mjs              # every card
 *   node scripts/generate-preview-cards.mjs home cloud   # just these
 *
 * To change a page's card, edit its entry in preview-cards.json — eyebrow,
 * title and description per locale, panel `accent` and the eyebrow's darker
 * `accentText` — re-run this, and bump its `rev`. Social apps cache a preview
 * by image URL for days; `rev` goes into the URL as ?v=, so bumping it is what
 * makes WhatsApp, X and LinkedIn fetch the new one. A new route needs a new
 * entry (its `path` is how src/lib/seo.ts finds it); routes without one fall
 * back to the home card.
 *
 * The drawing is the design's own painter (scripts/og-card.js, from the Claude
 * Design project's Link Previews page), run on a canvas in headless Chrome:
 * Chrome is the only renderer here that shapes Arabic correctly with the
 * site's webfonts. Static PNGs rather than ImageResponse routes for the reason
 * given in scripts/generate-brand-assets.mjs (next-intl's matcher swallows them).
 *
 * CHROME overrides the browser binary. Behind an HTTPS proxy (HTTPS_PROXY set)
 * Chrome is pointed at it so the Google Fonts request goes through.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => join(root, 'public', f);
const config = JSON.parse(readFileSync(join(root, 'src/lib/preview-cards.json'), 'utf8'));
const painter = readFileSync(join(root, 'scripts/og-card.js'), 'utf8');

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LOCALES = ['ar', 'en'];
const ORIGIN = 'https://balsm.health';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&family=Montserrat:wght@500;600;700;800&display=block';

// Every face og-card.js draws with, per locale.
const FACES_BY_LOCALE = {
  ar: ['700 26px Cairo', '800 64px Cairo', '400 26px "IBM Plex Sans Arabic"', '600 21px "IBM Plex Sans Arabic"', '500 20px "IBM Plex Mono"'],
  en: ['700 22px Montserrat', '800 58px Montserrat', '400 25px "IBM Plex Sans"', '600 19px "IBM Plex Sans"', '500 20px "IBM Plex Mono"'],
};

const svg = (f) => `data:image/svg+xml;base64,${readFileSync(pub(f)).toString('base64')}`;
const IMAGES = {
  logo: svg('balsm-logo-horizontal.svg'),
  mark: svg('balsm-logo-mono-white.svg'),
  icon: svg('balsm-logo.svg'),
};

/** The card's path as shown on it: the English page lives under /en. */
const shownPath = (card, locale) => (locale === 'en' ? `/en${card.path}` : card.path || '/');

function cardHtml(card, locale) {
  const FACES = FACES_BY_LOCALE[locale];
  const data = {
    card: { ...card[locale], accent: card.accent, accentText: card.accentText, path: shownPath(card, locale) },
    opts: { lang: locale, origin: ORIGIN, tagline: config.site.tagline[locale] },
    images: IMAGES,
  };
  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>* { margin: 0; padding: 0; } body { width: 1200px; height: 630px; overflow: hidden; } canvas { display: block; }</style>
</head>
<body>
<canvas width="1200" height="630"></canvas>
<script>${painter}</script>
<script>
  const data = ${JSON.stringify(data)};
  const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  // Google Fonts splits each family by script (unicode-range), and the
  // browser only fetches a subset for text that needs it. document.fonts.load()
  // without text samples Latin, so Cairo's and Plex Arabic's Arabic subsets
  // were never fetched and the canvas drew the system fallback. Load every
  // face the painter uses with the card's own text instead.
  const text = [data.card.eyebrow, data.card.title, data.card.desc, data.opts.tagline, data.card.path].join(' ');
  const faces = ${JSON.stringify(FACES)};
  Promise.all(faces.map((f) => document.fonts.load(f, text)))
    .then(() => Promise.all(Object.entries(data.images).map(([k, src]) => load(src).then((i) => [k, i]))))
    .then((pairs) => {
      const ctx = document.querySelector('canvas').getContext('2d');
      BalsmOgCard.paint(ctx, data.card, Object.fromEntries(pairs), data.opts);
    });
</script>
</body>
</html>`;
}

/* -------------------------------------------- the /download phone card -- */
// `"layout": "app"` swaps the design's card for the app card. Same frame as
// the others — a panel in the route's colour (left in Arabic, right in
// English) and the petal strip — but the panel holds the app's home screen
// (public/app/home-{ar,en}.webp) in a tilted phone instead of the brand disc.
// The text side carries the eyebrow, `headline` (else `title`) with the other
// locale's headline beneath, the route's `chips`, and the store badges. Plain
// HTML rather than canvas, so Chrome fetches the Arabic font subsets itself.

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Mixes a hex colour toward black (f < 0) or white (f > 0). */
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f));
  return `#${ch.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

// Store badges and chip ticks: the site's own glyphs (public/icons).
const glyph = (name, color) =>
  readFileSync(pub(`icons/${name}.svg`), 'utf8')
    .replace(/<\/?g[^>]*>/g, '')
    .replace('stroke="currentColor"', `stroke="${color}"`);

function appCardHtml(card, locale) {
  const ar = locale === 'ar';
  const main = card[locale];
  const alt = card[ar ? 'en' : 'ar'];
  const acc = card.accent;
  const screen = `data:image/webp;base64,${readFileSync(pub(`app/home-${locale}.webp`)).toString('base64')}`;
  const panel = ar ? 'left' : 'right';
  const start = ar ? 'right' : 'left';
  const badge = (icon, kicker, name) =>
    `<span class="badge">${glyph(icon, '#FFFFFF')}<span><small>${kicker}</small><b>${name}</b></span></span>`;
  const tick = glyph('check', card.accentText);
  return `<!doctype html>
<html lang="${locale}" dir="${ar ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #FAFAF7; position: relative; font-family: ${ar ? "'IBM Plex Sans Arabic'" : "'IBM Plex Sans'"}, sans-serif; }
  .panel {
    position: absolute; top: 0; bottom: 0; ${panel}: 0; width: 470px; overflow: hidden;
    background: radial-gradient(420px 360px at 50% 34%, rgba(255,255,255,.22), transparent 70%),
      linear-gradient(160deg, ${shade(acc, -0.38)} 0%, ${acc} 58%, ${shade(acc, 0.27)} 100%);
  }
  .panel .mark { position: absolute; width: 560px; opacity: .12; ${panel}: -150px; bottom: -170px; }
  .panel .ring { position: absolute; width: 420px; height: 420px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.18); left: 25px; top: 40px; }
  .phone {
    position: absolute; ${panel}: 92px; top: 118px; width: 290px; border-radius: 46px; background: #0E1822; padding: 11px;
    transform: rotate(${ar ? -6 : 6}deg); box-shadow: 0 40px 80px rgba(4,30,70,.45), 0 0 0 1.5px rgba(255,255,255,.12) inset;
  }
  .screen { position: relative; width: 100%; aspect-ratio: 393 / 852; border-radius: 36px; background: #fff; overflow: hidden; }
  .screen img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; }
  .island { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 31%; height: 25px; border-radius: 999px; background: #0B1218; }
  .col { position: absolute; top: 0; bottom: 0; ${start}: 0; width: 730px; padding: 56px 64px 0; display: flex; flex-direction: column; align-items: flex-start; }
  .logo { height: 56px; width: auto; display: block; }
  .eyebrow { margin-top: 40px; font: ${ar ? "700 24px/1.2 'Cairo'" : "500 19px/1.2 'IBM Plex Sans'"}, sans-serif; color: ${card.accentText}; letter-spacing: ${ar ? '0' : '.14em'}; text-transform: uppercase; }
  h1 { margin-top: 10px; font: ${ar ? "800 60px/1.5 'Cairo'" : "800 56px/1.12 'Montserrat'"}, sans-serif; color: #14202B; letter-spacing: ${ar ? '0' : '-.02em'}; max-width: ${ar ? 620 : 600}px; text-wrap: balance; }
  .sub { margin-top: ${ar ? 18 : 16}px; font: ${ar ? "500 25px/1.4 'IBM Plex Sans'" : "600 27px/1.5 'IBM Plex Sans Arabic'"}, sans-serif; color: #526174; direction: ${ar ? 'ltr' : 'rtl'}; }
  .chips { display: flex; gap: 10px; margin-top: 26px; }
  .chip { display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 999px; background: ${shade(acc, 0.88)}; color: ${shade(acc, -0.4)}; font: 600 ${ar ? '19px' : '17px'}/1 ${ar ? "'IBM Plex Sans Arabic'" : "'IBM Plex Sans'"}, sans-serif; }
  .chip svg { width: 17px; height: 17px; flex: none; }
  .stores { position: absolute; bottom: 62px; ${start}: 64px; display: flex; align-items: center; gap: 14px; direction: ltr; }
  .badge { display: inline-flex; align-items: center; gap: 11px; padding: 11px 22px 11px 16px; border-radius: 14px; background: #14202B; color: #fff; }
  .badge svg { width: 28px; height: 28px; flex: none; }
  .badge small { display: block; font: 500 12px/1.2 'Montserrat', sans-serif; opacity: .75; }
  .badge b { display: block; font: 600 20px/1.15 'Montserrat', sans-serif; }
  .url { position: absolute; top: 76px; ${panel}: 534px; font: 500 19px/1 'IBM Plex Mono', monospace; color: #5F6B77; direction: ltr; }
  .strip { position: absolute; bottom: 0; ${start}: 0; width: 730px; height: 10px; display: flex; }
  .strip i { flex: 1; }
</style>
</head>
<body>
  <div class="panel"><div class="ring"></div><img class="mark" src="${IMAGES.mark}" alt=""></div>
  <div class="phone"><div class="screen"><img src="${screen}" alt=""><div class="island"></div></div></div>
  <div class="col">
    <img class="logo" src="${IMAGES.logo}" alt="">
    <div class="eyebrow">${esc(main.eyebrow)}</div>
    <h1>${esc(main.headline ?? main.title)}</h1>
    <div class="sub">${esc(alt.headline ?? alt.title)}</div>
    <div class="chips">${(main.chips ?? []).map((c) => `<span class="chip">${tick}${esc(c)}</span>`).join('')}</div>
  </div>
  <div class="stores">${badge('apple', 'Download on the', 'App Store')}${badge('play', 'Get it on', 'Google Play')}</div>
  <div class="url">${esc(`balsm.health${shownPath(card, locale)}`)}</div>
  <div class="strip"><i style="background:#02BBB5"></i><i style="background:#1283FF"></i><i style="background:#01C4A2"></i><i style="background:#724DD0"></i><i style="background:#55D77F"></i></div>
</body>
</html>`;
}

function render(out, html) {
  const dir = mkdtempSync(join(tmpdir(), 'balsm-og-'));
  const file = join(dir, 'card.html');
  writeFileSync(file, html);
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  try {
    execFileSync(
      CHROME,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        '--window-size=1200,630',
        // Fast-forwards timers so the webfonts finish loading before capture.
        '--virtual-time-budget=15000',
        ...(proxy ? [`--proxy-server=${proxy}`] : []),
        // Chrome won't start its sandbox as root (CI and dev containers).
        ...(process.getuid?.() === 0 ? ['--no-sandbox'] : []),
        `--screenshot=${out}`,
        `file://${file}`,
      ],
      { stdio: 'ignore' }
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const wanted = process.argv.slice(2);
const unknown = wanted.filter((k) => !config.cards[k]);
if (unknown.length) {
  console.error(`unknown card(s): ${unknown.join(', ')} — keys are: ${Object.keys(config.cards).join(', ')}`);
  process.exit(1);
}

mkdirSync(pub('og'), { recursive: true });
const written = [];
for (const [key, card] of Object.entries(config.cards)) {
  if (wanted.length && !wanted.includes(key)) continue;
  for (const locale of LOCALES) {
    const out = pub(`og/${key}-${locale}.png`);
    render(out, card.layout === 'app' ? appCardHtml(card, locale) : cardHtml(card, locale));
    const { width, height } = await sharp(out).metadata();
    if (width !== 1200 || height !== 630) throw new Error(`${out} is ${width}x${height}, expected 1200x630`);
    written.push(`og/${key}-${locale}.png`);
  }
}
console.log(`wrote ${written.length} cards:\n  ${written.join('\n  ')}`);
