// Marker positions and labels for the Arab-world rollout map.
//
// The country geometry is NOT here — it lives in public/arab-world-map.svg,
// which CloudMap loads as a single <image>. That file is the source of truth
// for the shapes: edit it in Inkscape (or any SVG editor) and the page follows.
// It was originally produced by Mercator-projecting world-atlas@2.0.2
// countries-110m through the same d3 pipeline the design file runs:
//   d3.geoMercator().fitExtent([[24,24],[836,366]], <22 Arab countries>)
// Pre-projecting keeps the page free of d3, topojson and a CDN fetch.
//
// Bahrain and Comoros are absent from the 110m atlas, so they have neither a
// shape nor a dot — matching what the design renders. The dot coordinates
// below are hand-placed against the artwork; nudge them if you reshape a
// country.

export const MAP_ASSET = '/arab-world-map.svg';

/** Must match the viewBox of MAP_ASSET. */
export const MAP_VIEWBOX = "0 0 860 390";

export type CountryKey = string;

export const MAP_DOTS: { key: CountryKey; cx: number; cy: number; tier: 'gcc' | 'longterm' }[] = [
  { key: "kuwait", cx: 643.3, cy: 102.8, tier: 'gcc' },
  { key: "oman", cx: 712.6, cy: 180.5, tier: 'gcc' },
  { key: "qatar", cx: 672.5, cy: 139.3, tier: 'gcc' },
  { key: "saudi", cx: 617.7, cy: 148.6, tier: 'gcc' },
  { key: "uae", cx: 697.1, cy: 152.2, tier: 'gcc' },
  { key: "algeria", cx: 277.3, cy: 110.8, tier: 'longterm' },
  { key: "djibouti", cx: 601.8, cy: 255.9, tier: 'longterm' },
  { key: "iraq", cx: 611.9, cy: 66.6, tier: 'longterm' },
  { key: "jordan", cx: 555.4, cy: 84.4, tier: 'longterm' },
  { key: "lebanon", cx: 547.9, cy: 58.8, tier: 'longterm' },
  { key: "libya", cx: 402.1, cy: 123, tier: 'longterm' },
  { key: "mauritania", cx: 172.3, cy: 183.6, tier: 'longterm' },
  { key: "morocco", cx: 188.7, cy: 95.5, tier: 'longterm' },
  { key: "palestine", cx: 540.9, cy: 82.1, tier: 'longterm' },
  { key: "somalia", cx: 628.2, cy: 313.4, tier: 'longterm' },
  { key: "sudan", cx: 499.2, cy: 219.8, tier: 'longterm' },
  { key: "syria", cx: 569.8, cy: 47.7, tier: 'longterm' },
  { key: "tunisia", cx: 333.7, cy: 55.7, tier: 'longterm' },
  { key: "yemen", cx: 642.9, cy: 221, tier: 'longterm' },
];

export const MAP_EGYPT = { cx: 498.8, cy: 127.7 };
export const MAP_RED_SEA = { x: 561.2, y: 186.2 };
export const MAP_GULF_LABEL = { x: 691.3, y: 128 };
