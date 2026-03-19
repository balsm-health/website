import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Balsm - Open Source Healthcare Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />

        {/* Logo */}
        <svg viewBox="0 0 1024 1024" width="200" height="200" style={{ marginBottom: 30 }}>
          <path fill="#ffffff" d="M529,700C521,678 520,655 522,632C524,576 525,575 526,547C526,546 526,544 527,541C535,543 542,545 550,547C579,553 609,560 638,566C695,578 730,613 744,669C755,713 750,756 738,798C737,802 734,802 731,802C706,804 681,802 657,797C633,793 611,786 591,774C561,757 540,733 529,700"/>
          <path fill="#ffffff" d="M615,319C616,350 607,377 589,402C564,436 539,471 513,506C512,505 511,504 511,503C487,470 463,437 439,404C420,378 409,350 411,318C413,289 422,263 438,240C457,209 482,185 510,162C511,161 512,161 513,160C537,178 559,198 577,222C591,240 602,259 608,281C612,293 613,306 615,319"/>
          <path fill="#ffffff" d="M274,541C242,522 219,495 202,463C191,442 182,420 177,396C176,392 176,390 180,388C212,371 246,357 282,352C324,345 362,352 395,379C405,388 414,398 421,409C442,439 461,471 481,502C485,507 488,513 492,519C484,521 477,523 470,525C436,534 403,544 369,553C336,561 305,557 274,541"/>
        </svg>

        {/* Arabic Name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: 'white',
            marginBottom: 10,
            letterSpacing: '-0.02em',
          }}
        >
          بلسم
        </div>

        {/* English Name */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.95)',
            marginBottom: 30,
            letterSpacing: '0.1em',
          }}
        >
          BALSM
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          Open Source Healthcare Platform
        </div>

        {/* Badge */}
        <div
          style={{
            marginTop: 40,
            padding: '12px 32px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 50,
            fontSize: 20,
            fontWeight: 600,
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          Coming Soon
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
