#!/usr/bin/env node
/**
 * Renders the link-preview card (og:image / twitter:image) for every route, in
 * both locales, from src/lib/preview-cards.json:
 *
 *   public/og/<card>-<locale>.jpg   1200x630
 *
 *   node scripts/generate-preview-cards.mjs              # every card
 *   node scripts/generate-preview-cards.mjs home cloud   # just these
 *
 * To change a page's card, edit its entry in preview-cards.json — eyebrow,
 * title and description per locale, the background `accent` and the
 * eyebrow's darker `accentText` — re-run this, and bump its `rev`. Social apps
 * cache a preview by image URL for days; `rev` goes into the URL as ?v=, so
 * bumping it is what makes WhatsApp, X and LinkedIn fetch the new one. A new
 * route needs a new entry (its `path` is how src/lib/seo.ts finds it); routes
 * without one fall back to the home card.
 *
 * Centre-safe on purpose. WhatsApp often shows a link as a small square
 * thumbnail cut from the middle of the image (x 285–915), so everything the
 * card has to say sits in a white card filling exactly that square: logo,
 * eyebrow, title, description and URL (or, for `"layout": "app"`, the
 * headline over the app's home screen). Wider previews — iMessage, Telegram,
 * X, LinkedIn, Slack — show the same card on the route's colour, with the
 * store badges either side on the app card.
 *
 * JPEG, not PNG: a smaller file makes WhatsApp likelier to show the large
 * banner instead of the thumbnail, and loads faster everywhere.
 *
 * Headless Chrome, not sharp or next/og: the cards carry Arabic, and Chrome is
 * the only renderer here that shapes it correctly with the site's webfonts.
 * Static images rather than ImageResponse routes for the reason given in
 * scripts/generate-brand-assets.mjs (next-intl's matcher swallows them).
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

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LOCALES = ['ar', 'en'];
const JPEG_QUALITY = 86;

const FONTS =
  'https://fonts.googleapis.com/css2?family=Cairo:wght@700;800&family=IBM+Plex+Sans+Arabic:wght@500;600&family=IBM+Plex+Sans:wght@500;600&family=IBM+Plex+Mono:wght@500&family=Montserrat:wght@500;600;700;800&display=block';

const svg = (f) => `data:image/svg+xml;base64,${readFileSync(pub(f)).toString('base64')}`;
const LOGO = svg('balsm-logo-horizontal.svg');
const MARK = svg('balsm-logo-mono-white.svg');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Mixes a hex colour toward black (f < 0) or white (f > 0). */
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f));
  return `#${ch.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

// Store badges: the site's own glyphs (public/icons), drawn white.
const glyph = (name) =>
  readFileSync(pub(`icons/${name}.svg`), 'utf8')
    .replace(/<\/?g[^>]*>/g, '')
    .replace('stroke="currentColor"', 'stroke="#FFFFFF"');

/** Headlines step down in size so they stay within three lines in the card. */
function titleSize(text, ar, app) {
  if (app) return ar ? 40 : 36;
  const n = text.length;
  if (ar) return n <= 22 ? 54 : n <= 36 ? 46 : 40;
  return n <= 26 ? 48 : n <= 44 ? 42 : 36;
}

function cardHtml(card, locale) {
  const ar = locale === 'ar';
  const app = card.layout === 'app';
  const copy = card[locale];
  const title = app ? (copy.headline ?? copy.title) : copy.title;
  const acc = card.accent;
  const url = `balsm.health${ar ? '' : '/en'}${card.path}`;
  const screen = app ? `data:image/webp;base64,${readFileSync(pub(`app/home-${locale}.webp`)).toString('base64')}` : '';
  const badge = (icon, kicker, name) =>
    `<span class="badge">${glyph(icon)}<span><small>${kicker}</small><b>${name}</b></span></span>`;
  // The page stays LTR and only the card is RTL: overflowing decoration on an
  // RTL page makes Chrome scroll the canvas and shifts the screenshot.
  return `<!doctype html>
