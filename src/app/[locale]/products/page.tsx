import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import ProductsSections from '@/components/cloud/ProductsSections';
import JsonLd from '@/components/JsonLd';
import { alternates, openGraph, pageJsonLd, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'productsMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale, '/products'),
    openGraph: openGraph({ locale, title, description, path: '/products' }),
    twitter: twitter({ locale, title, description }),
  };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  const meta = await getTranslations({ locale, namespace: 'productsMeta' });
  const jsonLd = pageJsonLd({
    locale,
    path: '/products',
    title: meta('title'),
    description: meta('description'),
    breadcrumbs: [
      { name: t('breadcrumb.home'), path: '' },
      { name: t('breadcrumb.page'), path: '/products' },
    ],
  });

  return (
    <SiteShell active="products">
      <ProductsSections />
      <JsonLd data={jsonLd} />
    </SiteShell>
  );
}
