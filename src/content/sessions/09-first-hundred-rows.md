---
title: First hundred rows
description:
  Getting a scraper running against your own catalogue, and meeting the
  four failure modes that quietly corrupt a retail dataset
week: 9
date: 2027-04-19
teachers:
  - marisol-quaye
spec:
  - your scraper returns at least 100 rows with name, volume, ABV and price populated
  - you have a documented crawl delay and a check against the site's robots.txt
  - you can name which of your rows have an inferred rather than a stated ABV, and how many
related:
  - lectures/week-09
  - assessments/data-scraping-exercise
---

## Before the lab

Bring a laptop and your chosen retailer's online liquor catalogue. Bring
whatever scraping code you already have, working or not — a broken
scraper is a better starting point for this lab than an empty file.

## In the lab

**Conduct before code.** Check `robots.txt` first, set a crawl delay of at
least two seconds, and identify your client honestly. This is a course
rule stated on the [policies](/policies/) page, and it is also the
difference between a method another researcher could repeat and one that
gets an IP range blocked for the whole cohort.

**The four failure modes.** The week's reading catalogues them, and all
four will appear in your first hundred rows:

- **volume in the title, not a field** — "Cab Sav 750ml" parses; "Cab Sav
  75cl" and "Cab Sav 6x330" do not, unless you make them
- **ABV missing entirely** — common on beer and near-universal on
  multipacks; inferring from category is allowed, recording that you
  inferred it is required
- **promotional price in the price field** — the number changes under you
  between runs, so timestamp every row
- **the same product listed twice** at different sizes, which
  double-counts unless you key on something better than name

**The honest column.** Add a column recording, per row, whether ABV was
stated or inferred. The assessment's reproducibility criterion is
substantially about whether a reader can tell your measured data from your
assumed data, and a column is the cheapest way to let them.

**Core reading:** *Automated Extraction of Supermarket Inventory Data*
(Journal of Computational Retail Analysis, 2023)

## Afterwards

You leave with a running scraper, a hundred timestamped rows, and a count
of how many of them you had to guess at. The Data Scraping Exercise is due
the week after this one.
