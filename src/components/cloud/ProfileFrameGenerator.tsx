'use client';

import { useCallback, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { C, FONT } from './theme';
import { Download, ImagePlus } from './CloudIcons';

const BLANK_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const PREVIEW = 340;
const FRAME_BOX = 318;
/** Browser canvas ceiling. Only used when the photo is larger than this. */
const MAX_EXPORT = 8192;
const ASSET = {
  icon: '/frame/icon.svg',
  wordmark: '/frame/wordmark.svg',
  lockup: '/frame/logo-horizontal-mono-white.svg',
  watercolor: '/frame/balsm-background.png',
} as const;

const RING_COLORS = [
  { name: 'Violet', hex: '#724DD0' },
  { name: 'Blue', hex: '#1283FF' },
  { name: 'Aqua', hex: '#02BBB5' },
  { name: 'Mint', hex: '#55D77F' },
  { name: 'Navy', hex: '#1F2D3D' },
] as const;

const FRAME_STYLE_IDS = [
  'plate', 'campaign', 'dual', 'watercolor',
  'lockup', 'roleplate', 'creamplate', 'chord',
] as const;
type FrameStyle = (typeof FRAME_STYLE_IDS)[number];

const CAMPAIGNS = [
  { id: 'hiring', hue: '#1283FF', fill: '#0F6BCC', label: '#FFFFFF', rule: 'rgba(255,255,255,.55)', ar: 'نوظّف', en: 'Hiring' },
  { id: 'identity', hue: '#02BBB5', fill: '#029E99', label: '#FFFFFF', rule: 'rgba(255,255,255,.55)', ar: 'مفتوح. عربي. موثوق.', en: '' },
  { id: 'contributor', hue: '#724DD0', fill: '#5C3AB0', label: '#FFFFFF', rule: 'rgba(255,255,255,.55)', ar: 'مساهم', en: 'Contributor' },
  { id: 'community', hue: '#55D77F', fill: '#3FC366', label: '#1F2D3D', rule: 'rgba(31,45,61,.35)', ar: 'مُجتمع بلسم', en: '' },
  { id: 'cta', hue: '#01C4A2', fill: '#019A7F', label: '#1F2D3D', rule: 'rgba(31,45,61,.35)', ar: 'بلسم', en: 'balsm.health' },
] as const;
type CampaignId = (typeof CAMPAIGNS)[number]['id'];

const PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', file: 'balsm-linkedin-profile-frame.png' },
  { id: 'facebook', name: 'Facebook', file: 'balsm-facebook-profile-frame.png' },
  { id: 'x', name: 'X', file: 'balsm-x-profile-frame.png' },
  { id: 'instagram', name: 'Instagram', file: 'balsm-instagram-profile-frame.png' },
] as const;
type PlatformId = (typeof PLATFORMS)[number]['id'];

const FIXED_RING: Partial<Record<FrameStyle, string>> = {
  dual: '#02BBB5',
  lockup: '#26B5C7',
  roleplate: '#2E6DE6',
  creamplate: '#5A36C8',
};

const DARK_PLATE: FrameStyle[] = ['lockup', 'roleplate', 'chord'];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Square export so the photo is drawn 1:1 at zoom 1 — never forced down to 1024. */
function exportSize(naturalW: number, naturalH: number): number {
  if (!naturalW || !naturalH) return PREVIEW;
  const cover = Math.max(FRAME_BOX / naturalW, FRAME_BOX / naturalH);
  return Math.max(1, Math.min(MAX_EXPORT, Math.round(PREVIEW / cover)));
}

function makeExportCanvas(size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; size: number } | null {
  for (const s of [size, Math.min(size, 4096), 2048, PREVIEW]) {
    const canvas = document.createElement('canvas');
    canvas.width = s;
    canvas.height = s;
    const ctx = canvas.getContext('2d');
    if (ctx && canvas.width === s && canvas.height === s) return { canvas, ctx, size: s };
  }
  return null;
}

