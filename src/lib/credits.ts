/**
 * Modèle économique : tout ce qui est CV et lettre reste téléchargeable
 * gratuitement. Ce sont les actions IA (analyse, réécriture, lettre) qui
 * consomment des crédits, rechargés chaque jour et gagnés en partageant.
 */

const KEY = "cvfy.credits.v1";
export const DAILY_FREE = 3;

export type CreditsState = {
  day: string;
  usedToday: number;
  bonus: number;
  earned: string[]; // identifiants des bonus déjà réclamés
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

const fresh = (): CreditsState => ({ day: today(), usedToday: 0, bonus: 0, earned: [] });

export function readCredits(): CreditsState {
  if (typeof window === "undefined") return fresh();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return fresh();
    const parsed = JSON.parse(raw) as CreditsState;
    if (parsed.day !== today()) return { ...parsed, day: today(), usedToday: 0 };
    return parsed;
  } catch {
    return fresh();
  }
}

export function writeCredits(state: CreditsState): CreditsState {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  }
  return state;
}

export function remaining(state: CreditsState) {
  return Math.max(0, DAILY_FREE - state.usedToday) + state.bonus;
}

export function spend(state: CreditsState): CreditsState {
  if (state.usedToday < DAILY_FREE) return { ...state, usedToday: state.usedToday + 1 };
  return { ...state, bonus: Math.max(0, state.bonus - 1) };
}

export const BONUSES: { id: string; label: string; amount: number }[] = [
  { id: "share", label: "Partager CVfy à un ami", amount: 2 },
  { id: "profile", label: "Compléter son CV à 100 %", amount: 2 },
  { id: "feedback", label: "Donner son avis sur l'analyse", amount: 1 },
];

export function claim(state: CreditsState, id: string): CreditsState {
  if (state.earned.includes(id)) return state;
  const bonus = BONUSES.find((b) => b.id === id);
  if (!bonus) return state;
  return { ...state, bonus: state.bonus + bonus.amount, earned: [...state.earned, id] };
}
