'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FONT } from './theme';
import { AtSign, Globe, Mail } from './CloudIcons';
import AnimatedLogo from './AnimatedLogo';

const linkStyle: React.CSSProperties = { color: 'rgba(255,255,255,.66)', textDecoration: 'none' };
const colTitle: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, marginBottom: 14, color: '#fff' };
const colWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 11, fontSize: 14.5 };

const SOCIALS: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/balsm-health' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/balsm-health' },
  { label: 'X', href: 'https://x.com/balsm_health' },
  { label: 'Facebook', href: 'https://facebook.com/balsm.health' },
  { label: 'Instagram', href: 'https://instagram.com/balsm.health' },
  { label: 'YouTube', href: 'https://www.youtube.com/@balsm.health' },
  { label: 'TikTok', href: 'https://tiktok.com/@balsm.health' },
  { label: 'Threads', href: 'https://threads.com/@balsm.health' },
  { label: 'WhatsApp', href: 'https://whatsapp.com/channel/0029Vb7A39V3mFY3fXXLVi46' },
  { label: 'Patreon', href: 'https://patreon.com/balsm_health' },
  { label: 'Qabilah', href: 'https://qabilah.com/profile/balsm-health' },
  { label: 'Email', href: 'mailto:contact@balsm.health' },
];


const BRAND_PATHS: Record<string, string> = {
  GitHub: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  LinkedIn: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  X: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  Facebook: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-2.796c0-2.87 1.812-4.434 4.301-4.434.86 0 1.723.064 2.575.19v3.19h-1.767c-1.396 0-1.66.653-1.66 1.618v2.234h3.328l-.44 3.667h-2.885v7.98h-3.452",
  Instagram: "M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 0 1-.899 1.382c-.42.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 0 1-1.379-.899c-.421-.42-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.874.9-1.295.42-.421.724-.69 1.379-.899.42-.165 1.05-.36 2.221-.42 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
  YouTube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  TikTok: "M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-.53 0-1.06-.14-1.5-.42a2.7 2.7 0 0 1-1.14-2.6 2.593 2.593 0 0 1 2.59-2.32c.28 0 .55.05.82.13V9.4a5.9 5.9 0 0 0-.82-.06A6.28 6.28 0 0 0 3.51 15c0 1.3.45 2.6 1.29 3.6a6.24 6.24 0 0 0 4.75 2.15 6.27 6.27 0 0 0 6.28-6.28V9.01a8.16 8.16 0 0 0 4.77 1.52V7.44a4.85 4.85 0 0 1-3.99-1.62z",
  WhatsApp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.357.101 11.94c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.359 11.949-11.943a11.86 11.86 0 0 0-3.48-8.403",
  Patreon: "M0 .48v23.04h4.219V.48zm15.384 0c-4.767 0-8.641 3.875-8.641 8.641 0 4.766 3.875 8.641 8.641 8.641 4.766 0 8.616-3.875 8.616-8.641C24 4.355 20.15.48 15.384.48z",
};

function SocialIcon({ label }: { label: string }) {
  if (label === 'Threads') return <AtSign style={{ width: 18, height: 18 }} />;
  if (label === 'Qabilah') return <Globe style={{ width: 18, height: 18 }} />;
  if (label === 'Email') return <Mail style={{ width: 18, height: 18 }} />;
  const d = BRAND_PATHS[label];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" style={{ display: 'block' }} aria-hidden>
      <path d={d} />
    </svg>
  );
}

export default function BalsmFooter() {
  const t = useTranslations('siteFooter');

  return (
    <footer style={{ background: C.ink, color: '#fff', padding: 'clamp(48px,7vw,80px) 0 32px', fontFamily: FONT.arabic }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(180px,100%),1fr))',
            gap: '40px 24px',
            paddingBottom: 44,
            borderBottom: '1px solid rgba(255,255,255,.1)',
          }}
        >
          <div style={{ gridColumn: '1 / -1', maxWidth: 340 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
              <AnimatedLogo size={38} idle="breathe" />
              <span style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 24 }}>بَلسَم</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,.66)', margin: '0 0 16px' }}>{t('blurb')}</p>
            <div dir="ltr" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 12, letterSpacing: '.14em', color: 'rgba(255,255,255,.5)', textAlign: 'start', marginBottom: 22 }}>
              OPEN · ARAB · TRUSTED
            </div>
            <div style={colTitle}>{t('follow')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={s.label}
                  title={s.label}
                  className="balsm-social"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: '50%', flex: '0 0 auto', textDecoration: 'none' }}
                >
                  <SocialIcon label={s.label} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div style={colTitle}>{t('product.title')}</div>
            <div style={colWrap}>
              <Link href="/providers" style={linkStyle}>{t('product.pos')}</Link>
              <Link href="/#app" style={linkStyle}>{t('product.app')}</Link>
              <Link href="/cloud" style={linkStyle}>{t('product.cloud')}</Link>
              <Link href="/providers" style={linkStyle}>{t('product.providers')}</Link>
            </div>
          </div>

          <div>
            <div style={colTitle}>{t('community.title')}</div>
            <div style={colWrap}>
              <a href="https://github.com/balsm-health" target="_blank" rel="noopener noreferrer" style={linkStyle}><span dir="ltr">GitHub</span></a>
              <Link href="/contributors" style={linkStyle}>{t('community.contribute')}</Link>
              <Link href="/contributors" style={linkStyle}>{t('community.docs')}</Link>
              <Link href="/sponsor" style={linkStyle}>{t('community.support')}</Link>
            </div>
          </div>

          <div>
            <div style={colTitle}>{t('ecosystem.title')}</div>
            <div style={colWrap}>
              <Link href="/cloud#invest" style={linkStyle}>{t('ecosystem.investors')}</Link>
              <Link href="/cloud#join" style={linkStyle}>{t('ecosystem.join')}</Link>
              <Link href="/sponsor" style={linkStyle}>{t('ecosystem.donate')}</Link>
              <Link href="/" style={linkStyle}>{t('ecosystem.mission')}</Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between', alignItems: 'center', paddingTop: 24 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>
            {t('copyright')} · <span dir="ltr">balsm.health</span> · {t('pdpl')}
          </div>
          <div style={{ fontFamily: FONT.cairo, fontSize: 13.5, color: 'rgba(255,255,255,.6)' }}>{t('tagline')}</div>
        </div>
      </div>
    </footer>
  );
}
