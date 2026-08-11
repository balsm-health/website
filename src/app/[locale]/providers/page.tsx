import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import ProvidersSections from '@/components/cloud/ProvidersSections';
import JsonLd from '@/components/JsonLd';
import { alternates, openGraph, pageJsonLd, twitter } from '@/lib/seo';

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
    twitter: twitter({ title, description }),
  };
}

export default async function ProvidersPage({ params }: Props) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const meta = await getTranslations({ locale, namespace: 'providersMeta' });
  const jsonLd = pageJsonLd({
    locale,
    path: '/providers',
    title: meta('title'),
    description: meta('description'),
    breadcrumbs: [
      { name: nav('home'), path: '' },
      { name: nav('providers'), path: '/providers' },
    ],
  });

  return (
    <SiteShell active="providers">
      <ProvidersSections />
      <JsonLd data={jsonLd} />
    </SiteShell>
  );
}
