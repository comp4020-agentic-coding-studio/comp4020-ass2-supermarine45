# Process overview

## What I built

**SLOP4230 Retail Ethanol Economics** — a course that treats the bottle shop
as a dataset and the shelf price as a claim to be checked. Twelve weeks
decompose a retail price into production cost, category-specific tax, margin
and shelf position, in the order each term needs the last. The comedy, such as
it is, lives entirely in the gap between an absurd subject and a completely
sincere register; nothing on the site ever acknowledges the gap.

## How I got here

I derived the ideation from a list of _Improbable Research_ IgNobel prizes and
shortlisted four: Domestic Entomology, Ancient Aerial Anthropology, Capsicum
Anatomy, and Ethanol Economics. I picked Domestic Entomology and built it out
to a full twelve weeks
([`954f90e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-supermarine45/commit/954f90e)):
lectures, two assessments, a deck, and a `CLAUDE.md` harness with the persona
rules that made the deadpan register hold.

Then I discarded it. Cohabiting with household arthropods is an ethics
argument, and every week I generated drifted toward whimsy because there was
nothing underneath it to calculate — the agent had no constraint to fail
against, so "more content" and "better content" looked identical. Retail
ethanol economics keeps the same register but gives each week a number to
defend, which turned out to be the thing that made the agent's output
checkable rather than merely plausible. The pivot is
[`dc14976`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-supermarine45/commit/dc14976),
and the twelve weeks that followed are
[`9cff770`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-supermarine45/commit/9cff770).

## Fixing it in the harness, not in the file

The pivot exposed a failure mode entomology never had. A course that optimises
an alcohol-per-dollar ratio reads, if you let it, as encouragement to maximise
drinking. I caught the agent producing that tone three times and corrected it
three times in three different files before recognising that correcting output
was the wrong layer. I replaced a `CLAUDE.md` rule with a new one —
_"Optimisation is analysis, not endorsement"_ — that names both failure modes
explicitly: collapsing into "optimise responsibly" hand-waving, or collapsing
into a joke about drinking. Week 11's externality lecture exists because of
that rule, not the other way round. The diff is in
[`dc14976`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-supermarine45/commit/dc14976).

## How I knew the result was right

`pnpm check` covers compilation, accessibility, base-path links and dangling
refs, but it cannot see whether the course is coherent, so I wrote checks for
the promises it cannot reach: that the three assessment weights sum to 100
across the set, that every week 1–12 has exactly one lecture, that every
lecture cites a reading in the fixed style `CLAUDE.md` declares, and that no
rendered page still contains starter phrasing.

Two things I rejected rather than shipped. The agent found me a staff portrait
carrying a visible Dreamstime watermark — an unlicensed preview comp — and I
replaced it rather than crop around it. And when the portraits looked wrong on
the page, the answer was not to re-crop: the theme never renders a person photo
as a square, so the square sources were the wrong shape to begin with. Reading
`Card.astro` and `Hero.astro` gave the real constraint — 16:9, face on the
vertical centre line, ≥768px wide — and the portraits were rebuilt to it
([`551822c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-supermarine45/commit/551822c)).
