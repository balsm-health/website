'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { C, FONT } from './theme';
import type { NavAccount } from './navAccount';
import {
  ArrowLeft, BadgeCheck, ChevronDown, ChevronLeft, Compass, Eye, Gem, Github, HandCoins, HandHelping,
  Handshake, Layers, Mail, MapIcon, Menu, Scale, TrendingUp, Users,
} from './CloudIcons';

export type NavKey = 'home' | 'products' | 'ecosystem' | 'market' | 'partners' | 'contributors';

// Top-level links after the Initiative menu, in BalsmNavV2.dc.html order.
const LINKS: { key: Exclude<NavKey, 'home'>; href: string }[] = [
  { key: 'products', href: '/products' },
  { key: 'ecosystem', href: '/ecosystem' },
  { key: 'market', href: '/marketplace' },
  { key: 'partners', href: '/partners' },
  { key: 'contributors', href: '/contributors' },
];

type IconCmp = typeof Eye;
type MenuItem = { href: string; Icon: IconCmp; color: string; external?: boolean };

// Icon tints are the design's 600-step hues on a neutral chip (#F2F4F6).
const TABS: { key: 'about' | 'governance' | 'support'; items: MenuItem[] }[] = [
  {
    key: 'about',
    items: [
      { href: '/#vision', Icon: Eye, color: '#5C3AB0' },
      { href: '/#mission', Icon: Compass, color: '#0F6BCC' },
      { href: '/#values', Icon: Gem, color: '#2A8C47' },
      { href: '/#foundation', Icon: Layers, color: '#01866F' },
      { href: '/#scale', Icon: TrendingUp, color: '#5C3AB0' },
      { href: '/#who', Icon: Users, color: '#B8336F' },
    ],
  },
  {
    key: 'governance',
    items: [
      { href: '/ecosystem#licensing', Icon: Scale, color: '#0F6BCC' },
      { href: '/ecosystem#standards', Icon: BadgeCheck, color: '#01866F' },
      { href: '/ecosystem#roadmap', Icon: MapIcon, color: '#5C3AB0' },
      { href: 'https://github.com/balsm-health', Icon: Github, color: C.ink, external: true },
    ],
  },
  {
    key: 'support',
    items: [
      { href: '/partners#partner', Icon: HandHelping, color: '#B8336F' },
      { href: '/partners#partner', Icon: HandCoins, color: '#0F6BCC' },
      { href: '/partners', Icon: Handshake, color: '#01866F' },
      { href: 'mailto:contact@balsm.health', Icon: Mail, color: '#5C3AB0', external: true },
    ],
  },
];

// The mobile panel's Initiative list: every About item, then a short pick from
// the other two tabs (per the design, not the whole mega-menu).
const MOBILE_EXTRA: { tab: 'governance' | 'support'; index: number }[] = [
  { tab: 'governance', index: 0 },
  { tab: 'governance', index: 2 },
  { tab: 'support', index: 0 },
];

const DESKTOP_MIN = 1181;

function initials(name: string) {
  const first = name.trim().split(/\s+/).filter(Boolean)[0];
  return first ? first[0].toUpperCase() : '؟';
}

