// The semester's arithmetic, defined once.
//
// The standard-drink conversion appears in three places a student reads —
// session 1, the week 10 deck, and the toolkit — and a fourth divergent copy
// is how those start to disagree. Every widget imports from here, so a
// correction lands everywhere at once.

/** Density of ethanol at 20°C, g/mL. */
export const ETHANOL_DENSITY = 0.789;

/** An Australian standard drink is exactly ten grams of pure ethanol. */
export const STANDARD_DRINK_GRAMS = 10;

/**
 * Standard drinks in a container.
 *
 *   (volume_mL × ABV% × 0.789) / 1000
 *
 * which is the same as taking the ethanol volume, converting to grams, and
 * dividing by ten — the /1000 collapses the percentage and the gram division
 * into one constant. Stated in the collapsed form because that is the form
 * session 1 and the week 10 deck both use.
 */
export function standardDrinks(volumeMl: number, abvPercent: number): number {
  return (volumeMl * abvPercent * ETHANOL_DENSITY) / (100 * STANDARD_DRINK_GRAMS);
}

/** The course's index: standard drinks per dollar. Higher is better value. */
export function abvToDollarIndex(volumeMl: number, abvPercent: number, price: number): number {
  if (price <= 0) return Number.NaN;
  return standardDrinks(volumeMl, abvPercent) / price;
}

/** Litres of pure alcohol (LALs) — the base a volumetric excise is levied on. */
export function litresOfAlcohol(volumeMl: number, abvPercent: number): number {
  return (volumeMl * abvPercent) / (100 * 1000);
}

/** Wine Equalisation Tax: ad valorem, levied on wholesale value. */
export const WET_RATE = 0.29;

export function wetPayable(wholesale: number, rate: number = WET_RATE): number {
  return wholesale * rate;
}

/**
 * Indicative federal excise, dollars per litre of pure alcohol. A teaching
 * figure for the course's 2027 setting, not a current legal rate — the point
 * of the comparison is the shape of the two structures, and a student
 * checking today's schedule against this number should get a different answer
 * and be able to say why.
 */
export const EXCISE_PER_LAL = 104.0;

export function excisePayable(
  volumeMl: number,
  abvPercent: number,
  ratePerLal: number = EXCISE_PER_LAL,
): number {
  return litresOfAlcohol(volumeMl, abvPercent) * ratePerLal;
}

// --- the constrained selection problem ---

export type Category = "wine" | "beer" | "spirits" | "rtd";

export interface Sku {
  id: string;
  name: string;
  category: Category;
  volumeMl: number;
  abv: number;
  price: number;
}

export interface Line {
  sku: Sku;
  qty: number;
}

export interface Selection {
  lines: Line[];
  spend: number;
  drinks: number;
  categories: number;
  feasible: boolean;
}

export const CATEGORIES: Category[] = ["wine", "beer", "spirits", "rtd"];

/**
 * A small worked catalogue, in the shape week 9's scrape produces. Prices are
 * illustrative and deliberately span the range where the two methods diverge.
 */
export const CATALOGUE: Sku[] = [
  { id: "cask-4l", name: "Cask white, 4 L", category: "wine", volumeMl: 4000, abv: 10.5, price: 14.5 },
  { id: "cask-2l", name: "Cask red, 2 L", category: "wine", volumeMl: 2000, abv: 11.0, price: 9.0 },
  { id: "btl-wine", name: "Bottled shiraz, 750 mL", category: "wine", volumeMl: 750, abv: 13.5, price: 11.0 },
  { id: "beer-30", name: "Full-strength block, 30 × 375 mL", category: "beer", volumeMl: 11250, abv: 4.8, price: 58.0 },
  { id: "beer-6", name: "Craft six-pack, 6 × 330 mL", category: "beer", volumeMl: 1980, abv: 5.2, price: 24.0 },
  { id: "spirit-1l", name: "Bottom-shelf vodka, 1 L", category: "spirits", volumeMl: 1000, abv: 37.5, price: 42.0 },
  { id: "spirit-700", name: "Mid-shelf gin, 700 mL", category: "spirits", volumeMl: 700, abv: 40.0, price: 48.0 },
  { id: "rtd-10", name: "RTD cans, 10 × 375 mL", category: "rtd", volumeMl: 3750, abv: 4.5, price: 46.0 },
  { id: "rtd-4", name: "Premium RTD, 4 × 330 mL", category: "rtd", volumeMl: 1320, abv: 6.0, price: 22.0 },
];

