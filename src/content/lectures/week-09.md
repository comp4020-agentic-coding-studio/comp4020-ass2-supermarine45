---
title: "Automated Extraction of Retail Inventories (Web Scraping)"
description:
  Programmatic extraction of live pricing data: DOM parsing, HTTP requests, and structural data hygiene.
week: 9
date: 2027-04-19
teachers:
  - marisol-quaye
slides: /decks/week-09/
related:
  - assessments/data-scraping-exercise
---

**Core Theory:** *Automated Extraction of Retail Inventories: Legal and Technical Boundaries* (Kim, Data Science Quarterly, 2021).

## The Lecture

To this point, our economic modeling has relied on manual, localized audits. However, manual calculation of the ABV-to-dollar index is fundamentally insufficient for macro-level optimization. Retail pricing is a highly dynamic apparatus; supermarkets rely on localized discount cycles, hidden clearance anomalies, and algorithmic price matching that can vanish within hours. To fully exploit these inefficiencies, we must transition to applied computer science and operate at scale.

This week addresses the programmatic extraction of live inventory data from the digital storefronts and APIs of major Australian liquor retailers. We will cover the specific technical methodologies required to parse Document Object Model (DOM) architectures, execute automated HTTP requests, and structure raw, unstructured HTML into clean, statistically valid CSV datasets. Crucially, we will delineate the strict technical boundaries of this extraction, distinguishing between legitimate academic data harvesting and malicious server disruption. 

## Applied Computational Lab

In this week's laboratory, you will abandon the manual calculator and initialize your Python environment. This lab serves as the direct technical prerequisite for your Data Scraping Exercise assessment.

Utilizing libraries such as `BeautifulSoup4` and `requests`, you will draft a rudimentary scraping script targeting a provided, sanitized retail sandbox environment. Your objective is to programmatically extract raw HTML nodes, isolate the pricing, ABV, and volumetric strings, sanitize the variables (stripping currency symbols and extraneous whitespace), and append them to a structurally sound dataframe. You are strictly required to hardcode a `crawl-delay` variable into your `while` loops to ensure your automated requests respect standard server limits. 

## Mandatory Literature

- [The Billion Prices Project: using online prices for measurement and research](https://doi.org/10.1257/jep.30.2.151)
  — Cavallo & Rigobon, *Journal of Economic Perspectives* 30(2), 2016, 151–178. 
  This paper demonstrates the macroeconomic validity of our technical methodology. Cavallo and Rigobon detail the process of scraping retail prices at a national scale to calculate inflation indices. You are required to read this specifically for their section on measurement biases. The errors they document—substitution bias, survival bias, and missing data—are the exact computational failure modes that will invalidate your dataset if your DOM parsing logic is flawed.

- [Web scraping for research: legal, ethical, institutional, and scientific considerations](https://doi.org/10.1177/20539517251381686)
  — Brown, Gruen, Maldoff, Messing, Sanderson & Zimmer, *Big Data & Society* 12(4), 2025. 
  The academic integrity conduct rules outlined on the SLOP4230 course policies page are simply the abbreviated, administrative version of this paper. This document outlines the absolute legal and ethical parameters of automated data extraction in a university context. You are expected to read and understand these institutional considerations before you execute your first live server request, not after your IP address has been blacklisted.