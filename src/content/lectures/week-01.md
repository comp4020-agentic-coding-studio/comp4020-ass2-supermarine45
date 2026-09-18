---
title: Ethanol Fermentation & Baseline Costs
description:
  Establishing the chemical and economic baseline: fermentation margins and the absolute price floor of industrial ethanol before taxation.
week: 1
date: 2027-02-22
teachers:
  - marisol-quaye
slides: /decks/week-01/
---

**Core Theory:** *Fermentation of Ultra-Low-Cost Sugar Washes in High-Volume Beverage Production* (Smith & Davies, Journal of Industrial Microbiology, 2020).

## The Lecture

This week establishes the chemical and economic baseline for the entire twelve-week curriculum. In this course, ethanol ($C_2H_6O$) is never viewed biologically, socially, or culturally; it is viewed strictly fiscally. Before we can model retail optimization or exploit taxation loopholes, we must first isolate the absolute minimum cost of production before federal excises, packaging logistics, and retail margins distort the final shelf price. 

We will examine the molecular efficiency of industrial yeast strains—specifically *Saccharomyces cerevisiae*, when deployed in high-yield, low-cost sugar washes. By separating the raw thermodynamic cost of fermentation from the eventual retail markup, we establish the baseline price floor of alcohol production. 

Understanding this floor is critical. If, during your Week 9 data scraping exercise, you identify a SKU selling below this theoretical cost floor, you know immediately that the retailer is either absorbing a loss-leader margin to drive foot traffic, or the manufacturer has successfully exploited a profound regulatory loophole. Our goal this week is to define exactly what that baseline number is.

## Applied Computational Lab

As outlined in the course syllabus, theory without arithmetic is mere speculation. You must prove the baseline cost before you can optimize against it. 

Using the **Baseline Yield Calculator** widget provided in your lab interface, you will compute the raw production cost of a 10g ethanol unit. Enter the current bulk commodity price of refined sucrose ($/kg) and the estimated thermal energy overhead of the distillation phase. The calculator will output the absolute price floor of production. Record this metric; any disagreement between your local spreadsheet and this baseline floor will fatally compromise your final Event Portfolio.

## Mandatory Literature

Every week names two kinds of reading. The core theory (above) establishes the lecture's argument. The mandatory literature below consists of published work you must extract empirical data from to ground your arithmetic. 

- [Ethanol fermentation technologies from sugar and starch feedstocks](https://doi.org/10.1016/j.biotechadv.2007.09.002)
  — Bai, Anderson & Moo-Young, *Biotechnology Advances* 26(1), 2008, 89–105. 
  This paper outlines the exact industrial ferment that this week's cost model assumes. You must understand why *Saccharomyces* remains the organism of choice for high-volume commercial production, even when *Zymomonas* returns a technically higher yield. Sections 2 and 3 contain the specific metabolic metrics required for your lab arithmetic. Do not skim them.

- [Very high gravity (VHG) ethanolic brewing and fermentation: a research update](https://doi.org/10.1007/s10295-011-0999-3)
  — Puligundla, Smogrovicova, Obulam & Ko, *Journal of Industrial Microbiology & Biotechnology* 38(9), 2011, 1133–1144. 
  This paper puts a precise number on the claim made in slide 4 of the lecture: energy accounts for roughly 30% of total production cost, and the vast majority of that expenditure sits downstream of the ferment in the purification phase, rather than in the fermentation vat itself. Extract the energy expenditure percentages to calibrate your lab calculations.