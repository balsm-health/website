#!/usr/bin/env node
/**
 * Generates the static brand rasters that live in public/ from the canonical
 * brand SVGs, so link previews, browser tabs and home-screen icons all trace
 * back to one source of truth.
 *
 *   public/og-image.png     1200x630  link-preview card (Chrome screenshot)
 *   public/og-image-app.png    1200x630  /download store card, Arabic (Chrome screenshot)
 *   public/og-image-app-en.png 1200x630  /en/download store card, English
 *   public/icon-512.png     512x512   PWA / <link rel=icon>
 *   public/icon-192.png     192x192   PWA
 *   public/apple-icon.png   180x180   iOS home screen (opaque, per Apple)
 *   public/favicon.ico      16+32     legacy tab icon
 *
 * These are committed rasters rather than Next `ImageResponse` routes on
 * purpose: a route with no dot in its path (/opengraph-image, /icon) is
 * swallowed by the next-intl middleware matcher, and social crawlers get a
 * 404 instead of a card. Static files under public/ are excluded by that same
 * matcher and are served straight off Cloudflare's asset store.
 *
 * Re-run after any brand change:  node scripts/generate-brand-assets.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => join(root, 'public', f);

const MARK = readFileSync(pub('balsm-logo.svg'));
const LOCKUP = readFileSync(pub('balsm-logo-horizontal.svg'));

// Cloud palette — mirrors src/components/cloud/theme.ts
const BG = '#FAFAF7';
const INK = '#14202B';
const MUTED = '#78838F';

/* ---------------------------------------------------------------- icons -- */

// The mark is rendered at 4x then downscaled, which keeps the ribbon edges
// clean at small sizes where librsvg's own antialiasing gets crunchy.
async function markPng(size, { background = null, pad = 0 } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const art = await sharp(MARK, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: art, gravity: 'center' }])
    .png()
    .toBuffer();
}

/**
 * Packs PNGs into an ICO. The format allows a PNG payload verbatim in place of
 * a BMP one (Vista+), which every browser we care about reads, so this is a
 * 6-byte header plus one 16-byte directory entry per size.
 */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette count
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

/* ------------------------------------------------------------ og card --- */

// Headless Chrome rather than sharp for this one: the card carries Arabic
// text, and Chrome is the only thing here that shapes it correctly and can
// pull the same webfonts the site uses.
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const lockupSrc = () => `data:image/svg+xml;base64,${LOCKUP.toString('base64')}`;

