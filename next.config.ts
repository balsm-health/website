import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable strict mode for better error handling
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
