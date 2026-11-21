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
 * To change a page's card, edit its entry in preview-cards.json — kicker,
 * title, accent colour, optional alt — re-run this, and bump its `rev`.
 * Social apps cache a preview by image URL for days; `rev` goes into the URL
 * as ?v=, so bumping it is what makes WhatsApp, X and LinkedIn fetch the new
 * one. A new route needs a new entry (its `path` is how src/lib/seo.ts finds
 * it); routes without one fall back to the home card.
 *
 * Each card is primary in its own locale — the Arabic page's card leads with
 * the Arabic headline and carries the English one beneath it, and the English
 * card the reverse — so whoever the link is shared with reads their language
 * first and sees the other as a sign the site has both.
 *
 * Headless Chrome, not sharp or next/og: the cards carry Arabic, and Chrome is
 * the only renderer here that shapes it correctly with the site's webfonts.
 * Static PNGs rather than ImageResponse routes for the reason given in
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
const SITE = 'balsm.health';

// Cloud palette — mirrors src/components/cloud/theme.ts
const BG = '#FAFAF7';
const INK = '#14202B';
const INK2 = '#384756';
const MUTED = '#526174'; // ink-600: the small print still has to read at thumbnail size

const FONTS =
  'https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=IBM+Plex+Sans+Arabic:wght@500;600&family=IBM+Plex+Mono:wght@500&family=Montserrat:wght@500;600;700;800&family=IBM+Plex+Sans:wght@600&display=block';

const lockup = `data:image/svg+xml;base64,${readFileSync(pub('balsm-logo-horizontal.svg')).toString('base64')}`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const other = (locale) => (locale === 'ar' ? 'en' : 'ar');
const urlFor = (card, locale) => `${SITE}${locale === 'en' ? '/en' : ''}${card.path}`;

/** Headlines run one or two lines; longer copy steps the size down to stay in two. */
function titleSize(text, locale) {
  const n = text.length;
  if (locale === 'ar') return n <= 26 ? 76 : n <= 38 ? 64 : 54;
  return n <= 30 ? 68 : n <= 46 ? 58 : 50;
}

const fontFor = (locale, weight, size, lh) =>
  locale === 'ar' ? `${weight} ${size}px/${lh} 'Cairo', sans-serif` : `${weight} ${size}px/${lh} 'Montserrat', sans-serif`;

