import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import CloudHero from '@/components/cloud/CloudHero';
import CloudFeatures from '@/components/cloud/CloudFeatures';
import CloudMap from '@/components/cloud/CloudMap';
import CloudInvestors from '@/components/cloud/CloudInvestors';
import CloudWaitlist from '@/components/cloud/CloudWaitlist';
import { alternates, openGraph, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cloudMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale, '/cloud'),
    openGraph: openGraph({ locale, title, description, path: '/cloud' }),
    twitter: twitter({ locale, title, description }),
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
