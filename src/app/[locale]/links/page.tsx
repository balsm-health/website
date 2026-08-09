"use client";

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

type Locale = 'en' | 'ar';
type Theme = 'light' | 'dark';

type LinkItem = {
  key: string;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
  url: string;
};

const links: LinkItem[] = [
  {
    key: 'website',
    label: { en: 'Website', ar: 'الموقع' },
    description: { en: 'Visit our main website', ar: 'تصفح موقعنا' },
    url: 'https://balsm.health',
  },
  {
    key: 'linkedin',
    label: { en: 'LinkedIn', ar: 'لينكدإن' },
    description: { en: 'Follow us on LinkedIn', ar: 'تابعنا على لينكدإن' },
    url: 'https://www.linkedin.com/company/balsm-health',
  },
  {
    key: 'x',
    label: { en: 'X (Twitter)', ar: 'تويتر (X)' },
    description: { en: 'Follow us on X (Twitter)', ar: 'تابعنا على تويتر (X)' },
    url: 'https://x.com/balsm_health',
  },
  {
    key: 'facebook',
    label: { en: 'Facebook', ar: 'فيسبوك' },
    description: { en: 'Like our Facebook page', ar: 'أعجب بصفحتنا على فيسبوك' },
    url: 'https://facebook.com/balsm.health',
  },
  {
    key: 'instagram',
    label: { en: 'Instagram', ar: 'انستجرام' },
    description: { en: 'Follow us on Instagram', ar: 'تابعنا على انستجرام' },
    url: 'https://instagram.com/balsm.health',
  },
  {
    key: 'youtube',
    label: { en: 'YouTube', ar: 'يوتيوب' },
    description: { en: 'Subscribe to our YouTube channel', ar: 'اشترك في قناتنا على يوتيوب' },
    url: 'https://www.youtube.com/@balsm.health',
  },
  {
    key: 'tiktok',
    label: { en: 'TikTok', ar: 'تيك توك' },
    description: { en: 'Follow us on TikTok', ar: 'تابعنا على تيك توك' },
    url: 'https://tiktok.com/@balsm.health',
  },
  {
    key: 'patreon',
    label: { en: 'Patreon', ar: 'باتريون' },
    description: { en: 'Support us on Patreon', ar: 'ادعمنا على باتريون' },
    url: 'https://patreon.com/balsm_health',
  },
  {
    key: 'github',
    label: { en: 'GitHub', ar: 'جيت هب' },
    description: { en: 'View our GitHub organization', ar: 'شاهد مشاريعنا على جيت هب' },
    url: 'https://github.com/balsm-health',
  },
  {
    key: 'qabilah',
    label: { en: 'Qabilah', ar: 'قبيلة' },
    description: { en: 'Connect with us on Qabilah', ar: 'تواصل معنا على قبيلة' },
    url: 'https://qabilah.com/profile/balsm-health',
  },
  {
    key: 'threads',
    label: { en: 'Threads', ar: 'ثريدز' },
    description: { en: 'Follow us on Threads', ar: 'تابعنا على ثريدز' },
    url: 'https://threads.com/@balsm.health',
  },
  {
    key: 'email',
    label: { en: 'Email', ar: 'البريد الإلكتروني' },
    description: { en: 'Contact us by email', ar: 'راسلنا عبر البريد الإلكتروني' },
    url: 'mailto:contact@balsm.health',
  },
  {
    key: 'whatsapp_number',
    label: { en: 'WhatsApp Number', ar: 'رقم واتساب' },
    description: { en: 'Chat with us on WhatsApp', ar: 'تواصل معنا على واتساب' },
    url: 'https://wa.me/201553564045',
  },
  {
    key: 'whatsapp_channel',
    label: { en: 'WhatsApp Channel', ar: 'قناة واتساب' },
    description: { en: 'Join our WhatsApp Channel for updates', ar: 'انضم إلى قناة واتساب للحصول على التحديثات' },
    url: 'https://whatsapp.com/channel/0029Vb7A39V3mFY3fXXLVi46',
  },
];

