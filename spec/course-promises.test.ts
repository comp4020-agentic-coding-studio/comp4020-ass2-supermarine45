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
  /** The deliverable's contract lines, top-level in the API rather than in meta. */
  spec?: string[];
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

/**
 * Rendered text, for comparing page content against the strings that produced
 * it. A spec line reading "one supermarket's online liquor catalogue" ships as
 * `supermarket&#39;s`, so a raw `toContain` on the HTML fails on a page that is
 * perfectly correct.
 */
function renderedText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
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

  // This used to require a reading on every lab. It now requires one on every
  // *week*, which is the same promise addressed to the reader rather than to
  // the file: ten of the twelve labs cited the same paper as the lecture they
  // sit beneath, and once both are on one page that is the same citation twice.
  // The two labs that cite something of their own still do.
  it("never sends a week away without a reading", () => {
    const labByWeek = new Map(byType("sessions").map((n) => [Number(n.meta?.week), n]));
    for (const lecture of byType("lectures")) {
      const lab = labByWeek.get(Number(lecture.meta?.week));
      const text = body(lecture.id) + (lab ? body(lab.id) : "");
      const cited = /\*\*(?:Required|Core) reading:\*\*/.test(text);
      expect(cited, `week ${lecture.meta?.week} sends students away with no reading`).toBe(true);
    }
  });
});

