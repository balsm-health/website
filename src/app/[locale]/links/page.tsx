'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState, useSyncExternalStore, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import SocialLogo, { type SocialPlatform } from '@/components/cloud/SocialLogo';
import { ArrowUpRight, AtSign, Check, CodeXml, ContactRound, Globe, Mail, PartyPopper, Smartphone } from '@/components/cloud/CloudIcons';
import { C, FONT } from '@/components/cloud/theme';

// Port of Links.dc.html. Literal values below are the design's own and have no
// token yet; everything that matches a token uses it.
const L = {
  motto: '#01A88B',      // hue-as-text: 2.88:1 — the documented palette exception (PRODUCT.md § Accessibility)
  badgeText: '#0B4C94',
  chipBg: '#EEF5FF',
  chipIcon: '#1F2D3D',   // ink-800
  arrow: '#8A97A6',
  shadow: '0 1px 2px rgba(20,32,43,.04)',
} as const;

type Platform = 'ios' | 'android' | 'other';

type Row = {
  key: string;
  label: string;
  // Handle or short description under the label; a translation key when it's prose.
  sub: string | { t: 'whatsappChannel' | 'discord' };
  href: string;
  icon: ReactNode;
  trailing?: 'mail';
};

const logo = (platform: SocialPlatform) => <SocialLogo platform={platform} size={22} />;
const line = (Icon: typeof Globe) => <Icon style={{ width: 22, height: 22 }} />;

const FOLLOW: Row[] = [
  { key: 'github', label: 'GitHub', sub: 'balsm-health', href: 'https://github.com/balsm-health', icon: logo('github') },
  { key: 'discord', label: 'Discord', sub: { t: 'discord' }, href: 'https://discord.gg/cNd7QBU26a', icon: logo('discord') },
  { key: 'linkedin', label: 'LinkedIn', sub: 'balsm-health', href: 'https://www.linkedin.com/company/balsm-health', icon: logo('linkedin') },
  { key: 'x', label: 'X', sub: '@balsm_health', href: 'https://x.com/balsm_health', icon: logo('x') },
  { key: 'facebook', label: 'Facebook', sub: 'balsm.health', href: 'https://facebook.com/balsm.health', icon: logo('facebook') },
  { key: 'instagram', label: 'Instagram', sub: '@balsm.health', href: 'https://instagram.com/balsm.health', icon: logo('instagram') },
  { key: 'youtube', label: 'YouTube', sub: '@balsm.health', href: 'https://www.youtube.com/@balsm.health', icon: logo('youtube') },
  { key: 'tiktok', label: 'TikTok', sub: '@balsm.health', href: 'https://tiktok.com/@balsm.health', icon: logo('tiktok') },
  { key: 'threads', label: 'Threads', sub: '@balsm.health', href: 'https://threads.com/@balsm.health', icon: line(AtSign) },
  { key: 'whatsapp_channel', label: 'WhatsApp', sub: { t: 'whatsappChannel' }, href: 'https://whatsapp.com/channel/0029Vb7A39V3mFY3fXXLVi46', icon: logo('whatsapp-channel') },
  { key: 'patreon', label: 'Patreon', sub: 'balsm_health', href: 'https://patreon.com/balsm_health', icon: logo('patreon') },
  { key: 'qabilah', label: 'Qabilah', sub: 'balsm-health', href: 'https://qabilah.com/profile/balsm-health', icon: line(Globe) },
];

const CONTACT: Row[] = [
  { key: 'email', label: 'Email', sub: 'contact@balsm.health', href: 'mailto:contact@balsm.health', icon: line(Mail), trailing: 'mail' },
  { key: 'whatsapp', label: 'WhatsApp', sub: '@balsm.health', href: 'https://wa.me/balsm.health', icon: logo('whatsapp') },
];

// ── vCard ────────────────────────────────────────────────────────────────────

// Escapes a vCard 3.0 text value (RFC 2426 §4).
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');

async function photoBase64(): Promise<string | null> {
  try {
    const blob = await (await fetch('/apple-icon.png')).blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    return dataUrl.split(',')[1] ?? null;
  } catch {
    return null;
  }
}

