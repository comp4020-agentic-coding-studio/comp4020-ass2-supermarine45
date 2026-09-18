---
title: "Spatial Ergonomics of Suburban Liquor Retail"
description:
  Applying Geographic Information Systems (GIS) to interior retail environments to map the deliberate obfuscation of tax-efficient inventory.
week: 7
date: 2027-04-05
teachers:
  - marisol-quaye
slides: /decks/week-07/
related:
  - assessments/event-portfolio
---

**Core Theory:** *Spatial Optimization of High-ABV Inventory in Big-Box Liquor* (Fenn, Journal of Retailing Analytics, 2022).

## The Lecture

This week, we transition from theory to applied reality. The interior of a big-box suburban liquor outlet (e.g., Dan Murphy's) is not a passive warehouse; it is an environment actively designed to manipulate purchasing pathways. 

Retailers are intimately aware of the ABV-to-dollar anomalies and WET loopholes we calculated in Phase I and II. Because these highly tax-efficient items (like cask wine) yield exceptionally low retail margins, store architects deliberately design the floor plan against the consumer. Highly efficient stock is physically quarantined in low-visibility, distant thoroughfares at the rear of the store. Conversely, highly taxed, high-margin inventory is placed directly in prime navigational sections. We will use Geographic Information Systems (GIS) to map these interiors, demonstrating how retailers use physical space to artificially inflate the average consumer's index.

## Applied Computational Lab

In this week's lab, you will quantify the spatial friction of a retail environment. You will load a provided CAD floor plan of a standard suburban big-box liquor store into QGIS. 

Your task is to map the primary pedestrian vectors from the entrance turnstile to the most mathematically optimal ABV-to-dollar SKUs identified in Week 4. You will calculate the "walking penalty"—the literal distance in meters a consumer is forced to navigate past high-margin visual merchandising before reaching tax-efficient stock. You can interact with the **Interactive Spatial Floor Plan** widget on this page to visualize how discrete zones yield vastly different efficiencies. You must account for this spatial friction when mapping the physical extraction logistics of your Week 12 Event Portfolio.

## Mandatory Literature

- [Changing the density of alcohol outlets to reduce alcohol-related problems](https://doi.org/10.1080/09595230701499191)
  — Livingston, Chikritzhs & Room, *Drug and Alcohol Review* 26(5), 2007, 557–566. 
  While this paper maps where outlets sit geographically within a suburb rather than where stock sits internally within the outlet, the analytical maneuver is exactly the same as our own. The authors treat physical position as a strictly measurable economic variable rather than passive background noise. Read this for the methodology of density mapping, which you will apply to interior retail shelves.

- [Distances to on- and off-premise alcohol outlets and experiences of alcohol-related amenity problems](https://doi.org/10.1111/j.1465-3362.2011.00346.x)
  — Wilkinson & Livingston, *Drug and Alcohol Review* 31(4), 2012, 394–401. 
  This study measures physical distance against reported amenity effects. Our lecture's core claim—that a physical walk constitutes a measurable economic cost—is not a metaphor. This paper provides the empirical shape of the evidence for that claim, proving mathematically that spatial friction directly dictates consumption patterns at scale.