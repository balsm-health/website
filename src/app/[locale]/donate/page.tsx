import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/request';

// Donate was renamed to Sponsor. Keep the old path working.
type Props = { params: Promise<{ locale: string }> };

export default async function DonateRedirect({ params }: Props) {
  const { locale } = await params;
  // Arabic is unprefixed; every other locale keeps its prefix.
  redirect(locale === defaultLocale ? '/sponsor' : `/${locale}/sponsor`);
}
