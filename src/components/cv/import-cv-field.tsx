import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { importResumeText } from "@/lib/career.functions";

const ACCEPTED = ".pdf,.docx,.txt";
const MAX_MB = 8;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

export function ImportCvField({ onExtracted }: { onExtracted: (text: string) => void }) {
  const run = useServerFn(importResumeText);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Fichier trop volumineux (${MAX_MB} Mo max).`);
      return;
    }
    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await run({
        data: { base64, mimeType: file.type, fileName: file.name },
      });
      onExtracted(res.text);
      setFileName(file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import impossible. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    onExtracted("");
    setFileName("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {fileName ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
          <span className="flex items-center gap-2 truncate text-sm text-foreground">
            <FileText className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{fileName}</span>
          </span>
          <Button variant="ghost" size="sm" onClick={clear}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {loading ? "Lecture du fichier…" : "Importer mon CV (PDF, DOCX ou TXT)"}
        </Button>
      )}
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}