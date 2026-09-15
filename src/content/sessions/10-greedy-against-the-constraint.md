---
title: Greedy against the constraint
description:
  Running a greedy ranking and a dynamic-programming selection over the
  same dataset and the same budget, and finding the case where they part
week: 10
date: 2027-04-26
teachers:
  - idris-fenn
spec:
  - you can rank your own dataset by index and name its top five
  - you have one budget and variety constraint under which greedy and dynamic programming disagree
  - you can state the size of that disagreement in standard drinks
related:
  - lectures/week-10
  - assessments/event-portfolio
---

### Before the lab

Bring your week 9 dataset, cleaned. Bring the [index
calculator](/toolkit/#index-calculator) open in a browser tab if you want
to spot-check single rows against your code — a disagreement between the
two is worth finding now rather than in the portfolio.

### In the lab

**Ranking, which is easy.** Sort by index descending. For the question
"which single product is the best value here", this is not an
approximation — it is the answer, and most of weeks 3 through 8 were
one-row versions of it done by hand.

**Constraining, which is not.** Fix a budget and a minimum number of
distinct product types. Run greedy: take the highest index you can still
afford, repeat. Then run the dynamic-programming formulation from the
lecture. On most datasets they agree, which is the trap — the lab is not
finished until you have found a case where they do not.

**Finding the disagreement.** Greedy fails when the top-index item is
large enough to eat the budget that the variety constraint needs. If your
data does not produce that naturally, tighten the variety requirement or
lower the budget until it does, then record the parameters. Knowing the
conditions under which your method breaks is a result, not a failure.

**Measuring it.** Express the gap in total standard drinks, not in dollars
or in percent. Standard drinks is the objective function, so it is the
unit in which "worse" means something.

### Afterwards

You leave with a ranked dataset, a working constrained solver, and one
documented case where the easy method loses — which is the case your
portfolio has to prove it is not making.
