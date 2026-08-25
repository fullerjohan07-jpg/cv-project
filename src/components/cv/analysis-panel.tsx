import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, Loader2, Sparkles, Target, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/ui/form-controls";
import { ImportCvField } from "@/components/cv/import-cv-field";
import { analyzeCV, type CVAnalysis } from "@/lib/career.functions";
import { toCVPayload } from "@/lib/cv-payload";
import type { CVData } from "@/lib/cv-types";
import { cn } from "@/lib/utils";

export function AnalysisPanel({
  data,
  jobOffer,
  setJobOffer,
  canSpend,
  onSpend,
  onFeedback,
  feedbackGiven,
}: {
  data: CVData;
  jobOffer: string;
  setJobOffer: (v: string) => void;
  canSpend: boolean;
  onSpend: () => void;
  onFeedback: () => void;
  feedbackGiven: boolean;
}) {
  const run = useServerFn(analyzeCV);
  const [importedCvText, setImportedCvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CVAnalysis | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const sendFeedback = () => {
    if (feedbackSent || feedbackGiven) return;
    setFeedbackSent(true);
    onFeedback();
  };
  const launch = async () => {
    if (!canSpend) {
      setError("Plus de crédits IA aujourd'hui. Gagnez-en dans l'onglet Crédits.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await run({ data: { cv: toCVPayload(data), jobOffer, importedCvText } });
      setResult(res as CVAnalysis);
      onSpend();
    } catch (e) {
      setError(e instanceof Error ? e.message : "L'analyse a échoué. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-xl">
          <Target className="h-5 w-5 text-primary" />
          Analyse de CV
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Collez l'offre d'emploi visée : le score d'adéquation et les réécritures seront calibrés
          dessus. Sans offre, l'analyse se base sur votre titre.
        </p>
        <div className="mt-4">
          <Field label="Importer un CV existant (optionnel)">
            <ImportCvField onExtracted={setImportedCvText} />
          </Field>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Utile si votre CV contient des détails que vous n'avez pas (encore) remplis dans le
            formulaire ci-dessus. L'IA combinera les deux.
          </p>
        </div>
        <div className="mt-4">
          <Field label="Offre d'emploi (optionnel)">
            <TextArea
              value={jobOffer}
              onChange={(e) => setJobOffer(e.target.value)}
              placeholder="Collez ici le texte de l'annonce…"
              className="min-h-32"
            />
          </Field>
        </div>
        <Button size="lg" className="mt-4 w-full" onClick={launch} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Analyse en cours…" : "Analyser mon CV (1 crédit)"}
        </Button>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </div>

      {result ? (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center gap-6">
              <ScoreRing value={result.scoreGlobal} />
              <p className="min-w-52 flex-1 text-sm leading-relaxed text-foreground">
                {result.verdict}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Bar label="Compatibilité ATS" value={result.scores.ats} />
              <Bar label="Clarté" value={result.scores.clarte} />
              <Bar label="Impact" value={result.scores.impact} />
              <Bar label="Adéquation" value={result.scores.adequation} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ListCard
              title="Points forts"
              items={result.pointsForts}
              icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
            />
            <ListCard
              title="À corriger"
              items={result.faiblesses}
              icon={<AlertTriangle className="h-4 w-4 text-brand-amber" />}
            />
          </div>

          {result.motsClesManquants.length ? (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-base font-semibold">Mots-clés manquants</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.motsClesManquants.map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold">Réécritures prêtes à copier</h3>
            <div className="mt-4 flex flex-col gap-4">
              {result.ameliorations.map((a, i) => (
                <div key={i} className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {a.section}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{a.probleme}</p>
                  <p className="mt-2 rounded-lg bg-card p-3 text-sm leading-relaxed">
                    {a.reecriture}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigator.clipboard?.writeText(a.reecriture)}
                  >
                    Copier
                  </Button>
                </div>
              ))}
            </div>
          </div>

                    {result.questionsEntretien.length ? (
            <ListCard
              title="Questions d'entretien probables"
              items={result.questionsEntretien}
              icon={<Sparkles className="h-4 w-4 text-primary" />}
            />
          ) : null}

          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            {feedbackSent || feedbackGiven ? (
              <p className="text-sm font-medium text-primary">
                Merci pour votre avis — crédit bonus ajouté (visible dans l'onglet Crédits) !
              </p>
            ) : (
              <>
                <p className="text-sm font-medium">Cette analyse vous a-t-elle été utile ?</p>
                <div className="mt-3 flex justify-center gap-3">
                  <Button variant="outline" size="sm" onClick={sendFeedback}>
                    <ThumbsUp className="h-4 w-4" /> Utile
                  </Button>
                  <Button variant="outline" size="sm" onClick={sendFeedback}>
                    <ThumbsDown className="h-4 w-4" /> À améliorer
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  return (
    <div
      className="flex h-28 w-28 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(var(--primary) ${value * 3.6}deg, var(--muted) 0deg)`,
      }}
    >
      <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-card">
        <span className="font-display text-2xl font-semibold">{value}</span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-semibold">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", value >= 70 ? "bg-primary" : "bg-brand-amber")}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-base font-semibold">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed">
            <span className="mt-0.5 shrink-0">{icon}</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}