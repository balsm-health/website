'use client';

import { useLocale } from 'next-intl';
import { C, FONT } from './theme';

/**
 * The care-recipient app's home screen in an iPhone frame, shown on Home and
 * Download.
 *
 * Matches Home.dc.html: a capture of the app (402×874pt at 2×, so the screen
 * keeps the real iPhone 393:852 shape) with the status bar, Dynamic Island and
 * home indicator drawn on top. The capture leaves those bands empty so the
 * overlay sits in the app's own safe areas. There is one capture per locale
 * (public/app/home-{ar,en}.webp). When the app's home screen changes, replace
 * both files.
 */
const SCREEN = { ar: '/app/home-ar.webp', en: '/app/home-en.webp' } as const;

export default function AppPhone({ label, lazy = false }: { label: string; lazy?: boolean }) {
  const locale = useLocale();
  const src = locale === 'ar' ? SCREEN.ar : SCREEN.en;

  return (
    <div style={{ width: 'min(280px,74vw)', borderRadius: 44, background: C.ink, padding: 11, boxShadow: '0 30px 70px rgba(20,32,43,.22)', boxSizing: 'border-box', animation: 'balsm-float 6s ease-in-out infinite' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '393 / 852', borderRadius: 34, background: '#FFFFFF', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label}
          width={804}
          height={1748}
          loading={lazy ? 'lazy' : undefined}
          decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
        />
        {/* Status bar. It follows the page direction, so 9:41 sits on the right in Arabic, as on a real phone. */}
        <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px 0 26px', boxSizing: 'border-box', zIndex: 2, pointerEvents: 'none' }}>
          <span dir="ltr" style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 12, color: C.ink, letterSpacing: '-0.01em' }}>9:41</span>
          <span dir="ltr" style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.ink }}>
            <svg viewBox="0 0 18 12" style={{ width: 15, height: 10 }}><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" /><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" /><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" /></svg>
            <svg viewBox="0 0 16 12" style={{ width: 13, height: 10 }}><path d="M8 11.5l2.4-2.9a3.6 3.6 0 0 0-4.8 0z M8 4.6c1.6 0 3.1.6 4.2 1.6l1.5-1.8A8.6 8.6 0 0 0 8 2.2a8.6 8.6 0 0 0-5.7 2.2l1.5 1.8A6.3 6.3 0 0 1 8 4.6z" fill="currentColor" /></svg>
            <svg viewBox="0 0 27 13" style={{ width: 21, height: 10 }}><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" strokeOpacity=".4" /><rect x="2.5" y="2.5" width="18" height="8" rx="2" fill="currentColor" /><path d="M24.5 4.5v4a2 2 0 0 0 0-4z" fill="currentColor" fillOpacity=".45" /></svg>
          </span>
        </div>
        {/* Dynamic Island */}
        <div aria-hidden style={{ position: 'absolute', top: 7, left: '50%', transform: 'translateX(-50%)', width: '31%', height: 24, borderRadius: 999, background: '#0B1218', zIndex: 3, pointerEvents: 'none' }} />
        {/* Home indicator */}
        <div aria-hidden style={{ position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)', width: '35%', height: 4, borderRadius: 999, background: C.ink, zIndex: 2, pointerEvents: 'none' }} />
      </div>
    </div>
  );
}
