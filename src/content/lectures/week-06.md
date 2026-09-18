---
title: "Distillation Disparities and Federal Excise Penalties"
description:
  Analyzing extreme volumetric excise penalties on distilled spirits and the regulatory subversion of fortifying fermented goods.
week: 6
date: 2027-03-29
teachers:
  - idris-fenn
slides: /decks/week-06/
related:
  - assessments/wet-policy-brief
---

**Core reading:** *Federal Excise Disparities in Distillation versus Fermentation* (O'Connor, Tax Law Review, 2018).

## The Lecture

Having mapped the WET loophole for fermented goods, we must now examine the regulatory punishment inflicted upon distillation. The Australian federal taxation system applies a punitive volumetric excise to clear spirits, taxing them directly per liter of pure alcohol at rates that drastically suppress their ABV-to-dollar index. 

This disparity creates a powerful economic arbitrage for regulatory subversion. This week, we analyze the practice of fortification: the deliberate blending of cheap neutral grain spirits into low-quality grape must. By optimizing a fermented base, a producer can artificially push the ABV to the absolute legal maximum while technically retaining the product's classification as "wine." 

We will study case histories of producers walking this regulatory tightrope. Staying just below the statutory threshold allows the product to remain taxed at the 29% wholesale WET rate; crossing that threshold by a single percentage point triggers an immediate reclassification to a distilled spirit, resulting in a cliff-edge margin collapse.

## Applied Computational Lab

Because this week directly precedes the submission of your WET Policy Brief, the lab focuses on identifying the exact mathematical point of regulatory failure. 

You will be given the volumetric data for a theoretical 2-liter cask of cheap fermented grape must. Your task is to calculate the precise volume of 95% neutral grain spirit that can be added to the mixture before the Australian Taxation Office legally revokes its WET categorization. You will manually calculate the total tax burden of the product immediately before the threshold, and immediately after. The resulting delta is the exact financial value of the loophole. You cannot adequately draft your policy brief without understanding the scale of this cliff-edge penalty.

## Mandatory reading

- [Estimated impacts of alternative Australian alcohol taxation structures on consumption, public health and government revenues](https://doi.org/10.5694/mja13.10605)
  — Doran, Byrnes, Cobiac, Vandenberg & Vos, *Medical Journal of Australia* 199(9), 2013, 619–622. 
  This paper models the precise comparison this week establishes—ad valorem taxation against volumetric taxation—using real Australian datasets. While the authors report on what each structure does to consumption and public health, our interest lies in their revenue modeling. Extract their delta calculations to understand the macroeconomic scale of the disparity you are calculating in the lab.

- [Australia's Future Tax System: report to the Treasurer](https://treasury.gov.au/review/the-australias-future-tax-system-review)
  — Commonwealth Treasury, 2010, Recommendation 71. 
  The official 2010 recommendation from the Treasury was that every alcoholic beverage should be taxed volumetrically, converging over time on a single, flat rate. Read the section where the Treasury explicitly defines the current arrangement as "incoherent." More importantly, read the government's subsequent political response alongside it. The government's refusal to implement this recommendation is the ultimate proof that the WET loophole is a permanent structural reality, and therefore safe to build our long-term optimization algorithms upon.