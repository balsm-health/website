'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { C, FONT } from './theme';
import AppHomeScreen from './AppHomeScreen';
import BetaSignup from './BetaSignup';
import Reveal from './Reveal';
import { Apple, AppGallery, ArrowRight, Download, Globe, Play } from './CloudIcons';
import {
  APK_RELEASE_PAGE,
  primaryChannel,
  type Channel,
  type ChannelUrls,
  type Platform,
} from '@/lib/appDistribution';

const container: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
// Download.dc.html sets this kicker at 13px in an emerald; emeraldDark is the
// nearest palette member and the darker of the two.
const eyebrow: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color: C.emeraldDark };
const h2: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(22px,2.6vw,28px)', color: C.ink, margin: 0 };
const card: React.CSSProperties = { flex: '1 1 220px', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', minHeight: 64, borderRadius: 14 };
const chip: React.CSSProperties = { padding: '4px 10px', borderRadius: 999, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12, flex: 'none' };
const note: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: 0, maxWidth: 560 };
const noteLink: React.CSSProperties = { color: C.blueDark, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 };

const ICONS: Record<Channel, { Icon: typeof Apple }> = {
  appStore: { Icon: Apple },
  play: { Icon: Play },
  appGallery: { Icon: AppGallery },
  apk: { Icon: Download },
  web: { Icon: Globe },
};

function ChannelIcon({ channel }: { channel: Channel }) {
  const { Icon } = ICONS[channel];
  return <Icon style={{ width: 26, height: 26, flex: 'none' }} />;
}

const ORDER: Channel[] = ['appStore', 'play', 'appGallery', 'apk', 'web'];
const STORES: Channel[] = ['appStore', 'play', 'appGallery'];

/**
 * The store this device installs from, to tag with "for your device" even while
 * it is still a coming-soon card. A live primary channel takes precedence.
 */
const MINE: Partial<Record<Platform, Channel>> = {
  ios: 'appStore',
  android: 'play',
  huawei: 'appGallery',
  harmony: 'appGallery',
};

/** Store names are Latin brand marks in both locales; the rest are translated. */
const isStore = (c: Channel) => STORES.includes(c);

/**
 * iPadOS 13+ Safari sends a desktop Mac User-Agent, so the server — and the
 * middleware redirect — see a computer. Touch support is the tell.
 */
function isIPadDesktopUA() {
  return /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
}
const noSubscribe = () => () => {};

