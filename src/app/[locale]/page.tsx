import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import HomeSections from '@/components/cloud/HomeSections';
import JsonLd from '@/components/JsonLd';
import { alternates, openGraph, pageJsonLd, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'homeMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale),
    openGraph: openGraph({ locale }),
    twitter: twitter({ locale }),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const meta = await getTranslations({ locale, namespace: 'homeMeta' });
  const jsonLd = pageJsonLd({
    locale,
    path: '',
    title: meta('title'),
    description: meta('description'),
    breadcrumbs: [{ name: nav('home'), path: '' }],
  });

  return (
    <SiteShell active="home">
      <HomeSections />
      <JsonLd data={jsonLd} />
    </SiteShell>
  );
}
