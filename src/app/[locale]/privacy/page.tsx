import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import JsonLd from '@/components/JsonLd';
import { C, DISPLAY, FONT } from '@/components/cloud/theme';
import { Mail } from '@/components/cloud/CloudIcons';
import { alternates, openGraph, pageJsonLd, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

type Item = { term?: string; text: string };
type Section = { id: string; title: string; paragraphs?: string[]; items?: Item[]; after?: string };

// A reading page, not a marketing one: one narrow column, no Reveal wrappers.
// Nothing here should animate in — a policy has to be readable the instant it
// loads, and with scripting off.
const column: React.CSSProperties = { maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' };
const para: React.CSSProperties = { fontSize: 17, lineHeight: 1.85, color: C.ink2, margin: '0 0 14px' };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacyMeta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: alternates(locale, '/privacy'),
    openGraph: openGraph({ locale, title, description, path: '/privacy' }),
    twitter: twitter({ locale, title, description }),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const meta = await getTranslations({ locale, namespace: 'privacyMeta' });
  const sections = t.raw('sections') as Section[];
  const email = t('contact.email');

  const jsonLd = pageJsonLd({
    locale,
    path: '/privacy',
    title: meta('title'),
    description: meta('description'),
    breadcrumbs: [
      { name: nav('home'), path: '' },
      { name: t('breadcrumb'), path: '/privacy' },
    ],
  });

  return (
    <SiteShell>
      {/* HERO */}
      <section style={{ padding: 'clamp(44px,7vw,84px) 0 clamp(28px,4vw,44px)', background: `linear-gradient(180deg,${C.blueBg} 0%, ${C.bg} 100%)` }}>
        <div style={column}>
          {/* 19px bold is WCAG large text — see the eyebrow note in SponsorSections. */}
          <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 19, color: DISPLAY.blue }}>{t('hero.eyebrow')}</div>
          <h1 style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(32px,5vw,54px)', lineHeight: 1.15, color: C.ink, margin: '12px 0 16px' }}>
            {t('hero.title')}
          </h1>
          <p style={{ fontSize: 'clamp(17px,1.9vw,20px)', lineHeight: 1.75, color: C.ink2, margin: '0 0 18px' }}>{t('hero.subtitle')}</p>
          <p style={{ fontSize: 14.5, color: C.ink2, margin: 0 }}>{t('hero.updated')}</p>
        </div>
      </section>

      <div style={{ ...column, paddingBottom: 'clamp(56px,8vw,96px)' }}>
        {/* TABLE OF CONTENTS */}
        <nav aria-labelledby="privacy-toc" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: '18px 22px', margin: '8px 0 40px' }}>
          <h2 id="privacy-toc" style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 16, color: C.ink, margin: '0 0 4px' }}>{t('tocLabel')}</h2>
          <ol style={{ margin: 0, paddingInlineStart: 22, color: C.ink2, fontSize: 15.5 }}>
            {sections.map((s) => (
              <li key={s.id}>
                {/* Rows are 44px tall so each entry clears the target floor. */}
                <a href={`#${s.id}`} style={{ display: 'flex', alignItems: 'center', minHeight: 44, color: C.ink2 }}>{s.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        {/* SECTIONS */}
        {sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} style={{ marginBottom: 36, scrollMarginTop: 96 }}>
            <h2 id={`${s.id}-title`} style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 'clamp(22px,2.6vw,28px)', lineHeight: 1.3, color: C.ink, margin: '0 0 12px' }}>
              {s.title}
            </h2>
            {s.paragraphs?.map((p) => <p key={p} style={para}>{p}</p>)}
            {s.items && (
              <ul style={{ ...para, paddingInlineStart: 22 }}>
                {s.items.map((item) => (
                  <li key={item.text} style={{ marginBottom: 8 }}>
                    {item.term && <strong dir="auto" style={{ color: C.ink }}>{item.term}</strong>}
                    {item.term && ': '}
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
            {s.after && <p style={para}>{s.after}</p>}
          </section>
        ))}

        {/* CONTACT */}
        <section id="contact" aria-labelledby="contact-title" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 'clamp(22px,3vw,30px)', scrollMarginTop: 96 }}>
          <h2 id="contact-title" style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 22, color: C.ink, margin: '0 0 8px' }}>{t('contact.title')}</h2>
          <p style={{ ...para, marginBottom: 12 }}>{t('contact.body')}</p>
          <a href={`mailto:${email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, fontWeight: 600, fontSize: 17, color: C.blueDark }}>
            <Mail style={{ width: 20, height: 20 }} aria-hidden />
            <span dir="ltr">{email}</span>
          </a>
        </section>
      </div>

      <JsonLd data={jsonLd} />
    </SiteShell>
  );
}