const SHELL_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: ${BG}; position: relative; overflow: hidden; }
  body::before {
    content: ''; position: absolute; inset: 0;
    background:
      radial-gradient(760px 460px at 0% 100%, rgba(1,196,162,.07), transparent 70%),
      radial-gradient(640px 420px at 0% 0%, rgba(18,131,255,.06), transparent 70%);
  }
  footer {
    position: absolute; inset: auto 0 0 0; height: 8px; z-index: 2;
    background: linear-gradient(90deg, #01C4A2, #02BBB5, #1283FF, #724DD0);
  }`;

/** The design's per-page card (assets/og/*.png in the Claude Design project). */
function textCardHtml(card, locale) {
  const main = card[locale];
  const alt = card[other(locale)];
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const size = titleSize(main.title, locale);
  return `<!doctype html>
<html lang="${locale}" dir="${dir}">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>${SHELL_CSS}
  main { position: relative; height: 100%; padding: 64px 72px 70px; display: flex; flex-direction: column; }
  .top { display: flex; justify-content: flex-start; }
  .top img { height: 58px; width: auto; display: block; }
  .body { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 960px; }
  .kicker { display: flex; align-items: center; gap: 14px; }
  .dot { width: 14px; height: 14px; border-radius: 50%; background: ${card.accent}; flex: none; }
  .kicker b { font: ${locale === 'ar' ? "700 26px/1.3 'Cairo'" : "700 22px/1.3 'Montserrat'"}, sans-serif; color: ${INK2}; }
  .kicker small {
    font: ${other(locale) === 'ar' ? "700 20px/1.3 'Cairo'" : "600 15px/1.3 'Montserrat'"}, sans-serif;
    letter-spacing: ${other(locale) === 'ar' ? '0' : '.16em'}; text-transform: uppercase; color: ${MUTED};
  }
  h1 {
    font: ${fontFor(locale, 800, size, locale === 'ar' ? 1.3 : 1.12)}; color: ${INK};
    letter-spacing: ${locale === 'ar' ? '0' : '-0.02em'}; margin-top: 18px; text-wrap: balance;
  }
  p {
    font: ${fontFor(other(locale), other(locale) === 'ar' ? 700 : 500, other(locale) === 'ar' ? 30 : 28, 1.4)};
    color: ${INK2}; margin-top: 16px; direction: ${other(locale) === 'ar' ? 'rtl' : 'ltr'};
    text-align: ${locale === 'ar' ? 'right' : 'left'}; text-wrap: balance;
  }
  .bottom { display: flex; justify-content: space-between; align-items: center; }
  .url { font: 500 22px/1 'IBM Plex Mono', monospace; color: ${INK2}; direction: ltr; }
  .os { font: 600 20px/1 'IBM Plex Sans Arabic', 'IBM Plex Sans', sans-serif; color: ${INK2}; }
</style>
</head>
<body>
  <main>
    <div class="top"><img src="${lockup}" alt=""></div>
    <div class="body">
      <div class="kicker"><span class="dot"></span><b>${esc(main.kicker)}</b><small>${esc(alt.kicker)}</small></div>
      <h1>${esc(main.title)}</h1>
      <p>${esc(alt.title)}</p>
    </div>
    <div class="bottom"><span class="url">${esc(urlFor(card, locale))}</span><span class="os">${esc(config.footer[locale])}</span></div>
  </main>
  <footer></footer>
</body>
</html>`;
}

// Store badges: the site's own Apple / Play glyphs (public/icons), drawn white
// on ink like the badges on /download.
const glyph = (name) =>
  readFileSync(pub(`icons/${name}.svg`), 'utf8')
    .replace(/<\/?g[^>]*>/g, '')
    .replace('stroke="currentColor"', 'stroke="#FFFFFF"');

/**
 * The /download card. That URL is what the app's share sheet prints, so its
 * preview shows the app itself — the home-screen capture the site's phone
 * mockup uses (public/app/home-{ar,en}.webp), in the same iPhone frame — and
 * the store badges.
 */
function appCardHtml(card, locale) {
  const main = card[locale];
  const alt = card[other(locale)];
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const screen = `data:image/webp;base64,${readFileSync(pub(`app/home-${locale}.webp`)).toString('base64')}`;
  const badge = (icon, kicker, name) => `
    <span class="badge">${glyph(icon)}<span><small>${kicker}</small><b>${name}</b></span></span>`;
  return `<!doctype html>
<html lang="${locale}" dir="${dir}">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>${SHELL_CSS}
  body { display: flex; align-items: center; gap: 56px; padding: 0 84px; }
  body::before {
    background:
      radial-gradient(640px 420px at 22% 18%, rgba(131,80,222,.12), transparent 70%),
      radial-gradient(620px 380px at 92% 112%, rgba(1,196,162,.11), transparent 70%);
  }
  .copy { flex: 1; min-width: 0; position: relative; display: flex; flex-direction: column; align-items: flex-start; }
  .lockup { width: 300px; height: auto; display: block; }
  h1 {
    font: ${fontFor(locale, 800, locale === 'ar' ? 58 : 52, locale === 'ar' ? 1.35 : 1.15)}; color: ${INK};
    margin-top: 34px; letter-spacing: ${locale === 'ar' ? '0' : '-0.015em'};
  }
  p {
    font: ${other(locale) === 'en' ? "600 24px/1.4 'Montserrat'" : "700 26px/1.5 'Cairo'"}, sans-serif; color: ${MUTED};
    direction: ${other(locale) === 'ar' ? 'rtl' : 'ltr'}; margin-top: 12px;
  }
  .stores { display: flex; gap: 16px; direction: ltr; margin-top: 36px; }
  .badge {
    display: inline-flex; align-items: center; gap: 13px;
    padding: 13px 26px 13px 20px; border-radius: 16px; background: ${INK}; color: #fff;
  }
  .badge svg { width: 34px; height: 34px; flex: none; }
  .badge small { display: block; font: 500 14px/1.2 'Montserrat', sans-serif; opacity: .75; }
  .badge b { display: block; font: 600 24px/1.15 'Montserrat', sans-serif; }
  /* Same frame as src/components/cloud/AppPhone.tsx, scaled to 1.12x, running
     off the bottom edge so the screen reads at link-preview size. */
  .phone {
    flex: none; position: relative; align-self: flex-start; margin-top: 64px;
    width: 314px; border-radius: 49px; background: ${INK}; padding: 12px;
    box-shadow: 0 34px 80px rgba(20,32,43,.24);
  }
  .screen { position: relative; width: 100%; aspect-ratio: 393 / 852; border-radius: 38px; background: #fff; overflow: hidden; }
  .screen > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; }
  .status {
    position: absolute; top: 0; left: 0; right: 0; height: 49px; display: flex; align-items: center;
    justify-content: space-between; padding: 0 25px 0 29px; color: ${INK};
  }
  .status .time { font: 600 13.5px 'IBM Plex Sans', sans-serif; letter-spacing: -0.01em; direction: ltr; }
  .status .icons { display: flex; align-items: center; gap: 4.5px; direction: ltr; }
  .island { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 31%; height: 27px; border-radius: 999px; background: #0B1218; }
</style>
</head>
<body>
  <div class="copy">
    <img class="lockup" src="${lockup}" alt="">
    <h1>${esc(main.title)}</h1>
    <p>${esc(alt.title)}</p>
    <div class="stores">${badge('apple', 'Download on the', 'App Store')}${badge('play', 'Get it on', 'Google Play')}
    </div>
  </div>
  <div class="phone">
    <div class="screen">
      <img src="${screen}" alt="">
      <div class="status">
        <span class="time">9:41</span>
        <span class="icons">
          <svg viewBox="0 0 18 12" width="17" height="11"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg>
          <svg viewBox="0 0 16 12" width="15" height="11"><path d="M8 11.5l2.4-2.9a3.6 3.6 0 0 0-4.8 0z M8 4.6c1.6 0 3.1.6 4.2 1.6l1.5-1.8A8.6 8.6 0 0 0 8 2.2a8.6 8.6 0 0 0-5.7 2.2l1.5 1.8A6.3 6.3 0 0 1 8 4.6z" fill="currentColor"/></svg>
          <svg viewBox="0 0 27 13" width="24" height="11"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" stroke-opacity=".4"/><rect x="2.5" y="2.5" width="18" height="8" rx="2" fill="currentColor"/><path d="M24.5 4.5v4a2 2 0 0 0 0-4z" fill="currentColor" fill-opacity=".45"/></svg>
        </span>
      </div>
      <div class="island"></div>
    </div>
  </div>
  <footer></footer>
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
    render(out, card.layout === 'app' ? appCardHtml(card, locale) : textCardHtml(card, locale));
    const { width, height } = await sharp(out).metadata();
    if (width !== 1200 || height !== 630) throw new Error(`${out} is ${width}x${height}, expected 1200x630`);
    written.push(`og/${key}-${locale}.png`);
  }
}
console.log(`wrote ${written.length} cards:\n  ${written.join('\n  ')}`);
