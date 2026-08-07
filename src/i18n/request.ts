import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
// Arabic is the default: it is served unprefixed at `/`, and English lives
// under `/en`. `localePrefix: 'as-needed'` (see routing.ts) means `/ar/...`
// redirects to the unprefixed form.
export const defaultLocale: Locale = 'ar';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
