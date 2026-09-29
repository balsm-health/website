'use client';

import { useLocale, useTranslations } from 'next-intl';
import { C, FONT } from './theme';
import {
  Bell, PlusCircle, Clock, Flame, Stethoscope, MapPin, FolderHeart, ChevronRight,
  Activity, Droplet, ArrowUpRight, ArrowDownRight, Home as HomeIcon, Pill, User, Plus,
} from './CloudIcons';

/**
 * The care-recipient app's home screen, drawn in markup inside the Home page's
 * phone frame.
 *
 * Home.dc.html shows a raster capture here (assets/app-home-screen*.png, a
 * 390×787pt shot of the app prototype). This rebuilds that screen from the
 * prototype's own source in the design project — `_app/home.jsx` HomeScreen,
 * `_app/app.jsx` AppNav and `_app/app.css` — so the measurements, colours and
 * copy are the app's, not an eyeballed copy of the picture. It stays sharp at
 * any density and follows the locale without a second image.
 *
 * Laid out on the prototype's 390pt compact viewport and scaled to whatever
 * width the frame gives it via container-query units: `u(20)` is 20 app points.
 * Like the capture, the scroll view runs under the tab bar, so the "Latest
 * readings" row peeks in above it.
 */

const u = (n: number) => `calc(${n} * 100cqw / 390)`;

// The prototype's violet accent set (app.jsx ACCENTS.violet) — the app's own
// tint, not a site petal.
const ACCENT = '#8350DE';
const ACCENT_600 = '#6A3DBB';
const ACCENT_SHADOW = `0 ${u(8)} ${u(22)} rgba(131,80,222,.26)`;
// DS tokens the app reads that the site theme doesn't carry.
const INK_50 = '#F5F6F8';
const SUN_500 = '#E5B428';
const MINT_50 = '#E8F9EE';
const SHADOW_SM = `0 ${u(2)} ${u(6)} rgba(20,32,43,.06), 0 ${u(1)} ${u(2)} rgba(20,32,43,.04)`;
const SHADOW_XS = `0 ${u(1)} ${u(2)} rgba(20,32,43,.06)`;
const IN_RANGE = '#1F6A36';

