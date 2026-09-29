// Objectif : démontrer la frontière de décision sans appel réseau.
import assert from "node:assert/strict";
import { routeReflex } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const jev = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: {
    tool: {
      type: "choice",
      choice: "lookup_company",
      probabilities: { none: 0.02, lookup_company: 0.94, search_law: 0.04 },
      confidence: 0.94,
    },
  },
  usage: { input_tokens: 45, output_tokens: 0 },
}));
const mistral = { respond: async ({ input }) => "brouillon : " + input };
const resultat = await routeReflex("Trouver l’entreprise 552100554", {
  jev,
  mistral,
  tools: [
    {
      name: "lookup_company",
      description: "Rechercher une entreprise française par SIREN",
    },
    { name: "search_law", description: "Rechercher dans le droit français" },
  ],
});
assert.equal(resultat.tool, "lookup_company");
console.log(JSON.stringify(resultat, null, 2));
