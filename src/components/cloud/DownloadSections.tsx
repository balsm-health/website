'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { C, FONT } from './theme';
import { Apple, AppGallery, ArrowRight, Download, Globe, Play } from './CloudIcons';
import {
  APK_RELEASE_PAGE,
  primaryChannel,
  type Channel,
  type ChannelUrls,
  type Platform,
} from '@/lib/appDistribution';

const container: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
// 19px bold is WCAG large text, same as every other page's kicker.
const eyebrow: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color: C.blueDark, textAlign: 'start' };

const ICONS: Record<Channel, { Icon: typeof Apple; size: number }> = {
  appStore: { Icon: Apple, size: 24 },
  play: { Icon: Play, size: 22 },
  appGallery: { Icon: AppGallery, size: 22 },
  apk: { Icon: Download, size: 22 },
  web: { Icon: Globe, size: 22 },
};

const ORDER: Channel[] = ['appStore', 'play', 'appGallery', 'apk', 'web'];
const STORES: Channel[] = ['appStore', 'play', 'appGallery'];

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
  const others = ORDER.filter((c) => c !== primary && urls[c]);
  const pending = STORES.filter((c) => !urls[c]);
  const arrowFlip = locale === 'ar' ? 'rotate(180deg)' : 'none';

  const label = (c: Channel, size: 'lg' | 'md') => (
    <span style={{ textAlign: 'start', lineHeight: 1.15 }}>
      <span style={{ display: 'block', fontSize: size === 'lg' ? 12 : 10.5, opacity: 0.8, fontFamily: FONT.cairo }}>
        {t(`channels.${c}.kicker`)}
      </span>
      <span
        dir={isStore(c) ? 'ltr' : undefined}
        style={{
          display: 'block',
          fontSize: size === 'lg' ? 21 : 17,
          fontWeight: isStore(c) ? 600 : 700,
          fontFamily: isStore(c) ? FONT.display : FONT.cairo,
          textAlign: 'start',
        }}
      >
        {t(`channels.${c}.name`)}
      </span>
    </span>
  );

  // Same tab for every option: on a phone a new tab strands the user, and the
  // store apps intercept their own URLs regardless.
  const PrimaryIcon = ICONS[primary].Icon;

  return (
    <section style={{ padding: 'clamp(44px,7vw,88px) 0 clamp(56px,8vw,104px)', background: 'linear-gradient(180deg,#E4F0FF 0%, #FAFAF7 100%)', minHeight: '70vh' }}>
      <div style={{ ...container, maxWidth: 820 }}>
        <div style={eyebrow}>{t('eyebrow')}</div>
        <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(32px,5.2vw,58px)', lineHeight: 1.15, color: C.ink, margin: '14px 0 16px' }}>
          {t('title')}
        </h1>
        <p style={{ fontSize: 'clamp(17px,1.9vw,20px)', lineHeight: 1.75, color: C.ink2, margin: '0 0 32px', maxWidth: 620 }}>{t('subtitle')}</p>

        {/* Recommended */}
        <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color: C.ink2, marginBottom: 12 }}>{t(`for.${view}`)}</div>
        <a
          href={urls[primary]}
          data-channel={primary}
          // White on the blue petal is 3.67:1, under AA for the 12px kicker, so
          // the primary action wears ink like the home page's store badges.
          style={{ display: 'inline-flex', alignItems: 'center', gap: 14, minHeight: 64, padding: '14px 26px', borderRadius: 16, background: C.ink, color: '#fff', boxShadow: '0 12px 28px rgba(20,32,43,.18)' }}
        >
          <PrimaryIcon style={{ width: ICONS[primary].size + 4, height: ICONS[primary].size + 4, flex: 'none' }} />
          {label(primary, 'lg')}
          <ArrowRight style={{ width: 20, height: 20, marginInlineStart: 6, transform: arrowFlip, flex: 'none' }} />
        </a>

        {primary === 'apk' && (
          <p style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: '16px 0 0', maxWidth: 560 }}>
            {t('apkNote')}{' '}
            <a href={APK_RELEASE_PAGE} style={{ color: C.blueDark, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              {t('apkVerify')}
            </a>
          </p>
        )}
        {primary === 'web' && (
          <p style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: '16px 0 0', maxWidth: 560 }}>
            {t('webNote')}
            {pending.length > 0 && <> {t('storesPending')}</>}
          </p>
        )}

        {/* Everything else that is live, then the stores that aren't yet. */}
        {(others.length > 0 || pending.length > 0) && (
          <div style={{ marginTop: 44, paddingTop: 28, borderTop: `1px solid ${C.border}` }}>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color: C.ink, margin: '0 0 16px' }}>{t('otherTitle')}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {others.map((c) => {
                const { Icon, size } = ICONS[c];
                return (
                  <a
                    key={c}
                    href={urls[c]}
                    data-channel={c}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 11, minHeight: 52, padding: '10px 20px', borderRadius: 14, background: C.white, color: C.ink, border: `1.5px solid ${C.border}` }}
                  >
                    <Icon style={{ width: size, height: size, flex: 'none' }} />
                    {label(c, 'md')}
                  </a>
                );
              })}
              {/* Not links: there is nowhere to send anyone yet. */}
              {pending.map((c) => {
                const { Icon, size } = ICONS[c];
                return (
                  <span
                    key={c}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 11, minHeight: 52, padding: '10px 20px', borderRadius: 14, background: 'transparent', color: C.ink2, border: `1.5px dashed ${C.border}` }}
                  >
                    <Icon style={{ width: size, height: size, flex: 'none' }} />
                    <span style={{ textAlign: 'start', lineHeight: 1.15 }}>
                      <span style={{ display: 'block', fontSize: 10.5, fontFamily: FONT.cairo }}>{t('soon')}</span>
                      <span dir="ltr" style={{ display: 'block', fontSize: 17, fontWeight: 600, fontFamily: FONT.display, textAlign: 'start' }}>
                        {t(`channels.${c}.name`)}
                      </span>
                    </span>
                  </span>
                );
              })}
            </div>
            {others.includes('apk') && (
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.ink2, margin: '14px 0 0', maxWidth: 560 }}>
                {t('apkNote')}{' '}
                <a href={APK_RELEASE_PAGE} style={{ color: C.blueDark, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  {t('apkVerify')}
                </a>
              </p>
            )}
          </div>
        )}

        {view === 'desktop' && (
          <p style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: '28px 0 0' }}>{t('phoneHint')}</p>
        )}
      </div>
    </section>
  );
}