function ogCardHtml() {
  const lockup = lockupSrc();
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Montserrat:wght@500;600;700&display=block">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; background: ${BG};
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 34px; position: relative; overflow: hidden;
  }
  /* Same soft brand wash the site hero uses, kept well under the text. */
  body::before {
    content: ''; position: absolute; inset: 0;
    background:
      radial-gradient(760px 420px at 50% -12%, rgba(1,196,162,.13), transparent 70%),
      radial-gradient(620px 380px at 8% 112%, rgba(18,131,255,.10), transparent 70%);
  }
  img { width: 470px; height: auto; display: block; position: relative; }
  h1 {
    font: 800 46px/1.45 'Cairo', sans-serif; color: ${INK};
    position: relative; text-align: center;
  }
  p {
    font: 600 25px/1.4 'Montserrat', sans-serif; color: ${MUTED};
    position: relative; letter-spacing: .01em; direction: ltr;
  }
  ul {
    display: flex; gap: 12px; list-style: none; position: relative; margin-top: 6px;
  }
  li {
    font: 600 21px/1 'IBM Plex Sans Arabic', sans-serif; color: #384756;
    background: #FFFFFF; border: 1px solid #E6E5DC; border-radius: 999px;
    padding: 13px 22px;
  }
  /* Brand rule along the bottom edge, echoing the site footer. */
  footer {
    position: absolute; inset: auto 0 0 0; height: 8px;
    background: linear-gradient(90deg, #01C4A2, #02BBB5, #1283FF, #724DD0);
  }
</style>
</head>
<body>
  <img src="${lockup}" alt="">
  <h1>نظام التشغيل الصحي المملوك للمجتمع</h1>
  <p>The community-owned healthcare OS</p>
  <ul>
    <li>عربيٌّ أولاً</li>
    <li>يعمل بلا إنترنت</li>
    <li>مفتوح المصدر</li>
  </ul>
  <footer></footer>
</body>
</html>`;
}

// Store badges: the site's own Apple / Play glyphs (public/icons), drawn white
// on ink like the badges on Home and /download.
const glyph = (name) =>
  readFileSync(pub(`icons/${name}.svg`), 'utf8')
    .replace(/<\/?g[^>]*>/g, '')
    .replace('stroke="currentColor"', 'stroke="#FFFFFF"');

/**
 * The /download card. That URL is what the app's share sheet prints, so its
 * preview says "get the app", not the brand statement every other page shows,
 * and shows the app itself: the home-screen capture the site's phone mockup
 * uses (public/app/home-{ar,en}.webp), in the same iPhone frame. One card per
 * locale, so the screenshot and headline match the reader's language.
 */
const APP_CARD_COPY = {
  ar: { dir: 'rtl', title: 'سجلّك الصحي في جيبك', sub: 'Your health record, in your pocket', subDir: 'ltr' },
  en: { dir: 'ltr', title: 'Your health record, in your pocket', sub: 'سجلّك الصحي في جيبك', subDir: 'rtl' },
};

function ogAppCardHtml(locale = 'ar') {
  const lockup = lockupSrc();
  const copy = APP_CARD_COPY[locale];
  const screen = `data:image/webp;base64,${readFileSync(pub(`app/home-${locale}.webp`)).toString('base64')}`;
  const badge = (icon, kicker, name) => `
    <span class="badge">${glyph(icon)}<span><small>${kicker}</small><b>${name}</b></span></span>`;
  return `<!doctype html>
<html lang="${locale}" dir="${copy.dir}">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Montserrat:wght@500;600;700;800&family=IBM+Plex+Sans:wght@600&display=block">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; background: ${BG};
    display: flex; align-items: center; gap: 56px; padding: 0 84px;
    position: relative; overflow: hidden;
  }
  body::before {
    content: ''; position: absolute; inset: 0;
    background:
      radial-gradient(640px 420px at 22% 18%, rgba(131,80,222,.12), transparent 70%),
      radial-gradient(620px 380px at 92% 112%, rgba(1,196,162,.11), transparent 70%);
  }
  .copy { flex: 1; min-width: 0; position: relative; display: flex; flex-direction: column; align-items: flex-start; }
  .lockup { width: 300px; height: auto; display: block; }
  h1 {
    font: 800 ${locale === 'ar' ? '58px/1.35' : '52px/1.15'} ${locale === 'ar' ? "'Cairo'" : "'Montserrat'"}, sans-serif; color: ${INK};
    margin-top: 34px; letter-spacing: ${locale === 'ar' ? '0' : '-0.015em'};
  }
  p {
    font: ${copy.subDir === 'ltr' ? "600 24px/1.4 'Montserrat'" : "700 26px/1.5 'Cairo'"}, sans-serif; color: ${MUTED};
    direction: ${copy.subDir}; margin-top: 12px;
  }
  .stores { display: flex; gap: 16px; direction: ltr; margin-top: 36px; }
  .badge {
    display: inline-flex; align-items: center; gap: 13px;
    padding: 13px 26px 13px 20px; border-radius: 16px; background: ${INK}; color: #fff;
  }
  .badge svg { width: 34px; height: 34px; flex: none; }
  .badge small { display: block; font: 500 14px/1.2 'Montserrat', sans-serif; opacity: .75; }
  .badge b { display: block; font: 600 24px/1.15 'Montserrat', sans-serif; }
  /* Phone: same frame as src/components/cloud/AppPhone.tsx, scaled to 1.12x,
     running off the bottom edge so the screen reads at link-preview size. */
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
  footer {
    position: absolute; inset: auto 0 0 0; height: 8px; z-index: 2;
    background: linear-gradient(90deg, #01C4A2, #02BBB5, #1283FF, #724DD0);
  }
</style>
</head>
<body>
  <div class="copy">
    <img class="lockup" src="${lockup}" alt="">
    <h1>${copy.title}</h1>
    <p>${copy.sub}</p>
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

function renderOgCard(out, cardHtml = ogCardHtml()) {
  const dir = mkdtempSync(join(tmpdir(), 'balsm-og-'));
  const html = join(dir, 'card.html');
  writeFileSync(html, cardHtml);
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
        `--screenshot=${out}`,
        `file://${html}`,
      ],
      { stdio: 'ignore' }
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/* ------------------------------------------------------------------ run -- */

const icon512 = await markPng(512, { pad: 0.06 });
writeFileSync(pub('icon-512.png'), icon512);
writeFileSync(pub('icon-192.png'), await markPng(192, { pad: 0.06 }));
writeFileSync(
  pub('apple-icon.png'),
  await markPng(180, { pad: 0.12, background: BG })
);
writeFileSync(
  pub('favicon.ico'),
  ico([
    { size: 16, data: await markPng(16, { pad: 0.03 }) },
    { size: 32, data: await markPng(32, { pad: 0.03 }) },
    { size: 48, data: await markPng(48, { pad: 0.03 }) },
  ])
);

renderOgCard(pub('og-image.png'));
renderOgCard(pub('og-image-app.png'), ogAppCardHtml('ar'));
renderOgCard(pub('og-image-app-en.png'), ogAppCardHtml('en'));

for (const card of ['og-image.png', 'og-image-app.png', 'og-image-app-en.png']) {
  const { width, height } = await sharp(pub(card)).metadata();
  if (width !== 1200 || height !== 630) {
    throw new Error(`${card} is ${width}x${height}, expected 1200x630`);
  }
}

console.log('wrote og-image.png og-image-app.png og-image-app-en.png icon-512.png icon-192.png apple-icon.png favicon.ico');
