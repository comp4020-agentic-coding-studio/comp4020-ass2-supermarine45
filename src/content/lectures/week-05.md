---
title: "Price Elasticity in the Ready-to-Drink (RTD) Sector"
description:
  Analyzing demand elasticity, localized discount cycles, and the use of premixed spirits as retail loss-leaders.
week: 5
date: 2027-03-22
teachers:
  - marisol-quaye
slides: /decks/week-05/
---

**Core reading:** *Price Elasticity of Discount Spirits and RTDs in Suburban Markets* (Chen & Gupta, Journal of Consumer Policy, 2015).

## The Lecture

While cask wine provides a stable, tax-subsidized price floor, the Ready-to-Drink (RTD) sector operates on engineered volatility. This week, we examine the price elasticity of premixed spirits and how retailers deploy targeted markdowns to actively manipulate consumer purchasing habits. 

Because RTD products are highly price-elastic, even marginal discounts trigger disproportionate spikes in localized demand. We will plot how these engineered discount cycles create dramatic, short-term surges in the ABV-to-dollar index. Retailers willingly absorb temporary margin losses on these items to drive high-volume foot traffic into the store, relying on spatial psychology (which we will map in Week 8) to cross-sell higher-margin, tax-inefficient goods. Understanding this elasticity allows us to predict exactly when and where the index will artificially inflate, turning a heavily taxed item into a temporary optimization opportunity.

## Applied Computational Lab

In this week's lab, you will calculate the Price Elasticity of Demand (PED) for a nominated RTD product. Using a provided subset of historical scanner data, you will measure the percentage change in standard drinks purchased against the percentage change in retail price during a 48-hour promotional window. 

The objective is to quantify the precise discount threshold at which an RTD temporarily eclipses the baseline economic efficiency of cask wine. You will compute this threshold manually. Understanding the mathematics of demand elasticity by hand is a strict prerequisite before we begin writing automated scripts to hunt for these loss-leader anomalies in Week 9.

## Mandatory reading

- [Effects of beverage alcohol price and tax levels on drinking: a meta-analysis of 1003 estimates from 112 studies](https://doi.org/10.1111/j.1360-0443.2008.02438.x)
  — Wagenaar, Salois & Komro, *Addiction* 104(2), 2009, 179–190. 
  The elasticity hierarchy our models rely on this week is drawn directly from this meta-analysis, not our own assumptions: −0.46 for beer, −0.69 for wine, and −0.80 for spirits. Read the methodology section before looking at the numbers. The statistical spread across the 1,003 estimates matters significantly more than the three headline figures, as it proves that spirit pricing is inherently more volatile and responsive to retail manipulation than fermented goods.

- [Effects of alcohol tax and price policies on morbidity and mortality: a systematic review](https://doi.org/10.2105/ajph.2009.186007)
  — Wagenaar, Tobler & Komro, *American Journal of Public Health* 100(11), 2010, 2270–2278. 
  This paper tracks the same pricing relationship through to physical and societal outcomes. It is highly useful for demonstrating what a price elasticity vector actually entails once the product physically leaves the retail floor. We read this not for the public health conclusions, but to confirm that our mathematically modeled consumption spikes correlate perfectly with real-world morbidity data.