describe("the mandatory reading is real work a reader can go and get", () => {
  // The course's twelve set texts are the course's own. The mandatory reading
  // is published literature, and the one thing that tells a reader which is
  // which is that the real ones carry a link. A "mandatory reading" that is
  // just another unlinked title would erase that distinction silently, so this
  // holds the section to being links.
  const LINK = /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g;

  /**
   * The Mandatory reading block, from its heading to the next `## ` or the end.
   *
   * Sliced rather than matched on purpose. The regex for this was
   * `/^## Mandatory reading$([\s\S]*?)(?=^## |\Z)/m`, and `\Z` is not a
   * JavaScript anchor — it is the literal letter Z, so the lazy body stopped at
   * the first capital Z in the text. Week 1 mentions *Zymomonas* in its first
   * entry, so the section came back truncated mid-sentence and the week looked
   * like it had one reading instead of two. Nothing about that failure pointed
   * at the regex.
   */
  function mandatorySection(id: string): string {
    const text = body(id);
    const start = text.search(/^## Mandatory reading$/m);
    if (start === -1) return "";
    const rest = text.slice(start + "## Mandatory reading".length);
    const end = rest.search(/^## /m);
    return end === -1 ? rest : rest.slice(0, end);
  }

  function mandatoryLinks(id: string): string[] {
    return [...mandatorySection(id).matchAll(LINK)].map((m) => m[1]);
  }

  it("gives every week at least two, each an absolute link", () => {
    for (const lecture of byType("lectures")) {
      const links = mandatoryLinks(lecture.id);
      expect(links.length, `${lecture.id} lists ${links.length} mandatory readings`).toBeGreaterThanOrEqual(2);
      for (const url of links) {
        // A bare host is a homepage, not a reading — it tells a reader where a
        // publisher lives, not which paper to open.
        const path = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
        expect(path.length, `${lecture.id} cites a bare domain: ${url}`).toBeGreaterThan(0);
      }
    }
  });

  it("does not quietly let a set text pose as one", () => {
    // The set texts are cited *Title* (Journal, Year) and never linked. If that
    // shape turns up inside a Mandatory reading block, the two lists have run
    // together and the reader can no longer tell them apart.
    const SET_TEXT = /\*[^*\n]+\*\s*\((?:[^()]*,\s*)?(?:19|20)\d{2}\)/;
    for (const lecture of byType("lectures")) {
      const section = mandatorySection(lecture.id);
      expect(SET_TEXT.test(section), `${lecture.id} has a set-text citation under Mandatory reading`).toBe(false);
    }
  });
});

describe("a week is one page", () => {
  /**
   * The longest run of the lab's own prose that rendering cannot alter — no
   * emphasis, no quotes, no dashes, so the source string is the page string.
   *
   * This exists because the first version of the test below checked the lab's
   * heading, title and spec lines, all of which the week page renders itself.
   * Deleting `<Lab />` from the page — removing every word of the brief — left
   * all twenty-two tests green. Only a fragment of the body catches that.
   */
  function plainFragment(text: string): string {
    return (
      text
        .split(/[.\n]/)
        .map((line) => line.trim())
        .filter((line) => /^[A-Za-z0-9 ,]+$/.test(line) && line.length >= 40)
        .sort((a, b) => b.length - a.length)[0] ?? ""
    );
  }

  // Added after the Lecture index shipped with no weeks on it at all: the
  // rewrite kept the `import LecturesGrid` line and dropped the `<LecturesGrid />`
  // that used it, so the page built, typechecked, passed axe, passed the link
  // check and passed every test here, while being a page of prose followed by
  // nothing. A tab whose whole job is to list the twelve weeks should not be
  // able to list none of them quietly.
  it("lists every week, lab and deck on the Lecture index", () => {
    const html = readFileSync(resolve("dist/lectures/index.html"), "utf8");
    const page = renderedText(html);
    const labByWeek = new Map(byType("sessions").map((n) => [Number(n.meta?.week), n]));
    for (const lecture of byType("lectures")) {
      // Node ids are `<collection>/<slug>`; the route is `/<collection>/<slug>/`.
      expect(html, `the index does not link ${lecture.id}`).toContain(`/${lecture.id}/`);
      expect(page, `the index does not name ${lecture.id}`).toContain(lecture.title);
      expect(html, `the index does not link week ${lecture.meta?.week}'s slides`).toContain(
        String(lecture.meta?.slides),
      );
      const lab = labByWeek.get(Number(lecture.meta?.week));
      expect(page, `the index does not name week ${lecture.meta?.week}'s lab`).toContain(lab!.title);
    }
  });

  it("renders every lab on its week's page", () => {
    const labByWeek = new Map(byType("sessions").map((n) => [Number(n.meta?.week), n]));
    for (const lecture of byType("lectures")) {
      const lab = labByWeek.get(Number(lecture.meta?.week));
      expect(lab, `week ${lecture.meta?.week} has no lab to merge`).toBeDefined();
      const html = readFileSync(resolve(`dist/${lecture.id}/index.html`), "utf8");
      const page = renderedText(html);
      expect(html, `${lecture.id} renders no lab section`).toContain('id="lab"');
      expect(page, `${lecture.id} does not name its lab`).toContain(lab!.title);
      // The spec lines are the lab's contract; they were on the lab's own page
      // and have to survive the move, not just the title.
      for (const line of lab!.spec ?? []) {
        expect(page, `${lecture.id} drops a spec line from its lab`).toContain(line);
      }
      const fragment = plainFragment(body(lab!.id));
      expect(fragment.length, `${lab!.id} has no fragment plain enough to check for`).toBeGreaterThan(0);
      expect(page, `${lecture.id} names its lab but renders none of the brief`).toContain(fragment);
    }
  });

  it("leaves no lab stranded at an address that shows nothing", () => {
    // The labs keep their permalinks — the theme requires every content file to
    // be routed — so each has to land the reader on the week that carries it.
    for (const lab of byType("sessions")) {
      const stub = readFileSync(resolve(`dist/${lab.id}/index.html`), "utf8");
      const target = `/lectures/week-${String(lab.meta?.week).padStart(2, "0")}/#lab`;
      expect(stub, `${lab.id} does not redirect to its week`).toMatch(
        new RegExp(`http-equiv="refresh"[^>]*${target.replace(/\//g, "\\/")}`),
      );
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
  it("gives every one of the twelve weeks a deck, linked from its lecture", () => {
    for (const node of byType("lectures")) {
      expect(node.meta?.slides, `${node.id} carries no slides link`).toBeTruthy();
    }
  });

  it("builds a page for every deck a lecture links", () => {
    for (const node of byType("lectures").filter((n) => n.meta?.slides)) {
      const route = String(node.meta?.slides).replace(/^\/|\/$/g, "");
      const page = resolve("dist", route, "index.html");
      expect(() => readFileSync(page), `${node.id} links ${route} but no page was built`).not.toThrow();
    }
  });

  it("leaves no deck orphaned — every built deck is linked from a lecture", () => {
    const linked = new Set(
      byType("lectures").map((n) => String(n.meta?.slides ?? "").replace(/^\/|\/$/g, "")),
    );
    const built = readdirSync(resolve("dist/decks"), { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => `decks/${e.name}`);
    for (const deck of built) {
      expect(linked.has(deck), `${deck} is built but nothing links to it`).toBe(true);
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

describe("the worked examples on the slides are the arithmetic the toolkit does", () => {
  // The tax figures are hand-typed into two decks and computed a second time by
  // the toolkit, and a marker who runs one against the other is the person most
  // likely to notice they disagree. Nothing in the build compares them — the
  // decks are prose to it — so this recomputes each printed figure from
  // src/lib/index-math.ts and asserts the slide still says it.
  const cents = (dollars: number, drinks: number) => `${((dollars / drinks) * 100).toFixed(1)}c`;
  const deck = (week: string) => readFileSync(resolve(`src/decks/${week}.deck.mdx`), "utf8");

  it("shows WET falling forty-fold harder on the bottle than the cask (week 4)", async () => {
    const { standardDrinks, wetPayable } = await import("../src/lib/index-math");
    const slide = deck("week-04");
    const cask = cents(wetPayable(2.0), standardDrinks(4000, 10.5));
    const bottle = cents(wetPayable(20.0), standardDrinks(750, 13.5));
    expect(slide, `week 4 prints a WET figure that is not ${cask}`).toContain(`**${cask}**`);
    expect(slide, `week 4 prints a WET figure that is not ${bottle}`).toContain(`**${bottle}**`);
    // The claim the slide makes in words, not just the two numbers under it.
    expect(slide).toContain("forty-fold");
  });

  it("shows one volumetric rate landing identically on all three products (week 6)", async () => {
    const { standardDrinks, excisePayable, litresOfAlcohol } = await import("../src/lib/index-math");
    const slide = deck("week-06");
    const products: [number, number][] = [
      [700, 40],
      [375, 4.8],
      [375, 4.5],
    ];
    const perDrink = new Set<string>();
    for (const [ml, abv] of products) {
      const excise = excisePayable(ml, abv);
      perDrink.add(cents(excise, standardDrinks(ml, abv)));
      expect(slide, `week 6 prints no $${excise.toFixed(2)} row for ${ml} mL at ${abv}%`).toContain(
        `$${excise.toFixed(2)}`,
      );
      expect(slide).toContain(litresOfAlcohol(ml, abv).toFixed(3));
    }
    // The point of the slide: the burden is flat, which is why there is one.
    expect(perDrink.size, "the three products no longer share one per-drink figure").toBe(1);
    expect(slide).toContain([...perDrink][0]);
  });

  it("keeps week 6's callback to week 4's numbers true", async () => {
    const { standardDrinks, wetPayable } = await import("../src/lib/index-math");
    const cask = cents(wetPayable(2.0), standardDrinks(4000, 10.5));
    const bottle = cents(wetPayable(20.0), standardDrinks(750, 13.5));
    expect(deck("week-06"), "week 6 misquotes week 4").toContain(`${cask} against ${bottle}`);
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
