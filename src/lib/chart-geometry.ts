// Bar geometry shared between BarChart.astro's server-rendered markup and the
// client <script> of whichever week component redraws it on input — both
// sides need the same numbers or a slider update would snap the bars to a
// different scale than the one they were drawn at.

export const CHART_W = 480;
export const CHART_H = 220;
export const CHART_PAD = { top: 24, right: 16, bottom: 34, left: 44 };
export const CHART_PLOT_W = CHART_W - CHART_PAD.left - CHART_PAD.right;
export const CHART_PLOT_H = CHART_H - CHART_PAD.top - CHART_PAD.bottom;

const BAR_GAP = 0.28;

export interface BarRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Position and size of the `index`-th of `count` evenly spaced bars, scaled so `value` reaches `max`. */
export function barGeometry(index: number, count: number, value: number, max: number): BarRect {
  const slot = CHART_PLOT_W / count;
  const width = slot * (1 - BAR_GAP);
  const x = CHART_PAD.left + index * slot + (slot - width) / 2;
  const height = (Math.max(0, value) / max) * CHART_PLOT_H;
  const y = CHART_PAD.top + CHART_PLOT_H - height;
  return { x, y, width, height };
}
