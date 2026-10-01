import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import DownloadSections from '@/components/cloud/DownloadSections';
import JsonLd from '@/components/JsonLd';
import { DISTRIBUTION, appStoreId, channelUrls, detectPlatform, isPreBeta } from '@/lib/appDistribution';
import { alternates, openGraph, pageJsonLd, twitter } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const appId = appStoreId(DISTRIBUTION.appStore);
  const t = await getTranslations({ locale, namespace: 'downloadMeta' });
  // Pre-beta, the link preview promises early access, not a download.
  const beta = isPreBeta(channelUrls());
  const title = t(beta ? 'betaTitle' : 'title');
  const description = t(beta ? 'betaDescription' : 'description');
  return {
    title,
    description,
    alternates: alternates(locale, '/download'),
    openGraph: openGraph({ locale, title, description, path: '/download' }),
    twitter: twitter({ locale, title, description }),
    // Safari's Smart App Banner — "Open" if installed, "Get" if not.
    ...(appId && { itunes: { appId } }),
  };
}

/**
 * Reached only when middleware did not already send the device to a store:
 * desktop, a platform whose store isn't live yet, a crawler, or `?choose`.
 * Reading the User-Agent here makes the route dynamic, which it has to be — the
 * recommended option differs per device.
 */
export default async function DownloadPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const choose = (await searchParams).choose !== undefined;
  const platform = detectPlatform((await headers()).get('user-agent'));
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const meta = await getTranslations({ locale, namespace: 'downloadMeta' });
  const urls = channelUrls();
  const beta = isPreBeta(urls);
  const title = meta(beta ? 'betaTitle' : 'title');
  const jsonLd = pageJsonLd({
    locale,
    path: '/download',
    title,
    description: meta(beta ? 'betaDescription' : 'description'),
    breadcrumbs: [
      { name: nav('home'), path: '' },
      { name: title, path: '/download' },
    ],
  });

  return (
    <SiteShell>
      <DownloadSections platform={platform} urls={urls} choose={choose} />
      <JsonLd data={jsonLd} />
    </SiteShell>
  );
}
