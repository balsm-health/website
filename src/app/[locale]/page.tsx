import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import HomeSections from '@/components/cloud/HomeSections';
import { alternates, openGraph, twitter } from '@/lib/seo';

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
    openGraph: openGraph({ locale, title, description }),
    twitter: twitter({ title, description }),
  };
}

export default function Home() {
  return (
    <SiteShell active="home">
      <HomeSections />
    </SiteShell>
  );
}
