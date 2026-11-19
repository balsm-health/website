'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { C, FONT } from '../theme';
import { ArrowRight, CircleCheck } from '../CloudIcons';
import type { Msg } from './state';
import css from './marketplace.module.css';

export { css };

// Values from Marketplace.dc.html that theme.ts has no token for.
export const MK = {
  muted: '#5F6B77',      // hint / secondary text
  errBg: '#FBEBE7',
  errFg: '#9E3125',
  okFg: '#2A8C47',
  okDark: '#1F6B37',
  okBorder: '#BFEBCD',
  teal: '#01866F',       // aqua kicker text
  violetText: '#5C3AB0',
  amberText: '#7A5A0F',
  noteFg: '#5E440A',
  noteBorder: '#F1DFA6',
  chipBg: '#F2F4F6',
  hover: '#F6F7F8',
  border2: '#C4CAD1',
} as const;

export const page = (max: number, pad = '0 20px'): CSSProperties => ({ maxWidth: max, margin: '0 auto', padding: pad });
export const section = (bg: string = C.bg, pad = 'clamp(40px,6vw,72px) 0'): CSSProperties => ({ padding: pad, background: bg });
export const kicker = (color: string): CSSProperties => ({ fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13, color });
export const h1 = (size = 'clamp(26px,3.6vw,36px)', margin = '6px 0 8px'): CSSProperties => ({ fontFamily: FONT.cairo, fontWeight: 800, fontSize: size, margin, color: C.ink });
export const lead: CSSProperties = { fontSize: 15.5, lineHeight: 1.75, color: C.ink2, margin: '0 0 24px' };
export const chip = (bg: string, fg: string, size = 12): CSSProperties => ({ padding: '3px 10px', borderRadius: 999, background: bg, color: fg, fontFamily: FONT.cairo, fontWeight: 700, fontSize: size });
export const linkBtn: CSSProperties = { border: 'none', background: 'none', padding: 0, color: C.blueDark, fontFamily: FONT.cairo, fontWeight: 700, fontSize: 13.5, cursor: 'pointer' };
export const ltrInput: CSSProperties = { textAlign: 'left' };
export const codeInput: CSSProperties = { textAlign: 'center', letterSpacing: '.5em', fontFamily: FONT.mono, fontSize: 20 };

/** Translator for the `marketplace` namespace that also renders stored Msg values. */
export function useMt() {
  const t = useTranslations('marketplace');
  const msg = (m: Msg) => {
    const vals: Record<string, string> = { ...(m.v || {}) };
    for (const [k, key] of Object.entries(m.vk || {})) vals[k] = t(key);
    const out = t(m.k, vals);
    return m.strip ? out.replace(/\s*\*$/, '') : out;
  };
  // Seeded records carry a message key; typed ones carry their own text.
  const name = (o: { name: string; nameKey?: string } | null | undefined) => (o ? (o.nameKey ? t(o.nameKey) : o.name) : '');
  return { t, msg, name };
}

export function ErrorList({ errors, style }: { errors: Msg[]; style?: CSSProperties }) {
  const { t, msg } = useMt();
  if (!errors.length) return null;
  return (
    <div role="alert" style={{ marginTop: 16, padding: '14px 16px', borderRadius: 14, background: MK.errBg, color: MK.errFg, fontSize: 14.5, ...style }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{t('common.errorsTitle')}</div>
      <ul style={{ margin: 0, paddingInlineStart: 0, listStyle: 'none' }}>
        {errors.map((e, i) => <li key={i}>• {msg(e)}</li>)}
      </ul>
    </div>
  );
}

export function Alert({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  if (!children) return null;
  return <div role="alert" style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, background: MK.errBg, color: MK.errFg, fontSize: 14, ...style }}>{children}</div>;
}

export function FieldError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <div role="alert" className={css.err}>{children}</div>;
}

export function BackButton({ onClick, children, size = 14.5 }: { onClick: () => void; children: ReactNode; size?: number }) {
  return (
    <button type="button" onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '6px 0', border: 'none', background: 'none', color: C.blueDark, fontFamily: FONT.cairo, fontWeight: 700, fontSize: size, cursor: 'pointer', marginBottom: 8 }}>
      <ArrowRight className="v2-flip" style={{ width: 16, height: 16 }} />
      {children}
    </button>
  );
}

export function CenterLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} style={{ display: 'block', minHeight: 44, margin: '18px auto 0', border: 'none', background: 'none', color: C.ink2, fontFamily: FONT.cairo, fontWeight: 600, fontSize: 14.5, cursor: 'pointer' }}>
      {children}
    </button>
  );
}

export function SuccessNote({ title, children }: { title?: ReactNode; children?: ReactNode }) {
  return (
    <div role="status" className={css.pop} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '16px 18px', borderRadius: 16, background: C.greenBg, border: `1px solid ${MK.okBorder}` }}>
      <CircleCheck style={{ width: 22, height: 22, color: MK.okFg, flex: 'none' }} />
      <div>
        {title && <div style={{ fontFamily: FONT.cairo, fontWeight: 800, fontSize: 17, color: C.ink }}>{title}</div>}
        {children && <div style={{ fontSize: 14.5, color: title ? C.ink2 : C.ink, lineHeight: 1.6, marginTop: title ? 2 : 0 }}>{children}</div>}
      </div>
    </div>
  );
}
