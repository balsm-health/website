import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import ShareJoined from '@/components/cloud/ShareJoined';
import JsonLd from '@/components/JsonLd';
import { alternates, canonicalUrl, openGraph, pageJsonLd, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

const PATH = '/contributors/joined';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contributorsJoinedMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale, PATH),
    openGraph: openGraph({ locale, title, description, path: PATH }),
    twitter: twitter({ locale, title, description }),
  };
}

export default async function ContributorsJoinedPage({ params }: Props) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const meta = await getTranslations({ locale, namespace: 'contributorsJoinedMeta' });
  const jsonLd = pageJsonLd({
    locale,
    path: PATH,
    title: meta('title'),
    description: meta('description'),
    breadcrumbs: [
      { name: nav('home'), path: '' },
      { name: nav('contributors'), path: '/contributors' },
      { name: meta('title'), path: PATH },
    ],
  });

  return (
    <SiteShell active="contributors">
      <ShareJoined shareUrl={canonicalUrl(locale, '/contributors')} />
      <JsonLd data={jsonLd} />
    </SiteShell>
  );
}
