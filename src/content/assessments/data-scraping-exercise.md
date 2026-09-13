---
title: Data Scraping Exercise
description:
  Scrape and map local supermarket alcohol volumes against retail
  prices to calculate an ABV-to-dollar ratio for 100+ SKUs
week: 9
due: 2027-04-26T12:00:00+10:00
weight: 30
marking:
  mode: weighted
  criteria:
    - name: Completeness of the scraped dataset
      weight: 30
    - name: Accuracy of ABV-to-dollar ratio calculations
      weight: 40
    - name: Data organisation and reproducibility of method
      weight: 30
spec:
  - a dataset of at least 100 distinct SKUs from at least one named supermarket retailer
  - every row carries product name, volume, ABV, price, and computed standard-drink count
  - the ABV-to-dollar ratio uses week 2's standard-drink conversion, applied consistently
  - the scraping method is documented well enough that another student could reproduce it
related:
  - lectures/week-02
  - lectures/week-09
---

## The brief

> Scrape a real supermarket's online liquor catalogue, normalise it, and
> calculate the exact alcohol-by-volume-to-price ratio for at least 100
> SKUs.

Week 9 covers the scraping methodology and its failure modes; week 2
supplies the standard-drink conversion every ratio in the dataset depends
on. This exercise asks you to combine both without letting either
weaken the other: a scrape that captures volume, ABV, and price cleanly
but applies the wrong standard-drink formula produces a dataset that
looks complete and is quietly wrong throughout, which is exactly the
silent-failure mode week 9's reading warns about. A dataset under 100
SKUs is not marked as "smaller but valid" — the reading is explicit that
below that threshold, a category-wide pattern cannot be distinguished
from one retailer's current promotions, so the exercise's own claims
about value-for-money would not be supportable.

## What you submit

The scraped and normalised dataset itself (spreadsheet or equivalent
structured format), sorted by ABV-to-dollar ratio, plus a short written
account of the scraping method used and any fields that had to be
excluded or estimated.

The weighting below puts accuracy of the ratio calculation highest, since
a complete, well-organised dataset built on an incorrect standard-drink
conversion has produced 100 wrong answers rather than one.
