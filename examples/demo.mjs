// Purpose: Demonstrate the Jev-to-Mistral cascade without network calls.
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
const mistral = { respond: async ({ input }) => "draft:" + input };
console.log(
  await routeReflex("Find company 552100554", {
    jev,
    mistral,
    tools: [
      {
        name: "lookup_company",
        description: "Look up a French company by SIREN",
      },
      { name: "search_law", description: "Search French law" },
    ],
  }),
);
