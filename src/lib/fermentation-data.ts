// Illustrative teaching figures for week 1: the shape of very-high-gravity
// (VHG) fermentation, where yield rises with sugar-wash concentration and
// then falls as osmotic stress on the yeast sets in — the pattern this
// week's VHG reading describes, not a real producer's measured curve. Cost
// per litre of pure alcohol falls alongside rising yield and climbs again as
// the stressed high-gravity ferment needs more intervention to finish.
//
// Unlike index-math.ts's CATALOGUE, nothing in spec/ checks these figures —
// no worked example in a lecture or assessment cites them, so there is no
// second copy for them to drift from.
export interface FermentationPoint {
  concentration: number; // % w/v sugar in the wash
  yieldPercent: number;
  costPerLal: number; // AUD, pre-tax production cost per litre of pure alcohol
}

export const FERMENTATION_CURVE: FermentationPoint[] = [
  { concentration: 10, yieldPercent: 82, costPerLal: 3.4 },
  { concentration: 14, yieldPercent: 89, costPerLal: 2.95 },
  { concentration: 18, yieldPercent: 94, costPerLal: 2.7 },
  { concentration: 22, yieldPercent: 96, costPerLal: 2.62 },
  { concentration: 26, yieldPercent: 93, costPerLal: 2.78 },
  { concentration: 30, yieldPercent: 86, costPerLal: 3.15 },
];

/** Piecewise-linear interpolation between the fixed curve points above. */
export function fermentationAt(concentration: number): { yieldPercent: number; costPerLal: number } {
  const pts = FERMENTATION_CURVE;
  const c = Math.min(Math.max(concentration, pts[0].concentration), pts[pts.length - 1].concentration);
  let i = 0;
  while (i < pts.length - 2 && c > pts[i + 1].concentration) i++;
  const a = pts[i];
  const b = pts[i + 1];
  const t = (c - a.concentration) / (b.concentration - a.concentration);
  return {
    yieldPercent: a.yieldPercent + t * (b.yieldPercent - a.yieldPercent),
    costPerLal: a.costPerLal + t * (b.costPerLal - a.costPerLal),
  };
}
