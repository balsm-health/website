import { getTranslations } from 'next-intl/server';
import { alternates, openGraph, twitter } from '@/lib/seo';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * links/page.tsx is a client component, so its metadata has to live here.
 * Without it the route inherited the locale layout's `alternates(locale)` and
 * shipped a canonical pointing at the home page — telling Google to fold this
 * URL into `/`, while the sitemap still listed it as its own page.
 */
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'linksMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale, '/links'),
    openGraph: openGraph({ locale, title, description, path: '/links' }),
    twitter: twitter({ title, description }),
  };
}

export default function LinksLayout({ children }: Props) {
  return children;
}