function photoInset(style: FrameStyle): React.CSSProperties {
  if (style === 'chord') return { left: 0, top: 0, width: PREVIEW, height: PREVIEW };
  if (style === 'watercolor') return { left: 26, top: 26, width: 288, height: 288 };
  if (style === 'dual') return { left: 22, top: 22, width: 296, height: 296 };
  return { left: 11, top: 11, width: FRAME_BOX, height: FRAME_BOX };
}

export default function ProfileFrameGenerator() {
  const t = useTranslations('contributorsFrame');
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; offX: number; offY: number } | null>(null);

  const [imgUrl, setImgUrl] = useState(BLANK_PIXEL);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offX, setOffX] = useState(0);
  const [offY, setOffY] = useState(0);
  const [ringColor, setRingColor] = useState('#724DD0');
  const [dragging, setDragging] = useState(false);
  const [platform, setPlatform] = useState<PlatformId>('linkedin');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('plate');
  const [campaign, setCampaign] = useState<CampaignId>('identity');

  const hasImage = imgUrl !== BLANK_PIXEL;
  const activeCampaign = CAMPAIGNS.find((c) => c.id === campaign) ?? CAMPAIGNS[1];
  const previewRing = frameStyle === 'campaign' ? activeCampaign.hue : (FIXED_RING[frameStyle] ?? ringColor);
  const activePlatform = PLATFORMS.find((p) => p.id === platform) ?? PLATFORMS[0];
  const showRingColor = !['campaign', 'dual', 'watercolor', 'chord', 'lockup', 'roleplate', 'creamplate'].includes(frameStyle);

  const baseScale = (!naturalW || !naturalH) ? 1 : Math.max(FRAME_BOX / naturalW, FRAME_BOX / naturalH);
  const scale = baseScale * zoom;
  const photoW = (naturalW || 1) * scale;
  const photoH = (naturalH || 1) * scale;

  const openPicker = () => fileRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const img = new Image();
      img.onload = () => {
        setImgUrl(result);
        setNaturalW(img.naturalWidth);
        setNaturalH(img.naturalHeight);
        setZoom(1);
        setOffX(0);
        setOffY(0);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasImage) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, offX, offY };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setOffX(drag.offX + (e.clientX - drag.startX));
    setOffY(drag.offY + (e.clientY - drag.startY));
  };
  const onPointerUp = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const onDownload = useCallback(async () => {
    if (!hasImage) return;
    await document.fonts.ready;
    const camp = CAMPAIGNS.find((c) => c.id === campaign) ?? CAMPAIGNS[1];
    const ring = frameStyle === 'campaign' ? camp.hue : ringColor;
    const allocated = makeExportCanvas(exportSize(naturalW, naturalH));
    if (!allocated) return;
    const { canvas, ctx, size: SIZE } = allocated;
    const RATIO = SIZE / PREVIEW;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const cx = SIZE / 2;
    const cy = SIZE / 2;

    const ringPx = (
      frameStyle === 'chord' ? 0
      : frameStyle === 'lockup' || frameStyle === 'roleplate' || frameStyle === 'creamplate' ? 13
      : frameStyle === 'watercolor' ? 26
      : frameStyle === 'dual' ? 11
      : 11
    ) * RATIO;

    if (frameStyle === 'watercolor') {
      const wc = await loadImage(ASSET.watercolor);
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, SIZE / 2, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(wc, 0, 0, SIZE, SIZE);
      ctx.restore();
    } else if (frameStyle === 'dual') {
      ctx.fillStyle = '#02BBB5';
      ctx.beginPath(); ctx.arc(cx, cy, SIZE / 2, 0, Math.PI * 2); ctx.fill();
      const r2 = SIZE / 2 - 11 * RATIO;
      ctx.fillStyle = '#F5F6F8';
      ctx.beginPath(); ctx.arc(cx, cy, r2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#724DD0';
      ctx.lineWidth = 7 * RATIO;
      ctx.beginPath(); ctx.arc(cx, cy, r2 - 3.5 * RATIO, 0, Math.PI * 2); ctx.stroke();
    } else if (frameStyle !== 'chord') {
      ctx.fillStyle = ring;
      ctx.beginPath(); ctx.arc(cx, cy, SIZE / 2, 0, Math.PI * 2); ctx.fill();
    }

    const whiteR = frameStyle === 'chord' ? SIZE / 2
      : frameStyle === 'watercolor' ? SIZE / 2 - 26 * RATIO
      : frameStyle === 'dual' ? SIZE / 2 - 22 * RATIO
      : SIZE / 2 - ringPx;
    if (frameStyle !== 'chord') {
      ctx.fillStyle = '#DBDFE3';
      ctx.beginPath(); ctx.arc(cx, cy, whiteR, 0, Math.PI * 2); ctx.fill();
    }
    const photoR = frameStyle === 'chord' ? whiteR : whiteR - 4 * RATIO;

    const photo = await loadImage(imgUrl);
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, photoR, 0, Math.PI * 2); ctx.clip();
    const base = Math.max((FRAME_BOX * RATIO) / (naturalW || 1), (FRAME_BOX * RATIO) / (naturalH || 1));
    const drawScale = base * zoom;
    const w = naturalW * drawScale;
    const h = naturalH * drawScale;
    ctx.drawImage(photo, cx + offX * RATIO - w / 2, cy + offY * RATIO - h / 2, w, h);
    ctx.restore();
    if (frameStyle !== 'chord') {
      ctx.strokeStyle = frameStyle === 'watercolor' ? 'rgba(255,255,255,.94)' : '#FFFFFF';
      ctx.lineWidth = (frameStyle === 'watercolor' ? 5 : 4) * RATIO;
      ctx.beginPath(); ctx.arc(cx, cy, whiteR - 2 * RATIO, 0, Math.PI * 2); ctx.stroke();
    }

    if (frameStyle === 'chord') {
      const bandH = 96 * RATIO;
      ctx.fillStyle = '#1F2D3D';
      ctx.fillRect(0, SIZE - bandH, SIZE, bandH);
      const lockup = await loadImage(ASSET.lockup);
      const lockH = 30 * RATIO;
      const lockW = lockH * (86 / 30);
      const gap = 14 * RATIO;
      ctx.font = `700 ${Math.round(19 * RATIO)}px "IBM Plex Sans Arabic", sans-serif`;
      const labelText = 'مجتمع بلسم';
      const labelW = ctx.measureText(labelText).width;
      const totalW = lockW + gap + 1 * RATIO + gap + labelW;
      let cxRow = cx - totalW / 2;
      const midY = SIZE - bandH / 2 - 11 * RATIO;
      ctx.drawImage(lockup, cxRow, midY - lockH / 2, lockW, lockH);
      cxRow += lockW + gap;
      ctx.fillStyle = 'rgba(255,255,255,.32)';
      ctx.fillRect(cxRow, midY - 13 * RATIO, 1 * RATIO, 26 * RATIO);
      cxRow += 1 * RATIO + gap;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, cxRow, midY);
      ctx.strokeStyle = '#0F9D8A';
      ctx.lineWidth = 6 * RATIO;
      ctx.beginPath(); ctx.arc(cx, cy, SIZE / 2 - 3 * RATIO, 0, Math.PI * 2); ctx.stroke();
    }

    if (frameStyle === 'plate') {
      const icon = await loadImage(ASSET.icon);
      const wordmark = await loadImage(ASSET.wordmark);
      const pIconW = 38 * RATIO;
      const pGap = 13 * RATIO;
      const pWmW = 94 * RATIO;
      const pWmH = 42 * RATIO;
      const padX = 18 * RATIO;
      const padY = 6 * RATIO;
      const plateW = padX * 2 + pIconW + pGap + pWmW;
      const plateH = padY * 2 + Math.max(pIconW, pWmH);
      const plateX = cx - plateW / 2;
      const plateY = SIZE - 34 * RATIO - plateH;
      ctx.save();
      ctx.shadowColor = 'rgba(20,32,43,.35)';
      ctx.shadowBlur = 14 * RATIO;
      ctx.shadowOffsetY = 4 * RATIO;
      ctx.fillStyle = '#F4F3EC';
      roundRect(ctx, plateX, plateY, plateW, plateH, 20 * RATIO);
      ctx.fill();
      ctx.restore();
      ctx.drawImage(icon, plateX + padX, plateY + (plateH - pIconW) / 2, pIconW, pIconW);
      ctx.drawImage(wordmark, plateX + padX + pIconW + pGap, plateY + (plateH - pWmH) / 2, pWmW, pWmH);
    } else if (frameStyle === 'campaign') {
      const label = camp.ar + (camp.en ? `  ${camp.en}` : '');
      ctx.font = `700 ${Math.round(20 * RATIO)}px "IBM Plex Sans Arabic", "IBM Plex Sans", sans-serif`;
      const textW = ctx.measureText(label).width;
      const padX = 20 * RATIO;
      const padY = 10 * RATIO;
      const pillW = textW + padX * 2;
      const pillH = 20 * RATIO * 1.4 + padY;
      const pillX = cx - pillW / 2;
      const pillY = SIZE - 34 * RATIO - pillH;
      ctx.save();
      ctx.shadowColor = 'rgba(20,32,43,.28)';
      ctx.shadowBlur = 14 * RATIO;
      ctx.fillStyle = camp.fill;
      roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = camp.label;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, cx, pillY + pillH / 2 + 1 * RATIO);
      ctx.textAlign = 'left';
      const icon = await loadImage(ASSET.icon);
      const markR = 17 * RATIO;
      const markCy = 19 * RATIO + markR;
      ctx.save();
      ctx.shadowColor = 'rgba(20,32,43,.14)';
      ctx.shadowBlur = 10 * RATIO;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(cx, markCy, markR, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      const markIconSize = 22 * RATIO;
      ctx.drawImage(icon, cx - markIconSize / 2, markCy - markIconSize / 2, markIconSize, markIconSize);
    } else if (frameStyle === 'dual') {
      const icon = await loadImage(ASSET.icon);
      const mR = 37 * RATIO;
      const mCy = SIZE - 18 * RATIO - mR;
      ctx.save();
      ctx.shadowColor = 'rgba(20,32,43,.16)';
      ctx.shadowBlur = 12 * RATIO;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(cx, mCy, mR, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      const s = 48 * RATIO;
      ctx.drawImage(icon, cx - s / 2, mCy - s / 2, s, s);
    } else if (frameStyle === 'watercolor') {
      ctx.font = `700 ${Math.round(16 * RATIO)}px "IBM Plex Sans Arabic", sans-serif`;
      const label = 'مفتوح. عربي. موثوق.';
      const textW = ctx.measureText(label).width;
      const padX = 16 * RATIO;
      const pillW = textW + padX * 2;
      const pillH = 34 * RATIO;
      const pillX = cx - pillW / 2;
      const pillY = SIZE - 20 * RATIO - pillH;
      ctx.save();
      ctx.shadowColor = 'rgba(20,32,43,.16)';
      ctx.shadowBlur = 10 * RATIO;
      ctx.fillStyle = '#F4F3EC';
      roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = '#1F2D3D';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, cx, pillY + pillH / 2 + 1 * RATIO);
      ctx.textAlign = 'left';
    } else if (frameStyle === 'lockup') {
      const lockup = await loadImage(ASSET.lockup);
      const lockH = 30 * RATIO;
      const lockW = lockH * (86 / 30);
      const padX = 22 * RATIO;
      const padY = 11 * RATIO;
      const pillW = lockW + padX * 2;
      const pillH = lockH + padY * 2;
      const pillX = cx - pillW / 2;
      const pillY = SIZE - 30 * RATIO - pillH;
      ctx.save();
      ctx.shadowColor = 'rgba(20,32,43,.24)';
      ctx.shadowBlur = 14 * RATIO;
      ctx.fillStyle = '#1F2D3D';
      roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fill();
      ctx.restore();
      ctx.drawImage(lockup, pillX + padX, pillY + padY, lockW, lockH);
    } else if (frameStyle === 'roleplate') {
      const icon = await loadImage(ASSET.icon);
      ctx.font = `700 ${Math.round(21 * RATIO)}px "IBM Plex Sans Arabic", sans-serif`;
      const ar = 'نوظّف';
      const arW = ctx.measureText(ar).width;
      ctx.font = `700 ${Math.round(12 * RATIO)}px "Cairo", sans-serif`;
      const enW = ctx.measureText('balsm.health').width;
      const colW = Math.max(arW, enW);
      const iconS = 34 * RATIO;
      const gap1 = 12 * RATIO;
      const padX = 20 * RATIO;
      const pillW = padX * 2 + iconS + gap1 + 1 * RATIO + 12 * RATIO + colW;
      const pillH = 46 * RATIO;
      const pillX = cx - pillW / 2;
      const pillY = SIZE - 46 * RATIO - pillH;
      ctx.save();
      ctx.shadowColor = 'rgba(20,32,43,.24)';
      ctx.shadowBlur = 14 * RATIO;
      ctx.fillStyle = '#1F2D3D';
      roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fill();
      ctx.restore();
      ctx.drawImage(icon, pillX + padX, pillY + (pillH - iconS) / 2, iconS, iconS);
      const ruleX = pillX + padX + iconS + gap1;
      ctx.fillStyle = 'rgba(255,255,255,.28)';
      ctx.fillRect(ruleX, pillY + (pillH - iconS) / 2, 1 * RATIO, iconS);
      const textX = pillX + pillW - padX;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `700 ${Math.round(21 * RATIO)}px "IBM Plex Sans Arabic", sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(ar, textX, pillY + pillH / 2 - 2 * RATIO);
      ctx.fillStyle = '#E2F8F6';
      ctx.font = `700 ${Math.round(12 * RATIO)}px "Cairo", sans-serif`;
      ctx.fillText('balsm.health', textX, pillY + pillH / 2 + 15 * RATIO);
      ctx.textAlign = 'left';
    } else if (frameStyle === 'creamplate') {
      const icon = await loadImage(ASSET.icon);
      const wordmark = await loadImage(ASSET.wordmark);
      ctx.font = `700 ${Math.round(19 * RATIO)}px "IBM Plex Sans Arabic", sans-serif`;
      const label = 'مُساهم';
      const labelW = ctx.measureText(label).width;
      const iconS = 32 * RATIO;
      const wmW = 80 * RATIO;
      const wmH = 36 * RATIO;
      const gap = 10 * RATIO;
      const padX = 16 * RATIO;
      const padY = 9 * RATIO;
      const pillW = padX * 2 + iconS + gap + wmW + gap + 1 * RATIO + gap + labelW;
      const pillH = wmH + padY * 2;
      const pillX = cx - pillW / 2;
      const pillY = SIZE - 48 * RATIO - pillH;
      ctx.save();
      ctx.shadowColor = 'rgba(20,32,43,.18)';
      ctx.shadowBlur = 14 * RATIO;
      ctx.fillStyle = '#F4F3EC';
      roundRect(ctx, pillX, pillY, pillW, pillH, 18 * RATIO);
      ctx.fill();
      ctx.restore();
      let px = pillX + padX;
      ctx.drawImage(icon, px, pillY + (pillH - iconS) / 2, iconS, iconS);
      px += iconS + gap;
      ctx.drawImage(wordmark, px, pillY + (pillH - wmH) / 2, wmW, wmH);
      px += wmW + gap;
      ctx.fillStyle = '#DBDFE3';
      ctx.fillRect(px, pillY + (pillH - 30 * RATIO) / 2, 1 * RATIO, 30 * RATIO);
      px += 1 * RATIO + gap;
      ctx.fillStyle = '#1F2D3D';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, px, pillY + pillH / 2 + 1 * RATIO);
    }

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activePlatform.file;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }, [hasImage, campaign, frameStyle, ringColor, imgUrl, naturalW, naturalH, zoom, offX, offY, activePlatform.file]);

  const inset = photoInset(frameStyle);
  const photoShadow = frameStyle === 'chord' ? 'none'
    : frameStyle === 'watercolor' ? '0 0 0 5px rgba(255,255,255,.94)'
    : 'inset 0 0 0 4px #FFFFFF';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36, maxWidth: 1080, margin: '0 auto', padding: '56px 24px 96px', fontFamily: FONT.arabic }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 640 }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 13, lineHeight: 1.4, color: C.ltTagText, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {t('eyebrow')}
        </div>
        <h1 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 30, lineHeight: 1.2, color: '#1F2D3D', letterSpacing: '-0.01em', margin: 0, textWrap: 'balance' }}>
          {t('title')}
        </h1>
        <p style={{ fontWeight: 400, fontSize: 16, lineHeight: 1.6, color: C.ink2, margin: 0 }}>
          {t('subtitle', { platform: activePlatform.name })}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} role="group" aria-label={t('platform')}>
        {PLATFORMS.map((p) => {
          const on = platform === p.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              onClick={() => setPlatform(p.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 44, padding: '9px 16px', borderRadius: 999,
                border: `1.5px solid ${on ? C.ink : C.border}`,
                background: on ? C.ink : C.white,
                color: on ? '#fff' : C.ink2,
                fontFamily: FONT.arabic, fontWeight: 600, fontSize: 13.5, cursor: 'pointer',
              }}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: PREVIEW, height: PREVIEW }}>
            {frameStyle === 'watercolor' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ASSET.watercolor} alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: PREVIEW, height: PREVIEW, objectFit: 'cover', borderRadius: '50%' }} />
            )}
            {frameStyle !== 'chord' && frameStyle !== 'watercolor' && (
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `${frameStyle === 'dual' ? 11 : 11}px solid ${previewRing}`, boxSizing: 'border-box', pointerEvents: 'none' }} />
            )}
            {frameStyle === 'dual' && (
              <div style={{ position: 'absolute', inset: 11, borderRadius: '50%', border: '7px solid #724DD0', pointerEvents: 'none' }} />
            )}
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onClick={!hasImage ? openPicker : undefined}
              style={{
                position: 'absolute',
                ...inset,
                borderRadius: '50%',
                overflow: 'hidden',
                background: C.border,
                boxShadow: photoShadow,
                cursor: hasImage ? (dragging ? 'grabbing' : 'grab') : 'pointer',
                touchAction: 'none',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt=""
                draggable={false}
                style={{
                  position: 'absolute',
                  left: 159 + offX,
                  top: 159 + offY,
                  width: photoW,
                  height: photoH,
                  transform: 'translate(-50%, -50%)',
                  maxWidth: 'none',
                  userSelect: 'none',
                  visibility: hasImage ? 'visible' : 'hidden',
                }}
              />
              {!hasImage && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.ink2, textAlign: 'center', padding: 20 }}>
                  <ImagePlus style={{ width: 30, height: 30 }} />
                  <div style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.3 }}>{t('uploadEmpty')}</div>
                </div>
              )}
            </div>

            {frameStyle === 'plate' && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 18px', borderRadius: 10, background: '#F4F3EC', boxShadow: '0 4px 14px rgba(20,32,43,.18)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ASSET.icon} alt="" style={{ width: 38, height: 38, flex: 'none' }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ASSET.wordmark} alt="Balsm.health" style={{ height: 42, width: 94 }} />
                </div>
              </div>
            )}
            {frameStyle === 'campaign' && (
              <>
                <div style={{ position: 'absolute', left: '50%', top: 19, transform: 'translateX(-50%)', width: 34, height: 34, borderRadius: '50%', background: '#fff', boxShadow: '0 4px 10px rgba(20,32,43,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ASSET.icon} alt="" style={{ width: 22, height: 22 }} />
                </div>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 20px 10px', borderRadius: 999, background: activeCampaign.fill, boxShadow: '0 4px 14px rgba(20,32,43,.18), 0 0 0 4px rgba(255,255,255,.92)', maxWidth: 260 }}>
                    <span style={{ fontFamily: FONT.arabic, fontWeight: 700, fontSize: 16, lineHeight: 1.15, color: activeCampaign.label, whiteSpace: 'nowrap' }}>{activeCampaign.ar}</span>
                    {activeCampaign.en ? (
                      <>
                        <span style={{ width: 1, height: 15, background: activeCampaign.rule }} />
                        <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 15, lineHeight: 1.15, color: activeCampaign.label, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>{activeCampaign.en}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </>
            )}
            {frameStyle === 'dual' && (
              <div style={{ position: 'absolute', left: '50%', bottom: 18, transform: 'translateX(-50%)', width: 74, height: 74, borderRadius: '50%', background: '#fff', boxShadow: '0 4px 12px rgba(20,32,43,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ASSET.icon} alt="" style={{ width: 48, height: 48 }} />
              </div>
            )}
            {frameStyle === 'watercolor' && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ padding: '8px 16px', borderRadius: 999, background: '#F4F3EC', boxShadow: '0 4px 10px rgba(20,32,43,.16)', fontFamily: FONT.arabic, fontWeight: 700, fontSize: 16, color: '#1F2D3D' }}>
                  مفتوح. عربي. موثوق.
                </div>
              </div>
            )}
            {frameStyle === 'lockup' && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ padding: '11px 22px', borderRadius: 999, background: '#1F2D3D', boxShadow: '0 4px 14px rgba(20,32,43,.24)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ASSET.lockup} alt="Balsm.health" style={{ height: 30, width: 86 }} />
                </div>
              </div>
            )}
            {frameStyle === 'roleplate' && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 46, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 20px', borderRadius: 999, background: '#1F2D3D', boxShadow: '0 4px 14px rgba(20,32,43,.24)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ASSET.icon} alt="" style={{ width: 34, height: 34 }} />
                  <span style={{ width: 1, height: 34, background: 'rgba(255,255,255,.28)' }} />
                  <div style={{ textAlign: 'end' }}>
                    <div style={{ fontFamily: FONT.arabic, fontWeight: 700, fontSize: 21, color: '#fff', lineHeight: 1.1 }}>نوظّف</div>
                    <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12, color: '#E2F8F6' }}>balsm.health</div>
                  </div>
                </div>
              </div>
            )}
            {frameStyle === 'creamplate' && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 48, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', borderRadius: 18, background: '#F4F3EC', boxShadow: '0 4px 14px rgba(20,32,43,.18)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ASSET.icon} alt="" style={{ width: 32, height: 32 }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ASSET.wordmark} alt="" style={{ height: 36, width: 80 }} />
                  <span style={{ width: 1, height: 30, background: C.border }} />
                  <span style={{ fontFamily: FONT.arabic, fontWeight: 700, fontSize: 19, color: '#1F2D3D' }}>مُساهم</span>
                </div>
              </div>
            )}
            {frameStyle === 'chord' && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 96, background: '#1F2D3D', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, pointerEvents: 'none', borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ASSET.lockup} alt="" style={{ height: 30, width: 86 }} />
                <span style={{ width: 1, height: 26, background: 'rgba(255,255,255,.32)' }} />
                <span style={{ fontFamily: FONT.arabic, fontWeight: 700, fontSize: 19, color: '#fff' }}>مجتمع بلسم</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onFileChange} style={{ display: 'none' }} />
          <button type="button" onClick={openPicker} style={{ fontFamily: FONT.arabic, fontWeight: 600, fontSize: 13, lineHeight: 1.4, color: C.blue, background: 'none', border: 'none', cursor: 'pointer', minHeight: 44, padding: '10px 8px' }}>
            {hasImage ? t('replace') : t('upload')}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, paddingTop: 8, minWidth: 260, flex: '1 1 0%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: FONT.arabic, fontWeight: 600, fontSize: 13, lineHeight: 1.4, color: '#1F2D3D' }}>{t('zoom')}</div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              disabled={!hasImage}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              aria-label={t('zoom')}
              style={{ width: '100%', accentColor: C.blue, minHeight: 44 }}
            />
            <div style={{ fontFamily: FONT.arabic, fontSize: 12, lineHeight: 1.4, color: C.muted }}>{t('zoomHint')}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: FONT.arabic, fontWeight: 600, fontSize: 13, lineHeight: 1.4, color: '#1F2D3D' }}>{t('style')}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {FRAME_STYLE_IDS.map((id) => {
                const active = frameStyle === id;
                const swatchHue = FIXED_RING[id] ?? ringColor;
                const isWatercolor = id === 'watercolor';
                const isDark = DARK_PLATE.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFrameStyle(id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      width: 64, minHeight: 74, padding: '8px 4px 9px', borderRadius: 12,
                      border: `1.5px solid ${active ? C.ink : C.border}`,
                      background: active ? '#EEF0F3' : C.white, cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', flex: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxSizing: 'border-box', overflow: 'hidden',
                      border: `4px solid ${isWatercolor ? 'transparent' : swatchHue}`,
                      background: isDark ? '#1F2D3D' : C.border,
                    }}>
                      {isWatercolor ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ASSET.watercolor} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ASSET.icon} alt="" style={{ width: '60%', height: '60%', filter: isDark ? 'brightness(0) invert(1)' : undefined }} />
                      )}
                    </div>
                    <span style={{ fontFamily: FONT.arabic, fontWeight: 600, fontSize: 10.5, lineHeight: 1.2, color: active ? C.ink : C.ltTagText, textAlign: 'center' }}>
                      {t(`styles.${id}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {showRingColor && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontFamily: FONT.arabic, fontWeight: 600, fontSize: 13, lineHeight: 1.4, color: '#1F2D3D' }}>{t('ringColor')}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {RING_COLORS.map((c) => {
                  const on = ringColor === c.hex;
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      title={t(`colors.${c.name}`)}
                      aria-label={t(`colors.${c.name}`)}
                      aria-pressed={on}
                      onClick={() => setRingColor(c.hex)}
                      style={{
                        width: 44, height: 44, borderRadius: '50%', padding: 0,
                        border: 'none', background: 'transparent', cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: '50%', display: 'block',
                        background: c.hex,
                        border: `2px solid ${on ? C.ink : '#fff'}`,
                        boxShadow: `0 0 0 1px ${C.border}`,
                      }} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {frameStyle === 'campaign' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontFamily: FONT.arabic, fontWeight: 600, fontSize: 13, lineHeight: 1.4, color: '#1F2D3D' }}>{t('campaign')}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {CAMPAIGNS.map((c) => {
                  const on = campaign === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      title={c.ar}
                      aria-label={c.ar}
                      aria-pressed={on}
                      onClick={() => setCampaign(c.id)}
                      style={{
                        width: 44, height: 44, borderRadius: '50%', padding: 0,
                        border: 'none', background: 'transparent', cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <span style={{
                        width: 26, height: 26, borderRadius: '50%', display: 'block',
                        background: c.hue,
                        border: `2px solid ${on ? C.ink : '#fff'}`,
                        boxShadow: `0 0 0 1px ${C.border}`,
                      }} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={!hasImage}
            onClick={() => { void onDownload(); }}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              padding: '14px 26px', borderRadius: 999, border: 'none', minHeight: 48,
              background: hasImage ? C.blue : C.grayDot, color: '#fff',
              fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15,
              cursor: hasImage ? 'pointer' : 'not-allowed',
              boxShadow: hasImage ? '0 8px 22px rgba(18,131,255,.28)' : 'none',
            }}
          >
            <Download style={{ width: 18, height: 18 }} />
            {t('download', { platform: activePlatform.name })}
          </button>

          <div style={{ padding: '16px 18px', borderRadius: 12, background: C.borderHair }}>
            <p style={{ fontFamily: FONT.arabic, fontSize: 13, lineHeight: 1.6, color: C.ink2, margin: 0 }}>{t('privacy')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
