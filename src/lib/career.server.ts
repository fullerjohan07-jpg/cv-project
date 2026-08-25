import { generateText } from "ai";
import type { z } from "zod";
import { createLovableAiGatewayProvider, CAREER_MODEL } from "./ai-gateway.server";
import {
  analysisOutput,
  letterOutput,
  type CVAnalysis,
  type CoverLetter,
  type CVPayload,
} from "./career-schemas";

function gateway() {
  const key = process.env["GEMINI_API_KEY"];
  if (!key) throw new Error("Configuration IA manquante (GEMINI_API_KEY).");
  return createLovableAiGatewayProvider(key);
}

function extractJson(text: string): unknown {
  const cleaned = text
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error("Réponse IA illisible. Réessayez.");
  }
}

async function generateJson<T>(
  system: string,
  prompt: string,
  schema: z.ZodType<T>,
): Promise<T> {
  const ai = gateway();
  const result = await generateText({
    model: ai(CAREER_MODEL),
    system,
    prompt,
    temperature: 0.4,
  });
  return schema.parse(extractJson(result.text));
}

export function cvToText(cv: CVPayload) {
  const exp = cv.experiences
    .map(
      (e) =>
        `- ${e.role} chez ${e.company} (${e.startDate} - ${e.current ? "aujourd'hui" : e.endDate}) — ${e.description}`,
    )
    .join("\n");
  const edu = cv.education
    .map((e) => `- ${e.degree}, ${e.school} (${e.startDate} - ${e.endDate}) — ${e.description}`)
    .join("\n");
  return [
    `Nom: ${cv.personal.fullName}`,
    `Titre: ${cv.personal.title}`,
    `Localisation: ${cv.personal.location}`,
    `Profil: ${cv.summary}`,
    `Expériences:\n${exp || "(aucune)"}`,
    `Formations:\n${edu || "(aucune)"}`,
    `Compétences: ${cv.skills.join(", ") || "(aucune)"}`,
    `Langues: ${cv.languages.map((l) => `${l.name} (${l.level})`).join(", ") || "(aucune)"}`,
  ].join("\n\n");
}

const ANALYSIS_JSON_SHAPE = `{
  "scoreGlobal": nombre 0-100,
  "scores": { "ats": nombre, "clarte": nombre, "impact": nombre, "adequation": nombre },
  "verdict": "phrase",
  "pointsForts": ["..."],
  "faiblesses": ["..."],
  "motsClesManquants": ["..."],
  "ameliorations": [{ "section": "...", "probleme": "...", "reecriture": "..." }],
  "questionsEntretien": ["..."]
}`;

export async function runAnalysis(input: {
  cv: CVPayload;
  jobOffer: string;
  importedCvText?: string;
}): Promise<CVAnalysis> {
  return generateJson(
    "Tu es un recruteur senior francophone et expert ATS. Tu analyses des CV avec franchise, précision et bienveillance. Tes réécritures sont concrètes, chiffrées quand c'est possible, et rédigées en français. Jamais de blabla générique. Tu réponds UNIQUEMENT par un objet JSON valide, sans texte autour, sans balises de code.",
    [
      "Analyse ce CV.",
      input.jobOffer
        ? `Confronte-le à cette offre d'emploi et note l'adéquation en conséquence:\n"""${input.jobOffer}"""`
        : "Aucune offre fournie : évalue l'adéquation par rapport au titre visé du candidat.",
      `CV (formulaire structuré):\n"""${cvToText(input.cv)}"""`,
      input.importedCvText
        ? `Texte brut extrait du CV importé par le candidat (contient parfois des détails absents du formulaire, à prendre en compte en complément) :\n"""${input.importedCvText}"""`
        : "",
      "Donne 3 à 6 points forts, 3 à 6 faiblesses, jusqu'à 10 mots-clés manquants, 3 à 6 réécritures prêtes à copier-coller, et 4 questions d'entretien probables.",
      `Format JSON exact attendu :\n${ANALYSIS_JSON_SHAPE}`,
    ]
      .filter(Boolean)
      .join("\n\n"),
    analysisOutput,
  );
}

const LETTER_JSON_SHAPE = `{
  "objet": "...",
  "accroche": "...",
  "paragraphes": ["...", "..."],
  "formuleFinale": "...",
  "conseils": ["...", "...", "..."]
}`;

export async function runLetter(input: {
  cv: CVPayload;
  jobOffer: string;
  company: string;
  role: string;
  tone: string;
  length: "courte" | "standard" | "detaillee";
  importedCvText?: string;
}): Promise<CoverLetter> {
  const lengthHint = {
    courte: "2 paragraphes courts (max 120 mots au total).",
    standard: "3 paragraphes (200 à 250 mots au total).",
    detaillee: "4 paragraphes (300 à 350 mots au total).",
  }[input.length];

  return generateJson(
    "Tu rédiges des lettres de motivation en français, assorties au CV du candidat : même ton, mêmes preuves, mêmes chiffres. Tu es concret, tu bannis les clichés ('dynamique et motivé', 'depuis mon plus jeune âge'), tu ne fabules jamais d'expérience inexistante. Tu réponds UNIQUEMENT par un objet JSON valide, sans texte autour, sans balises de code.",
        [
      `Rédige une lettre de motivation pour ${input.role || "le poste visé"}${input.company ? ` chez ${input.company}` : ""}.`,
      `Ton souhaité : ${input.tone}. Longueur : ${lengthHint}`,
      input.jobOffer
        ? `Offre d'emploi:\n"""${input.jobOffer}"""`
        : "Pas d'offre fournie : appuie-toi sur le CV.",
      `CV du candidat (formulaire structuré):\n"""${cvToText(input.cv)}"""`,
      input.importedCvText
        ? `Texte brut extrait du CV importé (détails complémentaires à exploiter) :\n"""${input.importedCvText}"""`
        : "",
      "Ajoute 3 conseils courts pour personnaliser encore la lettre avant envoi.",
      `Format JSON exact attendu :\n${LETTER_JSON_SHAPE}`,
    ]
      .filter(Boolean)
      .join("\n\n"),
    letterOutput,
  );
}
