export const CAREER_MODEL = "gemini-2.5-flash";

export async function callGemini(params: {
  apiKey: string;
  model: string;
  system: string;
  prompt: string;
}): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": params.apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: params.system }] },
      contents: [{ role: "user", parts: [{ text: params.prompt }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Erreur IA (${res.status}) : ${errText.slice(0, 300) || res.statusText}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";

  if (!text) throw new Error("Réponse IA vide. Réessayez.");
  return text;
}