<html lang="${locale}" dir="ltr">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { overflow: hidden; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    font-family: ${ar ? "'IBM Plex Sans Arabic'" : "'IBM Plex Sans'"}, sans-serif;
    background: radial-gradient(520px 420px at 50% 40%, rgba(255,255,255,.18), transparent 70%),
      linear-gradient(150deg, ${shade(acc, -0.4)} 0%, ${acc} 55%, ${shade(acc, 0.25)} 100%);
  }
  .mark { position: absolute; width: 520px; opacity: .11; }
  .mark.a { left: -190px; top: -170px; }
  .mark.b { right: -190px; bottom: -190px; }
  .ring { position: absolute; width: 760px; height: 760px; left: 220px; top: -65px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.16); }
  /* The white card fills WhatsApp's centre crop (x 285–915) with 15px to spare. */
  .card {
    direction: ${ar ? 'rtl' : 'ltr'}; position: absolute; left: 300px; top: 36px; width: 600px; height: 540px;
    border-radius: 34px; background: #FAFAF7; box-shadow: 0 30px 70px rgba(4,25,60,.35);
    display: flex; flex-direction: column; align-items: center; text-align: center; padding: 44px 48px 0; overflow: hidden;
  }
  .logo { height: ${app ? 50 : 60}px; width: auto; display: block; }
  .eyebrow {
    margin-top: ${app ? 22 : 40}px; font: ${ar ? "700 22px/1.2 'Cairo'" : "500 16px/1.2 'IBM Plex Sans'"}, sans-serif;
    color: ${card.accentText}; letter-spacing: ${ar ? '0' : '.16em'}; text-transform: uppercase;
  }
  h1 {
    margin-top: ${app ? 10 : 14}px; font: 800 ${titleSize(title, ar, app)}px/${ar ? 1.45 : 1.15} ${ar ? "'Cairo'" : "'Montserrat'"}, sans-serif;
    color: #14202B; letter-spacing: ${ar ? '0' : '-.015em'}; text-wrap: balance;
  }
  .desc {
    margin-top: 16px; max-width: 500px; color: #4A5867; text-wrap: balance;
    font: ${ar ? "500 21px/1.75 'IBM Plex Sans Arabic'" : "500 19px/1.6 'IBM Plex Sans'"}, sans-serif;
  }
  .url { position: absolute; bottom: 34px; left: 0; right: 0; text-align: center; font: 500 17px/1 'IBM Plex Mono', monospace; color: #5F6B77; direction: ltr; }
  .phone { position: absolute; left: 50%; transform: translateX(-50%); top: ${ar ? 244 : 236}px; width: 300px; border-radius: 44px; background: #0E1822; padding: 10px; box-shadow: 0 -10px 40px rgba(20,32,43,.18); }
  .screen { position: relative; width: 100%; aspect-ratio: 393 / 852; border-radius: 34px; background: #fff; overflow: hidden; }
  .screen img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .island { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 31%; height: 24px; border-radius: 999px; background: #0B1218; }
  /* Outside the crop: the wide view's store badges, either side of the card. */
  .side { position: absolute; top: 0; bottom: 10px; width: 285px; display: flex; align-items: center; justify-content: center; }
  .side.l { left: 0; } .side.r { right: 0; }
  .badge { display: inline-flex; align-items: center; gap: 10px; padding: 11px 18px 11px 14px; border-radius: 14px; background: #14202B; color: #fff; box-shadow: 0 14px 30px rgba(4,25,60,.3); }
  .badge svg { width: 26px; height: 26px; }
  .badge small { display: block; font: 500 11px/1.2 'Montserrat', sans-serif; opacity: .75; }
  .badge b { display: block; font: 600 19px/1.15 'Montserrat', sans-serif; }
  .strip { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; display: flex; }
  .strip i { flex: 1; }
</style>
</head>
<body>
  <img class="mark a" src="${MARK}" alt=""><img class="mark b" src="${MARK}" alt="">
  <div class="ring"></div>
  ${app ? `<div class="side l">${badge('apple', 'Download on the', 'App Store')}</div><div class="side r">${badge('play', 'Get it on', 'Google Play')}</div>` : ''}
  <div class="card">
    <img class="logo" src="${LOGO}" alt="">
    <div class="eyebrow">${esc(copy.eyebrow)}</div>
    <h1>${esc(title)}</h1>
    ${app
      ? `<div class="phone"><div class="screen"><img src="${screen}" alt=""><div class="island"></div></div></div>`
      : `<div class="desc">${esc(copy.desc)}</div><div class="url">${esc(url)}</div>`}
  </div>
  <div class="strip"><i style="background:#02BBB5"></i><i style="background:#1283FF"></i><i style="background:#01C4A2"></i><i style="background:#724DD0"></i><i style="background:#55D77F"></i></div>
</body>
</html>`;
}

/** Screenshots the card to a PNG in a temp dir and returns that path. */
function screenshot(html) {
  const dir = mkdtempSync(join(tmpdir(), 'balsm-og-'));
  const file = join(dir, 'card.html');
  const png = join(dir, 'card.png');
  writeFileSync(file, html);
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
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
      `--screenshot=${png}`,
      `file://${file}`,
    ],
    { stdio: 'ignore' }
  );
  return { png, dir };
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
    const out = pub(`og/${key}-${locale}.jpg`);
    const { png, dir } = screenshot(cardHtml(card, locale));
    try {
      const { width, height } = await sharp(png).metadata();
      if (width !== 1200 || height !== 630) throw new Error(`${key}-${locale} is ${width}x${height}, expected 1200x630`);
      await sharp(png).jpeg({ quality: JPEG_QUALITY, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(out);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
    written.push(`og/${key}-${locale}.jpg`);
  }
}
console.log(`wrote ${written.length} cards:\n  ${written.join('\n  ')}`);
