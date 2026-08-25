import { z } from "zod";

export const cvSchema = z.object({
  personal: z.object({
    fullName: z.string().default(""),
    title: z.string().default(""),
    email: z.string().default(""),
    phone: z.string().default(""),
    location: z.string().default(""),
    website: z.string().default(""),
  }),
  summary: z.string().default(""),
  experiences: z
    .array(
      z.object({
        role: z.string().default(""),
        company: z.string().default(""),
        location: z.string().default(""),
        startDate: z.string().default(""),
        endDate: z.string().default(""),
        current: z.boolean().default(false),
        description: z.string().default(""),
      }),
    )
    .default([]),
  education: z
    .array(
      z.object({
        degree: z.string().default(""),
        school: z.string().default(""),
        startDate: z.string().default(""),
        endDate: z.string().default(""),
        description: z.string().default(""),
      }),
    )
    .default([]),
  skills: z.array(z.string()).default([]),
  languages: z.array(z.object({ name: z.string(), level: z.string() })).default([]),
});

export type CVPayload = z.infer<typeof cvSchema>;

export const analysisOutput = z.object({
  scoreGlobal: z.number().min(0).max(100),
  scores: z.object({
    ats: z.number().min(0).max(100),
    clarte: z.number().min(0).max(100),
    impact: z.number().min(0).max(100),
    adequation: z.number().min(0).max(100),
  }),
  verdict: z.string(),
  pointsForts: z.array(z.string()),
  faiblesses: z.array(z.string()),
  motsClesManquants: z.array(z.string()),
  ameliorations: z.array(
    z.object({
      section: z.string(),
      probleme: z.string(),
      reecriture: z.string(),
    }),
  ),
  questionsEntretien: z.array(z.string()),
});

export type CVAnalysis = z.infer<typeof analysisOutput>;

export const letterOutput = z.object({
  objet: z.string(),
  accroche: z.string(),
  paragraphes: z.array(z.string()),
  formuleFinale: z.string(),
  conseils: z.array(z.string()),
});

export type CoverLetter = z.infer<typeof letterOutput>;

export const analyzeInput = z.object({
  cv: cvSchema,
  jobOffer: z.string().max(12000).default(""),
  importedCvText: z.string().max(20000).default(""),
});

export const letterInput = z.object({
  cv: cvSchema,
  jobOffer: z.string().max(12000).default(""),
  company: z.string().max(200).default(""),
  role: z.string().max(200).default(""),
  tone: z.enum(["professionnel", "chaleureux", "direct", "audacieux"]).default("professionnel"),
  length: z.enum(["courte", "standard", "detaillee"]).default("standard"),
  importedCvText: z.string().max(20000).default(""),
});

export const importFileInput = z.object({
  base64: z.string().min(1),
  mimeType: z.string().default(""),
  fileName: z.string().default("fichier"),
});
