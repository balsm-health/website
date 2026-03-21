import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '22.5%', // Apple's standard border radius
        }}
      >
        {/* Balsm logo optimized for Apple Touch Icon */}
        <svg viewBox="0 0 1024 1024" width="85%" height="85%">
          <path
            fill="#ffffff"
            d="M529,700C521,678 520,655 522,632C524,576 525,575 526,547C526,546 526,544 527,541C535,543 542,545 550,547C579,553 609,560 638,566C695,578 730,613 744,669C755,713 750,756 738,798C737,802 734,802 731,802C706,804 681,802 657,797C633,793 611,786 591,774C561,757 540,733 529,700"
          />
          <path
            fill="#ffffff"
            d="M615,319C616,350 607,377 589,402C564,436 539,471 513,506C512,505 511,504 511,503C487,470 463,437 439,404C420,378 409,350 411,318C413,289 422,263 438,240C457,209 482,185 510,162C511,161 512,161 513,160C537,178 559,198 577,222C591,240 602,259 608,281C612,293 613,306 615,319"
          />
          <path
            fill="#ffffff"
            d="M274,541C242,522 219,495 202,463C191,442 182,420 177,396C176,392 176,390 180,388C212,371 246,357 282,352C324,345 362,352 395,379C405,388 414,398 421,409C442,439 461,471 481,502C485,507 488,513 492,519C484,521 477,523 470,525C436,534 403,544 369,553C336,561 305,557 274,541"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
