import type { ParseResponse } from "@kakeibo/shared";
import { llmParse } from "./llm";
import { ruleBasedParse } from "./parser";

export async function parseInput(text: string): Promise<ParseResponse> {
  try {
    return await llmParse(text);
  } catch {
    return ruleBasedParse(text);
  }
}
