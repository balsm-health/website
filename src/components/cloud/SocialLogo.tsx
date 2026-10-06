/**
 * A social platform's logo, loaded from its asset in /public/social rather than
 * inlined as path data.
 *
 * Painted as a CSS mask over `currentColor` instead of an <img>, so the logo
 * still takes the surrounding text colour — the footer's hover state and the
 * links page's per-theme brand tints keep working without a second copy of
 * the artwork.
 */
export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'x'
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'whatsapp'
  | 'patreon'
  | 'discord'
  | 'threads';

export default function SocialLogo({
  platform,
  size,
  className,
  style,
}: {
  platform: SocialPlatform;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const mask = `url(/social/${platform}.svg) center / contain no-repeat`;
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: 'block',
        flex: 'none',
        width: size,
        height: size,
        backgroundColor: 'currentColor',
        WebkitMask: mask,
        mask,
        ...style,
      }}
    />
  );
}
