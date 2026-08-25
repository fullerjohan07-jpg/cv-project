import { Check, Gift, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BONUSES, DAILY_FREE, type CreditsState, remaining } from "@/lib/credits";

export function CreditsPanel({
  state,
  onClaim,
  completion,
}: {
  state: CreditsState;
  onClaim: (id: string) => void;
  completion: number;
}) {
  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    let succeeded = false;
    try {
      if (navigator.share) {
        await navigator.share({ title: "CVfy", url });
        succeeded = true;
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        succeeded = true;
      }
    } catch {
      // partage annulé ou refusé par l'utilisateur : pas de crédit
      succeeded = false;
    }
    if (succeeded) onClaim("share");
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          Vos crédits IA
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Le CV et la lettre sont <strong>toujours téléchargeables gratuitement</strong>. Seules les
          actions IA consomment un crédit : {DAILY_FREE} offerts chaque jour.
        </p>
        <div className="mt-5 flex items-end gap-3">
          <span className="font-display text-5xl font-semibold text-primary">{remaining(state)}</span>
          <span className="pb-2 text-sm text-muted-foreground">crédits disponibles</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <Gift className="h-4 w-4 text-brand-amber" />
          Gagner des crédits
        </h3>
        <ul className="mt-4 flex flex-col gap-3">
          {BONUSES.map((b) => {
            const done = state.earned.includes(b.id);
            const locked = b.id === "profile" && completion < 100;
            const claimableHere = b.id === "share" || b.id === "profile";

            return (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{b.label}</p>
                  <p className="text-xs text-muted-foreground">
                    +{b.amount} crédit{b.amount > 1 ? "s" : ""}
                    {locked ? ` · CV complété à ${completion} %` : ""}
                    {b.id === "feedback" && !done
                      ? " · Générez une analyse dans l'onglet Analyse IA pour la débloquer"
                      : ""}
                  </p>
                </div>
                {done ? (
                  <span className="flex items-center gap-1 text-sm text-primary">
                    <Check className="h-4 w-4" /> Obtenu
                  </span>
                ) : claimableHere ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={locked}
                    onClick={() => (b.id === "share" ? share() : onClaim(b.id))}
                  >
                    Réclamer
                  </Button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" /> À débloquer ailleurs
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6">
        <h3 className="text-base font-semibold">Bientôt : Coach Carrière</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Suivi de candidatures, relances automatiques, simulation d'entretien et alertes offres. Le
          téléchargement restera gratuit — l'abonnement portera uniquement sur l'accompagnement.
        </p>
      </div>
    </div>
  );
}