async function buildVcf(): Promise<string> {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:;Balsm;;;',
    `FN:${esc('Balsm.health — بلسم')}`,
    'ORG:Balsm.health',
    `NICKNAME:${esc('بلسم')}`,
    `TITLE:${esc('مُجتمعي. مستقل. موثوق. · Community-driven. Independent. Trusted.')}`,
    'EMAIL;TYPE=INTERNET,WORK:contact@balsm.health',
    'URL;TYPE=WORK:https://balsm.health',
  ];
  for (const row of [...FOLLOW, ...CONTACT]) {
    if (row.href.startsWith('mailto:')) continue;
    const item = `item${row.key.replace(/\W/g, '')}`;
    const name = row.key === 'whatsapp_channel' ? 'WhatsApp Channel' : row.label;
    lines.push(`${item}.URL:${row.href}`, `${item}.X-ABLabel:${esc(name)}`, `X-SOCIALPROFILE;TYPE=${row.label.toLowerCase()}:${row.href}`);
  }
  lines.push(`NOTE:${esc('أول مبادرة مفتوحة المصدر للتقنية الصحية في الشرق الأوسط وشمال أفريقيا · MENA’s first open-source health-tech initiative. رعايةٌ تمتد .. وأثرٌ يبقىٰ — Care that reaches, impact that lasts.')}`);
  const photo = await photoBase64();
  // Base64 is ASCII, so folding by characters is folding by octets (75 per line).
  if (photo) lines.push(`PHOTO;ENCODING=b;TYPE=PNG:${photo}`.match(/.{1,74}/g)!.join('\r\n '));
  lines.push('END:VCARD');
  return lines.join('\r\n') + '\r\n';
}

function detectPlatform(): Platform {
  const ua = navigator.userAgent || '';
  // iPadOS reports a Mac UA; touch support tells them apart.
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  return /Android/i.test(ua) ? 'android' : 'other';
}
const noSubscribe = () => () => {};

// ── page ─────────────────────────────────────────────────────────────────────

