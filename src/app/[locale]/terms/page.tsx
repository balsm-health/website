import LegalPage, { isEmbedded, legalMetadata, type LegalSearchParams } from '@/components/cloud/LegalPage';

// Also opened inside the Balsm apps — see LegalPage for the ?embed=1 view.
type Props = { params: Promise<{ locale: string }>; searchParams: LegalSearchParams };

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  return legalMetadata(locale, 'terms', await isEmbedded(searchParams));
}

export default async function TermsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  return <LegalPage locale={locale} ns="terms" embed={await isEmbedded(searchParams)} />;
}
