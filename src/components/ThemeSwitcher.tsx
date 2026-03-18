'use client';

import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');

    setTimeout(() => setIsAnimating(false), 500);
  };

  if (!mounted) {
    return (
      <button
        className="group relative p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/50 dark:border-slate-700/50 shadow-lg shadow-black/5 dark:shadow-black/20"
        aria-label="Toggle theme"
        suppressHydrationWarning
      >
        <div className="w-6 h-6" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/50 dark:border-slate-700/50 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      suppressHydrationWarning
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/20 group-hover:via-primary-light/20 group-hover:to-primary/20 transition-all duration-300 -z-10" />

      {/* Icon container with rotation animation */}
      <div className={`relative w-6 h-6 transition-transform duration-500 ${isAnimating ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`}>
        {/* Moon icon (for light theme) */}
        <svg
          className={`absolute inset-0 w-6 h-6 text-slate-700 dark:text-slate-300 transition-all duration-300 ${
            theme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-180 scale-50'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>

        {/* Sun icon (for dark theme) */}
        <svg
          className={`absolute inset-0 w-6 h-6 text-slate-700 dark:text-amber-400 transition-all duration-300 ${
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-180 scale-50'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>

      {/* Ripple effect */}
      <div className={`absolute inset-0 rounded-2xl bg-primary/20 transition-opacity duration-300 ${isAnimating ? 'animate-ping opacity-75' : 'opacity-0'}`} />
    </button>
  );
}
