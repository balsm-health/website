import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import SponsorSections from '@/components/cloud/SponsorSections';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sponsorMeta' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balsm.health';
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteUrl}/${locale}/sponsor`,
      languages: { en: `${siteUrl}/en/sponsor`, ar: `${siteUrl}/ar/sponsor` },
    },
    openGraph: { title: t('title'), description: t('description'), locale: locale === 'ar' ? 'ar_EG' : 'en_US', url: `${siteUrl}/${locale}/sponsor` },
  };
}

export default function SponsorPage() {
  return (
    <SiteShell active="sponsor">
      <SponsorSections />
    </SiteShell>
  );
}
