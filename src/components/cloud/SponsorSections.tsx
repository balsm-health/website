'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { C, DISPLAY, FONT, ON, TEXT } from './theme';
import Reveal from './Reveal';
import { CodeXml, Languages, WifiOff, GitPullRequest, Building2, Megaphone, ArrowUpLeft, Mail, HeartPulse } from './CloudIcons';

type Card = { title: string; desc: string };
type OtherCard = { title: string; desc: string; cta: string };
type Sponsor = { name: string; desc: string; href: string };

const container: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
// Kickers are 19px bold, not 13px. Bold at >=18.66px is WCAG "large text",
// where the contrast bar drops from 4.5:1 to 3:1 — which is enough for the
// blue, violet and danger petals to be compliant at full strength. The rest
// remain part of the documented palette exception. Don't shrink these.
const eyebrow = (color: string, center = false): React.CSSProperties => ({ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color, textAlign: center ? 'center' : 'start' });

// logo image per sponsor (index-aligned with i18n sponsor.tech.sponsors); null → wordmark text
const LOGOS: (string | null)[] = ['/sponsor-mosalam.svg', '/sponsor-aws.svg', '/sponsor-sentry.svg', '/sponsor-kiro.svg', '/sponsor-github.svg'];
const WHERE_ICONS = [
  { Icon: CodeXml, bg: C.violetBg, color: C.violet },
  { Icon: Languages, bg: C.aquaBg, color: C.aqua },
  { Icon: WifiOff, bg: C.greenBg, color: C.green },
];
// `color` fills the icon chip, `text` draws the CTA line. One field was doing
// both, which put a 14px label in a fill colour (2.4:1 for the aqua card).
const OTHER_STYLES = [
  { Icon: GitPullRequest, bg: C.violetBg, color: C.violet, text: TEXT.violet, href: '/contributors' },
  { Icon: Building2, bg: C.aquaBg, color: C.aqua, text: TEXT.aqua, href: '/providers' },
  { Icon: Megaphone, bg: C.blueBg, color: C.blue, text: TEXT.blue, href: 'https://github.com/balsm-health' },
];

