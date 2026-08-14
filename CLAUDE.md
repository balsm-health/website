# Claude Code Instructions

Read and follow the agent instructions in the Roadmap repo: [AGENTS.md](../Balsm-Core/agents/rules/AGENTS.md), the shared standards in [Balsm-Core/agents/rules/CODING_STANDARDS.md](../Balsm-Core/agents/rules/CODING_STANDARDS.md), and this repo's own [CODING_STANDARDS.md](./CODING_STANDARDS.md).

## Design Context

Read before any design, styling, or copy work:

- **[PRODUCT.md](./PRODUCT.md)** — who/what/why. Register (`brand`), the four peer
  audiences, brand personality, anti-references, and the six design principles.
- **[DESIGN.md](./DESIGN.md)** — how it looks. Token architecture, the cool
  navy-slate `ink-*` scale, the five petals, RTL rules, and the bans.
- **[../Balsm-Core/brand/balsm-brand-canvas.md](../Balsm-Core/brand/balsm-brand-canvas.md)**
  — upstream source of truth for voice and positioning. Pin §6 for copy work.

Three things that are easy to get wrong and are documented in DESIGN.md:

- **Petals as text are a deliberate contrast exception.** They score 1.8–3.4:1
  where AA wants 4.5:1. That is a recorded brand-owner decision, not a bug — do
  not "fix" it by darkening one component. Change the token in `cloud/theme.ts`
  (AA-safe values are in the comments) or leave it. See PRODUCT.md § Accessibility.
- **Reveal state belongs in CSS, never in an inline style.** Inline `opacity: 0`
  ships the page blank without JS, and an inline `transform` silently outranks
  every hover rule.
- **`dark:` follows the `.dark` class**, not the OS, via `@custom-variant` in
  `globals.css`.

## Website-Specific Notes

- Marketing and public-facing site — no PHI or clinical data here
- Follow existing styling and component patterns
- Accessibility is a floor that is currently met, not an aspiration: WCAG AA
  across all six pages in both locales, 44px minimum targets. Treat a
  regression as a bug.
