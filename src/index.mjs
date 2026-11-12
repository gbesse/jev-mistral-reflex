// Objectif : implémenter la frontière de décision métier propre au dépôt.
export function validateTools(tools){
 const fail=()=>{throw new TypeError('Outils invalides ou réservés / Invalid or reserved tools / Herramientas inválidas o reservadas');};
 if(!Array.isArray(tools)||tools.length<2||tools.length>255)fail();const seen=new Set();
 for(const t of tools){if(!t||typeof t.name!=='string'||!/^[A-Za-z][A-Za-z0-9_.-]{0,63}$/.test(t.name)||['none','constructor','prototype','__proto__'].includes(t.name)||seen.has(t.name)||typeof t.description!=='string'||!t.description.trim()||t.description.length>8000)fail();seen.add(t.name);}
 return tools;
}
export async function routeReflex(
  input,
  { jev, mistral, tools, minConfidence = 0.8 },
) {
  validateTools(tools);
  if(!Number.isFinite(minConfidence)||minConfidence<0||minConfidence>1)throw new TypeError('Confiance invalide / Invalid confidence / Confianza inválida');
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
