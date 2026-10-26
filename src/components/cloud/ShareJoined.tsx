'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FONT } from './theme';
import { ArrowLeft, ArrowRight, Check, Copy, Download, MessageCircle, Move, Share2, ZoomIn, ZoomOut } from './CloudIcons';

/**
 * Port of Share Joined.dc.html: a contributor makes a card announcing they
 * joined, downloads it, and posts it with ready-made text.
 *
 * The card is drawn on a canvas, entirely in the browser — the photo is never
 * uploaded. Every template is the design's own drawing code, so coordinates,
 * sizes and colours are the design's literals, not theme tokens: they describe
 * artwork at 1200×630 / 1080×1080, not page UI. The card's language follows
 * the page locale.
 */

const ASSET = {
  watercolor: '/balsm-background.png',
  logo: '/balsm-logo-horizontal.svg',
  logoWhite: '/frame/logo-horizontal-mono-white.svg',
  icon: '/balsm-logo.svg',
  iconWhite: '/balsm-logo-mono-white.svg',
} as const;

const ROLES = [
  { id: 'code', en: 'Engineering' },
  { id: 'design', en: 'Design' },
  { id: 'clinical', en: 'Clinical expertise' },
  { id: 'product', en: 'Product' },
  { id: 'docs', en: 'Documentation' },
  { id: 'marketing', en: 'Marketing' },
  { id: 'community', en: 'Community' },
] as const;
type RoleId = (typeof ROLES)[number]['id'];

const FORMATS = [
  { id: 'wide', w: 1200, h: 630 },
  { id: 'square', w: 1080, h: 1080 },
] as const;
type FormatId = (typeof FORMATS)[number]['id'];

const TEMPLATES = ['watercolor', 'ink', 'panel', 'centered', 'minimal', 'halo', 'credential'] as const;
type Template = (typeof TEMPLATES)[number];

// `text` is the hue darkened for small type on the card's light grounds.
const ACCENTS = [
  { id: 'violet', hex: '#724DD0', text: '#724DD0' },
  { id: 'aqua', hex: '#02BBB5', text: '#017F7B' },
  { id: 'emerald', hex: '#01C4A2', text: '#018A72' },
  { id: 'blue', hex: '#1283FF', text: '#0B6FE0' },
  { id: 'mint', hex: '#55D77F', text: '#23894A' },
] as const;
type Accent = (typeof ACCENTS)[number];
type AccentId = Accent['id'];

const PETALS = ['#02BBB5', '#01C4A2', '#1283FF', '#55D77F', '#724DD0'];

const CARD_FONTS = ['800 60px Cairo', '700 40px Cairo', '500 26px "IBM Plex Sans Arabic"', '500 20px "IBM Plex Mono"', '600 16px Montserrat', '800 54px Montserrat', '700 22px Montserrat', '500 25px "IBM Plex Sans"'];

type Images = { bg: HTMLImageElement | null; logo: HTMLImageElement | null; icon: HTMLImageElement | null; logoW: HTMLImageElement | null; iconW: HTMLImageElement | null };
type Circle = { cx: number; cy: number; R: number };

/** Everything a template needs to paint one card. */
type Card = {
  en: boolean;
  name: string;
  roleAr: string;
  roleEn: string;
  github: string;
  accent: Accent;
  photo: HTMLImageElement | null;
  zoom: number;
  offX: number;
  offY: number;
  imgs: Images;
};

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// ── Drawing helpers (Share Joined.dc.html, verbatim) ────────────────────────

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / img.width, h / img.height);
  const iw = img.width * s, ih = img.height * s;
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function strip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const sw = w / 5;
  PETALS.forEach((p, i) => { ctx.fillStyle = p; ctx.fillRect(x + i * sw, y, sw + 1, h); });
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, maxW: number, size: number, tmpl: (s: number) => string) {
  let s = size;
  ctx.font = tmpl(s);
  while (ctx.measureText(text).width > maxW && s > 20) { s -= 2; ctx.font = tmpl(s); }
  return s;
}

function setSpacing(ctx: CanvasRenderingContext2D, v: string) {
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = v;
}

function petalBar(ctx: CanvasRenderingContext2D, x: number, y: number, segW: number, h: number, gap: number, rtl: boolean) {
  PETALS.forEach((p, i) => {
    ctx.fillStyle = p;
    const sx = rtl ? x - (i + 1) * segW - i * gap : x + i * (segW + gap);
    rrect(ctx, sx, y, segW, h, h / 2);
    ctx.fill();
  });
}

