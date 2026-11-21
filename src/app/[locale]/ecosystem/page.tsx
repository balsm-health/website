import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import EcosystemSections from '@/components/cloud/EcosystemSections';
import JsonLd from '@/components/JsonLd';
import { alternates, openGraph, pageJsonLd, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ecosystemMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale, '/ecosystem'),
    openGraph: openGraph({ locale, title, description, path: '/ecosystem' }),
    twitter: twitter({ locale, title, description, path: '/ecosystem' }),
  };
}

export default async function EcosystemPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ecosystem' });
  const meta = await getTranslations({ locale, namespace: 'ecosystemMeta' });
  const jsonLd = pageJsonLd({
    locale,
    path: '/ecosystem',
    title: meta('title'),
    description: meta('description'),
    breadcrumbs: [
      { name: t('breadcrumb.home'), path: '' },
      { name: t('breadcrumb.page'), path: '/ecosystem' },
    ],
  });

  return (
    <SiteShell active="ecosystem">
      <EcosystemSections />
      <JsonLd data={jsonLd} />
    </SiteShell>
  );
}
