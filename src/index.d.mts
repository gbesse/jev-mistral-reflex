// Purpose: Describe bounded tools and the Jev-to-Mistral routing cascade.
import type { JevProvider } from "./jev.mjs";
export type ReflexTool = { name: string; description: string };
export function validateTools(tools: ReflexTool[]): ReflexTool[];
export function routeReflex(
  input: string,
  options: {
    jev: JevProvider;
    mistral: { respond(request: any): Promise<any> };
    tools: ReflexTool[];
    minConfidence?: number;
  },
): Promise<any>;
export function runCli(
  argv: string[],
  io?: { log(value: string): void },
): Promise<void>;
