# Corporate Startup Pilot Evidence Gate

A free 20-gate worksheet for corporate venture, innovation and M&A teams that
need a documented first pass before committing internal resources to a startup
pilot. It keeps the evidence state separate from the human decision.

## What It Contains

- 20 editable gates across strategic fit, problem scope, evidence, pilot
  design, integration, security and legal, economics, scale handoff, and the
  final decision record.
- Six evidence states: `supported`, `partial`, `missing`, `conflicting`,
  `stale`, and `not_applicable`.
- A 15-field CSV starter record for evidence references, dates, hashes, owners,
  repair artefacts, the human decision, and its rationale.
- A browser-only review tool under `docs/` with search, filters, reset and full
  CSV export.

## Suggested Workflow

1. Rewrite each decision question to match the actual unit, target and pilot.
2. Record an internal path or redacted evidence reference. Do not place
   confidential target or personal data in a public copy of this repository.
3. Mark the evidence state. Use `conflicting` when two sources disagree and
   `stale` when the relevant review window has expired.
4. Name the owner and next artefact for every gate that still needs repair.
5. Record the human `proceed`, `repair`, `hold`, `stop`, `manual_review`, or
   `not_applicable` decision separately from the evidence state.
6. Export the complete record before the next pilot or resource-allocation
   meeting.

## Boundary

These are starter gates, not a universal pilot policy. The worksheet does not
verify evidence, decide strategic fit, approve a pilot, perform security or
legal review, provide M&A or investment advice, calculate a DDScore, or replace
full due diligence and accountable human judgement.

## DDScore Context and Disclosure

DDScore turns submitted private-company materials into a structured 0–100
first-pass analysis across 12 dimensions plus a written report. It is
analytical tooling for deciding where deeper work may be worth the cost. It is
not M&A advice, a valuation opinion, or a replacement for full diligence.

Disclosure: I work on DDScore at Playful Pixels Oy, the Finnish company that
makes DDScore.

[See DDScore for investors and screening teams](https://www.ddscore.ai/for-investor/?utm_source=github-repository&utm_medium=referral&utm_campaign=ddscore-30d-jul-2026&utm_content=corporate-startup-pilot-evidence-gate-repository-a)

## Files

- `corporate-startup-pilot-evidence-gate.csv`: editable 20×15 starter record.
- `docs/`: static browser tool used by GitHub Pages.
- `LICENSE.md`: CC BY 4.0 terms.

## Licence

Creative Commons Attribution 4.0 International. Attribution instructions are
in `LICENSE.md`.
