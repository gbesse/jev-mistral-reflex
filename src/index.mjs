// Objectif : implémenter la frontière de décision métier propre au dépôt.
export function validateTools(tools) {
  if (!Array.isArray(tools) || tools.length < 2)
    throw new TypeError("At least two tools are required");
  for (const t of tools) {
    if (!t?.name || !t?.description)
      throw new TypeError("Each tool needs name and description");
  }
  return tools;
}
export async function routeReflex(
  input,
  { jev, mistral, tools, minConfidence = 0.8 },
) {
  validateTools(tools);
  if (typeof input !== "string" || !input.trim())
    throw new TypeError("input must be non-empty");
  const criteria = { none: "No declared tool is appropriate" };
  for (const tool of tools) criteria[tool.name] = tool.description;
  const response = await jev.decide({
    state: { request: input },
    questions: {
      tool: {
        type: "choice",
        instructions:
          "Select a declared tool only when it directly handles the request. Choose none for open-ended conversation or missing capabilities.",
        criteria,
      },
    },
  });
  const a = response.answers.tool;
  if (a.choice !== "none" && a.confidence >= minConfidence)
    return {
      path: "jev",
      tool: a.choice,
      probability: a.probabilities[a.choice],
      confidence: a.confidence,
      usage: response.usage,
    };
  if (!mistral?.respond)
    throw new Error("A Mistral responder is required for fallback");
  return {
    path: "mistral",
    reason: a.choice === "none" ? "no_bounded_tool" : "low_confidence",
    result: await mistral.respond({ input, tools }),
    jev: { choice: a.choice, confidence: a.confidence },
  };
}
export async function runCli(argv, io = console) {
  io.log(
    JSON.stringify(
      {
        request: argv.join(" "),
        next: "Configure Jev and Mistral adapters, then call routeReflex.",
      },
      null,
      2,
    ),
  );
}
