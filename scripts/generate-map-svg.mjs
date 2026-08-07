#!/usr/bin/env node
/**
 * Builds public/arab-world-map.svg from Natural Earth, so the map is real
 * cartography rather than hand-drawn shapes.
 *
 *   node scripts/generate-map-svg.mjs
 *
 * Source: world-atlas@2.0.2 countries-50m (Natural Earth 1:50m), fetched on
 * demand and cached under .cache/. Projected with
 * d3.geoMercator().fitExtent([[24,24],[836,366]]) — the same framing the
 * original design used, so the 860x390 viewBox and the overlay coordinates in
 * mapData.ts stay meaningful.
 *
 * After regenerating, re-run scripts/generate-map-dots.mjs: the marker
 * positions are derived from these shapes and will drift otherwise.
 *
 * Editorial choices, all of them deliberate — see MERGED below:
 *   - Morocco is drawn including Western Sahara.
 *   - Somalia is drawn including Somaliland.
 *   - Palestine is drawn as historic Palestine: Natural Earth's PSE (West Bank
 *     and Gaza) unioned with Israel. There is no Israel on this map. That is a
 *     deliberate editorial position, not a data artefact.
 *   - The Golan Heights is drawn inside Syria. Natural Earth's countries layer
 *     folds it into Israel (de facto control), so it is cut out and reassigned
 *     — see REASSIGN.
 *   - Comoros is an Arab League member but sits ~3000km south of this frame,
 *     so it has no shape here. Bahrain IS included (the old 1:110m source
 *     didn't have it at all).
 * Change any of these by editing COUNTRIES and re-running.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { geoArea, geoMercator, geoPath } from 'd3-geo';
import { merge } from 'topojson-client';
import polygonClipping from 'polygon-clipping';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE_DIR = join(root, '.cache');
const OUT = join(root, 'public', 'arab-world-map.svg');

const SOURCES = {
  countries: {
    file: 'countries-50m.json',
    url: 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json',
  },
  // Carries the occupied/disputed territories that the countries layer folds
  // into whoever administers them. Same Natural Earth 1:50m build, so its edges
  // line up with the country outlines instead of leaving slivers.
  disputed: {
    file: 'ne_50m_admin_0_breakaway_disputed_areas.geojson',
    url: 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_50m_admin_0_breakaway_disputed_areas.geojson',
  },
};

async function load(name) {
  const { file, url } = SOURCES[name];
  const path = join(CACHE_DIR, file);
  if (!existsSync(path)) {
    mkdirSync(CACHE_DIR, { recursive: true });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetching ${url} failed: ${res.status}`);
    writeFileSync(path, Buffer.from(await res.arrayBuffer()));
    console.log(`cached ${file}`);
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

const topo = await load('countries');
const disputed = await load('disputed');
// Raw topology geometries, not features: topojson.merge needs the shared-arc
// information, which is exactly what dissolves the border between two
// neighbours instead of drawing both outlines on top of each other.
const geometries = topo.objects.countries.geometries;

// Atlas ids are zero-padded strings ("012", "048"), so compare numerically.
// Somaliland carries no id and has to be matched by name.
const byId = (id) => geometries.find((g) => g.id != null && Number(g.id) === Number(id));
const byName = (n) => geometries.find((g) => g.properties?.name === n);

// A country listed with several sources is unioned into one shape, with the
// borders between the parts dissolved.
const COUNTRIES = {
  algeria: [12], bahrain: [48], djibouti: [262], egypt: [818], iraq: [368],
  jordan: [400], kuwait: [414], lebanon: [422], libya: [434], mauritania: [478],
  oman: [512], qatar: [634], saudi: [682], sudan: [729],
  syria: [760], tunisia: [788], uae: [784], yemen: [887],
  morocco: [504, 732],           // 732 = Western Sahara
  somalia: [706, 'Somaliland'],
  palestine: [275, 376],         // 376 = Israel — drawn as historic Palestine
};

// Bahrain is a speck in the Gulf; including it in the fit would shift the
// framing for no visual gain, so the extent is set by everything else.
const FIT_KEYS = Object.keys(COUNTRIES).filter((k) => k !== 'bahrain');

const geomsFor = (key) =>
  COUNTRIES[key]
    .map((ref) => (typeof ref === 'number' ? byId(ref) : byName(ref)))
    .filter(Boolean);

for (const key of Object.keys(COUNTRIES)) {
  const found = geomsFor(key).length;
  if (found !== COUNTRIES[key].length) {
    throw new Error(`${key}: matched ${found} of ${COUNTRIES[key].length} Natural Earth sources`);
  }
}

/**
 * Territories the countries layer assigns to whoever administers them, moved to
 * the country they belong to. Cut out of `from` and unioned into `to`, so no
 * land is duplicated or lost.
 */
const REASSIGN = [
  // Occupied Syrian territory; Natural Earth folds it into Israel, which after
  // the palestine union above would otherwise put it inside Palestine.
  { area: 'Golan Heights', from: 'palestine', to: 'syria' },
];

const asMulti = (g) => (g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates]);

/**
 * d3-geo reads polygons spherically and wants exterior rings wound the opposite
 * way to RFC 7946 — which is what topojson.merge already produces, and what
 * polygon-clipping does NOT: it normalises its output to the RFC convention.
 * Feeding that straight to d3 makes every shape the complement of itself (Syria
 * came out at 5x10^8 km²), so clipped output gets its rings reversed on the way
 * back.
 */
