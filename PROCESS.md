# Process overview

## What I built

**SLOP4230 Retail Ethanol Economics** — a course that treats the bottle shop as
a dataset and a shelf price as a claim to be checked. Twelve weeks decompose a
retail price into production cost, category tax, margin and shelf position, each
term established in the order the next one needs it. The comedy is entirely in
the gap between an absurd subject and a completely sincere register, and nothing
on the site ever acknowledges the gap.

## The course I threw away

I shortlisted four topics from the _Improbable Research_ IgNobel archive —
Domestic Entomology, Ancient Aerial Anthropology, Capsicum Anatomy, Ethanol
Economics — picked the first, and built it out to a full twelve weeks
([`954f90e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-supermarine45/commit/954f90e)).

Then I discarded all of it. Cohabiting with household arthropods is an ethics
argument, and every week the agent generated drifted toward whimsy because there
was nothing underneath to calculate. With no quantity to be wrong about, "more
content" and "better content" looked identical — to the agent and, worryingly,
to me. Retail ethanol economics keeps the register and gives every week a number
to defend, which is what made the output checkable rather than merely plausible.
The pivot is
[`dc14976`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-supermarine45/commit/dc14976).

## Fixing the agent instead of the file

The new premise brought a failure mode the old one never had: a course that
optimises alcohol-per-dollar reads, if you let it, as encouragement. I corrected
that tone in three separate files before admitting I was working at the wrong
layer. I replaced a `CLAUDE.md` rule with one that names both ways the argument
fails — _"Optimisation is analysis, not endorsement"_, forbidding equally the
"optimise responsibly" hedge and the drinking joke. Week 11's externality
lecture, and the lab that tests a student's statement against those same two
failures, both exist because of that rule rather than the other way round.

## Knowing it was right before accepting it

`pnpm check` covers compilation, accessibility, links and dangling refs. It
cannot tell whether the course coheres, so I wrote twelve checks that can
([`ed78455`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-supermarine45/commit/ed78455)):
twelve weeks means twelve lectures and twelve labs, every claim carries a
citation in the fixed style, the weights sum to 100 across the set, no
assessment draws on a lecture taught after its due date. Then I broke three
things on purpose — a weight, a reading, the formula — to confirm each failed
exactly one test and the right one. A green suite that cannot go red is worth
nothing, and my first directional test was wrong in a way only that check
exposed: `related:` renders on both pages, so the graph is symmetric and cannot
say which way a dependency runs.

The same instinct caught a costlier error. The three toolkit widgets
([`d32f343`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-supermarine45/commit/d32f343))
looked broken at the 390px marking viewport in every screenshot I took — until
the live site, built from an untouched commit, reproduced the fault identically.
Headless Chrome's `--window-size` sets the window, not the layout viewport: it
renders wide and crops. The fix was a script driving the same device emulation
DevTools uses, which reports real overflow and would have saved an hour had I
written it first.

Two things I rejected rather than shipped: a staff portrait carrying a
Dreamstime watermark, and my own square crops of both portraits — the theme
never renders a person photo square, so the shape was wrong before the framing
was.
