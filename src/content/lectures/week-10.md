---
title: "Algorithmic Maximization of the ABV-to-Dollar Index"
description:
  Combinatorial optimization and algorithmic processing of large-scale retail datasets to identify structural market outliers.
week: 10
date: 2027-04-26
teachers:
  - idris-fenn
slides: /decks/week-10/
related:
  - assessments/data-scraping-exercise
  - assessments/event-portfolio
---

**Core reading:** *Algorithmic Maximization of the Intoxication Index in Real-Time Datasets* (Quaye, Quantitative Economics, 2024).

## The Lecture

Having successfully extracted an analysis of the retail dataset in Week 9, we must now apply programmatic logic to optimize it. A naive economic approach would simply sort your CSV by the ABV-to-dollar index and exhaust your entire capital budget on the single most mathematically efficient SKU (invariably a 4-liter cask of WET-subsidized white wine). 

However, macro-event logistics are rarely unconstrained. Your upcoming Event Portfolio dictates strict constraints: a fixed financial budget, maximum vehicle payload weights, and the minimum-variety requirements necessary to sustain a 50-person cohort. Therefore, we cannot rely on a simple greedy sort. We must treat retail beverage procurement strictly as a `combinatorial optimization`, specifically,with the classic Knapsack Problem. We will script automated functions in Python that parse your dataset, dynamically balancing the "weight" (retail price and physical payload) against the "value" (total standard drinks) to output the mathematically flawless inventory.

## Applied Computational Lab

In this week's lab, you will transition from data collection to algorithmic maximization. Utilizing the dataset you compiled for your Week 9 assessment, you will write a script that identifies the absolute optimum purchasing combination under a hard $500 cap. 

You will also deploy the **Data Visualization Scatterplot** widget within your lab environment. By plotting "Retail Price" on the X-axis against "Total Standard Drinks" on the Y-axis, you will visually isolate the profound outlier SKUs that your algorithm has identified. Hovering over these outliers will physically demonstrate the extreme efficiency of the WET loophole compared to the baseline cluster of volumetrically taxed spirits. This visual proof is a required component of your final Capstone deck.

## Mandatory reading

- [Knapsack Problems: Algorithms and Computer Implementations](http://www.or.deis.unibo.it/knapsack.html)
  — Martello & Toth, Wiley, 1990. 
  The core mathematical formulation that your Week 10 lab script builds upon is the 0-1 knapsack problem, and this text (made freely available by the authors) is where it is definitively set out. You are required to read Chapters 1 and 2. Pay absolute attention to the mathematical proof explaining exactly why a naive "greedy ranking" (merely buying the cheapest standard drinks in descending order) completely ceases to be optimal the moment a strict financial budget binds. 

- [Knapsack Problems](https://link.springer.com/book/10.1007/978-3-540-24777-7)
  — Kellerer, Pferschy & Pisinger, Springer, 2004. 
  This represents the modern computational treatment of combinatorial optimization. You must consult this text specifically for its chapters on *multiply-constrained* variants. A standard knapsack problem only balances one constraint (e.g., price). Your Capstone Event Portfolio poses a multiply-constrained variant by introducing physical vehicle payload limits and a minimum-variety requirement. You must understand the underlying algorithms here to write a script capable of solving for three concurrent variables.