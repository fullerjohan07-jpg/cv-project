import { createServerFn } from "@tanstack/react-start";
import { analyzeInput, letterInput } from "./career-schemas";

export type { CVPayload, CVAnalysis, CoverLetter } from "./career-schemas";

export const analyzeCV = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => analyzeInput.parse(input))
  .handler(async ({ data }) => {
    const { runAnalysis } = await import("./career.server");
    return runAnalysis(data);
  });

export const generateCoverLetter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => letterInput.parse(input))
  .handler(async ({ data }) => {
    const { runLetter } = await import("./career.server");
    return runLetter(data);
  });
