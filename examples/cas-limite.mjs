// Cas limite : une décision incertaine est transmise au répondant Mistral.
import assert from "node:assert/strict";
import { routeReflex } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";

const jev = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: {
    tool: {
      type: "choice",
      choice: "search_law",
      probabilities: { none: 0.2, lookup_company: 0.25, search_law: 0.55 },
      confidence: 0.55,
    },
  },
  usage: { input_tokens: 40, output_tokens: 0 },
}));
const resultat = await routeReflex("Explique-moi ce texte en détail", {
  jev,
  mistral: { respond: async () => "Réponse ouverte simulée" },
  tools: [
    { name: "lookup_company", description: "Rechercher une entreprise" },
    { name: "search_law", description: "Rechercher un texte juridique" },
  ],
});
assert.equal(resultat.path, "mistral");
assert.equal(resultat.reason, "low_confidence");
console.log(JSON.stringify(resultat, null, 2));
