# Working method: SLOP4230, Retail Ethanol Economics

This course is a sincere, deadpan academic treatment of an absurd premise:
optimising alcohol purchasing decisions as a rigorous quantitative economics
and data-science discipline. The comedy lives entirely in the gap between
the premise and the register — never in the register itself. Every rule
below exists to protect that gap.

## Persona rules

- **Never wink.** No jokes, no self-aware asides, no "obviously this is
  satire" framing, in any content a reader sees — homepage, lectures,
  sessions, assessments, decks, people. Write it exactly as a real
  quantitative retail-economics course would write about itself.
- **The premise is load-bearing, not decorative.** Every argument about
  taxation, pricing, or method must follow from the fictional literature
  cited, not from an assumed reaction of "this is funny." Treat *Ad
  Valorem Design and the Wine Equalisation Tax* the way a real course
  treats its set texts: as a source of claims to be applied, not a
  punchline.
- **Optimisation is analysis, not endorsement.** The course models the
  alcohol-by-volume-to-price ratio as a rigorous quantitative object; it
  does not read as encouragement to maximise alcohol purchasing or
  consumption. Week 11's ethical-implications framework is the semester's
  explicit acknowledgment that the optimisation has public-health costs —
  keep that acknowledgment honest rather than letting it collapse into
  either "optimise responsibly" hand-waving or a joke about drinking.
- **Citation style is fixed:** *Paper Title* (Journal Name, Year), italicised
  title, journal and year in parentheses. Every substantive claim in a
  lecture or deck should trace to one of the semester's 12 named readings —
  invent a new one only if the curriculum genuinely needs it, and give it
  the same shape (a plausible fictional journal, a plausible year).
- **One idea per semester.** The curriculum's arc — fermentation cost,
  the standard-drink metric, cask-wine margins, ad valorem tax, price
  elasticity, volumetric tax, retail layout, merchandising psychology,
  data scraping, algorithmic optimisation, ethics, capstone synthesis — is
  fixed. A new week or reading should extend that arc, not introduce an
  unrelated one. Week 11's externality framework is the semester's one
  deliberate acknowledgment that the optimisation has limits; don't add a
  second without a specific reason.
- **Frontmatter `description` stays short** (1–2 sentences): it feeds page
  `<meta>` tags and the listing-grid card teaser, both of which look broken
  if it runs long. Put the fuller, ~150-word treatment in the page body,
  the way `src/content/lectures/week-01.md` does.

## Hard constraints (the build enforces these — don't fight them)

- **Course code**: `SLOPxxxx` where the first digit is the level (1–4
  undergrad, 6/8 postgrad) and the last three digits (`230`) are fixed —
  keep them if you change the level. Defined in `src/course-config.ts`.
- **Weeks run 1–12** in every dated collection (`sessions`, `lectures`,
  `assessments`); the schema in `src/content.config.ts` rejects anything
  outside that range.
- **Dates stay inside the teaching period** (`courseMeta.startDate`–
  `endDate`), checked by `spec/data-integrity.test.ts`. Check both ends
  before changing either the course dates or a content date.
- **Assessment weights**: the three assessments must sum to 100 (currently
  30/30/40). A `marking: { mode: weighted }` block's own `criteria` weights
  must independently sum to 100 — that's a separate constraint, checked
  per-assessment, not across assessments.
- **`related:` refs must resolve** — the build fails on a dangling
  `<collection>/<slug>` ref. Renaming or deleting a content file means
  grepping for refs to its old slug first.
- **No hand-written root-absolute links** (`href="/lectures/"`) in `.astro`
  files — they skip the base-path rewrite and 404 on the deployed site.
  Markdown links and theme components handle this automatically.
- **Don't hand-edit `dist/api/`** — it's generated from the content
  collections and `course-config.ts` on every build.
- **Remove the `STARTER_CONTENT` comment** in any fragment you replace.
  `pnpm check:evidence` fails the Assignment 2 gate if one survives
  anywhere under `src`, and `git grep -n STARTER_CONTENT -- src` is the
  fast way to find what's left.

## Before calling content-work done

Run `pnpm check` (types, build, and `spec/data-integrity.test.ts`) — it
catches schema violations, dangling refs, and out-of-range dates that are
easy to introduce by hand in frontmatter. `pnpm check:evidence` is the
separate, stricter gate for final submission.
