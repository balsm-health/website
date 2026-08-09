import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import SponsorSections from '@/components/cloud/SponsorSections';
import { alternates, openGraph, twitter } from '@/lib/seo';

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
    twitter: twitter({ title, description }),
  };
}

export default function SponsorPage() {
  return (
    <SiteShell active="sponsor">
      <SponsorSections />
    </SiteShell>
  );
}
