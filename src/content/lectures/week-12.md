---
title: Capstone Synthesis
description:
  Scaling a purchasing algorithm from a single shopper to fifty-person
  event logistics, and what changes when it does
week: 12
date: 2027-05-10
teachers:
  - idris-fenn
---

**Core reading:** *Scaling Household Purchasing Algorithms to Event
Logistics* (Journal of Applied Consumer Logistics, 2024)

The semester closes by asking what happens when week 10's index and week
11's caution are applied at a scale neither was originally built for: not
one shopper's basket, but a fixed-budget inventory for a fifty-person
event. The week's reading finds that the constrained dynamic-programming
approach from week 10 still holds at this scale, but the minimum-variety
constraint becomes binding in a way it rarely is for an individual
shopper, since a single-SKU-optimal inventory that satisfies the budget
is trivial to construct and reliably the wrong answer for an actual
event. Week 11's externality framework does not disappear at scale
either — it multiplies by the guest count, which is precisely why the
reading treats event-scale purchasing as a harder, not merely a bigger,
version of the same problem the semester opened with in week 1's cost of
production.

## Outline

- applying week 10's constrained optimisation at fifty-person scale
- why the minimum-variety constraint binds harder at this scale
- why a single-SKU-optimal inventory is the wrong answer regardless of budget
- event-scale purchasing as harder, not merely bigger

## Further reading

- *Macro-Event Logistics in Beverage Procurement* (Supply Chain Journal,
  2020) — extends this week's scaling argument to physical transport,
  including vehicle payload limits for cask-heavy inventories, for a
  portfolio that has to actually be carried to the event once it is
  bought.
