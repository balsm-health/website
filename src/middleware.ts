import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Single source of truth for locales and prefixing — see i18n/routing.ts.
export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
