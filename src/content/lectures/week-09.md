---
title: Data Scraping Methodologies
description:
  Automated extraction of supermarket inventory data, and how to build a
  dataset large enough to trust
week: 9
date: 2027-04-19
teachers:
  - marisol-quaye
slides: /decks/week-09/
related:
  - assessments/data-scraping-exercise
---

**Core reading:** *Automated Extraction of Supermarket Inventory Data*
(Journal of Computational Retail Analysis, 2023)

Eight weeks of this course have argued, case by case, that a single
product's shelf price hides more than it shows. Week 9 provides the tool
for checking that claim at scale rather than one bottle at a time. The
week's reading documents a scraping methodology for supermarket online
catalogues — product name, volume, ABV, and price fields extracted and
normalised into a single schema — and is explicit about the failure
modes that corrupt a dataset silently: inconsistent volume units,
promotional prices scraped instead of standard prices, and ABV fields
missing entirely for a nontrivial share of listings. A scraped dataset
below roughly a hundred SKUs, the reading finds, is too small to
distinguish a genuine category-wide pattern from noise in any single
retailer's current promotions, which is precisely the threshold this
course's own data-scraping exercise sets.

## Outline

- extracting and normalising product name, volume, ABV, and price fields
- failure modes that corrupt a dataset without announcing themselves
- why roughly a hundred SKUs is the threshold for a trustworthy pattern
- distinguishing a real category pattern from one retailer's promotions

## Further reading

- *Automated Extraction of Retail Inventories* (Data Science Quarterly,
  2021) — a second scraping methodology, useful for designing your
  collection schedule around a retailer's rate limits rather than the
  silent-failure modes this week's core reading focuses on.
- *Clearance Cycles in Suburban Liquor Outlets* (Retail Analytics, 2019) —
  the natural extension once a dataset is scraped more than once: the same
  fields, tracked over time, forecast markdown timing rather than only
  describing the current price.
