'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FONT } from './theme';

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/balsm-logo.svg" alt="" style={{ width: 38, height: 38 }} />
              <span style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 24 }}>بَلسَم</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,.66)', margin: '0 0 16px' }}>{t('blurb')}</p>
            <div dir="ltr" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 12, letterSpacing: '.14em', color: 'rgba(255,255,255,.5)', textAlign: 'start', marginBottom: 22 }}>
              OPEN · ARAB · TRUSTED
            </div>
            <div style={colTitle}>{t('follow')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="balsm-social"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '9px 10px', borderRadius: 999, fontFamily: FONT.body, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}
                >
                  <span dir="ltr">{s.label}</span>
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
