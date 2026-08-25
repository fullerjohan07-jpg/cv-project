import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";

const MAX_BYTES = 8 * 1024 * 1024; // 8 Mo

export async function extractTextFromFile(input: {
  base64: string;
  mimeType: string;
  fileName: string;
}): Promise<string> {
  const buffer = Buffer.from(input.base64, "base64");
  if (buffer.byteLength > MAX_BYTES) {
    throw new Error("Fichier trop volumineux (8 Mo max).");
  }

  const name = input.fileName.toLowerCase();

  if (input.mimeType === "application/pdf" || name.endsWith(".pdf")) {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return cleanText(text);
  }

  if (
    input.mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return cleanText(result.value);
  }

  if (input.mimeType === "text/plain" || name.endsWith(".txt")) {
    return cleanText(buffer.toString("utf-8"));
  }

  throw new Error("Format non supporté. Utilisez un PDF, un DOCX ou un TXT.");
}

function cleanText(text: string): string {
  const trimmed = text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!trimmed) {
    throw new Error(
      "Impossible d'extraire du texte de ce fichier (c'est peut-être un scan/image ?).",
    );
  }
  return trimmed.slice(0, 20000);
}