export default function AppHomeScreen({ label }: { label: string }) {
  const t = useTranslations('home.app.screen');
  const locale = useLocale();
  const ar = locale === 'ar';
  // The prototype swaps every Latin face for Plex Arabic under RTL.
  const display = ar ? FONT.arabic : FONT.display;
  const body = ar ? FONT.arabic : FONT.body;
  const flip = ar ? 'scaleX(-1)' : undefined;

  const card: React.CSSProperties = {
    margin: `${u(14)} ${u(20)} 0`,
    background: C.white,
    border: `${u(1)} solid ${C.border}`,
    borderRadius: u(14),
    boxShadow: SHADOW_SM,
  };
  const shortcut: React.CSSProperties = { ...card, padding: `${u(13)} ${u(16)}`, display: 'flex', alignItems: 'center', gap: u(13) };
  const tile = (bg: string, color: string): React.CSSProperties => ({
    width: u(38), height: u(38), borderRadius: u(10), background: bg, color,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
  });
  const title: React.CSSProperties = { fontSize: u(16), fontWeight: 600, color: C.ink, lineHeight: 1.3 };
  const sub: React.CSSProperties = { fontSize: u(13), color: C.ltTagText, marginTop: u(1), lineHeight: 1.35 };
  const chevron: React.CSSProperties = { width: u(18), height: u(18), color: C.muted2, flex: 'none', transform: flip };

  // Streak ring: r 24, stroke 6, 6 of 7 days.
  const CIRC = 2 * Math.PI * 24;

  const shortcuts = [
    { Icon: Stethoscope, bg: MINT_50, color: C.mint, title: 'careTitle', sub: 'careSub' },
    { Icon: MapPin, bg: C.blueBg, color: C.blue, title: 'nearbyTitle', sub: 'nearbySub' },
    { Icon: FolderHeart, bg: C.violetBg, color: C.violet, title: 'recordsTitle', sub: 'recordsSub' },
  ] as const;

  const metrics = [
    { Icon: Activity, lab: 'bpLabel', val: '128/82', unit: 'bpUnit', foot: 'bpFoot', up: false },
    { Icon: Droplet, lab: 'gluLabel', val: '142', unit: 'gluUnit', foot: 'gluFoot', up: true },
  ] as const;

  const tabs = [
    { Icon: HomeIcon, key: 'tabHome', active: true },
    { Icon: MapPin, key: 'tabNearby', active: false },
    null,
    { Icon: Pill, key: 'tabMeds', active: false },
    { Icon: User, key: 'tabProfile', active: false },
  ] as const;

  return (
    // The phone is one picture to assistive tech: its alt text, not a stream
    // of sample UI read out of context.
    <div role="img" aria-label={label} style={{ width: '100%', height: '100%', containerType: 'inline-size' }}>
      <div aria-hidden style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.white, fontFamily: body, color: C.ink, overflow: 'hidden' }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* app bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: u(12), padding: `${u(22)} ${u(20)} ${u(12)}` }}>
            <span style={{ position: 'relative', width: u(44), height: u(44), borderRadius: '50%', background: C.aqua, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: u(16), flex: 'none' }}>
              {t('initials')}
              {/* multi-account dot — pinned bottom-right in both directions, as in the app */}
              <span style={{ position: 'absolute', bottom: u(-1), right: u(-1), width: u(14), height: u(14), borderRadius: '50%', background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: u(8), height: u(8), borderRadius: '50%', background: ACCENT }} />
              </span>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: u(12), color: C.ltTagText, lineHeight: 1.4 }}>{t('greeting')}</div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: u(21), letterSpacing: ar ? 0 : '-0.01em', lineHeight: 1.25 }}>{t('name')}</div>
            </div>
            <span style={{ width: u(44), height: u(44), borderRadius: '50%', background: INK_50, border: `${u(1)} solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink2, flex: 'none' }}>
              <Bell style={{ width: u(21), height: u(21) }} strokeWidth={1.75} />
            </span>
          </div>

          {/* hero check-in */}
          <div style={{ position: 'relative', overflow: 'hidden', margin: `0 ${u(20)}`, padding: u(22), borderRadius: u(20), background: ACCENT, color: C.white, boxShadow: ACCENT_SHADOW }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/balsm-logo-mono-white.svg" alt="" style={{ position: 'absolute', insetInlineEnd: u(-28), top: u(-28), width: u(150), height: u(150), objectFit: 'contain', opacity: 0.16, pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: u(13), fontWeight: 600, opacity: 0.9 }}>{t('checkinLabel')}</div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: u(26), letterSpacing: ar ? 0 : '-0.01em', lineHeight: 1.25, margin: `${u(2)} 0 ${u(14)}`, textWrap: 'balance' }}>{t('checkinQuestion')}</div>
              <div style={{ fontSize: u(12), opacity: 0.85, marginTop: u(2) }}>{t('checkinNote')}</div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: u(8), height: u(48), padding: `0 ${u(20)}`, borderRadius: u(10), background: C.white, color: ACCENT_600, fontWeight: 700, fontSize: u(16), whiteSpace: 'nowrap' }}>
                <PlusCircle style={{ width: u(20), height: u(20) }} />{t('checkinCta')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: u(6), marginTop: u(12), fontSize: u(13), opacity: 0.9 }}>
                <Clock style={{ width: u(15), height: u(15) }} />{t('checkinTime')}
              </div>
            </div>
          </div>

          {/* streak */}
          <div style={{ ...card, padding: u(16), display: 'flex', alignItems: 'center', gap: u(14) }}>
            <span style={{ position: 'relative', width: u(56), height: u(56), flex: 'none' }}>
              <svg viewBox="0 0 56 56" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="28" cy="28" r="24" fill="none" stroke={C.borderHair} strokeWidth="6" />
                <circle cx="28" cy="28" r="24" fill="none" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - 6 / 7)} />
              </svg>
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.display, fontWeight: 800, fontSize: u(16) }}>6</span>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: display, fontWeight: 600, fontSize: u(16), lineHeight: 1.3 }}>{t('streakTitle')}</div>
              <div style={{ fontSize: u(12), color: C.ltTagText, marginTop: u(2), lineHeight: 1.4 }}>{t('streakHelp')}</div>
            </div>
            <Flame style={{ width: u(24), height: u(24), color: SUN_500, flex: 'none' }} />
          </div>

          {/* shortcuts: care team, nearby care, health records */}
          {shortcuts.map((s) => (
            <div key={s.title} style={shortcut}>
              <span style={tile(s.bg, s.color)}><s.Icon style={{ width: u(19), height: u(19) }} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={title}>{t(s.title)}</div>
                <div style={sub}>{t(s.sub)}</div>
              </div>
              <ChevronRight style={chevron} />
            </div>
          ))}

          {/* latest readings — scrolls under the tab bar */}
          <div style={{ padding: `0 ${u(20)}`, margin: `${u(24)} 0 ${u(12)}`, fontFamily: display, fontWeight: 700, fontSize: u(18), whiteSpace: 'nowrap' }}>{t('latest')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: u(12), padding: `0 ${u(20)}` }}>
            {metrics.map((m) => (
              <div key={m.lab} style={{ background: C.white, border: `${u(1)} solid ${C.border}`, borderRadius: u(14), padding: `${u(14)} ${u(16)}`, boxShadow: SHADOW_XS }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: u(7), fontSize: u(12), fontWeight: 600, color: C.ltTagText }}>
                  <m.Icon style={{ width: u(15), height: u(15) }} />{t(m.lab)}
                </div>
                <div dir="ltr" style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: u(26), lineHeight: 1.1, marginTop: u(8), letterSpacing: '-0.01em', textAlign: ar ? 'right' : undefined }}>
                  {m.val}<span style={{ fontFamily: body, fontSize: u(13), fontWeight: 600, color: C.ltTagText, marginInline: u(4) }}>{t(m.unit)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: u(6), marginTop: u(8), fontSize: u(12), color: m.up ? C.danger : IN_RANGE }}>
                  {m.up
                    ? <ArrowUpRight style={{ width: u(14), height: u(14) }} />
                    : <ArrowDownRight style={{ width: u(14), height: u(14) }} />}
                  {t(m.foot)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* tab bar with the centre check-in button */}
        <div style={{ flex: 'none', display: 'flex', alignItems: 'stretch', borderTop: `${u(1)} solid ${C.border}`, background: C.white, paddingBottom: u(13) }}>
          {tabs.map((tab, i) =>
            tab === null ? (
              <span key={i} style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: `${u(10)} ${u(4)} ${u(6)}` }}>
                <span style={{ width: u(58), height: u(58), marginTop: u(-32), borderRadius: '50%', background: ACCENT, border: `${u(4)} solid ${C.white}`, boxShadow: ACCENT_SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, flex: 'none' }}>
                  <Plus style={{ width: u(26), height: u(26) }} strokeWidth={2.4} />
                </span>
              </span>
            ) : (
              <span key={tab.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: u(3), padding: `${u(10)} ${u(4)} ${u(6)}`, color: tab.active ? ACCENT : C.muted2, fontFamily: body, fontWeight: 600, fontSize: u(11) }}>
                <tab.Icon style={{ width: u(24), height: u(24) }} strokeWidth={tab.active ? 2.1 : 1.9} />
                {t(tab.key)}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
