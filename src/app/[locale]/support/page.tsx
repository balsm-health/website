import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import SupportSections from '@/components/cloud/SupportSections';
import JsonLd from '@/components/JsonLd';
import { alternates, openGraph, pageJsonLd, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'supportMeta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: alternates(locale, '/support'),
    openGraph: openGraph({ locale, path: '/support' }),
    twitter: twitter({ locale, path: '/support' }),
  };
}

export default async function SupportPage({ params }: Props) {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: 'supportMeta' });
  const footer = await getTranslations({ locale, namespace: 'siteFooter.community' });
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const support = await getTranslations({ locale, namespace: 'support' });
  const faq = support.raw('faq.items') as { q: string; a: string }[];

  const jsonLd = pageJsonLd({
    locale,
    path: '/support',
    title: meta('title'),
    description: meta('description'),
    breadcrumbs: [
      { name: nav('home'), path: '' },
      { name: footer('help'), path: '/support' },
    ],
  });

  // The FAQ as structured data, from the same strings the page shows.
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <SiteShell>
      <SupportSections />
      <JsonLd data={jsonLd} />
      <JsonLd data={faqLd} />
    </SiteShell>
  );
}
