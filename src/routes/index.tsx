import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Download,
  Eye,
  FileText,
  Gift,
  PenLine,
  Pencil,
  RotateCcw,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CVForm } from "@/components/cv/cv-form";
import { PreviewPane } from "@/components/cv/preview-pane";
import { AnalysisPanel } from "@/components/cv/analysis-panel";
import { LetterPanel } from "@/components/cv/letter-panel";
import { CreditsPanel } from "@/components/cv/credits-panel";
import { completeness } from "@/lib/cv-payload";
import { type CVData, emptyCV, sampleCV } from "@/lib/cv-types";
import { claim, readCredits, remaining, spend, writeCredits, type CreditsState } from "@/lib/credits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CVfy — CV, analyse IA et lettre de motivation assortie" },
      {
        name: "description",
        content:
          "Créez un CV professionnel, obtenez une analyse IA (score ATS, réécritures) et une lettre de motivation assortie. Téléchargement toujours gratuit.",
      },
      { property: "og:title", content: "CVfy — CV, analyse IA et lettre assortie" },
      {
        property: "og:description",
        content:
          "CV + analyse IA + lettre de motivation cohérente avec votre CV. Téléchargement gratuit, crédits IA offerts chaque jour.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Tab = "cv" | "analyse" | "lettre" | "credits";

const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "cv", label: "Mon CV", icon: FileText },
  { id: "analyse", label: "Analyse IA", icon: Target },
  { id: "lettre", label: "Lettre", icon: PenLine },
  { id: "credits", label: "Crédits", icon: Gift },
];

function Index() {
  const [data, setData] = useState<CVData>(emptyCV);
  const [step, setStep] = useState(0);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [tab, setTab] = useState<Tab>("cv");
  const [jobOffer, setJobOffer] = useState("");
  const [credits, setCredits] = useState<CreditsState>(() => readCredits());

  useEffect(() => {
    setCredits(readCredits());
  }, []);

  const left = remaining(credits);
  const onSpend = () => setCredits((c) => writeCredits(spend(c)));
  const onClaim = (id: string) => setCredits((c) => writeCredits(claim(c, id)));

  const handleDownload = () => {
    const previous = document.title;
    const name = data.personal.fullName.trim();
    document.title = name ? `CV - ${name}` : "Mon CV";
    window.print();
    window.setTimeout(() => {
      document.title = previous;
    }, 500);
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-semibold text-foreground">CVfy</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              CV, analyse IA et lettre assortie — téléchargement gratuit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground sm:flex">
            <Sparkles className="h-3.5 w-3.5" /> {left} crédits IA
          </span>
          {tab === "cv" ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => {
                  setData(sampleCV);
                  setStep(1);
                }}
              >
                <Wand2 className="h-4 w-4" />
                Exemple
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => {
                  setData(emptyCV);
                  setStep(0);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button size="lg" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Télécharger le PDF
              </Button>
            </>
          ) : null}
        </div>
      </header>

      <nav className="no-print flex gap-1 overflow-x-auto border-b border-border bg-card px-2 sm:px-6">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {tab === "cv" ? (
        <>
          <div className="no-print flex border-b border-border bg-card lg:hidden">
            <ToggleTab
              active={mobileView === "edit"}
              onClick={() => setMobileView("edit")}
              icon={<Pencil className="h-4 w-4" />}
              label="Éditer"
            />
            <ToggleTab
              active={mobileView === "preview"}
              onClick={() => setMobileView("preview")}
              icon={<Eye className="h-4 w-4" />}
              label="Aperçu"
            />
          </div>

          <main className="flex min-h-0 flex-1">
            <section
              className={cn(
                "no-print w-full min-w-0 border-r border-border bg-card lg:w-[46%] lg:max-w-[620px]",
                mobileView === "edit" ? "block" : "hidden lg:block",
              )}
            >
              <CVForm data={data} update={setData} step={step} setStep={setStep} />
            </section>
            <section
              className={cn(
                "min-w-0 flex-1 overflow-y-auto bg-muted/50 p-4 sm:p-8",
                mobileView === "preview" ? "block" : "hidden lg:block",
              )}
            >
              <PreviewPane data={data} />
            </section>
          </main>
        </>
      ) : (
        <main className="min-h-0 flex-1 overflow-y-auto bg-muted/40 p-4 sm:p-8">
          {tab === "analyse" ? (
            <AnalysisPanel
              data={data}
              jobOffer={jobOffer}
              setJobOffer={setJobOffer}
              canSpend={left > 0}
              onSpend={onSpend}
            />
          ) : null}
          {tab === "lettre" ? (
            <LetterPanel
              data={data}
              jobOffer={jobOffer}
              setJobOffer={setJobOffer}
              canSpend={left > 0}
              onSpend={onSpend}
            />
          ) : null}
          {tab === "credits" ? (
            <CreditsPanel state={credits} onClaim={onClaim} completion={completeness(data)} />
          ) : null}
        </main>
      )}
    </div>
  );
}

function ToggleTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
        active ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
