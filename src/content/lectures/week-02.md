---
title: The Standard Drink as Currency
description:
  Establishing the 10-gram ethanol baseline metric that every ratio,
  tax, and comparison in this course is denominated in
week: 2
date: 2027-03-01
teachers:
  - idris-fenn
slides: /decks/week-02/
related:
  - assessments/data-scraping-exercise
---

**Core reading:** *The Standard Drink as a Unit of Account*
(Journal of Beverage Economics, 2020)

A litre of beer and a litre of spirits are not comparable products, and
week 1's fermentation kinetics do not by themselves fix that. Week 2
introduces the standard drink — ten grams of pure ethanol — as the unit
this course prices everything against, the way a real economics course
would fix a unit of account before discussing exchange rates. The week's
reading treats the standard drink as exactly that: a currency, not a
serving suggestion, letting a $12 six-pack and a $40 bottle of spirits be
converted onto the same scale and genuinely compared for the first time.
Every alcohol-by-volume-to-price ratio calculated for the rest of the
semester, including the exercise this week feeds into, depends on this
conversion being done correctly and consistently — a wrong standard-drink
count anywhere in the dataset silently corrupts every ratio built on top
of it.

## Outline

- why raw litres cannot be compared across beverage categories
- the standard drink as a unit of account, not a serving size
- converting a shelf price into a price-per-standard-drink figure
- why one wrong conversion corrupts every ratio built afterward

## Mandatory reading

- [Understanding standard drinks and drinking guidelines](https://doi.org/10.1111/j.1465-3362.2011.00374.x)
  — Kerr & Stockwell, *Drug and Alcohol Review* 31(2), 2012, 200–205. The
  evidence that drinkers cannot perform this conversion in their heads —
  over-pouring is the norm, and percentage-ABV information does not fix
  it. That finding is the reason this course writes the conversion down
  and computes it, rather than estimating.
- [Australian guidelines to reduce health risks from drinking alcohol](https://www.nhmrc.gov.au/health-advice/alcohol)
  — National Health and Medical Research Council, 2020. The ten-gram
  definition every calculation in this course rests on, in the document
  that fixes it for Australia. Read the definition and the note that a
  served drink is frequently not a standard one.
