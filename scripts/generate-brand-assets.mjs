#!/usr/bin/env node
/**
 * Generates the static brand rasters that live in public/ from the canonical
 * brand SVGs, so link previews, browser tabs and home-screen icons all trace
 * back to one source of truth.
 *
 *   public/og-image.png     1200x630  link-preview card (Chrome screenshot)
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
const INK = '#2B2B25';
const MUTED = '#8C8C82';

/* ---------------------------------------------------------------- icons -- */

// The mark is rendered at 4x then downscaled, which keeps the petal edges
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
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function ogCardHtml() {
  const lockup = `data:image/svg+xml;base64,${LOCKUP.toString('base64')}`;
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
    font: 600 21px/1 'IBM Plex Sans Arabic', sans-serif; color: #56564C;
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

function renderOgCard(out) {
  const dir = mkdtempSync(join(tmpdir(), 'balsm-og-'));
  const html = join(dir, 'card.html');
  writeFileSync(html, ogCardHtml());
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

const { width, height } = await sharp(pub('og-image.png')).metadata();
if (width !== 1200 || height !== 630) {
  throw new Error(`og-image.png is ${width}x${height}, expected 1200x630`);
}

console.log('wrote og-image.png icon-512.png icon-192.png apple-icon.png favicon.ico');