function MenuLink({ item, children, ...rest }: { item: MenuItem; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  if (item.external) {
    const newTab = item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return <a href={item.href} {...newTab} {...rest}>{children}</a>;
  }
  return <Link href={item.href} {...rest}>{children}</Link>;
}

export default function BalsmNav({ active, account }: { active?: NavKey; account?: NavAccount }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const headerRef = useRef<HTMLElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hoverAt = useRef(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); setUserOpen(false); }
    };
    const onDoc = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) { setMenuOpen(false); setUserOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onDoc);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onDoc);
      clearTimeout(leaveTimer.current);
    };
  }, []);

  const openMenu = () => {
    clearTimeout(leaveTimer.current);
    if (window.innerWidth >= DESKTOP_MIN && !menuOpen) { hoverAt.current = Date.now(); setMenuOpen(true); }
  };
  const keepMenu = () => clearTimeout(leaveTimer.current);
  const leaveMenu = () => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setMenuOpen(false), 220);
  };
  // A click that lands right after hover opened the menu would otherwise close it again.
  const toggleMenu = () => {
    clearTimeout(leaveTimer.current);
    if (menuOpen && Date.now() - hoverAt.current < 600) return;
    setMenuOpen((v) => !v);
  };
  const closeAll = useCallback(() => {
    clearTimeout(leaveTimer.current);
    setMenuOpen(false);
    setMobileOpen(false);
    setUserOpen(false);
  }, []);

  const setLang = (next: 'ar' | 'en') => {
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next }));
  };

  const call = (fn?: () => void) => () => { setUserOpen(false); fn?.(); };

  const userName = (account?.userName || '').trim();
  const userEmail = (account?.userEmail || '').trim();
  const signedIn = !!(userName || userEmail);
  const shownName = userName || userEmail;

  const langBtn = (isOn: boolean): React.CSSProperties => ({
    minWidth: 44, height: 44, padding: '0 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', borderRadius: 999, background: isOn ? C.white : 'transparent', color: isOn ? C.ink : '#5F6B77',
    boxShadow: isOn ? '0 1px 3px rgba(20,32,43,.14)' : 'none', lineHeight: 1, cursor: 'pointer',
  });

  const itemText = (tabKey: string, i: number) => ({
    title: t(`${tabKey}.${i}.title`),
    desc: t(`${tabKey}.${i}.desc`),
  });

  const avatar = (size: number, font: number) => (
    <span
      aria-hidden
      style={{
        width: size, height: size, flex: 'none', borderRadius: '50%', background: 'linear-gradient(135deg,#1283FF,#724DD0)', color: C.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.cairo, fontWeight: 800, fontSize: font,
      }}
    >
      {initials(shownName)}
    </span>
  );

  const groupLabel: React.CSSProperties = { padding: '4px 12px 6px', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12, color: '#5F6B77' };
  const subLine: React.CSSProperties = { display: 'block', fontWeight: 400, fontSize: 12, color: '#5F6B77' };
  const rule = <div style={{ height: 1, background: C.borderHair, margin: '6px 0' }} />;

  const companies = account?.companies ?? [];
  const orgs = account?.orgs ?? [];
  const activeTab = TABS[tab];

  return (
    <header
      ref={headerRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        fontFamily: FONT.arabic,
        transition: 'background .3s ease, box-shadow .3s ease',
        background: scrolled ? 'rgba(250,250,247,0.92)' : 'rgba(250,250,247,0)',
        boxShadow: scrolled ? '0 1px 0 rgba(20,32,43,0.07), 0 10px 30px rgba(20,32,43,0.05)' : 'none',
        backdropFilter: scrolled ? 'saturate(1.3) blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(1.3) blur(12px)' : 'none',
      }}
    >
      <nav
        aria-label={t('main')}
        className="bn2-nav"
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
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/balsm-logo-horizontal.svg" alt="بلسم — Balsm.health" className="bn2-logo" style={{ height: 46, width: 'auto', display: 'block' }} />
        </Link>

        <div className="bn2-links" style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: FONT.cairo, fontWeight: 600, fontSize: 15.5 }}>
          <button
            type="button"
            className="bn2-link"
            onClick={toggleMenu}
            onMouseEnter={openMenu}
            onMouseLeave={leaveMenu}
            aria-expanded={menuOpen}
            aria-controls="bn2-initiative-menu"
            aria-current={active === 'home' ? 'page' : undefined}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, minHeight: 44, padding: '9px 13px 9px 15px', border: 'none', borderRadius: 999, font: 'inherit', cursor: 'pointer' }}
          >
            {t('links.initiative')}
            <ChevronDown style={{ width: 15, height: 15 }} />
          </button>
          {LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className="bn2-link"
              aria-current={active === l.key ? 'page' : undefined}
              style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '9px 15px', borderRadius: 999 }}
            >
              {t(`links.${l.key}`)}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: C.borderHair, borderRadius: 999, padding: 3 }}>
            <button type="button" onClick={() => setLang('ar')} aria-label="العربية" style={{ ...langBtn(locale === 'ar'), fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14 }}>
              ع
            </button>
            <button type="button" onClick={() => setLang('en')} aria-label="English" style={{ ...langBtn(locale === 'en'), fontFamily: FONT.display, fontWeight: 700, fontSize: 12.5, letterSpacing: '.02em' }}>
              EN
            </button>
          </div>

          {!signedIn && (account?.onSignIn ? (
            <button type="button" onClick={call(account.onSignIn)} className="bn2-login">{t('signIn')}</button>
          ) : (
            <Link href="/marketplace" className="bn2-login">{t('signIn')}</Link>
          ))}

          {signedIn && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => { setUserOpen((v) => !v); setMenuOpen(false); }}
                aria-haspopup="menu"
                aria-expanded={userOpen}
                aria-label={t('account.label', { name: shownName })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '3px 8px 3px 3px', border: `1.5px solid ${C.border}`, borderRadius: 999, background: C.white, cursor: 'pointer' }}
              >
                {avatar(36, 15)}
                <ChevronDown style={{ width: 15, height: 15, color: '#5F6B77' }} />
              </button>
              {userOpen && (
                <div
                  role="menu"
                  className="bn2-usermenu"
                  style={{ position: 'absolute', top: 'calc(100% + 8px)', insetInlineEnd: 0, width: 260, background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, boxShadow: '0 20px 50px rgba(20,32,43,.14)', padding: 8, zIndex: 60 }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 10px 12px', borderBottom: `1px solid ${C.borderHair}`, marginBottom: 6 }}>
                    {avatar(40, 16)}
                    <span style={{ minWidth: 0 }}>
                      <span dir="auto" style={{ display: 'block', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shownName}</span>
                      <span dir="ltr" style={{ display: 'block', fontSize: 12.5, color: '#5F6B77', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</span>
                    </span>
                  </div>

                  {account?.hasCompany ? (
                    <>
                      <div style={groupLabel}>{t('account.workspaces')}</div>
                      {companies.map((co, i) => (
                        <button key={`${co.name}-${i}`} type="button" role="menuitemradio" aria-checked={!!co.active} onClick={call(() => account.onSwitchCompany?.(i))} className="bn2-mi bn2-co" style={{ justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{co.name}</span>
                            {co.handle && <span dir="ltr" style={{ display: 'block', fontFamily: FONT.mono, fontWeight: 500, fontSize: 12, color: '#5F6B77', textAlign: 'start' }}>{co.handle}</span>}
                            <span style={subLine}>{co.roleLabel} · {co.count ?? ''} {t('account.orgsCount')}</span>
                          </span>
                          <span className="bn2-dot" aria-hidden />
                        </button>
                      ))}
                      <button type="button" role="menuitem" onClick={call(account.onAddCompany)} className="bn2-mi" style={{ color: C.blueDark }}>{t('account.createWorkspace')}</button>
                      {rule}
                      <div style={groupLabel}>{t('account.actingAs')}</div>
                      {orgs.length > 0 ? orgs.map((og, i) => (
                        <button key={`${og.name}-${i}`} type="button" role="menuitemradio" aria-checked={!!og.active} onClick={call(() => account.onSwitchOrg?.(i))} className="bn2-mi bn2-co" style={{ justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{og.name}</span>
                            <span style={subLine}>{og.typeLabel} · {og.statusLabel}</span>
                          </span>
                          <span className="bn2-dot" aria-hidden />
                        </button>
                      )) : (
                        <button type="button" role="menuitem" onClick={call(account.onWorkspace)} className="bn2-mi" style={{ color: C.blueDark }}>{t('account.addOrg')}</button>
                      )}
                      {account.canList && (
                        <>
                          {rule}
                          <button type="button" role="menuitem" onClick={call(account.onMine)} className="bn2-mi">{t('account.mine')}</button>
                          <button type="button" role="menuitem" onClick={call(account.onNewListing)} className="bn2-mi">{t('account.newListing')}</button>
                        </>
                      )}
                      <button type="button" role="menuitem" onClick={call(account.onWorkspace)} className="bn2-mi">{t('account.workspaceOrgs')}</button>
                      <button type="button" role="menuitem" onClick={call(account.onTeam)} className="bn2-mi">{t('account.team')}</button>
                    </>
                  ) : (
                    <button type="button" role="menuitem" onClick={call(account?.onAddCompany)} className="bn2-mi">{t('account.addYourOrg')}</button>
                  )}
                  <button type="button" role="menuitem" onClick={call(account?.onAccount)} className="bn2-mi">{t('account.myAccount')}</button>
                  <Link role="menuitem" href="/marketplace" onClick={() => setUserOpen(false)} className="bn2-mi">{t('account.marketplace')}</Link>
                  <button type="button" role="menuitem" onClick={call(account?.onSignOut)} className="bn2-mi" style={{ color: '#9E3125', borderTop: `1px solid ${C.borderHair}`, marginTop: 6, borderRadius: '0 0 10px 10px' }}>{t('account.signOut')}</button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            className="bn2-burger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t('menu')}
            aria-expanded={mobileOpen}
            style={{ alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.white, cursor: 'pointer', color: C.ink }}
          >
            <Menu style={{ width: 22, height: 22 }} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="bn2-mega" onMouseEnter={keepMenu} onMouseLeave={leaveMenu} style={{ position: 'absolute', top: '100%', insetInline: 0, padding: '0 clamp(18px,5vw,56px)' }}>
          <div
            id="bn2-initiative-menu"
            style={{ maxWidth: 1128, margin: '6px auto 0', background: C.white, border: `1px solid ${C.border}`, borderRadius: 22, boxShadow: '0 24px 60px rgba(20,32,43,.14)', padding: 14, display: 'flex', flexWrap: 'wrap', gap: 14 }}
          >
            <div role="tablist" aria-label={t('links.initiative')} style={{ flex: '0 1 220px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, padding: 6, background: '#F6F7F8', borderRadius: 16 }}>
              {TABS.map((tb, i) => (
                <button
                  key={tb.key}
                  type="button"
                  role="tab"
                  id={`bn2-tab-${tb.key}`}
                  aria-selected={tab === i}
                  aria-controls="bn2-tabpanel"
                  className="bn2-tab"
                  onClick={() => setTab(i)}
                  onMouseEnter={() => setTab(i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', minHeight: 44, padding: '12px 14px', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15, textAlign: 'start' }}
                >
                  <span>{t(`tabs.${tb.key}`)}</span>
                  <ChevronLeft className="v2-flip" style={{ width: 16, height: 16 }} />
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              id="bn2-tabpanel"
              aria-labelledby={`bn2-tab-${activeTab.key}`}
              style={{ flex: '2 1 420px', minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 4, alignContent: 'start' }}
            >
              {activeTab.items.map((item, i) => {
                const { title, desc } = itemText(activeTab.key, i);
                return (
                  <MenuLink key={`${activeTab.key}-${i}`} item={item} onClick={closeAll} className="bn2-item" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: 14, borderRadius: 14 }}>
                    <span style={{ width: 38, height: 38, flex: 'none', borderRadius: 11, background: '#F2F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                      <item.Icon style={{ width: 19, height: 19 }} />
                    </span>
                    <span style={{ display: 'block' }}>
                      <span style={{ display: 'block', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 15.5, color: C.ink }}>{title}</span>
                      <span dir="auto" style={{ display: 'block', fontSize: 13.5, lineHeight: 1.55, color: '#5F6B77', marginTop: 2, fontWeight: 400 }}>{desc}</span>
                    </span>
                  </MenuLink>
                );
              })}
            </div>

            <Link
              href="/#foundation"
              onClick={closeAll}
              style={{ flex: '1 1 220px', minWidth: 0, position: 'relative', overflow: 'hidden', borderRadius: 16, padding: 22, background: 'linear-gradient(150deg,#0F6BCC,#724DD0)', color: C.white, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 200 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/balsm-logo-mono-white.svg" alt="" style={{ position: 'absolute', top: -30, left: -30, width: 150, opacity: 0.14 }} />
              <span style={{ position: 'relative', fontFamily: FONT.cairo, fontWeight: 700, fontSize: 12.5, opacity: 0.85 }}>{t('promo.kicker')}</span>
              <span style={{ position: 'relative', fontFamily: FONT.cairo, fontWeight: 800, fontSize: 20, lineHeight: 1.35, margin: '6px 0 10px' }}>{t('promo.title')}</span>
              <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 14 }}>
                {t('promo.cta')}
                <ArrowLeft className="v2-flip" style={{ width: 15, height: 15 }} />
              </span>
            </Link>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="bn2-panel" style={{ padding: '8px clamp(18px,5vw,56px) 20px', background: 'rgba(250,250,247,0.98)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: FONT.cairo, fontWeight: 600, fontSize: 17, color: C.ink }}>
            <details style={{ borderBottom: `1px solid ${C.borderHair}` }}>
              <summary style={{ padding: '13px 8px', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {t('links.initiative')}
                <ChevronDown style={{ width: 18, height: 18 }} />
              </summary>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 12px 10px', fontSize: 15.5, fontWeight: 600, color: C.ink2 }}>
                {TABS[0].items.map((item, i) => (
                  <Link key={item.href} href={item.href} onClick={closeAll} style={{ display: 'flex', alignItems: 'center', minHeight: 44 }}>
                    {t(`about.${i}.title`)}
                  </Link>
                ))}
                {MOBILE_EXTRA.map(({ tab: tk, index }) => {
                  const item = TABS.find((x) => x.key === tk)!.items[index];
                  return (
                    <Link key={`${tk}-${index}`} href={item.href} onClick={closeAll} style={{ display: 'flex', alignItems: 'center', minHeight: 44 }}>
                      {t(`${tk}.${index}.title`)}
                    </Link>
                  );
                })}
              </div>
            </details>
            {LINKS.map((l, i) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={closeAll}
                aria-current={active === l.key ? 'page' : undefined}
                style={{ padding: '13px 8px', borderBottom: i < LINKS.length - 1 ? `1px solid ${C.borderHair}` : 'none' }}
              >
                {t(`links.${l.key}`)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
