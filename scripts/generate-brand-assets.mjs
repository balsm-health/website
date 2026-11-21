#!/usr/bin/env node
/**
 * Generates the static brand rasters that live in public/ from the canonical
 * brand SVGs, so link previews, browser tabs and home-screen icons all trace
 * back to one source of truth.
 *
 *   public/icon-512.png     512x512   PWA / <link rel=icon>
 *   public/icon-192.png     192x192   PWA
 *   public/apple-icon.png   180x180   iOS home screen (opaque, per Apple)
 *   public/favicon.ico      16+32     legacy tab icon
 *
 * Link-preview cards are per route and live in their own script,
 * scripts/generate-preview-cards.mjs.
 *
 * These are committed rasters rather than Next `ImageResponse` routes on
 * purpose: a route with no dot in its path (/opengraph-image, /icon) is
 * swallowed by the next-intl middleware matcher, and social crawlers get a
 * 404 instead of a card. Static files under public/ are excluded by that same
 * matcher and are served straight off Cloudflare's asset store.
 *
 * Re-run after any brand change:  node scripts/generate-brand-assets.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => join(root, 'public', f);

const MARK = readFileSync(pub('balsm-logo.svg'));

// Cloud palette — mirrors src/components/cloud/theme.ts
const BG = '#FAFAF7';

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

console.log('wrote icon-512.png icon-192.png apple-icon.png favicon.ico');
