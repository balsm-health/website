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
  const iconClass = theme === 'dark' ? 'h-5 w-5 text-white bg-white/10 p-1 rounded-md' : 'h-5 w-5 text-slate-900 bg-slate-100 p-1 rounded-md';

  switch (key) {
    case 'website':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-emerald-400' : 'h-5 w-5 text-emerald-600'} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" /></svg>;
    case 'linkedin':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#7AB7FF]' : 'h-5 w-5 text-[#0A66C2]'} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" /></svg>;
    case 'x':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-slate-900'} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
    case 'facebook':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#8AB4F8]' : 'h-5 w-5 text-[#1877F2]'} fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .732.592 1.324 1.325 1.324h11.495v-9.294h-3.124v-3.622h3.124v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.592 1.323-1.324v-21.35c0-.733-.593-1.325-1.326-1.325z" /></svg>;
    case 'instagram':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#F472B6]' : 'h-5 w-5 text-[#E1306C]'} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.012-4.947.07-1.276.058-2.687.334-3.678 1.325-.991.991-1.267 2.402-1.325 3.678-.058 1.28-.07 1.688-.07 4.947s.012 3.667.07 4.947c.058 1.276.334 2.687 1.325 3.678.991.991 2.402 1.267 3.678 1.325 1.28.058 1.688.07 4.947.07s3.667-.012 4.947-.07c1.276-.058 2.687-.334 3.678-1.325.991-.991 1.267-2.402 1.325-3.678.058-1.28.07-1.688.07-4.947s-.012-3.667-.07-4.947c-.058-1.276-.334-2.687-1.325-3.678-.991-.991-2.402-1.267-3.678-1.325-1.28-.058-1.688-.07-4.947-.07z" /></svg>;
    case 'youtube':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#FF6B6B]' : 'h-5 w-5 text-[#FF0000]'} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112c-1.863-.502-9.386-.502-9.386-.502s-7.523 0-9.386.502a2.994 2.994 0 0 0-2.112 2.112c-.502 1.863-.502 5.754-.502 5.754s0 3.891.502 5.754a2.994 2.994 0 0 0 2.112 2.112c1.863.502 9.386.502 9.386.502s7.523 0 9.386-.502a2.994 2.994 0 0 0 2.112-2.112c.502-1.863.502-5.754.502-5.754s0-3.891-.502-5.754zm-13.498 9.314v-7.001l6.5 3.5-6.5 3.501z" /></svg>;
    case 'tiktok':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-slate-900'} fill="currentColor" viewBox="0 0 24 24"><path d="M12.75 2v14.25a2.25 2.25 0 1 1-2.25-2.25h1.5a.75.75 0 0 0 0-1.5h-1.5A3.75 3.75 0 1 0 15 16.25V7.5a5.25 5.25 0 0 0 5.25 5.25.75.75 0 0 0 0-1.5A3.75 3.75 0 0 1 16.5 7.5V2h-3.75z" /></svg>;
    case 'patreon':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#FF8088]' : 'h-5 w-5 text-[#FF424D]'} fill="currentColor" viewBox="0 0 24 24"><circle cx="17.5" cy="17.5" r="5.5" /><rect x="2" y="2" width="6" height="20" rx="3" /></svg>;
    case 'github':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-slate-900'} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.111-4.555-4.944 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.687-4.566 4.936.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.577.688.48C19.135 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>;
    case 'threads':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-slate-900'} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.111-4.555-4.944 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.687-4.566 4.936.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.577.688.48C19.135 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>;
    case 'email':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#FCA5A5]' : 'h-5 w-5 text-[#DC2626]'} fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20V8.99l8 6.99 8-6.99V20H4z" /></svg>;
    case 'whatsapp_number':
      return <svg aria-hidden="true" className={theme === 'dark' ? 'h-5 w-5 text-[#4ADE80]' : 'h-5 w-5 text-[#16A34A]'} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.93.545 3.73 1.49 5.26L2 22l4.87-1.28A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.952 7.952 0 0 1-4.09-1.16l-.29-.17-2.89.76.77-2.81-.18-.29A7.952 7.952 0 1 1 12 20zm4.13-5.47c-.2-.1-1.18-.58-1.36-.65-.18-.07-.31-.1-.44.1-.13.2-.5.65-.62.78-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.59-.53-.99-1.18-1.11-1.38-.12-.2-.01-.3.09-.4.09-.09.2-.23.3-.34.1-.12.13-.2.2-.33.07-.13.03-.25-.01-.35-.05-.1-.44-1.07-.6-1.47-.16-.39-.32-.34-.44-.35-.11-.01-.25-.01-.39-.01-.13 0-.34.05-.52.23-.18.18-.68.66-.68 1.6 0 .94.7 1.85.8 1.98.1.13 1.37 2.1 3.32 2.87.47.2.84.32 1.13.41.47.15.9.13 1.24.08.38-.06 1.18-.48 1.35-.94.17-.46.17-.85.12-.94-.05-.09-.18-.13-.38-.23z" /></svg>;
    case 'whatsapp_channel':
      return <img src="/whatsapp-channels.svg" alt="WhatsApp Channels" className={theme === 'dark' ? 'h-5 w-5 object-contain brightness-0 invert' : 'h-5 w-5 object-contain'} />;
    case 'qabilah':
      return <img src="/qabilah-logo.svg" alt="Qabilah" className="h-5 w-5 object-contain" />;
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
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    setTheme(getInitialTheme());

    if (typeof window !== 'undefined') {
      const pathLocale = window.location.pathname.split('/')[1];
      if (pathLocale === 'ar') {
        setLocale('ar');
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

  const allLinks = links.map(l => ({
    ...l,
    image: l.key === 'website' ? '/balsm-logo.svg' : 
           l.key === 'whatsapp_channel' ? '/whatsapp-channels.svg' : 
           l.key === 'qabilah' ? '/qabilah-logo.svg' : null
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
        className="fixed right-6 top-6 z-50 rounded-full border border-slate-200/80 bg-white/90 p-3 shadow-xl shadow-black/5 backdrop-blur-xl transition-all hover:scale-110 hover:border-primary/40 focus:outline-none dark:border-slate-700/50 dark:bg-slate-900/90 dark:shadow-black/20"
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
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white p-4 shadow-2xl transition-transform duration-500 hover:scale-105 dark:border-slate-800 dark:bg-slate-900 sm:h-32 sm:w-32">
              <img
                src="/balsm-logo.svg"
                alt="Balsm Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="mb-20 px-4">
            <h1 className="mb-10 bg-gradient-to-tr from-slate-900 to-slate-600 bg-clip-text text-3xl font-black tracking-tight text-transparent transition-all dark:from-white dark:to-slate-400 sm:text-4xl">
              {locale === 'ar' ? 'Balsm | بلسم' : 'Balsm | بلسم'}
            </h1>
            <p className="mx-auto mt-8 max-w-sm px-8 text-[0.95rem] font-medium leading-relaxed text-slate-500 transition-colors dark:text-slate-400 sm:text-[1.1rem]">
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
                  className={`group relative flex min-h-[64px] w-full items-center overflow-hidden rounded-xl border border-slate-200/50 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:bg-white hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:bg-slate-900/80 ${locale === 'ar' ? 'flex-row-reverse pl-12 pr-4' : 'flex-row pl-4 pr-12'}`}
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
                  <span className={`flex-1 truncate font-bold tracking-tight text-[#000000] transition-colors group-hover:text-slate-800 dark:text-white dark:group-hover:text-primary-light text-base sm:text-lg ${locale === 'ar' ? 'mr-4 text-right' : 'ml-4 text-left'}`}>
                    {link.label[locale]}
                  </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <footer className="mt-32 pb-24 text-center">
        <Link href={`/${locale}`} className="group inline-flex items-center gap-2 rounded-full border border-slate-200/50 bg-white/50 px-8 py-3 text-sm font-semibold tracking-wide text-slate-600 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-primary dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
          <img src="/balsm-logo.svg" className="h-5 w-5 transition-transform group-hover:rotate-12" alt="" />
            {locale === 'ar' ? 'بني بحب بواسطة بلسم' : 'Built with love by Balsm'}
          </Link>
        </footer>
      </main>
    </div>
  );
}
