---
title: Algorithmic Maximization
description:
  Coding the ABV-to-dollar index formula, and turning nine weeks of
  measurement into a single ranked output
week: 10
date: 2027-04-26
teachers:
  - idris-fenn
slides: /decks/week-10/
related:
  - assessments/assignment-1
  - assessments/event-portfolio
---

**Core reading:** *Greedy and Dynamic-Programming Approaches to Retail
Index Maximisation* (Operations Research for Retail, 2022)

Week 9's dataset is only useful once it can be ranked, and week 10
provides the formula that does the ranking. The week's reading formalises
the ABV-to-dollar index — standard drinks per dollar, computed per SKU
from the fields week 9's scrape extracts — and compares a naive
greedy selection against a dynamic-programming approach once a budget
constraint and a minimum-variety constraint are added, finding the
greedy method adequate for an unconstrained ranking but measurably
suboptimal the moment a real budget cap is introduced. The deck linked
from this page works through both approaches in the detail the
semester's remaining assessments assume you already have, since neither
the scraping exercise's ranking nor the closing event portfolio's
constrained inventory can be built correctly on the naive version alone.

## Outline

- formalising the ABV-to-dollar index from week 9's scraped fields
- greedy ranking versus dynamic programming under a budget constraint
- where the naive method is adequate and where it fails
- why the constrained version is what the rest of the semester needs

## Further reading

- *Algorithmic Maximization of the Intoxication Index* (Quantitative
  Economics, 2024) — applies this week's formula to a live, updating feed
  rather than a static scrape, and is the reading to check against if your
  data scraping exercise re-ranks its dataset as prices change rather than
  once.
