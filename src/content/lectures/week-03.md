---
title: "Cardboard Efficiencies: The Microeconomics of Bag-in-Box Wine"
description:
  Quantifying the margin improvements of bag-in-box distribution through logistical payload optimization and spatial geometry.
week: 3
date: 2027-03-08
teachers:
  - marisol-quaye
slides: /decks/week-03/
---

**Core Theory:** *Spatial Geometry and Oxidation Resistance in Polyethylene Bladder Distribution* (Fenn, Supply Chain & Logistics Journal, 2018).

## The Lecture

Having established the chemical price floor of ethanol in Week 1 and our standardized currency in Week 2, we now introduce the first major physical vector that distorts retail pricing: packaging logistics. 

In industrial beverage distribution, the traditional glass bottle is a mathematically catastrophic vessel. It possesses a high tare weight, requires structural reinforcement to prevent shattering, and its cylindrical geometry creates significant dead-space voids when packed into square cartons. This translates to an immense logistical overhead, as transport vehicles end up burning fuel to move heavy glass and empty air.

The Australian the bag-in-box (cask) packaging format eliminates this overhead entirely. By replacing glass with a collapsible, oxidation-resistant polyethylene bladder housed in a corrugated rectangular prism, producers achieve near-100% volumetric efficiency when stacking pallets. This lecture isolates that spatial efficiency and calculates the exact margin improvement it generates per liter of ethanol. We will demonstrate how these massive savings in physical freight are passed directly to the consumer, artificially lowering the ABV-to-dollar index of cask wine before taxation is even applied.

## Applied Computational Lab

In this week's lab, you will quantify the spatial penalty of cylindrical packaging. You are provided with the physical dimensions and maximum weight capacity of a standard Australian shipping pallet (the 1165mm x 1165mm CHEP pallet). 

Your task is to compute the maximum number of standard drinks that can be legally loaded onto a single pallet using two different formats: cases of 750mL glass wine bottles, and blocks of 4-liter cardboard casks. You will calculate the dead-space ratio for both configurations and convert that wasted volume into a definitive financial cost per standard drink. This physical payload math forms the logistical foundation of your Week 12 Event Portfolio.

## Mandatory Literature

- [Comparative life cycle assessment of alternative systems for wine packaging in Italy](https://doi.org/10.1016/j.jclepro.2020.120888)
  — Ferrara & De Feo, *Journal of Cleaner Production* 259, 2020, 120888.
  This paper provides external validation for the physical mechanics discussed in the lecture. Ferrara and De Feo measure bag-in-box distribution against the single-use glass bottle, attributing the massive discrepancy to packaging tare weight and palletizing efficiency. Crucially, they measure these two variables in carbon emissions rather than corporate dollars, which provides an independent, parallel confirmation that the logistical mechanism we are exploiting is structurally real.

- [Minimum pricing of alcohol versus volumetric taxation](https://doi.org/10.1371/journal.pone.0080936)
  — Sharma, Vandenberg & Hollingsworth, *PLoS ONE* 9(1), 2014, e80936.
  This study analyzes raw scanner data from 885 Victorian households. It observes that the heaviest 3% of consumers paid an average of A$1.31 per standard drink, against A$2.21 for the lightest consumers, and they achieved this efficiency almost exclusively by purchasing cask wine. This is the empirical proof of our theoretical model: it confirms that the market actively utilizes the cardboard efficiency we calculate in the lab, demonstrating our conclusion as an observed retail reality.