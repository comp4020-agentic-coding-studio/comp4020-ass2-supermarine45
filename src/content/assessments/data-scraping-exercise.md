---
title: Data Scraping Exercise
description:
  Scrape and map local supermarket alcohol volumes against retail
  prices to calculate an ABV-to-dollar ratio for 150+ SKUs
week: 9
due: 2027-04-26T12:00:00+10:00
weight: 30
marking:
  mode: weighted
  criteria:
    - name: Code functionality and efficiency
      weight: 34
    - name: Data cleanliness and statistical validity
      weight: 33
    - name: Methodological clarity
      weight: 33
spec:
  - a dataset of at least 150 distinct SKUs from at least one named supermarket retailer
  - a stratified sample covering cask wine, RTDs, and clear spirits
  - every row carries product name, volume, ABV, price, and computed standard-drink count
  - the ABV-to-dollar ratio uses week 2's standard-drink conversion, applied consistently
  - the scraping method is documented well enough that another student could reproduce it
related:
  - lectures/week-02
  - lectures/week-09
---

## The brief

Students must write a Python script to scrape local supermarket alcohol
volumes against retail prices, calculating the exact ABV-to-dollar ratio
for a minimum of 150 distinct SKUs (Stock Keeping Units). The dataset
must include a stratified sample of cask wine, RTDs, and clear spirits.

## What you submit

A raw CSV dataset, the original Python script (.py file), and a 500-word
methodology outlining your scraping parameters and rate-limiting ethics.
