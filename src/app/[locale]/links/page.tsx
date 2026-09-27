"use client";

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import SocialLogo from '@/components/cloud/SocialLogo';
import { Globe, MailFilled, MoonFilled, SunFilled, Users } from '@/components/cloud/CloudIcons';

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
      return <Globe className={theme === 'dark' ? 'h-5 w-5 text-emerald-400' : 'h-5 w-5 text-emerald-600'} />;
    case 'linkedin':
      return <SocialLogo platform="linkedin" className={theme === 'dark' ? 'h-5 w-5 text-[#7AB7FF]' : 'h-5 w-5 text-[#0A66C2]'} />;
    case 'x':
      return <SocialLogo platform="x" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-ink-900'} />;
    case 'facebook':
      return <SocialLogo platform="facebook" className={theme === 'dark' ? 'h-5 w-5 text-[#8AB4F8]' : 'h-5 w-5 text-[#1877F2]'} />;
    case 'instagram':
      return <SocialLogo platform="instagram" className={theme === 'dark' ? 'h-5 w-5 text-[#F472B6]' : 'h-5 w-5 text-[#E1306C]'} />;
    case 'youtube':
      return <SocialLogo platform="youtube" className={theme === 'dark' ? 'h-5 w-5 text-[#FF6B6B]' : 'h-5 w-5 text-[#FF0000]'} />;
    case 'tiktok':
      return <SocialLogo platform="tiktok" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-ink-900'} />;
    case 'patreon':
      return <SocialLogo platform="patreon" className={theme === 'dark' ? 'h-5 w-5 text-[#FF8088]' : 'h-5 w-5 text-[#FF424D]'} />;
    case 'github':
      return <SocialLogo platform="github" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-ink-900'} />;
    case 'threads':
      return <SocialLogo platform="threads" className={theme === 'dark' ? 'h-5 w-5 text-white' : 'h-5 w-5 text-ink-900'} />;
    case 'email':
      return <MailFilled className={theme === 'dark' ? 'h-5 w-5 text-[#FCA5A5]' : 'h-5 w-5 text-[#DC2626]'} />;
    case 'whatsapp_number':
      return <SocialLogo platform="whatsapp" className={theme === 'dark' ? 'h-5 w-5 text-[#4ADE80]' : 'h-5 w-5 text-[#16A34A]'} />;
    case 'whatsapp_channel':
      return <img src="/whatsapp-channels.svg" alt="WhatsApp Channels" className={theme === 'dark' ? 'h-5 w-5 object-contain brightness-0 invert' : 'h-5 w-5 object-contain'} />;
    case 'qabilah':
      // Placeholder until a licensed Qabilah mark lands in public/ — the file
      // this used to point at (/qabilah-logo.svg) was never in the repo, so the
      // row rendered a broken image. Swap this back to an <img> once the real
      // asset is available.
      return <Users className={theme === 'dark' ? 'h-5 w-5 text-[#5EEAD4]' : 'h-5 w-5 text-[#0D9488]'} />;
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
          <SunFilled className="h-5 w-5 text-amber-400" />
        ) : (
          <MoonFilled className="h-5 w-5 text-primary" />
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
