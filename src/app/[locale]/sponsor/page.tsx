import { permanentRedirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/request';

// Sponsor was folded into Partners (Partners.dc.html). Keep the old path working.
type Props = { params: Promise<{ locale: string }> };

export default async function SponsorRedirect({ params }: Props) {
  const { locale } = await params;
  // Arabic is unprefixed; every other locale keeps its prefix.
  permanentRedirect(locale === defaultLocale ? '/partners#partner' : `/${locale}/partners#partner`);
}