export default function SponsorSections() {
  const t = useTranslations('sponsor');
  const sponsors = t.raw('tech.sponsors') as Sponsor[];
  const whereCards = t.raw('where.cards') as Card[];
  const otherCards = t.raw('other.cards') as OtherCard[];

  return (
    <>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(44px,7vw,84px) 0 clamp(36px,5vw,60px)', background: 'linear-gradient(180deg,#FDF5DC 0%, #FAFAF7 100%)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/balsm-logo.svg" alt="" aria-hidden style={{ position: 'absolute', left: -100, top: -80, width: 320, opacity: 0.1, animation: 'balsm-spin 80s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 980, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)', textAlign: 'center' }}>
          <Reveal>
            <div style={eyebrow(DISPLAY.amber, true)}>{t('hero.eyebrow')}</div>
            <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(34px,5.6vw,64px)', lineHeight: 1.12, color: C.ink, margin: '14px 0 18px' }}>
              {t('hero.title1')}<br />{t('hero.title2')}
            </h1>
            <p style={{ fontSize: 'clamp(17px,1.9vw,21px)', lineHeight: 1.75, color: C.ink2, margin: '0 auto', maxWidth: 600 }}>{t('hero.subtitle')}</p>
            {/* "your support may one day reach someone you love" */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 26, padding: '14px 20px', background: C.amberBg, borderRadius: 14, maxWidth: 'fit-content', marginInline: 'auto' }}>
              {/* Icon and label are one colour in the design, not two — the
                  split read as a two-tone chip at a glance. */}
              <HeartPulse style={{ width: 22, height: 22, color: '#7A5A0F', flex: 'none' }} />
              <span style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16, color: '#7A5A0F' }}>{t('hero.callout')}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TECH SPONSORS */}
      <section style={{ padding: 'clamp(48px,8vw,100px) 0', background: C.dark }}>
        <div style={container}>
          <Reveal style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 46px' }}>
            <div style={{ ...eyebrow(C.mint, true) }}>{t('tech.eyebrow')}</div>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.2vw,50px)', lineHeight: 1.15, color: '#fff', margin: '12px 0 14px' }}>{t('tech.title')}</h2>
            <p style={{ fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.8, color: 'rgba(255,255,255,.66)', margin: 0 }}>{t('tech.desc')}</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 18, marginBottom: 36 }}>
            {sponsors.map((s, i) => {
              const logo = LOGOS[i];
              return (
                <Reveal key={s.name} delay={i * 60} className="balsm-lift" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                  <div style={{ width: 120, height: 44, margin: '0 auto 16px', background: '#fff', borderRadius: 10, padding: '8px 12px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt={s.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span dir="ltr" style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 18, color: C.ink }}>{s.name}</span>
                    )}
                  </div>
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" dir="ltr" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontFamily: FONT.display, fontWeight: 700, fontSize: 19, color: '#fff' }}>{s.name}</a>
                  ) : (
                    <div dir="ltr" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 19, color: '#fff', marginBottom: 6 }}>{s.name}</div>
                  )}
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,.66)', margin: 0 }}>{s.desc}</p>
                </Reveal>
              );
            })}
          </div>
          <Reveal style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.7)', margin: '0 0 18px' }}>{t('tech.note')}</p>
            <a href="mailto:sponsors@balsm.health" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 30px', borderRadius: 999, background: C.mint, color: ON.mint, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 17 }}>
              <Mail style={{ width: 19, height: 19 }} />{t('tech.cta')}
            </a>
          </Reveal>
        </div>
      </section>

      {/* WHERE IT GOES */}
      <section style={{ padding: 'clamp(60px,9vw,108px) 0', background: C.white, borderTop: `1px solid ${C.borderHair}` }}>
        <div style={container}>
          <Reveal style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 46px' }}>
            <div style={eyebrow(DISPLAY.emerald, true)}>{t('where.eyebrow')}</div>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(28px,4.2vw,50px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 0' }}>{t('where.title')}</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 20 }}>
            {whereCards.map((card, i) => {
              const s = WHERE_ICONS[i];
              return (
                <Reveal key={i} delay={i * 70} className="balsm-lift" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 20, padding: 30 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 18 }}>
                    <s.Icon style={{ width: 24, height: 24 }} />
                  </div>
                  <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 21, color: C.ink, margin: '0 0 8px' }}>{card.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{card.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* OTHER WAYS */}
      <section style={{ padding: 'clamp(60px,9vw,100px) 0', background: C.bg, borderTop: `1px solid ${C.borderHair}` }}>
        <div style={container}>
          <Reveal style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            <h2 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(26px,4vw,44px)', lineHeight: 1.15, color: C.ink, margin: 0 }}>{t('other.title')}</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 18 }}>
            {otherCards.map((card, i) => {
              const s = OTHER_STYLES[i];
              const inner = (
                <>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 16 }}>
                    <s.Icon style={{ width: 23, height: 23 }} />
                  </div>
                  <h3 style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 20, color: C.ink, margin: '0 0 6px' }}>{card.title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.ink2, margin: '0 0 12px' }}>{card.desc}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT.cairo, fontWeight: 600, fontSize: 14, color: s.text }}>
                    {card.cta}<ArrowUpLeft style={{ width: 15, height: 15 }} />
                  </span>
                </>
              );
              const st: React.CSSProperties = { display: 'block', background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, height: '100%' };
              return (
                <Reveal key={i} delay={i * 60}>
                  {s.href.startsWith('http') ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="balsm-lift" style={st}>{inner}</a>
                  ) : (
                    <Link href={s.href} className="balsm-lift" style={st}>{inner}</Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