function getIcon(key: string, theme: Theme): ReactNode {
  // High contrast icons for both themes
  const iconClass = theme === 'dark' ? 'h-5 w-5 text-white bg-white/10 p-1 rounded-md' : 'h-5 w-5 text-ink-900 bg-ink-100 p-1 rounded-md';

  switch (key) {
    case 'website':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-emerald-400' : 'h-5 w-5 text-emerald-600'} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" /></svg>;
    case 'linkedin':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#7AB7FF]' : 'h-5 w-5 text-[#0A66C2]'} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" /></svg>;
    case 'x':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-ink-900'} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
    case 'facebook':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#8AB4F8]' : 'h-5 w-5 text-[#1877F2]'} fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .732.592 1.324 1.325 1.324h11.495v-9.294h-3.124v-3.622h3.124v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.592 1.323-1.324v-21.35c0-.733-.593-1.325-1.326-1.325z" /></svg>;
    case 'instagram':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#F472B6]' : 'h-5 w-5 text-[#E1306C]'} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z" /></svg>;
    case 'youtube':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#FF6B6B]' : 'h-5 w-5 text-[#FF0000]'} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112c-1.863-.502-9.386-.502-9.386-.502s-7.523 0-9.386.502a2.994 2.994 0 0 0-2.112 2.112c-.502 1.863-.502 5.754-.502 5.754s0 3.891.502 5.754a2.994 2.994 0 0 0 2.112 2.112c1.863.502 9.386.502 9.386.502s7.523 0 9.386-.502a2.994 2.994 0 0 0 2.112-2.112c.502-1.863.502-5.754.502-5.754s0-3.891-.502-5.754zm-13.498 9.314v-7.001l6.5 3.5-6.5 3.501z" /></svg>;
    case 'tiktok':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-ink-900'} fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>;
    case 'patreon':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#FF8088]' : 'h-5 w-5 text-[#FF424D]'} fill="currentColor" viewBox="0 0 24 24"><circle cx="17.5" cy="17.5" r="5.5" /><rect x="2" y="2" width="6" height="20" rx="3" /></svg>;
    case 'github':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-ink-900'} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.111-4.555-4.944 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.687-4.566 4.936.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.577.688.48C19.135 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>;
    case 'threads':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-ink-900'} fill="currentColor" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.617-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 013.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.32.142 1.469.691 2.544 1.738 3.11 3.026.79 1.798.863 4.728-1.53 7.071-1.829 1.791-4.045 2.606-7.164 2.626z" /></svg>;
    case 'email':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#FCA5A5]' : 'h-5 w-5 text-[#DC2626]'} fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20V8.99l8 6.99 8-6.99V20H4z" /></svg>;
    case 'whatsapp_number':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#4ADE80]' : 'h-5 w-5 text-[#16A34A]'} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.93.545 3.73 1.49 5.26L2 22l4.87-1.28A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.952 7.952 0 0 1-4.09-1.16l-.29-.17-2.89.76.77-2.81-.18-.29A7.952 7.952 0 1 1 12 20zm4.13-5.47c-.2-.1-1.18-.58-1.36-.65-.18-.07-.31-.1-.44.1-.13.2-.5.65-.62.78-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.59-.53-.99-1.18-1.11-1.38-.12-.2-.01-.3.09-.4.09-.09.2-.23.3-.34.1-.12.13-.2.2-.33.07-.13.03-.25-.01-.35-.05-.1-.44-1.07-.6-1.47-.16-.39-.32-.34-.44-.35-.11-.01-.25-.01-.39-.01-.13 0-.34.05-.52.23-.18.18-.68.66-.68 1.6 0 .94.7 1.85.8 1.98.1.13 1.37 2.1 3.32 2.87.47.2.84.32 1.13.41.47.15.9.13 1.24.08.38-.06 1.18-.48 1.35-.94.17-.46.17-.85.12-.94-.05-.09-.18-.13-.38-.23z" /></svg>;
    case 'whatsapp_channel':
      return <img src="/whatsapp-channels.svg" alt="WhatsApp Channels" className={theme === 'dark' ? 'h-5 w-5 object-contain brightness-0 invert' : 'h-5 w-5 object-contain'} />;
    case 'qabilah':
      // Placeholder until a licensed Qabilah mark lands in public/ — the file
      // this used to point at (/qabilah-logo.svg) was never in the repo, so the
      // row rendered a broken image. Swap this back to an <img> once the real
      // asset is available.
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#5EEAD4]' : 'h-5 w-5 text-[#0D9488]'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    default:
      return null;
  }
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem('balsm-links-theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function LinksPage() {
  const [theme, setTheme] = useState<Theme>('light');
  // Arabic is the default locale and is served unprefixed, so only an explicit
  // /en prefix switches this page to English.
  const [locale, setLocale] = useState<Locale>('ar');

  useEffect(() => {
    setTheme(getInitialTheme());

    if (typeof window !== 'undefined') {
      const pathLocale = window.location.pathname.split('/')[1];
      if (pathLocale === 'en') {
        setLocale('en');
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('balsm-links-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  // Rows that render a real asset rather than an inline glyph. Filenames are
  // lowercase on purpose: Cloudflare's asset store is case-sensitive, so a
  // mismatch that works on a macOS dev box 404s in production.
  const allLinks = links.map(l => ({
    ...l,
    image: l.key === 'website' ? '/balsm-logo.svg' :
           l.key === 'whatsapp_channel' ? '/whatsapp-channels.svg' : null
  }));

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text-primary)] transition-colors duration-500 selection:bg-primary/30">
      <div className="animated-bg" aria-hidden="true">
        <div className="blob blob-1 opacity-40 dark:opacity-20" />
        <div className="blob blob-2 opacity-40 dark:opacity-20" />
        <div className="blob blob-3 opacity-40 dark:opacity-20" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_40%)] dark:bg-[radial-gradient(circle_at_top,_rgba(1,196,162,0.03),_transparent_40%)]" />

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? (locale === 'ar' ? 'تبديل إلى الوضع الفاتح' : 'Switch to light mode') : (locale === 'ar' ? 'تبديل إلى الوضع الداكن' : 'Switch to dark mode')}
        className="fixed right-6 top-6 z-50 rounded-full border border-ink-200/80 bg-white/90 p-3 shadow-xl shadow-black/5 backdrop-blur-xl transition-all hover:scale-110 hover:border-primary/40 focus:outline-none dark:border-ink-700/50 dark:bg-ink-900/90 dark:shadow-black/20"
      >
        {theme === 'dark' ? (
          <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zm5.657 2.343a1 1 0 0 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707zM21 11a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2h1zm-2.343 7.657a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 1 1 1.414-1.414l.707.707zM12 19a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1zm-7.657-2.343a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 1 1 1.414 1.414l-.707.707zM4 13a1 1 0 1 1 0-2H3a1 1 0 1 1 0 2h1zm2.343-7.657a1 1 0 0 1 1.414-1.414l.707.707A1 1 0 1 1 7.05 6.464l-.707-.707zM12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7z" /></svg>
        ) : (
          <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M21.64 13.64A9 9 0 0 1 12 21a9 9 0 0 1 0-18c.34 0 .68.02 1.01.06a1 1 0 0 1 .54 1.7A7 7 0 0 0 19 17.45a1 1 0 0 1 1.7.54c.04.33.06.67.06 1.01a9 9 0 0 1-1.12 4.64z" /></svg>
        )}
      </button>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[580px] flex-col items-center px-4 pb-16 pt-16 sm:px-6 sm:pt-20">
        <section className="flex w-full flex-col items-center text-center">
          <div className="group relative mb-8">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-primary to-emerald-400 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40 group-hover:blur-2xl" />
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white p-4 shadow-2xl transition-transform duration-500 hover:scale-105 dark:border-ink-800 dark:bg-ink-900 sm:h-32 sm:w-32">
              <img
                src="/balsm-logo.svg"
                alt="Balsm Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="mb-20 px-4">
            <h1 className="mb-10 text-3xl font-black tracking-tight text-wordmark transition-colors sm:text-4xl">
              {locale === 'ar' ? 'Balsm | بلسم' : 'Balsm | بلسم'}
            </h1>
            <p className="mx-auto mt-8 max-w-sm px-8 text-[0.95rem] font-medium leading-relaxed text-ink-700 transition-colors dark:text-ink-300 sm:text-[1.1rem]">
              {locale === 'ar'
                ? 'أول منصة برمجية عربية مفتوحة المصدر لربط أركان الرعاية الصحية (مستشفيات، صيدليات، معامل). شاركنا بناء مستقبل الصحة الرقمية.'
                : 'The first Arabic open-source healthcare software platform connecting hospitals, pharmacies, and labs. Join us in building the future of digital health.'}
            </p>
          </div>

          <div className="mt-8 flex w-full flex-col items-center px-4 sm:px-0">
            <nav aria-label={locale === 'ar' ? 'روابط التواصل' : 'Contact Links'} className="mb-32 flex w-full max-w-md flex-col gap-4 sm:max-w-[480px]">
              {allLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex min-h-[64px] w-full items-center overflow-hidden rounded-xl border border-ink-200/50 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:bg-white hover:shadow-lg dark:border-ink-800/50 dark:bg-ink-900/50 dark:hover:bg-ink-900/80 ${locale === 'ar' ? 'flex-row-reverse pl-12 pr-4' : 'flex-row pl-4 pr-12'}`}
                >
                  {/* Fixed Icon Slot - No overlap with text */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-500 group-hover:scale-110">
                    {link.image ? (
                      <img 
                        src={link.image} 
                        alt="" 
                        className={`h-6 w-6 object-contain ${link.key === 'whatsapp_channel' && theme === 'dark' ? 'brightness-0 invert' : ''}`} 
                      />
                    ) : (
                      getIcon(link.key, theme)
                    )}
                  </div>

                  {/* Left Aligned Label - Safe from overlapping icons */}
                  <span className={`flex-1 truncate font-bold tracking-tight text-ink-900 transition-colors group-hover:text-ink-800 dark:text-white dark:group-hover:text-primary-light text-base sm:text-lg ${locale === 'ar' ? 'mr-4 text-right' : 'ml-4 text-left'}`}>
                    {link.label[locale]}
                  </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <footer className="mt-32 pb-24 text-center">
        <Link href={`/${locale}`} className="group inline-flex items-center gap-2 rounded-full border border-ink-200/50 bg-white/50 px-8 py-3 text-sm font-semibold tracking-wide text-ink-700 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-primary dark:border-ink-700/50 dark:bg-ink-800/50 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white">
          <img src="/balsm-logo.svg" className="h-5 w-5 transition-transform group-hover:rotate-12" alt="" />
            {locale === 'ar' ? 'بني بحب بواسطة بلسم' : 'Built with love by Balsm'}
          </Link>
        </footer>
      </main>
    </div>
  );
}