function summarise(lines: Line[], minCategories: number): Selection {
  const kept = lines.filter((l) => l.qty > 0);
  const spend = kept.reduce((t, l) => t + l.sku.price * l.qty, 0);
  const drinks = kept.reduce((t, l) => t + standardDrinks(l.sku.volumeMl, l.sku.abv) * l.qty, 0);
  const categories = new Set(kept.map((l) => l.sku.category)).size;
  return { lines: kept, spend, drinks, categories, feasible: categories >= minCategories };
}

/**
 * Greedy: take as much of the highest-index SKU as the budget allows, then the
 * next. Optimal for an unconstrained "which is best value" question, and the
 * week 10 lecture's whole point is that it stops being optimal the moment a
 * budget and a variety floor exist together.
 */
export function greedySelect(
  catalogue: Sku[],
  budget: number,
  minCategories: number,
  maxQty = 12,
): Selection {
  const ranked = [...catalogue].sort(
    (a, b) =>
      abvToDollarIndex(b.volumeMl, b.abv, b.price) - abvToDollarIndex(a.volumeMl, a.abv, a.price),
  );
  let left = budget;
  const lines: Line[] = [];
  for (const sku of ranked) {
    const qty = Math.min(maxQty, Math.floor(left / sku.price));
    if (qty > 0) {
      lines.push({ sku, qty });
      left -= sku.price * qty;
    }
  }
  return summarise(lines, minCategories);
}

/**
 * Dynamic programming: a bounded knapsack maximising standard drinks under a
 * budget, with the distinct-category count carried in the state as a bitmask
 * so the variety floor is a hard constraint rather than a post-filter.
 *
 * Budget is discretised to 50-cent steps, which is finer than any shelf price
 * in the catalogue and keeps the table small enough to solve on keystroke.
 */
export function optimalSelect(
  catalogue: Sku[],
  budget: number,
  minCategories: number,
  maxQty = 12,
): Selection {
  const STEP = 0.5;
  const cap = Math.floor(budget / STEP);
  const masks = 1 << CATEGORIES.length;
  const NEG = -1;

  // best[b][m] = max drinks within budget b having used exactly category set m
  let best = new Float64Array((cap + 1) * masks).fill(NEG);
  best[0] = 0;
  const choices: Int8Array[] = [];
  // The mask a state was reached from. `m | bit === m` whenever the category
  // was already present, so the transition is not invertible from the mask
  // alone — the parent has to be recorded rather than derived.
  const parents: Int8Array[] = [];

  for (const sku of catalogue) {
    const bit = 1 << CATEGORIES.indexOf(sku.category);
    const cost = Math.round(sku.price / STEP);
    const gain = standardDrinks(sku.volumeMl, sku.abv);
    const next = new Float64Array(best);
    const choice = new Int8Array((cap + 1) * masks);
    const parent = new Int8Array((cap + 1) * masks).fill(-1);

    for (let b = 0; b <= cap; b++) {
      for (let m = 0; m < masks; m++) {
        const from = best[b * masks + m];
        if (from === NEG) continue;
        for (let q = 1; q <= maxQty; q++) {
          const nb = b + cost * q;
          if (nb > cap) break;
          const nm = m | bit;
          const value = from + gain * q;
          const at = nb * masks + nm;
          if (value > next[at]) {
            next[at] = value;
            choice[at] = q;
            parent[at] = m;
          }
        }
      }
    }
    best = next;
    choices.push(choice);
    parents.push(parent);
  }

  // Pick the best reachable state that satisfies the variety floor.
  let bestB = -1;
  let bestM = -1;
  let bestV = NEG;
  for (let b = 0; b <= cap; b++) {
    for (let m = 0; m < masks; m++) {
      if (popcount(m) < minCategories) continue;
      const v = best[b * masks + m];
      if (v > bestV) {
        bestV = v;
        bestB = b;
        bestM = m;
      }
    }
  }
  if (bestV === NEG) return { lines: [], spend: 0, drinks: 0, categories: 0, feasible: false };

  // Walk the recorded parents back to recover the quantities.
  const lines: Line[] = [];
  let b = bestB;
  let m = bestM;
  for (let i = catalogue.length - 1; i >= 0; i--) {
    const at = b * masks + m;
    const qty = choices[i][at];
    if (qty > 0) {
      lines.push({ sku: catalogue[i], qty });
      b -= Math.round(catalogue[i].price / STEP) * qty;
      m = parents[i][at];
    }
  }
  return summarise(lines.reverse(), minCategories);
}

function popcount(n: number): number {
  let c = 0;
  for (let x = n; x; x >>= 1) c += x & 1;
  return c;
}