function watercolorDisc(ctx: CanvasRenderingContext2D, bg: HTMLImageElement | null, cx: number, cy: number, r: number, alpha: number) {
  if (!bg) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  const sx = bg.width * 0.6, sw = bg.width * 0.4, sh = Math.min(bg.height, sw);
  ctx.drawImage(bg, sx, (bg.height - sh) / 2, sw, sh, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

function drawPhoto(ctx: CanvasRenderingContext2D, c: Card, cx: number, cy: number, R: number, ring: string, gap: string) {
  const rw = Math.max(6, R * 0.09), gw = rw * 0.45;
  ctx.fillStyle = ring; ctx.beginPath(); ctx.arc(cx, cy, R + rw, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = gap; ctx.beginPath(); ctx.arc(cx, cy, R + gw, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
  const im = c.photo;
  if (im) {
    const sc = Math.max(2 * R / im.width, 2 * R / im.height) * c.zoom;
    const iw = im.width * sc, ih = im.height * sc;
    const mx = Math.max(0, (iw - 2 * R) / 2), my = Math.max(0, (ih - 2 * R) / 2);
    const ox = Math.max(-mx, Math.min(mx, c.offX * R)), oy = Math.max(-my, Math.min(my, c.offY * R));
    ctx.drawImage(im, cx - iw / 2 + ox, cy - ih / 2 + oy, iw, ih);
  } else {
    ctx.fillStyle = '#FAFAF7'; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    if (c.imgs.icon) ctx.drawImage(c.imgs.icon, cx - R * 0.62, cy - R * 0.62, R * 1.24, R * 1.24);
  }
  ctx.restore();
}

function photoSquare(ctx: CanvasRenderingContext2D, c: Card, x: number, y: number, s: number, rad: number, frame: number): Circle {
  ctx.save(); ctx.shadowColor = 'rgba(20,32,43,0.10)'; ctx.shadowBlur = s * 0.1; ctx.shadowOffsetY = s * 0.03;
  ctx.fillStyle = '#FFFFFF'; rrect(ctx, x - frame, y - frame, s + 2 * frame, s + 2 * frame, rad + frame); ctx.fill(); ctx.restore();
  ctx.save(); rrect(ctx, x, y, s, s, rad); ctx.clip();
  const im = c.photo; const cx = x + s / 2, cy = y + s / 2;
  if (im) {
    const sc = Math.max(s / im.width, s / im.height) * c.zoom;
    const iw = im.width * sc, ih = im.height * sc;
    const lx = Math.max(0, (iw - s) / 2), ly = Math.max(0, (ih - s) / 2);
    ctx.drawImage(im, cx - iw / 2 + Math.max(-lx, Math.min(lx, c.offX * s / 2)), cy - ih / 2 + Math.max(-ly, Math.min(ly, c.offY * s / 2)), iw, ih);
  } else {
    ctx.fillStyle = '#F4F3EC'; ctx.fillRect(x, y, s, s);
    if (c.imgs.icon) { const k = s * 0.42; ctx.drawImage(c.imgs.icon, cx - k / 2, cy - k / 2, k, k); }
  }
  ctx.restore();
  return { cx, cy, R: s / 2 };
}

const roleLine = (c: Card) => (c.en ? `Contributing to ${c.roleEn.toLowerCase()}` : `أساهم في ${c.roleAr}`);
const cardUrl = (c: Card) => (c.github ? `github.com/${c.github}` : 'balsm.health/contributors');

// ── Templates ───────────────────────────────────────────────────────────────

function paintHalo(ctx: CanvasRenderingContext2D, W: number, H: number, c: Card): Circle {
  const { en, accent: acc, imgs } = c; const AF = en ? 'Montserrat' : 'Cairo', BF = en ? '"IBM Plex Sans"' : '"IBM Plex Sans Arabic"';
  const sq = W === H; const X = (x: number) => (en ? x : W - x);
  ctx.fillStyle = '#FAFAF7'; ctx.fillRect(0, 0, W, H);
  watercolorDisc(ctx, imgs.bg, X(-40), H + 40, sq ? 260 : 170, 0.45);
  const s = sq ? 360 : 290, pcx = X(sq ? 700 : 905), pcy = sq ? 320 : 262;
  watercolorDisc(ctx, imgs.bg, pcx + (en ? 1 : -1) * s * 0.2, pcy - s * 0.17, s * 0.74, 0.95);
  const circle = photoSquare(ctx, c, pcx - s / 2, pcy - s / 2, s, s * 0.14, sq ? 12 : 10);
  ctx.textBaseline = 'alphabetic'; ctx.direction = en ? 'ltr' : 'rtl'; ctx.textAlign = 'center';
  let ny = pcy + s / 2 + (sq ? 72 : 56);
  if (c.name) { fitFont(ctx, c.name, s + 80, sq ? 38 : 30, (k) => `700 ${k}px ${AF}`); ctx.fillStyle = '#1F2D3D'; ctx.fillText(c.name, pcx, ny); ny += sq ? 42 : 34; }
  ctx.font = `600 ${sq ? 23 : 19}px ${BF}`; ctx.fillStyle = acc.text; ctx.fillText(roleLine(c), pcx, ny);

  const pad = sq ? 84 : 72, xs = X(pad), colW = sq ? 912 : 560; ctx.textAlign = en ? 'left' : 'right';
  if (imgs.logo) { const lh = sq ? 64 : 52; const lw = imgs.logo.width * lh / imgs.logo.height; ctx.drawImage(imgs.logo, en ? xs : xs - lw, sq ? 80 : 56, lw, lh); }
  let y = sq ? 690 : 200;
  ctx.fillStyle = '#526174';
  if (en) { ctx.font = `600 ${sq ? 22 : 19}px Montserrat`; setSpacing(ctx, '4px'); ctx.fillText('I JOINED THE', xs, y); setSpacing(ctx, '0px'); }
  else { ctx.font = `700 ${sq ? 30 : 26}px Cairo`; ctx.fillText('انضممتُ إلى', xs, y); }
  ctx.fillStyle = '#14202B';
  const lines = en ? (sq ? ['Balsm community'] : ['Balsm', 'community']) : ['مجتمع بلسم'];
  const hs = en
    ? fitFont(ctx, sq ? 'Balsm community' : 'community', colW, sq ? 84 : 78, (k) => `800 ${k}px Montserrat`)
    : fitFont(ctx, 'مجتمع بلسم', colW, sq ? 96 : 88, (k) => `800 ${k}px Cairo`);
  lines.forEach((l, i) => { y += i ? hs * 1.0 : hs * (en ? 1.06 : 1.2); ctx.fillText(l, xs, y); });
  y += sq ? 34 : 30; petalBar(ctx, xs, y, sq ? 44 : 38, sq ? 9 : 8, 6, !en);
  y += sq ? 66 : 58; const ds = sq ? 27 : 22; ctx.font = `400 ${ds}px ${BF}`; ctx.fillStyle = '#384756';
  const desc = en ? 'Building open-source healthcare infrastructure for the Arab world, together.' : 'نبني معاً بنية تحتية صحية مفتوحة المصدر للعالم العربي.';
  wrap(ctx, desc, sq ? 560 : colW - 40).slice(0, 3).forEach((l, i) => { if (i) y += ds * 1.55; ctx.fillText(l, xs, y); });
  const fy = H - (sq ? 76 : 52);
  ctx.font = `600 ${sq ? 22 : 18}px ${BF}`; ctx.fillStyle = '#1F2D3D';
  ctx.fillText(en ? 'Community-driven. Independent. Trusted.' : 'مُجتمعي. مستقل. موثوق.', xs, fy - (sq ? 40 : 32));
  ctx.font = `500 ${sq ? 21 : 17}px "IBM Plex Mono"`; ctx.fillStyle = '#526174'; ctx.direction = 'ltr'; ctx.fillText(cardUrl(c), xs, fy);
  return circle;
}

function paintCredential(ctx: CanvasRenderingContext2D, W: number, H: number, c: Card): Circle {
  const { en, accent: acc, imgs } = c; const AF = en ? 'Montserrat' : 'Cairo', BF = en ? '"IBM Plex Sans"' : '"IBM Plex Sans Arabic"';
  const sq = W === H; const X = (x: number) => (en ? x : W - x);
  ctx.fillStyle = '#E6F6F3'; ctx.fillRect(0, 0, W, H);
  watercolorDisc(ctx, imgs.bg, X(W + 40), -60, sq ? 360 : 260, 0.55);
  const m = sq ? 64 : 40, cw = W - 2 * m, ch = H - 2 * m, rad = sq ? 30 : 24;
  ctx.save(); ctx.shadowColor = 'rgba(20,32,43,0.10)'; ctx.shadowBlur = 36; ctx.shadowOffsetY = 12; ctx.fillStyle = '#F4F3EC'; rrect(ctx, m, m, cw, ch, rad); ctx.fill(); ctx.restore();
  ctx.save(); rrect(ctx, m, m, cw, ch, rad); ctx.clip();
  if (imgs.icon) { const k = sq ? 620 : 470; ctx.globalAlpha = 0.08; ctx.drawImage(imgs.icon, en ? m + cw - k * 0.7 : m - k * 0.3, m + ch - k * 0.72, k, k); ctx.globalAlpha = 1; }
  strip(ctx, m, m + ch - (sq ? 12 : 10), cw, sq ? 12 : 10);
  ctx.restore();
  const ip = sq ? 60 : 48, xs = X(m + ip), xe = X(m + cw - ip);
  ctx.textBaseline = 'alphabetic';
  const hy = m + (sq ? 52 : 36), lh = sq ? 60 : 46;
  if (imgs.logo) { const lw = imgs.logo.width * lh / imgs.logo.height; ctx.drawImage(imgs.logo, en ? xs : xs - lw, hy, lw, lh); }
  ctx.direction = en ? 'ltr' : 'rtl'; ctx.textAlign = en ? 'right' : 'left'; ctx.fillStyle = acc.text;
  if (en) { ctx.font = `700 ${sq ? 17 : 14}px Montserrat`; setSpacing(ctx, '3px'); ctx.fillText('COMMUNITY MEMBER', xe, hy + lh / 2 + 6); setSpacing(ctx, '0px'); }
  else { ctx.font = `700 ${sq ? 24 : 20}px Cairo`; ctx.fillText('عضو في المجتمع', xe, hy + lh / 2 + 8); }
  const dy = hy + lh + (sq ? 40 : 26); ctx.fillStyle = '#DEDCCF'; ctx.fillRect(m + ip, dy, cw - 2 * ip, 2);

  const s = sq ? 300 : 236, py = dy + (sq ? 52 : 34), px = en ? m + ip : W - m - ip - s;
  const circle = photoSquare(ctx, c, px, py, s, s * 0.12, sq ? 8 : 7);
  const tx = X(m + ip + s + (sq ? 48 : 40)), tw = cw - 2 * ip - s - (sq ? 48 : 40);
  ctx.textAlign = en ? 'left' : 'right'; ctx.direction = en ? 'ltr' : 'rtl';
  let y = py + (sq ? 38 : 30);
  ctx.font = `700 ${sq ? 26 : 22}px ${AF}`; ctx.fillStyle = '#384756';
  ctx.fillText(en ? 'I joined the Balsm community' : 'انضممتُ إلى مجتمع بلسم', tx, y);
  const name = c.name || (en ? 'Your name' : 'اسمك');
  ctx.fillStyle = c.name ? '#14202B' : '#9AA5B1';
  const ns = fitFont(ctx, name, tw, sq ? 66 : 54, (k) => `800 ${k}px ${AF}`); y += ns * 1.25; ctx.fillText(name, tx, y);
  y += sq ? 50 : 42; ctx.font = `600 ${sq ? 27 : 23}px ${BF}`; ctx.fillStyle = acc.text; ctx.fillText(roleLine(c), tx, y);
  const d = new Date(); const dd = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
  y += sq ? 62 : 50; ctx.font = `500 ${sq ? 22 : 18}px ${BF}`; ctx.fillStyle = '#526174';
  const lab = en ? 'Member since ' : 'عضو منذ '; ctx.fillText(lab, tx, y);
  const lw2 = ctx.measureText(lab).width; ctx.font = `500 ${sq ? 22 : 18}px "IBM Plex Mono"`; ctx.fillStyle = '#1F2D3D'; ctx.direction = 'ltr';
  ctx.textAlign = en ? 'left' : 'right'; ctx.fillText(dd, en ? tx + lw2 : tx - lw2, y);
  if (c.github) { y += sq ? 38 : 30; ctx.fillStyle = '#526174'; ctx.fillText('github.com/' + c.github, tx, y); }

  const fy = m + ch - (sq ? 64 : 40);
  ctx.direction = 'rtl'; ctx.textAlign = en ? 'left' : 'right'; ctx.fillStyle = '#1F2D3D';
  ctx.font = `700 ${sq ? 40 : 26}px Cairo`;
  const slogan = 'رعايةٌ تمتد .. وأثرٌ يبقىٰ';
  if (en) { const w = ctx.measureText(slogan).width; ctx.textAlign = 'right'; ctx.fillText(slogan, xs + w, fy - (sq ? 44 : 0)); }
  else ctx.fillText(slogan, xs, fy - (sq ? 44 : 0));
  if (sq) { ctx.font = '500 22px "IBM Plex Sans"'; ctx.fillStyle = '#526174'; ctx.direction = 'ltr'; ctx.textAlign = en ? 'left' : 'right'; ctx.fillText('Care that reaches, impact that lasts', xs, fy); }
  ctx.direction = 'ltr'; ctx.textAlign = en ? 'right' : 'left'; ctx.font = `500 ${sq ? 21 : 17}px "IBM Plex Mono"`; ctx.fillStyle = '#526174';
  ctx.fillText(cardUrl(c), xe, fy);
  return circle;
}

/** Watercolor, ink, panel, centered and minimal share one layout engine. */
function paintClassic(ctx: CanvasRenderingContext2D, W: number, H: number, tpl: Template, c: Card): Circle {
  const { bg, logo, icon, logoW, iconW } = c.imgs; const acc = c.accent;
  const { en } = c; const sq = W === H;
  const AF = en ? 'Montserrat' : 'Cairo', BF = en ? '"IBM Plex Sans"' : '"IBM Plex Sans Arabic"';
  const dark = tpl === 'ink';
  const K = dark
    ? { ink: '#FFFFFF', ink2: '#EBEDF0', sub: '#DBDFE3', mut: '#B7C0C9', eye: acc.hex }
    : { ink: '#14202B', ink2: '#1F2D3D', sub: '#384756', mut: '#526174', eye: acc.text };
  ctx.fillStyle = tpl === 'minimal' ? '#F4F3EC' : dark ? '#14202B' : '#FAFAF7'; ctx.fillRect(0, 0, W, H);
  const pad = sq ? 80 : 72;
  let photo: { cx: number; cy: number; R: number; ring: string; gap: string };
  let col: { a: number; b: number; y: number };
  let center = false, logoY = sq ? 52 : 60, eyebrow = true;

  if (tpl === 'watercolor' || tpl === 'panel' || tpl === 'ink') {
    const panel = sq ? { x: 0, y: 0, w: W, h: 470 } : { x: en ? W - 460 : 0, y: 0, w: 460, h: H };
    if (tpl === 'watercolor' && bg) {
      ctx.save(); ctx.beginPath(); ctx.rect(panel.x, panel.y, panel.w, panel.h); ctx.clip(); cover(ctx, bg, panel.x, panel.y, panel.w, panel.h); ctx.restore();
      const g = sq ? ctx.createLinearGradient(0, panel.h - 160, 0, panel.h) : en ? ctx.createLinearGradient(panel.x + 160, 0, panel.x, 0) : ctx.createLinearGradient(panel.w - 160, 0, panel.w, 0);
      g.addColorStop(0, 'rgba(250,250,247,0)'); g.addColorStop(1, '#FAFAF7'); ctx.fillStyle = g; ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
    }
    if (tpl === 'panel') { ctx.fillStyle = acc.hex; ctx.fillRect(panel.x, panel.y, panel.w, panel.h); }
    const cx = sq ? W / 2 : panel.x + panel.w / 2 + (en ? 10 : -10), cy = sq ? 250 : H / 2, R = sq ? 170 : 150;
    if (tpl === 'ink' && iconW) { const s = sq ? 820 : 660; ctx.globalAlpha = 0.07; ctx.drawImage(iconW, cx - s / 2, cy - s / 2, s, s); ctx.globalAlpha = 1; }
    photo = { cx, cy, R, ring: tpl === 'panel' ? '#FFFFFF' : acc.hex, gap: tpl === 'panel' ? acc.hex : dark ? '#14202B' : '#FFFFFF' };
    col = sq ? { a: pad, b: W - pad, y: 570 } : en ? { a: pad, b: panel.x - 24, y: 210 } : { a: panel.w + 24, b: W - pad, y: 210 };
    if (dark) strip(ctx, 0, H - 8, W, 8);
  } else if (tpl === 'centered') {
    if (bg) { ctx.globalAlpha = 0.4; cover(ctx, bg, 0, 0, W, H); ctx.globalAlpha = 1; }
    center = true; logoY = sq ? 60 : 40;
    photo = { cx: W / 2, cy: sq ? 330 : 190, R: sq ? 150 : 88, ring: acc.hex, gap: '#FFFFFF' };
    col = { a: pad, b: W - pad, y: sq ? 560 : 300 }; eyebrow = sq;
    strip(ctx, 0, H - 8, W, 8);
  } else {
    strip(ctx, 0, 0, W, 10);
    if (icon) { const s = sq ? 680 : 540; ctx.globalAlpha = 0.1; ctx.drawImage(icon, en ? W - s * 0.62 : -s * 0.38, H - s * 0.72, s, s); ctx.globalAlpha = 1; }
    const R = sq ? 62 : 46;
    photo = { cx: en ? W - pad - R - 8 : pad + R + 8, cy: sq ? 112 : 92, R, ring: acc.hex, gap: '#F4F3EC' };
    col = { a: pad, b: W - pad, y: sq ? 340 : 240 };
  }

  const lg = dark ? logoW : logo;
  if (lg) {
    const lh = center && !sq ? 44 : sq ? 56 : 52; const lw = lg.width * (lh / lg.height);
    const lx = center ? (W - lw) / 2 : en ? col.a : col.b - lw;
    ctx.drawImage(lg, lx, logoY, lw, lh);
  }
  drawPhoto(ctx, c, photo.cx, photo.cy, photo.R, photo.ring, photo.gap);

  ctx.textBaseline = 'alphabetic';
  const maxW = col.b - col.a; const x = center ? W / 2 : en ? col.a : col.b; const endX = en ? col.b : col.a;
  const setDir = (d: CanvasDirection) => { ctx.direction = d; ctx.textAlign = center ? 'center' : d === 'rtl' ? 'right' : 'left'; };
  setDir(en ? 'ltr' : 'rtl');
  let y = col.y; const cw = center && !sq;
  if (eyebrow) {
    setSpacing(ctx, en ? '2.6px' : '0px');
    ctx.fillStyle = K.eye; ctx.font = en ? '700 16px Montserrat' : '700 22px Cairo';
    ctx.fillText(en ? 'BALSM COMMUNITY' : 'مجتمع بلسم', x, y);
    setSpacing(ctx, '0px');
    y += sq ? 82 : 76;
  } else y += 60;
  ctx.fillStyle = K.ink; ctx.font = en ? `800 ${cw ? 44 : sq ? 60 : 50}px Montserrat` : `800 ${cw ? 50 : sq ? 68 : 58}px Cairo`;
  const hl = wrap(ctx, en ? 'I joined the Balsm community' : 'انضممتُ إلى مجتمع بلسم', maxW).slice(0, 2);
  hl.forEach((l, k) => { if (k) y += sq ? 70 : 60; ctx.fillText(l, x, y); });
  if (c.name) {
    ctx.font = `700 ${cw ? 32 : sq ? 42 : 36}px ${AF}`; ctx.fillStyle = K.ink2;
    for (const l of wrap(ctx, c.name, maxW).slice(0, cw ? 1 : 2)) { y += cw ? 50 : sq ? 62 : 54; ctx.fillText(l, x, y); }
  }
  y += cw ? 42 : sq ? 52 : 46;
  ctx.font = `500 ${cw ? 23 : sq ? 28 : 25}px ${BF}`; ctx.fillStyle = K.sub;
  ctx.fillText(roleLine(c), x, y);

  const by = H - (sq ? 72 : 60) - (dark || center ? 4 : 0);
  ctx.font = `500 ${sq ? 22 : 20}px ${BF}`; ctx.fillStyle = K.sub;
  const tag = en ? 'Community-driven. Independent. Trusted. · Open source' : 'مُجتمعي. مستقل. موثوق. · مفتوح المصدر';
  const stacked = en || center;
  ctx.fillText(tag, x, by - (stacked ? (sq ? 40 : 36) : 0));
  ctx.font = `500 ${sq ? 22 : 19}px "IBM Plex Mono"`; ctx.fillStyle = K.mut;
  ctx.direction = 'ltr'; ctx.textAlign = center ? 'center' : 'left';
  if (stacked) ctx.fillText(cardUrl(c), x, by); else ctx.fillText(cardUrl(c), endX, by);
  return { cx: photo.cx, cy: photo.cy, R: photo.R };
}

function paint(ctx: CanvasRenderingContext2D, W: number, H: number, tpl: Template, c: Card): Circle {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  const circle = tpl === 'halo' ? paintHalo(ctx, W, H, c) : tpl === 'credential' ? paintCredential(ctx, W, H, c) : paintClassic(ctx, W, H, tpl, c);
  ctx.restore();
  return circle;
}

// ── Post text ───────────────────────────────────────────────────────────────

const FOLLOW = 'LinkedIn: linkedin.com/company/balsm.health\nFacebook: facebook.com/balsm.health\nInstagram: @balsm.health\nX: @balsm_health\nWhatsApp: whatsapp.com/channel/0029Vb7A39V3mFY3fXXLVi46';

function defaultPost(en: boolean, roleAr: string, roleEn: string, github: string, url: string) {
  const gh = github ? `github.com/${github}\n` : '';
  if (en) return `I joined the Balsm community to contribute to ${roleEn.toLowerCase()}.\nTogether we're building an open-source healthcare OS for the Arab world: community-driven, independent, trusted.\n${gh}Join us: ${url}\n\nFollow Balsm:\n${FOLLOW}\n\n#Balsm #OpenSource`;
  return `انضممتُ إلى مجتمع بلسم لأساهم في ${roleAr}.\nنبني معاً نظاماً صحياً مفتوح المصدر للعالم العربي: مُجتمعي. مستقل. موثوق.\n${gh}انضمّ إلينا: ${url}\n\nتابِع بلسم:\n${FOLLOW}\n\n#بلسم #Balsm #مفتوح_المصدر`;
}

// ── UI ──────────────────────────────────────────────────────────────────────

const label: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14, color: C.ink2 };
const hint: React.CSSProperties = { fontSize: 13, lineHeight: 1.6, color: C.ltTagText };
const field: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8 };
const group: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10 };
const shareLink: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '0 14px', borderRadius: 999, fontFamily: FONT.display, fontWeight: 600, fontSize: 13 };

