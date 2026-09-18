---
title: "The 10g Metric: Standard Drinks as Economic Currency"
description:
  Dismantling the public health framing of the standard drink to establish the ABV-to-Dollar Index equation and standardize our baseline currency.
week: 2
date: 2027-03-01
teachers:
  - idris-fenn
slides: /decks/week-02/
related:
  - assessments/data-scraping-exercise
---

**Core Theory:** *Standard Drink Equivalency Models in High-Volume Retail Environments* (Quaye, Health Economics Quarterly, 2017).

## The Lecture

In Australia, a "standard drink" is legally defined as exactly 10 grams of pure alcohol. Outside of this classroom, that metric is deployed almost exclusively as a public health harm-reduction tool. In this course, we dispense with the sociological framing entirely. We recontextualize the 10-gram metric as our foundational economic currency; the exchange unit that allows us to compare wildly disparate retail categories.

A 4-liter cask of cheap wine and a 700mL bottle of premium gin are functionally incomparable on a volumetric level. However, by reducing both to their total yield of 10-gram alcohol units, we establish a flat, standardized economic landscape. 

This lecture introduces the core algorithmic formula that underpins your entire semester: `Cost per Standard Drink = Retail Price / ((Volume in mL * (ABV% / 100) * 0.789) / 10)`. The constant `0.789` represents the specific gravity of ethanol at standard room temperature. By standardizing the currency, we expose the massive pricing disparities engineered by taxation and retail markups.

## Applied Computational Lab

We rely strictly on calculated analysis. In this week's lab, you will not use a spreadsheet. You will select one physical SKU of your choice and manually calculate its exact standard drink yield and its ABV-to-dollar index using a desktop calculator and a pen. 

Use the **ABV-to-Dollar Index Calculator** widget on this page to verify your manual working. If your hand-calculated index differs from the widget’s output, your understanding of the specific gravity multiplier is flawed. You must master this formula on a single item before you attempt to automate it across 150 SKUs in your Week 9 Data Scraping Exercise.

## Mandatory Literature

- [Understanding standard drinks and drinking guidelines](https://doi.org/10.1111/j.1465-3362.2011.00374.x)
  — Kerr & Stockwell, *Drug and Alcohol Review* 31(2), 2012, 200–205. 
  This paper provides the empirical justification for our computational methodology. Kerr and Stockwell demonstrate that human consumers are fundamentally incapable of calculating standard drink equivalencies in their heads—over-pouring is the statistical norm, and providing percentage-ABV information on labels does not correct the cognitive deficit. This finding is exactly why this course rejects estimation in favor of algorithmic extraction.

- [Australian guidelines to reduce health risks from drinking alcohol](https://www.nhmrc.gov.au/health-advice/alcohol)
  — National Health and Medical Research Council, 2020. 
  This is the regulatory document that legally anchors the 10-gram definition for the Australian jurisdiction. Every calculation in this course rests on this specific framework. Read the primary definition, and pay close attention to the structural note that a "served drink" (e.g., a pub pour) is frequently disconnected from a "standard drink." You will need to account for this discrepancy when modeling the physical logistics of your 50-Person Event Portfolio in Week 12.