'use client';

import { useTranslations } from 'next-intl';
import { C, FONT, MOTION } from './theme';
import Reveal from './Reveal';

type Item = { q: string; a: string };

/**
 * The visible FAQ. Its content is the same i18n source the FAQPage JSON-LD is
 * built from (see the home page), which is deliberate: Google requires FAQ
 * structured data to match content the reader can actually see, and generating
 * both from one place is what stops them drifting apart.
 *
 * Built on <details>, so the answers are keyboard accessible and present in the
 * HTML even while collapsed — crawlers and answer engines read them either way.
 */
export default function FaqSection() {
  const t = useTranslations('faq');
  const items = t.raw('items') as Item[];

  return (
    <section
      id="faq"
      style={{
        padding: 'clamp(60px,9vw,108px) 0',
        background: C.white,
        borderTop: `1px solid ${C.borderHair}`,
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }}>
        <Reveal style={{ marginBottom: 38 }}>
          <div style={{ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color: C.aqua }}>
            {t('eyebrow')}
          </div>
          <h2
            style={{
              fontFamily: FONT.cairo,
              fontWeight: 800,
              fontSize: 'clamp(28px,4.2vw,46px)',
              lineHeight: 1.15,
              color: C.ink,
              margin: '12px 0 0',
            }}
          >
            {t('title')}
          </h2>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <details
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: '18px 22px',
                }}
              >
                <summary
                  style={{
                    fontFamily: FONT.cairo,
                    fontWeight: 700,
                    fontSize: 17,
                    color: C.ink,
                    cursor: 'pointer',
                    listStyle: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 14,
                  }}
                >
                  {item.q}
                  {/* Rotates with [open] — see globals.css */}
                  <span aria-hidden className="balsm-faq-chevron" style={{ color: C.muted, flex: 'none', fontSize: 20, lineHeight: 1 }}>
                    +
                  </span>
                </summary>
                <p
                  style={{
                    fontSize: 15.5,
                    lineHeight: 1.85,
                    color: C.ink2,
                    margin: '14px 0 0',
                    transition: MOTION.revealTransition,
                  }}
                >
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
