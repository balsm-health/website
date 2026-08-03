import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import ContributorsSections from '@/components/cloud/ContributorsSections';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contributorsMeta' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balsm.health';
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteUrl}/${locale}/contributors`,
      languages: { en: `${siteUrl}/en/contributors`, ar: `${siteUrl}/ar/contributors` },
    },
    openGraph: { title: t('title'), description: t('description'), locale: locale === 'ar' ? 'ar_EG' : 'en_US', url: `${siteUrl}/${locale}/contributors` },
  };
}

export default function ContributorsPage() {
  return (
    <SiteShell active="contributors">
      <ContributorsSections />
    </SiteShell>
  );
}
