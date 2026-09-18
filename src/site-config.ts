import { defineSiteConfig } from "astro-theme-university/types";
import { slopBranding } from "astro-theme-slop";
import { courseMeta } from "./course-config";

// The underlying collection remains `sessions`; these labels are the language
// students see. "Lab" because that is what these are: a catalogue, a calculator
// and an hour of arithmetic on real shelf prices.
//
// The labs no longer have pages of their own — each one is rendered on its
// week's page under /lectures/, which is why there is no longer a `/sessions/`
// route for the collection key to name. The key, the refs and the API node type
// are all still `sessions`; only the reader-facing word and the URL changed.
export const sessionLabels = {
  singular: "Lab",
  plural: "Labs",
} as const;

export const graphCollections = ["sessions", "assessments", "lectures", "people"];

export const courseApiCollections = [
  ...graphCollections.map((key) => ({ key })),
  { key: "policies", dir: "pages/policies" },
];

export const siteConfig = defineSiteConfig({
  ...slopBranding,
  name: "Slop University",

  links: [
    { text: "Lecture", href: "/lectures/" },
    { text: "Assessment", href: "/assessments/" },
    { text: "Schedule", href: "/schedule/" },
    { text: "Toolkit", href: "/toolkit/" },
    { text: "People", href: "/people/" },
    { text: "Policies", href: "/policies/" },
  ],

  licence: "CC-BY-NC-SA-4.0",
  socialImage: "/src/assets/images/card.png",
  socialImageAlt: `A preview card for ${courseMeta.code}: ${courseMeta.title}`,
});
