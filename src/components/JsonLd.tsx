/**
 * Emits a JSON-LD structured-data block.
 *
 * The site-level graph is injected inline via
 * `dangerouslySetInnerHTML` (crawlers read ld+json from anywhere in the
 * document, and keeping our tags out of <head> avoids the hydration mismatch
 * documented in the locale layout). This wraps that same pattern so per-route
 * pages don't each repeat the script boilerplate.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
