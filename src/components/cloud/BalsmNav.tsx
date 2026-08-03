'use client';

import { useEffect, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { C, FONT } from './theme';
import { Terminal, Menu } from './CloudIcons';

export type NavKey = 'home' | 'providers' | 'contributors' | 'cloud' | 'sponsor';

const LINKS: { key: NavKey; href: string }[] = [
  { key: 'home', href: '/' },
  { key: 'providers', href: '/providers' },
  { key: 'cloud', href: '/cloud' },
  { key: 'contributors', href: '/contributors' },
  { key: 'sponsor', href: '/sponsor' },
];

export default function BalsmNav({ active }: { active: NavKey }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const setLang = (next: 'ar' | 'en') => {
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next }));
  };

  const pill = (isActive: boolean): React.CSSProperties => ({
    padding: '9px 15px',
    borderRadius: 999,
    fontFamily: FONT.cairo,
    fontWeight: 600,
    fontSize: 15.5,
    background: isActive ? C.borderHair : 'transparent',
    color: isActive ? C.ink : C.ink2,
    transition: 'background .2s ease, color .2s ease',
    whiteSpace: 'nowrap',
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        fontFamily: FONT.arabic,
        transition: 'background .3s ease, box-shadow .3s ease, backdrop-filter .3s ease',
        background: scrolled ? 'rgba(250,250,247,0.9)' : 'rgba(250,250,247,0)',
        boxShadow: scrolled ? '0 1px 0 rgba(43,43,37,0.07), 0 10px 30px rgba(43,43,37,0.05)' : 'none',
        backdropFilter: scrolled ? 'saturate(1.3) blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(1.3) blur(12px)' : 'none',
      }}
    >
      <nav
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '14px clamp(18px,5vw,56px)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px 24px',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/balsm-logo.svg" alt="Balsm" width={34} height={34} style={{ display: 'block' }} />
          <span lang="ar" style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 23, color: C.ink, letterSpacing: '-.01em' }}>
            بَلسَم
          </span>
        </Link>

        <div className="cloudnav-links" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {LINKS.map((l) => (
            <Link key={l.key} href={l.href} style={pill(active === l.key)}>
              {t(l.key)}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: C.borderHair, borderRadius: 999, padding: 3 }}>
            <button
              onClick={() => setLang('ar')}
              aria-label="العربية"
              style={{
                minWidth: 38, height: 38, padding: '0 10px', border: 'none', borderRadius: 999,
                background: locale === 'ar' ? C.white : 'transparent', color: locale === 'ar' ? C.ink : C.muted,
                boxShadow: locale === 'ar' ? '0 1px 3px rgba(43,43,37,.14)' : 'none',
                fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14, lineHeight: 1, cursor: 'pointer',
              }}
            >
              ع
            </button>
            <button
              onClick={() => setLang('en')}
              aria-label="English"
              style={{
                minWidth: 38, height: 38, padding: '0 10px', border: 'none', borderRadius: 999,
                background: locale === 'en' ? C.white : 'transparent', color: locale === 'en' ? C.ink : C.muted,
                boxShadow: locale === 'en' ? '0 1px 3px rgba(43,43,37,.14)' : 'none',
                fontFamily: FONT.display, fontWeight: 700, fontSize: 12.5, letterSpacing: '.02em', lineHeight: 1, cursor: 'pointer',
              }}
            >
              EN
            </button>
          </div>

          <a
            href="https://github.com/balsm-health"
            target="_blank"
            rel="noopener noreferrer"
            className="cloudnav-cta"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 14px', borderRadius: 999, border: `1.5px solid ${C.borderSoft}`, color: C.ink2, fontFamily: FONT.body, fontWeight: 600, fontSize: 14 }}
          >
            <Terminal style={{ width: 17, height: 17 }} />
            <span dir="ltr">{t('github')}</span>
          </a>

          <Link
            href="/cloud"
            className="cloudnav-cta"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 999, background: C.blue, color: C.white, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, boxShadow: '0 8px 22px rgba(18,131,255,.22)', whiteSpace: 'nowrap' }}
          >
            {t('join')}
          </Link>

          <button
            className="cloudnav-burger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t('menu')}
            aria-expanded={mobileOpen}
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, border: `1.5px solid ${C.borderSoft}`, background: C.white, cursor: 'pointer', color: C.ink }}
          >
            <Menu style={{ width: 22, height: 22 }} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="cloudnav-panel" style={{ padding: '8px clamp(18px,5vw,56px) 20px', background: 'rgba(250,250,247,0.98)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: FONT.cairo, fontWeight: 600, fontSize: 17 }}>
            {LINKS.map((l, i) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{ padding: '13px 8px', borderBottom: i < LINKS.length - 1 ? `1px solid ${C.borderHair}` : 'none', color: active === l.key ? C.ink : C.ink2 }}
              >
                {t(l.key)}
              </Link>
            ))}
            <Link
              href="/cloud"
              onClick={() => setMobileOpen(false)}
              style={{ marginTop: 10, textAlign: 'center', padding: 14, borderRadius: 999, background: C.blue, color: C.white, fontWeight: 700 }}
            >
              {t('join')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
