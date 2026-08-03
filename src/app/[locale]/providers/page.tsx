import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import ProvidersSections from '@/components/cloud/ProvidersSections';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'providersMeta' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balsm.health';
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteUrl}/${locale}/providers`,
      languages: { en: `${siteUrl}/en/providers`, ar: `${siteUrl}/ar/providers` },
    },
    openGraph: { title: t('title'), description: t('description'), locale: locale === 'ar' ? 'ar_EG' : 'en_US', url: `${siteUrl}/${locale}/providers` },
  };
}

export default function ProvidersPage() {
  return (
    <SiteShell active="providers">
      <ProvidersSections />
    </SiteShell>
  );
}
