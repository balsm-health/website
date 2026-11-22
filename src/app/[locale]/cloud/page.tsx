import { permanentRedirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/request';

// Balsm Cloud no longer has its own page: it is a section of /products.
// Keep the old path working.
type Props = { params: Promise<{ locale: string }> };

export default async function CloudRedirect({ params }: Props) {
  const { locale } = await params;
  // Arabic is unprefixed; every other locale keeps its prefix.
  permanentRedirect(locale === defaultLocale ? '/products#cloud' : `/${locale}/products#cloud`);
}
