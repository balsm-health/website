import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import ProfileFrameGenerator from '@/components/cloud/ProfileFrameGenerator';
import JsonLd from '@/components/JsonLd';
import { alternates, openGraph, pageJsonLd, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

const PATH = '/contributors/frame';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contributorsFrameMeta' });
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

export default async function ContributorsFramePage({ params }: Props) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const meta = await getTranslations({ locale, namespace: 'contributorsFrameMeta' });
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
      <ProfileFrameGenerator />
      <JsonLd data={jsonLd} />
    </SiteShell>
  );
}
