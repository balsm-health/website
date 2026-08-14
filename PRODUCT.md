# Product

## Register

brand

## Users

Four audiences, deliberately **peers rather than a funnel**. The site is not a
single conversion path with one hero persona; each surface belongs to one of
these, and none of them is a secondary consideration.

- **Care recipients** — urban and underserved equally, connected or not. Navigating
  fragmented care with no continuous record, no visibility into their own data,
  and no reliable way to connect pharmacy, clinic and lab into one picture.
  Served by `/` and the patient-app section.
- **Providers** — pharmacists, doctors, nurses, lab operators who will live
  inside Balsm daily, plus the clinic/hospital **operations manager** who
  actually signs off. That buyer cares about three things: self-hosting, PDPL
  compliance, and zero licensing cost. Served by `/providers` and `/cloud`.
- **Contributors** — developers, designers, clinicians, translators and legal
  minds deciding whether this project is worth their evenings. Served by
  `/contributors`, which pulls live GitHub issues rather than describing them.
- **Sponsors and funders** — technical sponsors giving infrastructure and tools
  rather than cash, and anyone assessing whether this is serious. Served by
  `/sponsor` and `/cloud#invest`.

Upstream detail — GTM logic, geographic sequencing, the economic buyer — lives
in `../Balsm-Core/brand/balsm-brand-canvas.md` §3. Note the site deliberately
diverges from the canvas here: the canvas ranks the **patient** as Balsm's
primary user, which is true of the *product*. The *website* ranks nobody first.

## Product Purpose

Balsm is the Community-Owned Healthcare OS for the Arab world — free to
self-host, Arabic-first, offline-ready, FHIR-native. It is pre-launch: nothing
has shipped, no pricing is announced, no licence is chosen publicly.

The website is its public face across six surfaces — home, providers, cloud,
contributors, sponsor, links.

**The outcome that ranks first right now is contributor recruitment.** Not
because it is the biggest audience, but because it is the one that compounds:
Balsm is a community with a platform, not a company with users, and until the
community exists there is nothing for the other three audiences to adopt, buy
or fund. When a design decision trades off between audiences, the tiebreak goes
to the one that makes a capable person want to contribute.

Everything else the site does — earning provider trust, capturing Cloud
waitlist interest, proving seriousness to sponsors — is real work, and none of
it should be degraded to serve the above. It is a ranking, not an exclusion.

Success looks like: a developer who lands on `/contributors` finds a real open
issue and opens a PR; an operations manager who lands on `/providers` believes
the zero-cost self-host claim; nobody anywhere is misled about how much of this
has actually shipped.

## Brand Personality

Trusted professional. **Serious when it counts** — clinical contexts,
compliance, data handling, error messages. **Optimistic where it matters** —
community, mission, onboarding, open source. If Balsm were a person: a seasoned
healthcare professional who also believes deeply in open systems, patient with
complexity, honest about tradeoffs, never performative.

Three words: **Calm. Confident. Ours.**
Positioning's three words: **Open. Arab. Owned.**

Never: hyped, preachy, self-congratulatory, cold-corporate, startup-bro, timid,
or apologetic. Trust is earned through consistency, not volume.

Full voice spec — the 14 brand words, the clinical and community registers — is
in `../Balsm-Core/brand/balsm-brand-canvas.md` §6. Pin it for any copy work.

## Anti-references

- SaaS startup gradient-bubble aesthetic (blob backgrounds + glassmorphism cards
  = consumer, not clinical)
- Teal-dominant palette (previous website mistake — teal is a petal color, not
  the primary action color)
- Warm-cream AI default body background (cream is for document surfaces, not the
  page)
- Generic medical stock photography / cross / syringe brand symbols
- Corporate "healthcare software" language
- Off-brand neutral scales (Tailwind `gray-*` / `slate-*`) — the brand ships its
  own navy-slate ramp keyed to the wordmark (`ink-*`)
- **Claiming more than has shipped.** Certifications Balsm doesn't hold, prices
  that don't exist, a licence not yet chosen, user or deployment figures. The
  `doNotClaim` list in `public/.well-known/ai.json` is the enforced version of
  this and should stay in sync.

## Design Principles

1. **Arabic is first-class** — بلسم in plain spelling (no diacritics), RTL native, IBM Plex
   Sans Arabic + Cairo for display, never an afterthought. Arabic is the
   original, not a translation.
2. **Clinical restraint** — calm, not flashy. Healthcare deserves stillness. No
   bounce, no glass cards, no eyebrow on every section.
3. **Five petals, one brand** — the flower mark is the identity. Blue (#1283FF)
   is the primary action. Aqua is the healing accent. All five petals appear in
   brand moments. Petals are *fills* and stay at full strength even as text —
   a deliberate contrast exception, see Accessibility below and DESIGN.md.
4. **Cool ink on warm paper** — the navy-slate `ink-*` scale is keyed to the
   wordmark; the creams stay warm and are for document surfaces only. Warmth
   comes from the paper, never from a tinted body background.
5. **Sovereignty visible** — every touchpoint reinforces "your data, your
   system." Calm confidence, earned trust.
6. **Practice what you preach** — the marketing site for an offline-first,
   resilience-valuing product should itself be resilient. Content is readable
   without JavaScript; reveals enhance an already-visible default rather than
   gating it; nothing essential waits on a client-side observer. An
   offline-first product whose own site renders blank without JS is an argument
   against itself.

## Accessibility & Inclusion

WCAG AA is the standard, met everywhere **except one documented exception**.

**The exception: petals used as text.** The five brand petals are light by
design — they are fills. Used as small text they score 1.8–3.4:1 against AA's
4.5:1. Making them compliant was implemented and then reversed by an explicit
brand-owner decision: at label sizes, compliance costs ~0.18 of OKLCH lightness
on every accent, and since a kicker leads each section the whole site read flat.
The conflict is structural, not a bad value choice — this palette cannot be both
brand-bright and AA-legible at label sizes.

This is a real cost to low-vision readers, recorded rather than hidden. Every
AA-safe value sits in a comment beside the live one in `cloud/theme.ts`, so any
role can be dialled back with a one-line edit if the tradeoff is ever revisited.

Everything else holds, and regressions in it are bugs:

- Every interactive target clears 44×44px.
- `ink-*` on light, white on `C.dark`, and `C.violet` are all compliant.
- RTL-native at every breakpoint; Arabic and English both first-class. Use
  logical properties (`inline-start`/`inline-end`), never `left`/`right`.
- Reduced-motion alternatives for every animation, including reveals.
- Arabic numerals and Egyptian date/currency formatting for the `ar` locale.
- Offline-awareness in messaging — the product is offline-first, so the copy
  never assumes connectivity.
- Don't "fix" a petal-as-text contrast warning by darkening that one component.
  Ad-hoc darkening is how the flatness came back last time. Change the token in
  `cloud/theme.ts` or leave it alone.
