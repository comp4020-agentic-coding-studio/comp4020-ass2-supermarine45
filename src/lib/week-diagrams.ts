/**
 * Weeks whose lecture page renders an interactive diagram, per the
 * week === N chain in src/pages/lectures/[slug].astro. Kept in sync by
 * hand — update this if a diagram is added to or removed from a week
 * there.
 */
export const WEEKS_WITH_DIAGRAM: ReadonlySet<number> = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
]);
