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
  'https://fonts.googleapis.com/css2?family=Cairo:wght@700;800&family=IBM+Plex+Sans+Arabic:wght@400;600&family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Mono:wght@500&family=Montserrat:wght@700;800&display=block';

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
    render(out, cardHtml(card, locale));
    const { width, height } = await sharp(out).metadata();
    if (width !== 1200 || height !== 630) throw new Error(`${out} is ${width}x${height}, expected 1200x630`);
    written.push(`og/${key}-${locale}.png`);
  }
}
console.log(`wrote ${written.length} cards:\n  ${written.join('\n  ')}`);
