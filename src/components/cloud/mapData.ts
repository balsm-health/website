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
  { key: "bahrain", cx: 667.3, cy: 133.2, tier: 'gcc' },
  { key: "kuwait", cx: 641.3, cy: 101.3, tier: 'gcc' },
  { key: "oman", cx: 723, cy: 167.5, tier: 'gcc' },
  { key: "qatar", cx: 672.7, cy: 141.1, tier: 'gcc' },
  { key: "saudi", cx: 619.6, cy: 152, tier: 'gcc' },
  { key: "uae", cx: 699.5, cy: 155.7, tier: 'gcc' },
  { key: "algeria", cx: 279.6, cy: 116.5, tier: 'longterm' },
  { key: "djibouti", cx: 600, cy: 257.6, tier: 'longterm' },
  { key: "iraq", cx: 606.1, cy: 65.9, tier: 'longterm' },
  { key: "jordan", cx: 552.1, cy: 89.5, tier: 'longterm' },
  { key: "lebanon", cx: 549.5, cy: 55.8, tier: 'longterm' },
  { key: "libya", cx: 374.5, cy: 120.1, tier: 'longterm' },
  { key: "mauritania", cx: 175.1, cy: 192.6, tier: 'longterm' },
  { key: "morocco", cx: 199.2, cy: 80.1, tier: 'longterm' },
  { key: "palestine", cx: 539.7, cy: 84.9, tier: 'longterm' },
  { key: "somalia", cx: 652.6, cy: 274.6, tier: 'longterm' },
  { key: "sudan", cx: 500, cy: 217.5, tier: 'longterm' },
  { key: "syria", cx: 567.4, cy: 46.7, tier: 'longterm' },
  { key: "tunisia", cx: 334.4, cy: 45.3, tier: 'longterm' },
  { key: "yemen", cx: 622.5, cy: 226.2, tier: 'longterm' },
];

export const MAP_EGYPT = { cx: 495.7, cy: 132.4 };
export const MAP_RED_SEA = { x: 561.2, y: 186.2 };
// Nudged clear of the Bahrain dot (667.3,133.2), which the 110m map lacked.
export const MAP_GULF_LABEL = { x: 700, y: 116 };
