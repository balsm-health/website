import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import HomeSections from '@/components/cloud/HomeSections';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'homeMeta' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balsm.health';
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: { en: `${siteUrl}/en`, ar: `${siteUrl}/ar` },
    },
    openGraph: { title: t('title'), description: t('description'), locale: locale === 'ar' ? 'ar_EG' : 'en_US', url: `${siteUrl}/${locale}` },
  };
}

export default function Home() {
  return (
    <SiteShell active="home">
      <HomeSections />
    </SiteShell>
  );
}
