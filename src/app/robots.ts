import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * Search and AI crawlers are both welcomed deliberately.
 *
 * Being cited by answer engines (ChatGPT, Claude, Perplexity, Google AI
 * Overviews) requires their fetchers to be able to read the site, so they are
 * listed explicitly rather than left to the wildcard — an explicit group is
 * what a per-agent block elsewhere in the file gets compared against.
 *
 * NOTE: this file is not the last word in production. Cloudflare's AI Crawl
 * Control prepends its own managed rules to the served robots.txt and is
 * currently issuing `Disallow: /` for ClaudeBot, GPTBot, CCBot, Google-Extended
 * and others — which overrides the intent below. That is a zone setting in the
 * Cloudflare dashboard, not something this file can undo.
 */

// Fetchers that retrieve pages to answer a user's question and cite the source.
// These are the ones that matter for being quoted in AI answers.
const ANSWER_ENGINES = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'CCBot',
  'cohere-ai',
  'Meta-ExternalAgent',
  'Amazonbot',
  'Bytespider',
  'YouBot',
  'DuckAssistBot',
  'MistralAI-User',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /api is server-only, and Next's build output has no crawlable value.
        disallow: ['/api/', '/_next/'],
      },
      ...ANSWER_ENGINES.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
