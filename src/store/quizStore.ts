import { create } from 'zustand';
import { resolveGenderedText, type Gender } from '../utils/gender';
import type { PricingPlanId } from '../types/quiz';
import { screens } from '../data/screens';

// ─── State & Actions ──────────────────────────────────────────────────────────

interface QuizState {
  currentScreen: number;          // 1-indexed, matches screen id
  answers: Record<string, unknown>; // all answers keyed by answerKey
  userName: string;
  userEmail: string;
  userAge: string;
  userGender: Gender;
  selectedPlan: PricingPlanId | null;
  direction: 'forward' | 'backward';

  // Derived helpers
  totalScreens: number;

  // Actions
  goNext: () => void;
  goBack: () => void;
  goTo: (screen: number) => void;
  setAnswer: (key: string, value: unknown) => void;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setUserAge: (age: string) => void;
  setUserGender: (gender: Gender) => void;
  setSelectedPlan: (plan: PricingPlanId) => void;
  reset: () => void;
}

// Derived from screens.ts so the flow's actual length always drives
// navigation clamping and the "Paso X de N" progress display.
const TOTAL_SCREENS = screens.length;

export const useQuizStore = create<QuizState>((set) => ({
  currentScreen: 1,
  answers: {},
  userName: '',
  userEmail: '',
  userAge: '',
  // Funnel 100% dirigido a mujeres — no se pregunta el sexo.
  userGender: 'female',
  selectedPlan: null,
  direction: 'forward',
  totalScreens: TOTAL_SCREENS,

  goNext: () =>
    set((state) => ({
      currentScreen: Math.min(state.currentScreen + 1, TOTAL_SCREENS),
      direction: 'forward',
    })),

  goBack: () =>
    set((state) => ({
      currentScreen: Math.max(state.currentScreen - 1, 1),
      direction: 'backward',
    })),

  goTo: (screen: number) =>
    set((state) => ({
      currentScreen: screen,
      direction: screen > state.currentScreen ? 'forward' : 'backward',
    })),

  setAnswer: (key, value) =>
    set((state) => ({
      answers: { ...state.answers, [key]: value },
    })),

  setUserName: (name) => set({ userName: name }),

  setUserEmail: (email) => set({ userEmail: email }),

  setUserAge: (age) => set({ userAge: age }),

  setUserGender: (gender) => set({ userGender: gender }),

  setSelectedPlan: (plan) => set({ selectedPlan: plan }),

  reset: () =>
    set({
      currentScreen: 1,
      answers: {},
      userName: '',
      userEmail: '',
      userAge: '',
      userGender: 'female',
      selectedPlan: null,
      direction: 'forward',
    }),
}));

// ─── Interpolation helper ─────────────────────────────────────────────────────

/**
 * Replaces {{userName}} / {{userAge}} tokens and resolves "word/a" gendered
 * text (e.g. "sentado/a" → "sentada") based on the user's selected gender.
 */
export function interpolate(text: string, userName: string, userAge: string, userGender: Gender = 'female'): string {
  const genderNoun = userGender === 'male' ? 'hombres' : 'mujeres';
  const withTokens = text
    .replace(/\{\{userName\}\}/g, userName || 'amiga')
    .replace(/\{\{userAge\}\}/g, userAge || '60-65')
    .replace(/\{\{genderNoun\}\}/g, genderNoun);
  return resolveGenderedText(withTokens, userGender);
}
