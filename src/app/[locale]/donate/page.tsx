import { redirect } from 'next/navigation';

// Donate was renamed to Sponsor. Keep the old path working.
type Props = { params: Promise<{ locale: string }> };

export default async function DonateRedirect({ params }: Props) {
  const { locale } = await params;
  redirect(locale === 'en' ? '/sponsor' : `/${locale}/sponsor`);
}
