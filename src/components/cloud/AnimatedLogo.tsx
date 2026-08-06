'use client';

/**
 * The Balsm mark, animated.
 *
 * A local stand-in for the design system's `AnimatedLogo` (the design file
 * imports it as `BalsmDesignSystem_51cdbf.AnimatedLogo`). The DS ships it as a
 * web-component runtime bundle, which we deliberately don't pull into the Next
 * app — same call we already make for the lucide icons in CloudIcons.tsx.
 *
 * The artwork itself is NOT duplicated here: it's referenced straight from
 * /balsm-logo.svg, which is a copy of the canonical Balsm-Core/brand/icon.svg.
 * Update the brand asset and this follows automatically.
 *
 * Timings are the DS values verbatim:
 *   bloom   1150ms cubic-bezier(.2,.8,.2,1)
 *   breathe 4600ms ease-in-out, starting after the 1750ms settle
 *
 * Trade-off of referencing the file rather than inlining it: the browser can't
 * address individual petals inside an <img>, so the bloom plays on the mark as
 * a whole instead of cascading petal-by-petal at 120ms. The unfurl-from-the-hub
 * motion and its soft overshoot are preserved.
 *
 * Both animations use `fill-mode: both` and rest on the finished mark, so under
 * reduced motion (globals.css collapses every animation to 0.01ms) the logo
 * renders complete and still rather than blank.
 */
export default function AnimatedLogo({
  size = 96,
  idle = 'breathe',
  title,
  style,
}: {
  size?: number;
  idle?: 'breathe' | 'none';
  title?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        // The point the five petals converge on, as a fraction of the asset's
        // 447x470 viewBox — everything rotates and scales about the hub.
        transformOrigin: '49% 53%',
        animation: idle === 'breathe' ? 'balsm-logo-breathe 4600ms ease-in-out 1750ms infinite' : undefined,
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/balsm-logo.svg"
        alt={title ?? ''}
        aria-hidden={title ? undefined : true}
        width={size}
        height={size}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          transformOrigin: '49% 53%',
          animation: 'balsm-logo-bloom 1150ms cubic-bezier(.2,.8,.2,1) both',
        }}
      />
    </span>
  );
}
