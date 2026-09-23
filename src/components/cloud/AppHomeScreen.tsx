'use client';

import { useLocale, useTranslations } from 'next-intl';
import { C, FONT } from './theme';
import {
  Bell, PlusCircle, Clock, Flame, MapPin, FolderHeart, ChevronRight,
  Home as HomeIcon, Pill, User, Plus,
} from './CloudIcons';

/**
 * The care-recipient app's home screen, drawn in markup inside the Home page's
 * phone frame.
 *
 * Home.dc.html shows a raster capture here (assets/app-home-screen*.png). This
 * reproduces that capture — and the app's own home screen, balsm_app
 * feature/mvp `app/screenshots/04_home.png` — as live markup instead: it stays
 * sharp at any density, follows the locale without a second image, and the
 * copy is the app's own (its `home`, `map`, `records` and `tab_*` strings).
 *
 * Everything is laid out on a 375-unit-wide phone and scaled to whatever width
 * the frame gives it, via container-query units — `u(16)` is 16 phone points.
 * Colours are sampled from the app capture; the check-in purple is the app's,
 * not a site petal.
 */

const u = (n: number) => `calc(${n} * 100cqw / 375)`;

const APP_PURPLE = '#8350DE';
const APP_PURPLE_INK = '#6A3CC4';
const APP_PURPLE_BG = '#EEE7FB';
const BELL_BG = '#F5F6F8';
const GREET = '#8893A0';

