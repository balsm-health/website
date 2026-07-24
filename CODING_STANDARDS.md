# website — Coding Standards

> Extends the shared standards in
> [Balsm-Core/agents/rules/CODING_STANDARDS.md](../Balsm-Core/agents/rules/CODING_STANDARDS.md).
> Shared principles (error handling, SOLID, logging, validation, DTOs,
> idempotency, caching) apply as written there; this file adds the
> TypeScript/Next.js specifics.

---

## 1. Stack & Naming

- TypeScript 5.10 + Next.js 16 + React 19.2 + Tailwind 4.0
- components: `PascalCase` files and exports; hooks: `use{Thing}`; utilities: `camelCase`
- no `any` — model API responses with explicit types matching the .NET DTO contracts (snake_case JSON)

## 2. Content & Data

- marketing / public-facing pages only — **no PHI or clinical data in this repo**
- API consumption is read-only public endpoints; never embed secrets in client bundles

## 3. Quality Bar

- accessibility: WCAG compliance on all pages (semantic HTML, keyboard nav, contrast)
- web vitals are the performance budget: optimize LCP/CLS/INP; use Next image/font optimization
- follow existing styling and component patterns; Tailwind utility-first, no ad-hoc CSS files
- both `en` and `ar` (RTL) render paths must be maintained for localized pages