export default function DownloadSections({
  platform: serverPlatform,
  urls,
  choose,
}: {
  platform: Platform;
  urls: ChannelUrls;
  choose: boolean;
}) {
  const t = useTranslations('download');
  const home = useTranslations('home');
  const locale = useLocale();
  // False during SSR and hydration, then the real answer — no mismatch.
  const iPad = useSyncExternalStore(noSubscribe, isIPadDesktopUA, () => false);
  const platform: Platform = serverPlatform === 'desktop' && iPad ? 'ios' : serverPlatform;

  useEffect(() => {
    // Do what middleware would have done for an iPhone.
    if (iPad && serverPlatform === 'desktop' && urls.appStore && !choose) window.location.replace(urls.appStore);
  }, [iPad, serverPlatform, urls.appStore, choose]);

  // A crawler gets the desktop view: it is the one that lists every option.
  const view = platform === 'bot' ? 'desktop' : platform;
  const primary = primaryChannel(view, urls);
  const mine = primary ?? MINE[view];
  const live = ORDER.filter((c) => urls[c]);
  const pending = STORES.filter((c) => !urls[c]);
  const arrowFlip = locale === 'ar' ? 'rotate(180deg)' : 'none';
  // Nothing installable on this device yet, so the hero collects emails for
  // early access instead of offering a button that leads nowhere.
  const beta = !primary;

  const name = (c: Channel, size: number) => (
    <span
      dir={isStore(c) ? 'ltr' : undefined}
      style={{
        display: 'block',
        fontSize: size,
        fontWeight: 700,
        fontFamily: isStore(c) ? FONT.display : FONT.cairo,
        // A Latin mark in its own LTR box still lines up with the RTL kicker.
        textAlign: locale === 'ar' ? 'right' : 'left',
      }}
    >
      {t(`channels.${c}.name`)}
    </span>
  );

  const apkNote = (
    <p style={note}>
      {t('apkNote')}{' '}
      <a href={APK_RELEASE_PAGE} style={noteLink}>{t('apkVerify')}</a>
    </p>
  );

  return (
    <>
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(44px,7vw,84px) 0 clamp(48px,7vw,88px)', background: 'linear-gradient(180deg,#E3F7F3 0%, #FAFAF7 100%)' }}>
        <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', left: -100, top: -80, width: 320, opacity: 0.1, animation: 'balsm-spin 80s linear infinite', pointerEvents: 'none' }} />
        <div style={{ ...container, position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(380px,100%),1fr))', gap: 'clamp(36px,6vw,72px)', alignItems: 'center' }}>
          <Reveal style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
              <span style={eyebrow}>{t('eyebrow')}</span>
              {beta && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: C.amberBg, color: '#7A5A0F', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12.5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: '#E5B428' }} />
                  {t('beta.badge')}
                </span>
              )}
            </div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', lineHeight: 1.2, color: C.ink, margin: 0, textWrap: 'pretty' }}>
              {t(beta ? 'beta.title' : 'title')}
            </h1>
            <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', lineHeight: 1.8, color: C.ink2, margin: 0, maxWidth: 540, textWrap: 'pretty' }}>
              {t(beta ? 'beta.subtitle' : 'subtitle')}
            </p>

            {beta ? (
              <BetaSignup />
            ) : (
              // Same tab for every option: on a phone a new tab strands the
              // user, and the store apps intercept their own URLs regardless.
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, marginTop: 4 }}>
                <div style={{ fontFamily: FONT.cairo, fontWeight: 600, fontSize: 14, color: C.ink2 }}>{t(`for.${view}`)}</div>
                <a
                  href={urls[primary]}
                  data-channel={primary}
                  className="dl-store"
                  // White on the blue petal is 3.67:1, under AA for the 12px
                  // kicker, so the primary action wears ink like the store badges.
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 14, minHeight: 64, padding: '12px 24px', borderRadius: 16, boxShadow: '0 12px 28px rgba(20,32,43,.18)' }}
                >
                  <ChannelIcon channel={primary} />
                  <span style={{ lineHeight: 1.15 }}>
                    <span style={{ display: 'block', fontSize: 12, color: '#B7C0C9', fontFamily: FONT.cairo, textAlign: 'start' }}>{t(`channels.${primary}.kicker`)}</span>
                    {name(primary, 20)}
                  </span>
                  <ArrowRight style={{ width: 20, height: 20, marginInlineStart: 6, transform: arrowFlip, flex: 'none' }} />
                </a>
                {primary === 'apk' && apkNote}
                {primary === 'web' && (
                  <p style={note}>
                    {t('webNote')}
                    {pending.length > 0 && <> {t('storesPending')}</>}
                  </p>
                )}
              </div>
            )}
          </Reveal>

          {/* Phone mockup — the app's home screen, drawn in markup (see AppHomeScreen). */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 'min(280px,72vw)', aspectRatio: '280 / 560', borderRadius: 42, background: C.ink, padding: 11, boxShadow: '0 30px 70px rgba(20,32,43,.22)', boxSizing: 'border-box' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: 32, background: C.bg, overflow: 'hidden', position: 'relative' }}>
                <AppHomeScreen label={home('app.screenAlt')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(40px,6vw,72px) 0 clamp(56px,8vw,96px)' }}>
        <div style={{ ...container, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'clamp(32px,5vw,56px)' }}>
          {live.length > 0 && (
            <Reveal style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={h2}>{t('beta.availableNow')}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {live.map((c) => (
                  <a key={c} href={urls[c]} data-channel={c} className="dl-store" style={{ ...card, boxShadow: '0 8px 20px rgba(20,32,43,.14)' }}>
                    <ChannelIcon channel={c} />
                    <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{ fontSize: 12, color: '#B7C0C9' }}>{t(`channels.${c}.kicker`)}</span>
                      {name(c, 18)}
                    </span>
                    {c === mine && <span style={{ ...chip, background: C.emerald, color: '#06302A' }}>{t('forDevice')}</span>}
                  </a>
                ))}
              </div>
              {live.includes('apk') && primary !== 'apk' && apkNote}
            </Reveal>
          )}
          {pending.length > 0 && (
            <Reveal style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={h2}>{t('beta.launching')}</h2>
              {/* Not links: there is nowhere to send anyone yet. */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {pending.map((c) => (
                  <div key={c} aria-disabled="true" style={{ ...card, background: C.white, border: '1.5px dashed #C3CAD1', color: C.ink2 }}>
                    <ChannelIcon channel={c} />
                    <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{ fontSize: 12, color: C.ltTagText }}>{t('soon')}</span>
                      {name(c, 18)}
                    </span>
                    {c === mine && <span style={{ ...chip, background: C.ltTagBg, color: C.ink2 }}>{t('forDevice')}</span>}
                  </div>
                ))}
              </div>
            </Reveal>
          )}
          {view === 'desktop' && (
            <p style={{ ...note, gridColumn: '1 / -1', maxWidth: 'none' }}>{t('phoneHint')}</p>
          )}
        </div>
      </section>
    </>
  );
}
