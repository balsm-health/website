import { getTranslations } from 'next-intl/server';
import MarketplaceApp from '@/components/cloud/marketplace/MarketplaceApp';
import JsonLd from '@/components/JsonLd';
import { alternates, openGraph, pageJsonLd, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'marketplaceMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale, '/marketplace'),
    openGraph: openGraph({ locale, title, description, path: '/marketplace' }),
    twitter: twitter({ locale, title, description }),
  };
}

export default async function MarketplacePage({ params }: Props) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const meta = await getTranslations({ locale, namespace: 'marketplaceMeta' });
  const jsonLd = pageJsonLd({
    locale,
    path: '/marketplace',
    title: meta('title'),
    description: meta('description'),
    breadcrumbs: [
      { name: nav('home'), path: '' },
      { name: meta('crumb'), path: '/marketplace' },
    ],
  });

  // The marketplace is one client app: the shell (with the signed-in account
  // menu) is rendered from inside it so the nav reflects its state.
  return (
    <>
      <MarketplaceApp />
      <JsonLd data={jsonLd} />
    </>
  );
}
