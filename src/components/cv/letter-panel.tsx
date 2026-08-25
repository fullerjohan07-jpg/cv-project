import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select, TextArea, TextInput } from "@/components/ui/form-controls";
import { ImportCvField } from "@/components/cv/import-cv-field";
import { generateCoverLetter, type CoverLetter } from "@/lib/career.functions";
import { toCVPayload } from "@/lib/cv-payload";
import type { CVData } from "@/lib/cv-types";
export function LetterPanel({
  data,
  jobOffer,
  setJobOffer,
  canSpend,
  onSpend,
}: {
  data: CVData;
  jobOffer: string;
  setJobOffer: (v: string) => void;
  canSpend: boolean;
  onSpend: () => void;
}) {
  const run = useServerFn(generateCoverLetter);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState("professionnel");
  const [length, setLength] = useState("standard");
  const [importedCvText, setImportedCvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [letter, setLetter] = useState<CoverLetter | null>(null);

  const launch = async () => {
    if (!canSpend) {
      setError("Plus de crédits IA aujourd'hui. Gagnez-en dans l'onglet Crédits.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await run({
        data: {
          cv: toCVPayload(data),
          jobOffer,
          company,
          role: role || data.personal.title,
          tone: tone as "professionnel",
          length: length as "standard",
          importedCvText,
        },
      });
      setLetter(res as CoverLetter);
      onSpend();
    } catch (e) {
      setError(e instanceof Error ? e.message : "La génération a échoué. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const plainText = letter
    ? [
        `Objet : ${letter.objet}`,
        "",
        letter.accroche,
        "",
        ...letter.paragraphes,
        "",
        letter.formuleFinale,
        "",
        data.personal.fullName,
      ].join("\n")
    : "";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="no-print rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-xl">
          <PenLine className="h-5 w-5 text-primary" />
          Lettre de motivation assortie
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Même ton, mêmes preuves, mêmes chiffres que votre CV — jamais de texte générique.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Entreprise">
            <TextInput value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Studio Nova" />
          </Field>
          <Field label="Poste visé">
            <TextInput
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder={data.personal.title || "Cheffe de projet"}
            />
          </Field>
          <Field label="Ton">
            <Select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="professionnel">Professionnel</option>
              <option value="chaleureux">Chaleureux</option>
              <option value="direct">Direct</option>
              <option value="audacieux">Audacieux</option>
            </Select>
          </Field>
          <Field label="Longueur">
            <Select value={length} onChange={(e) => setLength(e.target.value)}>
              <option value="courte">Courte</option>
              <option value="standard">Standard</option>
              <option value="detaillee">Détaillée</option>
            </Select>
          </Field>
        </div>

                <div className="mt-4">
          <Field label="Importer un CV existant (optionnel)">
            <ImportCvField onExtracted={setImportedCvText} />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Offre d'emploi (optionnel)">
            <TextArea
              value={jobOffer}
              onChange={(e) => setJobOffer(e.target.value)}
              placeholder="Collez l'annonce pour une lettre sur-mesure…"
            />
          </Field>
        </div>

        <Button size="lg" className="mt-4 w-full" onClick={launch} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
          {loading ? "Rédaction en cours…" : "Générer ma lettre (1 crédit)"}
        </Button>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </div>

      {letter ? (
        <>
          <div id="cv-print-root" className="overflow-hidden rounded-2xl ring-1 ring-border">
            <div className="cv-page cv-letter mx-auto max-w-full bg-white px-14 py-14 text-[12.5pt] leading-[1.6] text-neutral-800">
              <div className="mb-10 text-[10.5pt] leading-6 text-neutral-600">
                <p className="text-[13pt] font-semibold tracking-wide text-neutral-900">
                  {data.personal.fullName}
                </p>
                {data.personal.title ? <p>{data.personal.title}</p> : null}
                <p>{data.personal.location}</p>
                <p>
                  {data.personal.email}
                  {data.personal.phone ? ` · ${data.personal.phone}` : ""}
                </p>
              </div>
              {company ? (
                <p className="mb-8 text-[10.5pt] leading-6 text-neutral-600">
                  À l'attention du service recrutement
                  <br />
                  {company}
                </p>
              ) : null}
              <p className="mb-8 text-right text-[10.5pt] text-neutral-600">
                {data.personal.location ? `${data.personal.location}, le ` : "Le "}
                {new Date().toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="mb-8 font-semibold text-neutral-900">Objet : {letter.objet}</p>
              <p className="mb-5 text-justify">{letter.accroche}</p>
              {letter.paragraphes.map((p, i) => (
                <p key={i} className="mb-5 text-justify indent-8">
                  {p}
                </p>
              ))}
              <p className="mt-8 text-justify">{letter.formuleFinale}</p>
              <p className="mt-10 text-right font-semibold text-neutral-900">
                {data.personal.fullName}
              </p>
            </div>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <Button onClick={() => window.print()} size="lg">
              <Download className="h-4 w-4" />
              Télécharger en PDF
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigator.clipboard?.writeText(plainText)}>
              Copier le texte
            </Button>
          </div>

          {letter.conseils.length ? (
            <div className="no-print rounded-2xl border border-border bg-card p-6">
              <h3 className="text-base font-semibold">Avant d'envoyer</h3>
              <ul className="mt-3 list-disc pl-5 text-sm leading-relaxed text-muted-foreground">
                {letter.conseils.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
