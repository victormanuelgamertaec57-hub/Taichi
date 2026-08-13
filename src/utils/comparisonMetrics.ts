// ─── "Ahora / Objetivo" comparison card metrics ────────────────────────────
// Estimaciones simples y honestas (no clínicas) usadas solo para dar contexto
// visual a la tarjeta de comparación del paywall.

export type BmiCategory = 'bajo' | 'normal' | 'sobrepeso' | 'obesidad';

// Mismos cortes que BmiFeedbackScreen.getBmiRange (18.5 / 25 / 30)
export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'bajo';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'sobrepeso';
  return 'obesidad';
}

const MALE_BODY_FAT_RANGES: Record<BmiCategory, [number, number]> = {
  bajo: [10, 14],
  normal: [15, 20],
  sobrepeso: [21, 27],
  obesidad: [28, 35],
};

export function getMaleBodyFatRangeNow(bmi: number): [number, number] {
  return MALE_BODY_FAT_RANGES[getBmiCategory(bmi)];
}

export const MALE_BODY_FAT_GOAL: [number, number] = [12, 18];

// El path femenino no recolecta altura/peso, así que se estima por rango de
// edad (ya recolectado en ambos paths) en vez de por IMC.
const FEMALE_BODY_FAT_RANGES_BY_AGE: Record<string, [number, number]> = {
  '30-39': [27, 33],
  '40-49': [28, 34],
  '50-59': [29, 35],
  '60-69': [30, 36],
  '70+': [31, 37],
};

export function getFemaleBodyFatRangeNow(userAge: string | undefined): [number, number] {
  return FEMALE_BODY_FAT_RANGES_BY_AGE[userAge ?? ''] ?? [29, 35];
}

export const FEMALE_BODY_FAT_GOAL: [number, number] = [22, 27];

export function formatRange([from, to]: [number, number]): string {
  return `${from}-${to}%`;
}

// Grasa corporal -> percent 0-100 "en forma" (menos grasa = percent más alto),
// para poder dibujarla con la misma <LevelBar> que energía y equilibrio.
// Límites por género: fuera de ellos el valor se acota a 0/100.
const BODY_FAT_BOUNDS: Record<'male' | 'female', [number, number]> = {
  male: [10, 35],   // 10% -> 100, 35% -> 0
  female: [18, 40], // 18% -> 100, 40% -> 0
};

export function bodyFatFitnessPercent([from, to]: [number, number], isMale: boolean): number {
  const [best, worst] = BODY_FAT_BOUNDS[isMale ? 'male' : 'female'];
  const midpoint = (from + to) / 2;
  const percent = ((worst - midpoint) / (worst - best)) * 100;
  return Math.min(100, Math.max(0, Math.round(percent)));
}

// ─── Nivel de energía (común a ambos paths, pregunta 'energyLevel') ────────

const ENERGY_PERCENT: Record<string, number> = {
  low: 15,
  medium_low: 35,
  medium: 60,
  high: 85,
};

export function energyLevelPercent(energyLevel: string | undefined): number {
  return ENERGY_PERCENT[energyLevel ?? ''] ?? 40;
}

export const ENERGY_GOAL_PERCENT = 95;

// ─── Nivel de equilibrio (path femenino, derivado de 3 preguntas) ─────────

const BALANCE_INITIAL_FEAR_SCORE: Record<string, number> = {
  yes_lot: 20,
  yes_some: 50,
  no_prevent: 75,
};
const BALANCE_FEAR_SCORE: Record<string, number> = {
  often: 15,
  sometimes: 45,
  rarely: 65,
  no: 80,
};
const WALKING_CONFIDENCE_SCORE: Record<string, number> = {
  very_low: 20,
  moderate: 55,
  high: 85,
};

export function calculateBalanceScorePercent(answers: Record<string, unknown>): number {
  const scores: number[] = [];
  const initialFear = answers.balanceInitialFear as string | undefined;
  const fear = answers.balanceFear as string | undefined;
  const confidence = answers.walkingConfidence as string | undefined;

  if (initialFear && BALANCE_INITIAL_FEAR_SCORE[initialFear] !== undefined) {
    scores.push(BALANCE_INITIAL_FEAR_SCORE[initialFear]);
  }
  if (fear && BALANCE_FEAR_SCORE[fear] !== undefined) {
    scores.push(BALANCE_FEAR_SCORE[fear]);
  }
  if (confidence && WALKING_CONFIDENCE_SCORE[confidence] !== undefined) {
    scores.push(WALKING_CONFIDENCE_SCORE[confidence]);
  }

  if (scores.length === 0) return 45;
  return Math.round(scores.reduce((sum, v) => sum + v, 0) / scores.length);
}

export const BALANCE_GOAL_PERCENT = 92;

// ─── Shared helper: percent (0-100) -> filled segments (1-5) ──────────────

export function percentToFilled(percent: number, segments = 5): number {
  return Math.min(segments, Math.max(1, Math.round((percent / 100) * segments)));
}
