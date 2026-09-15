---
title: Getting started
description:
  The first lab of the semester — fixing the fiscal-molecule framing of
  ethanol and the standard-drink metric every calculation this course makes
  depends on
week: 1
date: 2027-02-22
teachers:
  - marisol-quaye
spec:
  - you can state the standard-drink content of a product from its volume and ABV
  - you have picked one supermarket's online liquor catalogue as your working dataset for the semester
  - you can compute one ungraded ABV-to-dollar index value by hand before you leave
related:
  - lectures/week-01
  - lectures/week-02
---

The first lab exists to fix the shared vocabulary the rest of the semester
is denominated in, before week 1's fermentation lecture and week 2's
standard-drink lecture ask you to put it to use. Nothing here is graded.
Everything here is assumed from week 2 onward.

### Before the lab

The `spec` above is the contract. Arrive with a specific supermarket's
online liquor catalogue picked out — the one you will keep returning to for
week 9's scraping exercise — and a calculator or spreadsheet you are willing
to do arithmetic in during the lab.

### In the lab

**The fiscal molecule.** Ethanol (C₂H₆O) is not treated biologically in
this course; it is treated purely as an economic unit. We fix the chemical
baseline week 1's lecture covers so that a production cost, not an assumed
retail price, is what every later tax and margin calculation sits on top
of.

**The standard drink as currency.** In Australia, one standard drink is
defined as exactly ten grams of pure ethanol. This lab fixes that
figure as the unit every ratio, tax, and comparison for the rest of the
semester is denominated in — the way week 2's lecture treats it as a unit
of account, not a serving suggestion.

**A first, ungraded index.** The formula the semester builds toward —

```
standard_drinks = (volume_ml × abv_percent × 0.789) / 1000
index = standard_drinks / price_dollars
```

— is previewed here only far enough to compute it by hand for two or three
products from the catalogue you picked. Week 10 formalises the constrained
version; this lab only checks that the unconstrained number comes out
right.

**Required reading:** *Standard Drink Equivalency Models in High-Volume
Retail Environments* (Health Economics, 2017)

### Afterwards

You leave with a working catalogue, a correct standard-drink conversion,
and one hand-computed index value — the three things week 9's scraping
exercise scales up and week 10's lecture formalises.
