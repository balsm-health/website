import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import ProvidersSections from '@/components/cloud/ProvidersSections';
import { alternates, openGraph, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'providersMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale, '/providers'),
    openGraph: openGraph({ locale, title, description, path: '/providers' }),
    twitter: twitter({ locale, title, description }),
  };
}

export default function ProvidersPage() {
  return (
    <SiteShell active="providers">
      <ProvidersSections />
    </SiteShell>
  );
}
