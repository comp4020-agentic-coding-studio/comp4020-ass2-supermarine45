// The promises SLOP4230 makes that the build cannot check.
//
// The build already owns compilation, accessibility, internal links, dangling
// refs, deck compilation and API generation, and data-integrity.test.ts owns
// the teaching-period dates. What is left is everything this particular course
// claims about itself — that it runs twelve weeks, that every claim is cited,
// that an assessment never depends on a lecture that has not happened yet, and
// that the one formula the whole semester rests on is stated the same way
// everywhere it appears.
//
// These read the built artefacts rather than the source, so they test the
// contract — what the site must be — rather than how it was assembled.

import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  title: string;
  related: string[];
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { code: string; startDate: string; endDate: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const byType = (type: string) => api.nodes.filter((n) => n.type === type);
const WEEKS = Array.from({ length: 12 }, (_, i) => i + 1);

/** A node's full body, which only the per-entry API files carry. */
function body(id: string): string {
  const node = JSON.parse(readFileSync(resolve(`dist/api/${id}.json`), "utf8")) as { body?: string };
  return node.body ?? "";
}

function htmlPages(dir = resolve("dist")): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "_astro" ? [] : htmlPages(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

describe("the course runs the twelve weeks it advertises", () => {
  it("has exactly one lecture per teaching week", () => {
    const weeks = byType("lectures").map((n) => n.meta?.week);
    for (const week of WEEKS) {
      expect(weeks.filter((w) => w === week), `week ${week} lectures`).toHaveLength(1);
    }
    expect(byType("lectures")).toHaveLength(12);
  });

  it("pairs every lecture week with a lab", () => {
    const labWeeks = byType("sessions").map((n) => n.meta?.week);
    for (const week of WEEKS) {
      expect(labWeeks.filter((w) => w === week), `week ${week} labs`).toHaveLength(1);
    }
  });

  it("names a teaching-team member on every lecture and lab, and they all exist", () => {
    const people = new Set(byType("people").map((n) => n.id.split("/")[1]));
    for (const node of [...byType("lectures"), ...byType("sessions")]) {
      const teachers = (node.meta?.teachers ?? []) as string[];
      expect(teachers.length, `${node.id} names no teacher`).toBeGreaterThan(0);
      for (const teacher of teachers) {
        expect(people.has(teacher), `${node.id} names unknown teacher ${teacher}`).toBe(true);
      }
    }
  });
});

describe("every claim traces to the literature", () => {
  // CLAUDE.md fixes the citation style: *Paper Title* (Journal Name, Year).
  const CITATION = /\*[^*]+\*\s*\n?\s*\((?:[^()]*,\s*)?(?:19|20)\d{2}\)/;

  it("gives every lecture a core reading in the fixed style", () => {
    for (const node of byType("lectures")) {
      const text = body(node.id);
      expect(text, `${node.id} has no core reading`).toContain("**Core reading:**");
      expect(CITATION.test(text), `${node.id} citation is not *Title* (Journal, Year)`).toBe(true);
    }
  });

  it("gives every lab a required or core reading", () => {
    for (const node of byType("sessions")) {
      const text = body(node.id);
      const cited = /\*\*(?:Required|Core) reading:\*\*/.test(text);
      expect(cited, `${node.id} sends students away with no reading`).toBe(true);
    }
  });
});

describe("assessment adds up and depends only on what has happened", () => {
  it("sums the three weights to 100", () => {
    // The schema enforces each weighted block's own criteria summing to 100.
    // Nothing enforces the total across assessments, which is the number the
    // brief actually requires.
    const total = byType("assessments").reduce((sum, n) => sum + Number(n.meta?.weight ?? 0), 0);
    expect(total).toBe(100);
  });

  it("falls due on or after the week it is set in", () => {
    const lectureDate = new Map(
      byType("lectures").map((n) => [Number(n.meta?.week), String(n.meta?.date).slice(0, 10)]),
    );
    for (const assessment of byType("assessments")) {
      const set = lectureDate.get(Number(assessment.meta?.week));
      const due = String(assessment.meta?.due).slice(0, 10);
      expect(set, `${assessment.id} is filed under a week with no lecture`).toBeDefined();
      expect(due >= set!, `${assessment.id} is due ${due}, before its week-${assessment.meta?.week} lecture on ${set}`).toBe(true);
    }
  });

  // `related:` renders on both pages, so the generated graph is symmetric and
  // says nothing about which way a dependency runs — week 10's lecture draws
  // on the scraping exercise, not the other way round. The direction exists
  // only in the frontmatter that declared it, so this reads that.
  it("never draws on a lecture that has not happened by its due date", () => {
    const lectureDate = new Map(
      byType("lectures").map((n) => [n.id, String(n.meta?.date).slice(0, 10)]),
    );
    for (const assessment of byType("assessments")) {
      const slug = assessment.id.split("/")[1];
      const source = readFileSync(resolve(`src/content/assessments/${slug}.md`), "utf8");
      const block = source.match(/^related:\n((?:\s+-\s+.+\n)+)/m)?.[1] ?? "";
      const declared = [...block.matchAll(/-\s+(\S+)/g)].map((m) => m[1]);
      const due = String(assessment.meta?.due).slice(0, 10);

      for (const ref of declared.filter((r) => r.startsWith("lectures/"))) {
        const date = lectureDate.get(ref);
        expect(date, `${assessment.id} declares unknown ${ref}`).toBeDefined();
        expect(
          date! <= due,
          `${assessment.id} is due ${due} but draws on ${ref}, taught ${date}`,
        ).toBe(true);
      }
    }
  });
});

describe("the slides the course claims exist", () => {
  it("builds a page for every lecture that links one, and links at least one", () => {
    const linked = byType("lectures").filter((n) => n.meta?.slides);
    expect(linked.length, "no lecture carries a deck").toBeGreaterThan(0);
    for (const node of linked) {
      const route = String(node.meta?.slides).replace(/^\/|\/$/g, "");
      const page = resolve("dist", route, "index.html");
      expect(() => readFileSync(page), `${node.id} links ${route} but no page was built`).not.toThrow();
    }
  });
});

describe("the index formula does not disagree with itself", () => {
  // The conversion is written out for students in the week 1 lab and the week
  // 10 deck, and implemented a third time in src/lib/index-math.ts for the
  // toolkit. Three statements of one formula is three chances to drift.
  const FORMULA = /standard_drinks = \(volume_ml × abv_percent × 0\.789\) \/ 1000/;

  it("states the conversion identically wherever the course writes it out", () => {
    const lab = body("sessions/01-getting-started");
    const deck = readFileSync(resolve("src/decks/week-10.deck.mdx"), "utf8");
    expect(FORMULA.test(lab), "week 1 lab states the formula differently").toBe(true);
    expect(FORMULA.test(deck), "week 10 deck states the formula differently").toBe(true);
  });

  it("computes what the written formula says it computes", async () => {
    const { standardDrinks, abvToDollarIndex } = await import("../src/lib/index-math");
    // A 4 L cask at 10.5%: (4000 × 10.5 × 0.789) / 1000 = 33.138
    expect(standardDrinks(4000, 10.5)).toBeCloseTo(33.138, 3);
    expect(abvToDollarIndex(4000, 10.5, 14.5)).toBeCloseTo(2.2854, 4);
  });
});

describe("nothing starter-shaped reaches a reader", () => {
  const TEMPLATE_PHRASES = [
    "STARTER_CONTENT",
    "Replace this deck",
    "Weights should sum to 100",
    "your course deserves",
    "A course decides how many lectures it needs",
    "YOUR-ORG",
  ];

  it("ships no template phrasing on any rendered page", () => {
    const offenders: string[] = [];
    for (const page of htmlPages()) {
      const html = readFileSync(page, "utf8");
      for (const phrase of TEMPLATE_PHRASES) {
        if (html.includes(phrase)) offenders.push(`${page.split("/dist/")[1]}: "${phrase}"`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
