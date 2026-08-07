import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import ContributorsSections from '@/components/cloud/ContributorsSections';
import { alternates, openGraph, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contributorsMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale, '/contributors'),
    openGraph: openGraph({ locale, title, description, path: '/contributors' }),
    twitter: twitter({ title, description }),
  };
}

export default function ContributorsPage() {
  return (
    <SiteShell active="contributors">
      <ContributorsSections />
    </SiteShell>
  );
}
