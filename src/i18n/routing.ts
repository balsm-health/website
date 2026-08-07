import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './request';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Arabic is served unprefixed at `/`; English lives under `/en`. `/ar/...`
  // redirects to the unprefixed form.
  localePrefix: 'as-needed',
  // `/` is always Arabic. With detection on, next-intl reads Accept-Language
  // and bounces an English-preferring browser from `/` to `/en` — and most
  // browsers in the region report English regardless of what the reader wants,
  // which would defeat the point of an Arabic-first default. Language is
  // switched explicitly, via the nav toggle.
  localeDetection: false,
});