export default function AppHomeScreen({ label }: { label: string }) {
  const t = useTranslations('home.app.screen');
  const locale = useLocale();
  const ar = locale === 'ar';
  const display = ar ? FONT.cairo : FONT.display;
  const body = ar ? FONT.arabic : FONT.body;

  const card: React.CSSProperties = {
    margin: `0 ${u(16)}`,
    background: C.white,
    border: `${u(1.5)} solid ${C.border}`,
    borderRadius: u(18),
    padding: `${u(14)} ${u(16)}`,
    display: 'flex',
    alignItems: 'center',
    gap: u(14),
  };
  const cardTitle: React.CSSProperties = { fontFamily: display, fontWeight: 700, fontSize: u(17), lineHeight: 1.25, color: C.ink };
  const cardSub: React.CSSProperties = { fontFamily: body, fontSize: u(13), lineHeight: 1.35, color: C.ltTagText, marginTop: u(3) };
  const tile = (bg: string, color: string): React.CSSProperties => ({
    width: u(40), height: u(40), borderRadius: u(11), background: bg, color,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
  });
  const chevron: React.CSSProperties = {
    width: u(17), height: u(17), color: C.muted2, flex: 'none', marginInlineStart: 'auto',
    transform: ar ? 'scaleX(-1)' : undefined,
  };

  // 6 of the last 7 days: the ring runs clockwise from 12 o'clock and stops
  // one-seventh short, which is the gap the capture shows at the top-left.
  const R = 22;
  const CIRC = 2 * Math.PI * R;

  const tabs = [
    { Icon: HomeIcon, key: 'tabHome', active: true },
    { Icon: MapPin, key: 'tabNearby' },
    null,
    { Icon: Pill, key: 'tabMeds' },
    { Icon: User, key: 'tabProfile' },
  ] as const;

  return (
    // The phone is one picture to assistive tech: its alt text, not twenty
    // fragments of sample UI read out of context.
    <div role="img" aria-label={label} style={{ width: '100%', height: '100%', containerType: 'inline-size' }}>
      <div aria-hidden style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.white, fontFamily: body, color: C.ink, overflow: 'hidden' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: u(12), padding: `${u(18)} ${u(18)} 0` }}>
          <span style={{ position: 'relative', width: u(44), height: u(44), borderRadius: '50%', background: C.aqua, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: u(15), flex: 'none' }}>
            {t('initials')}
            <span style={{ position: 'absolute', insetInlineEnd: u(-1), bottom: u(-1), width: u(11), height: u(11), borderRadius: '50%', background: APP_PURPLE, border: `${u(2)} solid ${C.white}` }} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: u(13), color: GREET, lineHeight: 1.3 }}>{t('greeting')}</div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: u(22), lineHeight: 1.2 }}>{t('name')}</div>
          </div>
          <span style={{ width: u(44), height: u(44), borderRadius: '50%', background: BELL_BG, border: `${u(1)} solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink2, flex: 'none' }}>
            <Bell style={{ width: u(20), height: u(20) }} />
          </span>
        </div>

        {/* today's check-in */}
        <div style={{ position: 'relative', overflow: 'hidden', margin: `${u(14)} ${u(16)} 0`, padding: u(22), borderRadius: u(22), background: APP_PURPLE, color: C.white, boxShadow: `0 ${u(10)} ${u(24)} rgba(131,80,222,.18)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/balsm-logo-mono-white.svg" alt="" style={{ position: 'absolute', insetInlineEnd: u(-26), top: u(-18), width: u(150), height: u(150), opacity: 0.16, pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: display, fontWeight: 600, fontSize: u(13), opacity: 0.92 }}>{t('checkinLabel')}</div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: u(25), lineHeight: 1.18, margin: `${u(6)} 0 ${u(10)}` }}>{t('checkinQuestion')}</div>
            <div style={{ fontSize: u(12), opacity: 0.85, lineHeight: 1.4 }}>{t('checkinNote')}</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: u(8), marginTop: u(10), padding: `${u(12)} ${u(20)}`, borderRadius: u(14), background: C.white, color: APP_PURPLE_INK, fontFamily: display, fontWeight: 700, fontSize: u(15.5) }}>
              <PlusCircle style={{ width: u(19), height: u(19) }} />{t('checkinCta')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: u(7), marginTop: u(12), fontSize: u(13), opacity: 0.9 }}>
              <Clock style={{ width: u(16), height: u(16) }} />{t('checkinTime')}
            </div>
          </div>
        </div>

        {/* streak */}
        <div style={{ ...card, marginTop: u(14) }}>
          <span style={{ position: 'relative', width: u(52), height: u(52), flex: 'none' }}>
            <svg viewBox="0 0 52 52" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="26" cy="26" r={R} fill="none" stroke={C.borderHair} strokeWidth="5" />
              <circle cx="26" cy="26" r={R} fill="none" stroke={APP_PURPLE} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(CIRC * 6) / 7} ${CIRC}`} />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: u(18) }}>6</span>
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={cardTitle}>{t('streakTitle')}</div>
            <div style={cardSub}>{t('streakHelp')}</div>
          </div>
          <Flame style={{ width: u(22), height: u(22), color: C.amber, flex: 'none' }} />
        </div>

        {/* nearby care */}
        <div style={{ ...card, marginTop: u(12) }}>
          <span style={tile(C.blueBg, C.blue)}><MapPin style={{ width: u(20), height: u(20) }} /></span>
          <div style={{ minWidth: 0 }}>
            <div style={cardTitle}>{t('nearbyTitle')}</div>
            <div style={cardSub}>{t('nearbySub')}</div>
          </div>
          <ChevronRight style={chevron} />
        </div>

        {/* health records */}
        <div style={{ ...card, marginTop: u(12) }}>
          <span style={tile(APP_PURPLE_BG, APP_PURPLE)}><FolderHeart style={{ width: u(20), height: u(20) }} /></span>
          <div style={{ minWidth: 0 }}>
            <div style={cardTitle}>{t('recordsTitle')}</div>
            <div style={cardSub}>{t('recordsSub')}</div>
          </div>
          <ChevronRight style={chevron} />
        </div>

        {/* tab bar with the raised add button */}
        <div style={{ marginTop: 'auto', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: `${u(10)} ${u(8)} ${u(14)}`, borderTop: `${u(1)} solid ${C.border}`, background: C.white }}>
          {tabs.map((tab, i) =>
            tab === null ? (
              <span key={i} style={{ width: u(60), height: u(40), position: 'relative', flex: 'none' }}>
                <span style={{ position: 'absolute', left: '50%', top: u(-36), transform: 'translateX(-50%)', width: u(58), height: u(58), borderRadius: '50%', background: APP_PURPLE, border: `${u(5)} solid ${C.white}`, boxShadow: `0 ${u(8)} ${u(18)} rgba(131,80,222,.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, boxSizing: 'content-box' }}>
                  <Plus style={{ width: u(26), height: u(26) }} />
                </span>
              </span>
            ) : (
              <span key={tab.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: u(4), color: 'active' in tab ? APP_PURPLE : C.muted2, fontFamily: display, fontWeight: 600, fontSize: u(11.5), minWidth: u(56) }}>
                <tab.Icon style={{ width: u(24), height: u(24) }} />
                {t(tab.key)}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