const reverseWinding = (multi) => multi.map((poly) => poly.map((ring) => [...ring].reverse()));

const disputedArea = (name) => {
  const f = disputed.features.find((x) => (x.properties.BRK_NAME ?? x.properties.NAME) === name);
  if (!f) throw new Error(`no disputed-areas feature named "${name}"`);
  return asMulti(f.geometry);
};

// merge() dissolves arcs shared between the parts, so a unioned country has one
// outline rather than its components' borders drawn over each other.
const base = new Map(
  Object.keys(COUNTRIES).map((key) => [key, asMulti(merge(topo, geomsFor(key)))])
);

// Square kilometres, for checking that a reassignment moved what it should.
const EARTH_R = 6371;
const km2 = (multi) => geoArea({ type: 'MultiPolygon', coordinates: multi }) * EARTH_R ** 2;

const bboxOf = (multi) => {
  const b = [Infinity, Infinity, -Infinity, -Infinity];
  for (const poly of multi) for (const [x, y] of poly[0]) {
    if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y;
    if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y;
  }
  return b;
};

for (const { area, from, to } of REASSIGN) {
  const patch = disputedArea(area);
  if (!base.has(from) || !base.has(to)) throw new Error(`${area}: unknown country in reassignment`);

  const want = km2(patch);
  const fromBefore = km2(base.get(from));
  const toBefore = km2(base.get(to));

  // The two Natural Earth layers don't agree on this boundary to the last
  // vertex, so cutting the patch out leaves offcuts hugging the old line: a
  // 238km² strip plus slivers, each of which would be stroked as its own
  // outline and read as the border still being there. Anything left over
  // inside the patch's neighbourhood belongs to the same reassignment, so it
  // travels with it rather than being deleted — no land goes missing.
  const [minX, minY, maxX, maxY] = bboxOf(patch);
  const padX = (maxX - minX) * 0.15;
  const padY = (maxY - minY) * 0.15;
  const isOffcut = (poly) => {
    const [a, b, c, d] = bboxOf([poly]);
    return a >= minX - padX && b >= minY - padY && c <= maxX + padX && d <= maxY + padY;
  };

  const remainder = polygonClipping.difference(base.get(from), patch);
  const offcuts = remainder.filter(isOffcut);
  const kept = remainder.filter((poly) => !isOffcut(poly));
  if (!kept.length) throw new Error(`${area}: cutting it out consumed all of ${from}`);

  base.set(from, reverseWinding(kept));
  base.set(to, reverseWinding(polygonClipping.union(base.get(to), patch, ...offcuts)));

  const lost = fromBefore - km2(base.get(from));
  const gained = km2(base.get(to)) - toBefore;

  // Conservation. `to` can gain slightly more than `from` loses: where the two
  // Natural Earth layers disagree the patch also covers a hairline gap that
  // belonged to neither country, and filling it is the right outcome. What must
  // not happen is land going missing, or the two sides diverging materially.
  if (gained < lost - want * 0.01 || Math.abs(lost - gained) > want * 0.01) {
    throw new Error(`${area}: ${from} lost ${lost.toFixed(1)} km² but ${to} gained ${gained.toFixed(1)} km²`);
  }
  // Sanity band. Mainly catches a winding flip, which yields the complement of
  // the shape and would otherwise silently draw the planet minus the country.
  if (lost < want * 0.9 || lost > want * 1.4) {
    throw new Error(`${area}: moved ${lost.toFixed(0)} km², expected ~${want.toFixed(0)} km²`);
  }

  const extra = offcuts.length ? `, +${offcuts.length} offcut(s) ${(lost - want).toFixed(0)}km²` : '';
  console.log(`${area}: ${from} -> ${to} (${want.toFixed(0)} km²${extra})`);
}

const shapeFor = (key) => ({
  type: 'Feature',
  geometry: { type: 'MultiPolygon', coordinates: base.get(key) },
});

const collection = (keys) => ({ type: 'FeatureCollection', features: keys.map(shapeFor) });

const projection = geoMercator().fitExtent([[24, 24], [836, 366]], collection(FIT_KEYS));
// 1dp is ~0.1 units on an 860-wide canvas — sub-pixel at render size, and it
// roughly halves the file.
const path = geoPath(projection).digits(1);

const shapes = Object.keys(COUNTRIES).map((key) => ({ key, d: path(collection([key])) }));
const paths = shapes.map((s) => `    <path id="country-${s.key}" d="${s.d}" />`).join('\n');

writeFileSync(
  OUT,
  `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- GENERATED by scripts/generate-map-svg.mjs — Natural Earth 1:50m via
     world-atlas@2.0.2, Mercator fitExtent([[24,24],[836,366]]).
     Morocco includes Western Sahara; Somalia includes Somaliland; Palestine is
     drawn as historic Palestine (West Bank + Gaza + Israel); the Golan Heights
     is inside Syria; Comoros is out of frame. Borders inside a unioned country
     are dissolved. Hand edits here are fine but
     are lost on the next run — and re-run generate-map-dots.mjs afterwards. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 390" width="860" height="390" aria-hidden="true">
  <defs>
    <filter id="mapSoft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#2B2B25" flood-opacity="0.1" />
    </filter>
  </defs>
  <g fill="#EFEFE7" stroke="#E2E1D5" stroke-width="1" filter="url(#mapSoft)">
${paths}
  </g>
</svg>
`
);

console.log(`wrote ${shapes.length} country paths to public/arab-world-map.svg`);
console.log('now run: node scripts/generate-map-dots.mjs');
