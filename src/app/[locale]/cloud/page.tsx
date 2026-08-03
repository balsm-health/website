import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import CloudHero from '@/components/cloud/CloudHero';
import CloudFeatures from '@/components/cloud/CloudFeatures';
import CloudMap from '@/components/cloud/CloudMap';
import CloudInvestors from '@/components/cloud/CloudInvestors';
import CloudWaitlist from '@/components/cloud/CloudWaitlist';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cloudMeta' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balsm.health';
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteUrl}/${locale}/cloud`,
      languages: { en: `${siteUrl}/en/cloud`, ar: `${siteUrl}/ar/cloud` },
    },
    openGraph: { title: t('title'), description: t('description'), locale: locale === 'ar' ? 'ar_EG' : 'en_US', url: `${siteUrl}/${locale}/cloud` },
  };
}

export default function CloudPage() {
  return (
    <SiteShell active="cloud">
      <CloudHero />
      <CloudFeatures />
      <CloudMap />
      <CloudInvestors />
      <CloudWaitlist />
    </SiteShell>
  );
}
