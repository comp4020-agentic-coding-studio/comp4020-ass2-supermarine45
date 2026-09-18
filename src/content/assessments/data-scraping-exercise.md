---
title: Retail Data Extraction Exercise
description:
  Extraction and analysis of retail inventory data to compute baseline ABV-to-dollar efficiencies across 150+ SKUs.
week: 9
due: 2027-04-26T12:00:00+10:00
weight: 30
marking:
  mode: weighted
  criteria:
    - name: Programmatic functionality and script efficiency
      weight: 40
    - name: Data analysis comprehension
      weight: 30
    - name: Methodological transparency and rate-limiting ethics
      weight: 30
spec:
  - extraction of a minimum of 150 distinct SKUs from a nominated regional liquor retailer
  - dataset must represent a stratified sample encompassing cask wine, ready-to-drink (RTD) premixes, and distilled clear spirits
  - individual rows must strictly isolate product name, raw volume (mL), stated ABV, retail price, and the computed standard-drink yield
  - the ABV-to-dollar index must correctly apply the 10g baseline metric established in Week 2
  - the methodological documentation must allow for exact replication of your scraping parameters by a third party
related:
  - lectures/week-02
  - lectures/week-09
---

## The brief

Economic analysis should be supported by empirical data. In this exercise, you will use Python to collect live pricing and volume data from the digital storefront of a suburban supermarket or liquor retailer.

Your script must collect at least **150 distinct Stock Keeping Units (SKUs)** and calculate the **ABV-to-dollar ratio** for each product. The dataset must use a **stratified sample** rather than random selection and include three beverage categories: **cask wine, bottled spirits, and ready-to-drink (RTD) products**. This ensures that the dataset captures differences in pricing, taxation, and promotional activity relevant to the Capstone Portfolio.

## What you submit

You must upload a single `.zip` archive containing three files: 
1. Your raw, unedited CSV dataset.
2. A Python script (`.py` or `.ipynb`) used to execute the extraction.
3. A 500-word document outlining your methodology. 

Your methodology must describe your data-parsing approach, justify the sample stratification, and document each step along the way. 