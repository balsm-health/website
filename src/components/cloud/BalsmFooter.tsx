'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, FONT } from './theme';
import { AtSign, Globe, Mail } from './CloudIcons';
import AnimatedLogo from './AnimatedLogo';
import SocialLogo, { type SocialPlatform } from './SocialLogo';

const linkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,.66)',
  textDecoration: 'none',
  // 23px rows sat well under the 44px floor. The height is taken as a minimum
  // with the label centred, and colWrap's gap drops to 0 to pay for it — so the
  // visible spacing between links is what it was, and the target is the row.
  display: 'flex',
  alignItems: 'center',
  minHeight: 44,
};
const colTitle: React.CSSProperties = { fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, marginBottom: 14, color: '#fff' };
const colWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', fontSize: 14.5 };

const SOCIALS: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/balsm-health' },
  { label: 'Discord', href: 'https://discord.gg/cNd7QBU26a' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/balsm-health' },
  { label: 'X', href: 'https://x.com/balsm_health' },
  { label: 'Facebook', href: 'https://facebook.com/balsm.health' },
  { label: 'Instagram', href: 'https://instagram.com/balsm.health' },
  { label: 'YouTube', href: 'https://www.youtube.com/@balsm.health' },
  { label: 'TikTok', href: 'https://tiktok.com/@balsm.health' },
  { label: 'Threads', href: 'https://threads.com/@balsm.health' },
  { label: 'WhatsApp', href: 'https://wa.me/balsm.health' },
  { label: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029Vb7A39V3mFY3fXXLVi46' },
  { label: 'Patreon', href: 'https://patreon.com/balsm_health' },
  { label: 'Qabilah', href: 'https://qabilah.com/profile/balsm-health' },
  { label: 'Email', href: 'mailto:contact@balsm.health' },
];


// Label → asset in /public/social. Threads, Qabilah and Email stay line
// icons, as in the design.
const PLATFORM: Record<string, SocialPlatform> = {
  GitHub: 'github',
  Discord: 'discord',
  LinkedIn: 'linkedin',
  X: 'x',
  Facebook: 'facebook',
  Instagram: 'instagram',
  YouTube: 'youtube',
  TikTok: 'tiktok',
  WhatsApp: 'whatsapp',
  'WhatsApp Channel': 'whatsapp-channel',
  Patreon: 'patreon',
};

function SocialIcon({ label }: { label: string }) {
  if (label === 'Threads') return <AtSign style={{ width: 18, height: 18 }} />;
  if (label === 'Qabilah') return <Globe style={{ width: 18, height: 18 }} />;
  if (label === 'Email') return <Mail style={{ width: 18, height: 18 }} />;
  const platform = PLATFORM[label];
  return platform ? <SocialLogo platform={platform} size={18} /> : null;
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
          <div style={{ gridColumn: '1 / -1', maxWidth: 380 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
              <AnimatedLogo size={38} idle="breathe" />
              <span style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 24 }}>بلسم</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,.66)', margin: '0 0 16px' }}>{t('blurb')}</p>
            <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,.5)', marginBottom: 22 }}>
              {t('motto')}
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
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', flex: '0 0 auto', textDecoration: 'none' }}
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
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 6, fontSize: 13, color: 'rgba(255,255,255,.5)' }}>
            <span>{t('copyright')} · <span dir="ltr">balsm.health</span> · {t('pdpl')} ·</span>
            {/* Sits beside the PDPL claim on purpose: the policy is what backs it. */}
            <Link href="/privacy" style={{ ...linkStyle, textDecoration: 'underline', textUnderlineOffset: 3 }}>{t('privacy')}</Link>
            <span aria-hidden>·</span>
            <Link href="/terms" style={{ ...linkStyle, textDecoration: 'underline', textUnderlineOffset: 3 }}>{t('terms')}</Link>
          </div>
          <div style={{ fontFamily: FONT.cairo, fontSize: 13.5, color: 'rgba(255,255,255,.6)' }}>{t('tagline')}</div>
        </div>
      </div>
    </footer>
  );
}