export default function LinksPage() {
  const t = useTranslations('links');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  // Server render (and hydration) uses 'other'; the client snapshot then swaps
  // in the real platform without a setState-in-effect round trip.
  const platform = useSyncExternalStore(noSubscribe, detectPlatform, () => 'other' as Platform);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const ar = locale === 'ar';
  // Montserrat runs wider than Cairo: the English pair drops a point so
  // "App · coming soon" stays on one line at 360px.
  const display = ar ? FONT.cairo : FONT.display;
  const body = ar ? FONT.arabic : FONT.body;

  const flash = () => {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 4000);
  };

  const saveContact = async () => {
    const file = new File([await buildVcf()], 'Balsm.vcf', { type: 'text/vcard' });
    // Android can hand the card straight to Contacts through the share sheet.
    if (platform === 'android' && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Balsm.health' });
        return flash();
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      }
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Balsm.vcf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    flash();
  };

  const setLang = (next: 'ar' | 'en') => {
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next }));
  };

  const langButton = (code: 'ar' | 'en', label: string, text: string, font: string, size: number) => (
    <button
      type="button"
      onClick={() => setLang(code)}
      aria-label={label}
      aria-pressed={locale === code}
      style={{
        minWidth: 44, height: 44, padding: '0 10px', border: 'none', borderRadius: 999, cursor: 'pointer',
        background: locale === code ? C.white : 'transparent', color: locale === code ? C.ink : C.muted,
        boxShadow: locale === code ? '0 1px 3px rgba(20,32,43,.14)' : 'none',
        fontFamily: font, fontWeight: 700, fontSize: size, lineHeight: 1,
      }}
    >
      {text}
    </button>
  );

  const sectionTitle = (text: string, id: string) => (
    <h2 id={id} style={{ margin: 0, padding: '0 4px', fontFamily: display, fontWeight: 700, fontSize: 13, color: C.ltTagText }}>{text}</h2>
  );

  const row = (r: Row) => {
    const sub = typeof r.sub === 'string' ? r.sub : t(r.sub.t);
    const external = r.href.startsWith('http');
    return (
      <li key={r.key}>
        <a
          href={r.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="links-row"
          style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 60, padding: '10px 14px', borderRadius: 14, boxShadow: L.shadow, textDecoration: 'none' }}
        >
          <span style={{ width: 40, height: 40, flex: 'none', borderRadius: 12, background: L.chipBg, color: L.chipIcon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {r.icon}
          </span>
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 16 }}><bdi>{r.label}</bdi></span>
            {/* <bdi> isolates a Latin handle inside RTL text so its "@" stays in front. */}
            <span style={{ fontFamily: typeof r.sub === 'string' ? FONT.body : body, fontSize: 13, color: C.ltTagText, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><bdi>{sub}</bdi></span>
          </span>
          {r.trailing === 'mail'
            ? <Mail style={{ width: 18, height: 18, color: L.arrow, flex: 'none' }} />
            : <ArrowUpRight className="chevron-end" style={{ width: 18, height: 18, color: L.arrow, flex: 'none' }} />}
        </a>
      </li>
    );
  };

  // Links.dc.html puts the join card among the follow rows, after the
  // WhatsApp channel. It is a page on this site, so it opens in the same tab.
  const joinedRow = (
    <li key="joined">
      <Link
        href="/contributors/joined"
        className="links-row"
        style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 60, padding: '10px 14px', borderRadius: 14, boxShadow: L.shadow, textDecoration: 'none' }}
      >
        <span style={{ width: 40, height: 40, flex: 'none', borderRadius: 12, background: '#E3F7F3', color: '#01A88B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PartyPopper style={{ width: 20, height: 20 }} />
        </span>
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 16, textAlign: 'start' }}>{t('joined.title')}</span>
          <span style={{ fontFamily: body, fontSize: 13, color: C.ltTagText, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'start' }}>{t('joined.sub')}</span>
        </span>
        <ArrowUpRight className="chevron-end" style={{ width: 18, height: 18, color: L.arrow, flex: 'none' }} />
      </Link>
    </li>
  );

  const list: React.CSSProperties = { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 };

  return (
    <div className="cloud-light" style={{ fontFamily: body, color: C.ink, background: C.bg, minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/balsm-background.png"
        alt=""
        aria-hidden
        style={{ position: 'absolute', insetInline: 0, top: 0, width: '100%', height: 420, objectFit: 'cover', opacity: 0.45, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(#000 40%, transparent)', maskImage: 'linear-gradient(#000 40%, transparent)' }}
      />

      <main style={{ position: 'relative', maxWidth: 480, margin: '0 auto', padding: '16px 18px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, background: 'rgba(235,237,240,.9)' }}>
            {langButton('ar', 'العربية', 'ع', FONT.cairo, 14)}
            {langButton('en', 'English', 'EN', FONT.display, 13)}
          </div>
        </div>

        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: 28, background: C.white, boxShadow: '0 10px 30px rgba(20,32,43,.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/balsm-logo.svg" alt="" style={{ width: 62, height: 'auto' }} />
          </div>
          <h1 style={{ margin: 0, lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/balsm-wordmark.svg" alt="بلسم — Balsm.health" style={{ height: 40, width: 'auto' }} />
          </h1>
          <p style={{ margin: 0, fontFamily: display, fontWeight: 700, fontSize: 14, color: L.motto }}>{t('motto')}</p>
          <p style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: C.blueBg, color: L.badgeText, fontFamily: display, fontWeight: 700, fontSize: 13.5 }}>
            <CodeXml style={{ width: 16, height: 16, flex: 'none' }} />
            <span>{t('badge')}</span>
          </p>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: C.ink2, maxWidth: 360, textWrap: 'pretty' }}>{t('tagline')}</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 10 }}>
          <button
            type="button"
            onClick={saveContact}
            aria-describedby="links-save-hint"
            className="links-save"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 56, padding: '0 18px', border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: display, fontWeight: 700, fontSize: 16, boxShadow: '0 8px 22px rgba(18,131,255,.28)' }}
          >
            <ContactRound style={{ width: 22, height: 22 }} />
            <span>{t('save')}</span>
          </button>
          <span id="links-save-hint" style={{ fontSize: 12.5, lineHeight: 1.6, color: C.ltTagText, textAlign: 'center' }}>{t(`saveHint.${platform}`)}</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10, marginTop: 4 }}>
            <Link href="/" className="links-site" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 52, padding: '0 10px', borderRadius: 14, fontFamily: display, fontWeight: 700, fontSize: ar ? 15 : 14, whiteSpace: 'nowrap', textDecoration: 'none' }}>
              <Globe style={{ width: 19, height: 19 }} />
              <bdi>balsm.health</bdi>
            </Link>
            <Link href="/download" className="links-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 52, padding: '0 10px', borderRadius: 14, fontFamily: display, fontWeight: 700, fontSize: ar ? 15 : 14, whiteSpace: 'nowrap', textDecoration: 'none' }}>
              <Smartphone style={{ width: 19, height: 19 }} />
              <span>{t('app')}</span>
            </Link>
          </div>
        </div>

        <section aria-labelledby="links-follow" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sectionTitle(t('follow'), 'links-follow')}
          <ul style={list}>
            {FOLLOW.map((r) => (r.key === 'whatsapp_channel' ? [row(r), joinedRow] : row(r)))}
          </ul>
        </section>

        <section aria-labelledby="links-contact" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sectionTitle(t('contact'), 'links-contact')}
          <ul style={list}>{CONTACT.map(row)}</ul>
        </section>

        <div role="status" aria-live="polite">
          {toast && (
            <div style={{ position: 'fixed', insetInline: 16, bottom: 20, maxWidth: 448, margin: '0 auto', padding: '14px 16px', borderRadius: 14, background: C.ink, color: C.white, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, boxShadow: '0 12px 30px rgba(20,32,43,.25)' }}>
              <Check style={{ width: 18, height: 18, color: C.mint, flex: 'none' }} />
              <span>{t(platform === 'ios' ? 'saved.ios' : 'saved.other')}</span>
            </div>
          )}
        </div>

        <footer style={{ display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
          <Link href="/" className="links-foot" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontSize: 13, textDecoration: 'none' }}>
            <bdi>© Balsm.health</bdi>
          </Link>
        </footer>
      </main>
    </div>
  );
}