// 44px, not the design's 40px: the site keeps a 44px minimum target.
const chip = (on: boolean): React.CSSProperties => ({
  minHeight: 44, padding: '0 16px', borderRadius: 999, cursor: 'pointer',
  fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14,
  border: `1.5px solid ${on ? C.violet : C.border}`,
  background: on ? '#F1ECFB' : C.white, color: on ? '#4E2FA3' : C.ink2,
});

const noSubscribe = () => () => {};
// Only where the browser can share a file: otherwise the button would post
// text without the card, which the share links already do.
const canShareFiles = () => typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare;

/** `shareUrl` is the Contributors page in this locale, the link every post carries. */
export default function ShareJoined({ shareUrl }: { shareUrl: string }) {
  const t = useTranslations('contributorsJoined');
  const en = useLocale() === 'en';

  const [name, setName] = useState('');
  const [role, setRole] = useState<RoleId>('code');
  const [github, setGithub] = useState('');
  const [tpl, setTpl] = useState<Template>('watercolor');
  const [accentId, setAccentId] = useState<AccentId>('violet');
  const [formatId, setFormatId] = useState<FormatId>('wide');
  const [photo, setPhoto] = useState<{ url: string; img: HTMLImageElement } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const [dragOver, setDragOver] = useState(false);
  const [postText, setPostText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [imgs, setImgs] = useState<Images | null>(null);
  const [thumbs, setThumbs] = useState<Partial<Record<Template, string>>>({});
  const nativeShare = useSyncExternalStore(noSubscribe, canShareFiles, () => false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const circleRef = useRef<Circle | null>(null);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number; k: number } | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const format = FORMATS.find((f) => f.id === formatId) ?? FORMATS[0];
  const accent = ACCENTS.find((a) => a.id === accentId) ?? ACCENTS[0];
  const roleEn = ROLES.find((r) => r.id === role)?.en ?? ROLES[0].en;
  const roleAr = t(`roles.${role}`);
  const gh = github.trim();
  const post = postText ?? defaultPost(en, roleAr, roleEn, gh, shareUrl);

  // Brand art and card fonts first, or the first paint uses fallbacks.
  useEffect(() => {
    let live = true;
    (async () => {
      const [bg, logo, icon, logoW, iconW] = await Promise.all([ASSET.watercolor, ASSET.logo, ASSET.icon, ASSET.logoWhite, ASSET.iconWhite].map(loadImage));
      try { await Promise.all(CARD_FONTS.map((f) => document.fonts.load(f))); } catch {}
      if (live) setImgs({ bg, logo, icon, logoW, iconW });
    })();
    return () => { live = false; };
  }, []);

  const card = useCallback((): Card | null => imgs && ({
    en, name: name.trim(), roleAr, roleEn, github: gh, accent,
    photo: photo?.img ?? null, zoom, offX: off.x, offY: off.y, imgs,
  }), [imgs, en, name, roleAr, roleEn, gh, accent, photo, zoom, off]);

  // The preview.
  useEffect(() => {
    const c = canvasRef.current; const data = card();
    if (!c || !data) return;
    if (c.width !== format.w) c.width = format.w;
    if (c.height !== format.h) c.height = format.h;
    const ctx = c.getContext('2d');
    if (ctx) circleRef.current = paint(ctx, format.w, format.h, tpl, data);
  }, [card, format, tpl]);

  // Template thumbnails, redrawn with the reader's own details after a pause.
  useEffect(() => {
    const data = card();
    if (!data) return;
    const timer = setTimeout(() => {
      const big = document.createElement('canvas'); big.width = format.w; big.height = format.h;
      const sm = document.createElement('canvas'); sm.width = 280; sm.height = Math.round(280 * format.h / format.w);
      const bctx = big.getContext('2d'), sctx = sm.getContext('2d');
      if (!bctx || !sctx) return;
      const next: Partial<Record<Template, string>> = {};
      for (const id of TEMPLATES) {
        paint(bctx, format.w, format.h, id, data);
        sctx.clearRect(0, 0, sm.width, sm.height);
        sctx.drawImage(big, 0, 0, sm.width, sm.height);
        next[id] = sm.toDataURL('image/jpeg', 0.82);
      }
      setThumbs(next);
    }, 220);
    return () => clearTimeout(timer);
  }, [card, format]);

  const loadFile = (f: File | undefined) => {
    if (!f || !/^image\//.test(f.type)) return;
    const rd = new FileReader();
    rd.onload = () => {
      const url = typeof rd.result === 'string' ? rd.result : '';
      const img = new Image();
      img.onload = () => { setPhoto({ url, img }); setZoom(1); setOff({ x: 0, y: 0 }); };
      img.src = url;
    };
    rd.readAsDataURL(f);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const circle = circleRef.current; const c = canvasRef.current;
    if (!photo || !circle || !c) return;
    const k = c.width / c.clientWidth; const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) * k, y = (e.clientY - r.top) * k;
    if (Math.hypot(x - circle.cx, y - circle.cy) > circle.R * 1.12) return;
    c.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, ox: off.x, oy: off.y, k };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const d = dragRef.current; const circle = circleRef.current;
    if (!d || !circle || !photo) return;
    const im = photo.img; const R = circle.R;
    const sc = Math.max(2 * R / im.width, 2 * R / im.height) * zoom;
    const mx = Math.max(0, (im.width * sc - 2 * R) / 2) / R, my = Math.max(0, (im.height * sc - 2 * R) / 2) / R;
    setOff({
      x: Math.max(-mx, Math.min(mx, d.ox + (e.clientX - d.x) * d.k / R)),
      y: Math.max(-my, Math.min(my, d.oy + (e.clientY - d.y) * d.k / R)),
    });
  };
  const onPointerUp = () => { dragRef.current = null; };

  const blob = () => new Promise<Blob | null>((r) => canvasRef.current ? canvasRef.current.toBlob(r, 'image/png') : r(null));
  const fileName = `balsm-joined${gh ? '-' + gh : ''}.png`;

  const download = async () => {
    const b = await blob();
    if (!b) return;
    const url = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const share = async () => {
    const b = await blob();
    if (!b) return;
    const data = { text: post, files: [new File([b], fileName, { type: 'image/png' })] };
    try {
      if (navigator.canShare(data)) await navigator.share(data);
      else await navigator.share({ text: post, url: shareUrl });
    } catch {}
  };

  const copyText = async () => {
    try { await navigator.clipboard.writeText(post); } catch {}
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  const enc = encodeURIComponent;
  const links = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/feed/?shareActive=true&text=${enc(post)}` },
    { label: 'X', href: `https://x.com/intent/post?text=${enc(post)}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${enc(post)}`, icon: true },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}` },
  ];
  const Arrow = en ? ArrowRight : ArrowLeft;
  const optional = <span style={{ fontWeight: 400, color: C.ltTagText }}>{t('optional')}</span>;

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vw,72px) clamp(20px,5vw,48px) clamp(56px,8vw,96px)', display: 'flex', flexDirection: 'column', gap: 'clamp(28px,4vw,44px)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 680 }}>
        <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14, color: C.violet }}>{t('eyebrow')}</span>
        <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(30px,4.4vw,48px)', lineHeight: 1.2, margin: 0, textWrap: 'pretty' }}>{t('title')}</h1>
        <p style={{ fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.8, color: C.ink2, margin: 0, textWrap: 'pretty' }}>{t('subtitle')}</p>
        <Link href="/contributors/frame" className="sj-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, alignSelf: 'flex-start', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14 }}>
          <span>{t('frameLink')}</span><Arrow style={{ width: 16, height: 16 }} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 'clamp(28px,4vw,48px)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 460, minWidth: 0 }}>
          <div role="group" aria-labelledby="sj-template" style={group}>
            <span id="sj-template" style={label}>{t('template')}</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(128px,1fr))', gap: 10 }}>
              {TEMPLATES.map((id) => {
                const on = tpl === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setTpl(id)}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '6px 6px 10px', borderRadius: 14, cursor: 'pointer', background: C.white, border: `2px solid ${on ? C.blue : C.borderHair}`, boxShadow: on ? '0 6px 18px rgba(18,131,255,.16)' : 'none', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color: on ? C.ink : C.ink2 }}
                  >
                    <span style={{ display: 'block', width: '100%', aspectRatio: formatId === 'square' ? '1 / 1' : '1200 / 630', borderRadius: 8, overflow: 'hidden', background: C.borderHair, backgroundImage: thumbs[id] ? `url("${thumbs[id]}")` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <span>{t(`templates.${id}`)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div role="group" aria-labelledby="sj-accent" style={group}>
            <span id="sj-accent" style={label}>{t('accent')}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {ACCENTS.map((a) => {
                const on = accentId === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={on}
                    aria-label={t(`accents.${a.id}`)}
                    title={t(`accents.${a.id}`)}
                    onClick={() => setAccentId(a.id)}
                    style={{ width: 44, height: 44, borderRadius: 999, cursor: 'pointer', background: a.hex, border: '3px solid #fff', boxShadow: on ? `0 0 0 2.5px ${a.hex}` : `0 0 0 1px ${C.border}` }}
                  />
                );
              })}
            </div>
          </div>

          <div style={field}>
            <label htmlFor="sj-name" style={label}>{t('name')}</label>
            <input id="sj-name" className="sj-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('namePlaceholder')} maxLength={40} autoComplete="name" style={{ height: 50, padding: '0 16px', borderRadius: 14, background: C.white, fontFamily: en ? FONT.body : FONT.arabic, fontSize: 16, color: C.ink }} />
          </div>

          <div role="group" aria-labelledby="sj-role" style={group}>
            <span id="sj-role" style={label}>{t('role')}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ROLES.map((r) => (
                <button key={r.id} type="button" aria-pressed={role === r.id} onClick={() => setRole(r.id)} style={chip(role === r.id)}>
                  {t(`roles.${r.id}`)}
                </button>
              ))}
            </div>
          </div>

          <div style={field}>
            <label htmlFor="sj-gh" style={label}>{t('github')} {optional}</label>
            <div dir="ltr" className="sj-input" style={{ display: 'flex', alignItems: 'center', height: 50, borderRadius: 14, background: C.white, overflow: 'hidden' }}>
              <span style={{ padding: '0 4px 0 16px', fontFamily: FONT.mono, fontSize: 15, color: C.ltTagText }}>github.com/</span>
              <input id="sj-gh" value={github} onChange={(e) => setGithub(e.target.value.replace(/[^A-Za-z0-9-]/g, ''))} placeholder="username" maxLength={39} autoComplete="off" spellCheck={false} style={{ flex: 1, minWidth: 0, height: '100%', border: 'none', outline: 'none', padding: '0 12px 0 0', fontFamily: FONT.mono, fontSize: 15, color: C.ink, background: 'transparent' }} />
            </div>
          </div>

          <div style={field}>
            <span id="sj-photo" style={label}>{t('photo')} {optional}</span>
            <button
              type="button"
              aria-labelledby="sj-photo sj-photo-action"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); loadFile(e.dataTransfer.files?.[0]); }}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderRadius: 14, cursor: 'pointer', textAlign: 'start', font: 'inherit', color: 'inherit', border: `1.5px dashed ${dragOver ? C.violet : '#C3CAD1'}`, background: dragOver ? '#F1ECFB' : C.white }}
            >
              <span style={{ width: 72, height: 72, flex: 'none', borderRadius: 999, padding: 3, background: C.violet }}>
                <span style={{ width: '100%', height: '100%', borderRadius: 999, border: '3px solid #fff', overflow: 'hidden', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {photo
                    ? <span style={{ display: 'block', width: '100%', height: '100%', backgroundImage: `url("${photo.url}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    // eslint-disable-next-line @next/next/no-img-element
                    : <img src={ASSET.icon} alt="" style={{ width: '60%', height: '60%', display: 'block' }} />}
                </span>
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <span id="sj-photo-action" style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color: C.ink }}>{photo ? t('photoChange') : t('photoAdd')}</span>
                <span style={{ fontSize: 13, lineHeight: 1.5, color: C.ltTagText }}>{t('photoDrop')}</span>
              </span>
            </button>
            {photo && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px', borderRadius: 14, background: C.white, border: `1px solid ${C.borderHair}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ZoomOut style={{ width: 18, height: 18, color: C.ltTagText, flex: 'none' }} />
                  <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} aria-label={t('zoom')} style={{ flex: 1, minWidth: 0, minHeight: 44, accentColor: C.violet }} />
                  <ZoomIn style={{ width: 18, height: 18, color: C.ltTagText, flex: 'none' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.ltTagText }}><Move style={{ width: 15, height: 15, flex: 'none' }} />{t('dragHint')}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button type="button" className="sj-ghost" onClick={() => { setZoom(1); setOff({ x: 0, y: 0 }); }} style={{ minHeight: 44, padding: '0 12px', border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: FONT.cairo, fontWeight: 600, fontSize: 13, color: C.ink2 }}>{t('reset')}</button>
                    <button type="button" className="sj-ghost sj-danger" onClick={() => { setPhoto(null); setZoom(1); setOff({ x: 0, y: 0 }); }} style={{ minHeight: 44, padding: '0 12px', border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: FONT.cairo, fontWeight: 600, fontSize: 13, color: C.danger }}>{t('remove')}</button>
                  </div>
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={(e) => { loadFile(e.target.files?.[0]); e.target.value = ''; }} style={{ display: 'none' }} />
            <span style={hint}>{t('privacy')}</span>
          </div>

          <div role="group" aria-labelledby="sj-size" style={group}>
            <span id="sj-size" style={label}>{t('size')}</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FORMATS.map((f) => (
                <button key={f.id} type="button" aria-pressed={formatId === f.id} onClick={() => setFormatId(f.id)} style={chip(formatId === f.id)}>
                  {t(`formats.${f.id}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 40px rgba(20,32,43,0.10)', background: C.white, alignSelf: 'center', width: '100%', maxWidth: formatId === 'square' ? 520 : '100%', aspectRatio: `${format.w} / ${format.h}` }}>
            <canvas
              ref={canvasRef}
              width={format.w}
              height={format.h}
              role="img"
              aria-label={t('preview')}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ display: 'block', width: '100%', height: 'auto', cursor: photo ? 'grab' : 'default', touchAction: photo ? 'none' : 'auto' }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <button type="button" className="sj-primary" onClick={download} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 22px', border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, boxShadow: '0 8px 20px rgba(18,131,255,.22)' }}>
              <Download style={{ width: 18, height: 18 }} /><span>{t('download')}</span>
            </button>
            {nativeShare && (
              <button type="button" className="sj-outline" onClick={share} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 22px', borderRadius: 999, border: `1.5px solid ${C.ink}`, cursor: 'pointer', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color: C.ink }}>
                <Share2 style={{ width: 18, height: 18 }} /><span>{t('share')}</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 20, borderRadius: 14, background: C.white, border: `1px solid ${C.borderHair}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <label htmlFor="sj-post" style={label}>{t('post')}</label>
              <button type="button" className="sj-copy" onClick={copyText} aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '0 14px', border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color: '#0B6FE0' }}>
                {copied ? <Check style={{ width: 15, height: 15 }} /> : <Copy style={{ width: 15, height: 15 }} />}
                <span>{copied ? t('copied') : t('copy')}</span>
              </button>
            </div>
            <textarea id="sj-post" value={post} onChange={(e) => setPostText(e.target.value)} rows={12} style={{ width: '100%', resize: 'vertical', border: 'none', outline: 'none', padding: 0, fontFamily: en ? FONT.body : FONT.arabic, fontSize: 15, lineHeight: 1.75, color: C.ink, background: 'transparent' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 6, borderTop: `1px solid ${C.borderHair}` }}>
              {links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="sj-share" style={shareLink}>
                  {l.icon && <MessageCircle style={{ width: 16, height: 16 }} />}
                  <span>{l.label}</span>
                </a>
              ))}
            </div>
            <span style={hint}>{t('postHint')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
