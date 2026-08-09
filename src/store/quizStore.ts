import { create } from 'zustand';
import { resolveGenderedText, type Gender } from '../utils/gender';
import type { PricingPlanId } from '../types/quiz';
import { screens } from '../data/screens';

// ─── Gender-aware screen navigation helper ─────────────────────────────────────
// Returns true if a screen should be shown to the given gender.
function screenMatchesGender(screenId: number, gender: Gender): boolean {
  const s = screens.find((x) => x.id === screenId);
  if (!s) return true;
  if (!('genderOnly' in s) || !s.genderOnly) return true;
  return s.genderOnly === gender;
}

// Find the next/prev visible screen for the current gender
function nextVisibleScreen(from: number, gender: Gender, dir: 'forward' | 'backward'): number {
  const ids = screens.map((s) => s.id).sort((a, b) => a - b);
  const idx = ids.indexOf(from);
  if (dir === 'forward') {
    for (let i = idx + 1; i < ids.length; i++) {
      if (screenMatchesGender(ids[i], gender)) return ids[i];
    }
    return ids[ids.length - 1]; // clamp to last
  } else {
    for (let i = idx - 1; i >= 0; i--) {
      if (screenMatchesGender(ids[i], gender)) return ids[i];
    }
    return ids[0]; // clamp to first
  }
}

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
  getStageProgress: () => {
    currentStep: number;
    totalSteps: number;
    stageName: string;
    stageId: number;
  };

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

export const useQuizStore = create<QuizState>((set, get) => ({
  currentScreen: 1,
  answers: {},
  userName: '',
  userEmail: '',
  userAge: '',
  // Por defecto 'female' pero se actualizará dinámicamente en el paso 2 del quiz
  userGender: 'female',
  selectedPlan: null,
  direction: 'forward',
  totalScreens: TOTAL_SCREENS,

  getStageProgress: () => {
    const currentId = get().currentScreen;
    const screen = screens.find((s) => s.id === currentId);
    if (!screen) return { currentStep: 0, totalSteps: 0, stageName: '', stageId: 0 };
    const stageId = screen.stageId || 1;
    const stageName = screen.stageName || '';
    const stageScreens = screens.filter((s) => s.stageId === stageId);
    const currentStep = stageScreens.findIndex((s) => s.id === currentId) + 1;
    return {
      currentStep,
      totalSteps: stageScreens.length,
      stageName,
      stageId,
    };
  },

  goNext: () =>
    set((state) => {
      const next = nextVisibleScreen(state.currentScreen, state.userGender, 'forward');
      return { currentScreen: next, direction: 'forward' };
    }),

  goBack: () =>
    set((state) => {
      const prev = nextVisibleScreen(state.currentScreen, state.userGender, 'backward');
      return { currentScreen: prev, direction: 'backward' };
    }),

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
  const defaultName = userGender === 'male' ? 'amigo' : 'amiga';
  const withTokens = text
    .replace(/\{\{userName\}\}/g, userName || defaultName)
    .replace(/\{\{userAge\}\}/g, userAge || '60-65')
    .replace(/\{\{genderNoun\}\}/g, genderNoun);
  return resolveGenderedText(withTokens, userGender);
}

if (typeof window !== 'undefined') {
  (window as any).useQuizStore = useQuizStore;
}
