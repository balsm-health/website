import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import SponsorSections from '@/components/cloud/SponsorSections';
import JsonLd from '@/components/JsonLd';
import { alternates, openGraph, pageJsonLd, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sponsorMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale, '/sponsor'),
    openGraph: openGraph({ locale, title, description, path: '/sponsor' }),
    twitter: twitter({ locale, title, description }),
  };
}

export default async function SponsorPage({ params }: Props) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const meta = await getTranslations({ locale, namespace: 'sponsorMeta' });
  const jsonLd = pageJsonLd({
    locale,
    path: '/sponsor',
    title: meta('title'),
    description: meta('description'),
    breadcrumbs: [
      { name: nav('home'), path: '' },
      { name: nav('sponsor'), path: '/sponsor' },
    ],
  });

  return (
    <SiteShell active="sponsor">
      <SponsorSections />
      <JsonLd data={jsonLd} />
    </SiteShell>
  );
}
