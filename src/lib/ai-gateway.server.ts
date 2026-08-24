import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "google",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}

export const CAREER_MODEL = "gemini-2.5-flash";