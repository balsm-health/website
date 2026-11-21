import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import PartnersSections from '@/components/cloud/PartnersSections';
import JsonLd from '@/components/JsonLd';
import { alternates, openGraph, pageJsonLd, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'partnersMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale, '/partners'),
    openGraph: openGraph({ locale, title, description, path: '/partners' }),
    twitter: twitter({ locale, title, description, path: '/partners' }),
  };
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const t = await getTranslations({ locale, namespace: 'partners' });
  const meta = await getTranslations({ locale, namespace: 'partnersMeta' });
  const jsonLd = pageJsonLd({
    locale,
    path: '/partners',
    title: meta('title'),
    description: meta('description'),
    breadcrumbs: [
      { name: nav('home'), path: '' },
      { name: t('breadcrumb'), path: '/partners' },
    ],
  });

  return (
    <SiteShell active="partners">
      <PartnersSections />
      <JsonLd data={jsonLd} />
    </SiteShell>
  );
}
