// Objectif : vérifier les règles déterministes et les décisions sémantiques soumises à revue.
import test from "node:test";
import assert from "node:assert/strict";
import { routeReflex } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const tools = [
  { name: "a", description: "A" },
  { name: "b", description: "B" },
];
test("routes a confident decision", async () => {
  const j = createFakeProvider(() => ({
    model: "jev-1.13.0",
    answers: {
      tool: {
        type: "choice",
        choice: "a",
        probabilities: { a: 0.9, b: 0.05, none: 0.05 },
        confidence: 0.9,
      },
    },
    usage: { input_tokens: 1, output_tokens: 0 },
  }));
  assert.equal(
    (
      await routeReflex("x", {
        jev: j,
        mistral: { respond: async () => "" },
        tools,
      })
    ).path,
    "jev",
  );
});
test("falls back on uncertainty", async () => {
  const j = createFakeProvider(() => ({
    model: "jev-1.13.0",
    answers: {
      tool: {
        type: "choice",
        choice: "a",
        probabilities: { a: 0.5, b: 0.3, none: 0.2 },
        confidence: 0.5,
      },
    },
    usage: { input_tokens: 1, output_tokens: 0 },
  }));
  assert.equal(
    (
      await routeReflex("x", {
        jev: j,
        mistral: { respond: async () => "ok" },
        tools,
      })
    ).result,
    "ok",
  );
});
