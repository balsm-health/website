import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import ContributorsSections from '@/components/cloud/ContributorsSections';
import { alternates, openGraph, twitter } from '@/lib/seo';
import { fetchOrgIssues } from '@/lib/github';

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

export default async function ContributorsPage() {
  // Fetched here rather than in the client component so the list is server
  // rendered (crawlers and no-JS visitors see it) and the hourly cache is
  // shared across every visitor instead of one request per browser.
  const issues = await fetchOrgIssues();

  return (
    <SiteShell active="contributors">
      <ContributorsSections issues={issues} />
    </SiteShell>
  );
}
