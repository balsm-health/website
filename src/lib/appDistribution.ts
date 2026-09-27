/**
 * Where the patient app can be installed from, and which of those places a
 * given device should be sent to. Backs `balsm.health/download` — the URL the
 * app's own share sheet prints (balsm_app: ecosystem_sheet.dart), so it is the
 * link people pass to each other and must always land somewhere useful.
 *
 * Every channel is off until it actually exists. A store badge that 404s, or an
 * APK link before the first production release, is worse than no badge: the
 * page falls back to the web app, which is always there. Flip a channel on here
 * the day it goes live — nothing else has to change.
 *
 * Pure module: no Next or DOM imports, so middleware (edge), the server page and
 * the client component all share the one resolver.
 */

/** Android application ID and iOS bundle ID — same string on both. */
export const APP_ID = 'app.balsm.health';

export const DISTRIBUTION = {
  /** App Store listing, region-less: 'https://apps.apple.com/app/id6740000000'. */
  appStore: 'https://apps.apple.com/sa/app/ynmo-tifli/id6443390362' as string | null, // TEST ONLY — not Balsm
  /** Google Play listing: `https://play.google.com/store/apps/details?id=${APP_ID}`. */
  play: 'https://play.google.com/store/apps/details?id=com.tatralab.ynmo_parent&pli=1' as string | null, // TEST ONLY — not Balsm
  /** AppGallery listing: 'https://appgallery.huawei.com/app/C110000000'. */
  appGallery: null as string | null,
  /**
   * `true` once a production tag (vX.Y.Z, no -alpha/-beta) has published
   * `balsm-production.apk` to GitHub Releases, signed with the release key —
   * the same key whose SHA-256 goes in public/.well-known/assetlinks.json.
   * The release workflow still uploads an APK when signing secrets are
   * missing; do not flip this for one of those.
   */
  apkReleased: false,
} as const;

const RELEASES = 'https://github.com/balsm-health/balsm_app/releases';

/** Flutter web build, synced into public/apps/balsm (scripts/sync-flutter-web.sh). */
export const WEB_APP_PATH = '/apps/balsm/';

export type Channel = 'appStore' | 'play' | 'appGallery' | 'apk' | 'web';

/**
 * `huawei` is Android without Google Play (HMS); `harmony` is HarmonyOS NEXT,
 * which runs neither Play nor APKs. `bot` covers crawlers and link-preview
 * fetchers — WhatsApp's UA says Android, and it must get the page, not a store.
 */
export type Platform = 'ios' | 'android' | 'huawei' | 'harmony' | 'desktop' | 'bot';

export type ChannelUrls = Partial<Record<Channel, string>>;

/** Only the channels that are live, with their URLs. */
export function channelUrls(d: typeof DISTRIBUTION = DISTRIBUTION): ChannelUrls {
  const urls: ChannelUrls = { web: WEB_APP_PATH };
  if (d.appStore) urls.appStore = d.appStore;
  if (d.play) urls.play = d.play;
  if (d.appGallery) urls.appGallery = d.appGallery;
  if (d.apkReleased) urls.apk = `${RELEASES}/latest/download/balsm-production.apk`;
  return urls;
}

/** Numeric ID from an App Store URL, for Safari's Smart App Banner. */
export function appStoreId(url: string | null): string | null {
  return url?.match(/\/id(\d+)/)?.[1] ?? null;
}

/** Release page — version, notes and the APK's SHA-256 digest. */
export const APK_RELEASE_PAGE = `${RELEASES}/latest`;

// Named fetchers, not a bare /bot|telegram/: in-app browsers carry their host
// app's name (Telegram-Android, LinkedInApp) and phones carry brands like
// CUBOT, and those are people who should be redirected like anyone else.
const BOT_UA =
  /googlebot|google-inspectiontool|bingbot|applebot|duckduckbot|yandex(bot|images)|baiduspider|petalbot|twitterbot|telegrambot|slackbot|discordbot|linkedinbot|pinterestbot|redditbot|facebookexternalhit|facebookcatalog|whatsapp\/|skypeuripreview|embedly|slurp|crawler|spider|lighthouse|headlesschrome|bot\//i;

export function detectPlatform(userAgent: string | null | undefined): Platform {
  const ua = userAgent ?? '';
  if (!ua || BOT_UA.test(ua)) return 'bot';
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
  if (/OpenHarmony|ArkWeb/.test(ua) && !/Android/.test(ua)) return 'harmony';
  if (/Android/.test(ua)) {
    // Honor split from Huawei in 2020 and ships Play again, so it is not matched.
    return /HUAWEI|HMSCore|HarmonyOS/i.test(ua) ? 'huawei' : 'android';
  }
  // iPadOS 13+ Safari reports a Mac UA; the client component corrects that.
  return 'desktop';
}

/** Ordered preference per platform — the first live one is the primary action. */
const PREFERENCE: Record<Platform, Channel[]> = {
  ios: ['appStore', 'web'],
  android: ['play', 'apk', 'web'],
  huawei: ['appGallery', 'apk', 'web'],
  harmony: ['appGallery', 'web'],
  desktop: ['web'],
  bot: ['web'],
};

export function primaryChannel(platform: Platform, urls: ChannelUrls): Channel {
  return PREFERENCE[platform].find((c) => urls[c]) ?? 'web';
}

const STORES: Channel[] = ['appStore', 'play', 'appGallery'];

/**
 * Where to send a device without showing the page at all. Stores only: an APK
 * is never downloaded unasked, and the web app is a choice, not a default, for
 * someone who might prefer a store build that isn't out yet.
 */
export function autoRedirect(platform: Platform, urls: ChannelUrls): Channel | null {
  const channel = primaryChannel(platform, urls);
  return STORES.includes(channel) ? channel : null;
}

/** Path segment for a direct link, e.g. `/download/android` → 'play'. */
export const TARGETS: Record<string, Channel> = {
  ios: 'appStore',
  android: 'play',
  appgallery: 'appGallery',
  apk: 'apk',
  web: 'web',
};

/**
 * Carries campaign tags into the Play install referrer, so an install can be
 * traced back to the QR code or post that sent it. Apple's equivalent needs a
 * provider token, so App Store links go out unchanged.
 */
export function withReferrer(url: string, channel: Channel, search: URLSearchParams): string {
  if (channel !== 'play') return url;
  const utm = [...search].filter(([k]) => k.startsWith('utm_'));
  if (!utm.length) return url;
  const out = new URL(url);
  out.searchParams.set('referrer', new URLSearchParams(utm).toString());
  return out.toString();
}
