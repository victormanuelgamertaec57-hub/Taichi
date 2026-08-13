import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import type { ComparisonScreen } from '../../types/quiz';
import {
  getMaleBodyFatRangeNow,
  MALE_BODY_FAT_GOAL,
  getFemaleBodyFatRangeNow,
  FEMALE_BODY_FAT_GOAL,
  formatRange,
  energyLevelPercent,
  ENERGY_GOAL_PERCENT,
  calculateBalanceScorePercent,
  BALANCE_GOAL_PERCENT,
  percentToFilled,
  bodyFatFitnessPercent,
} from '../../utils/comparisonMetrics';

import ahoraFemenino from '../../assets/avatars/avatar-ahora-femenino.png';
import objetivoFemenino from '../../assets/avatars/avatar-objetivo-femenino.png';

import ahoraMasculino from '../../assets/avatars/avatar-ahora-masculino.png';
import objetivoMasculino from '../../assets/avatars/avatar-objetivo-masculino.png';

interface Props {
  screen: ComparisonScreen;
}

// Mismo gradiente que la barra de progreso superior (ProgressBar.tsx)
const LEVEL_GRADIENT_STOPS: [number, string][] = [
  [0, '#5A6FD6'],
  [0.5, '#7B8FE0'],
  [1, '#D4A24C'],
];

function lerpHexColor(from: string, to: string, t: number): string {
  const a = parseInt(from.slice(1), 16);
  const b = parseInt(to.slice(1), 16);
  const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
  const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

function levelGradientColorAt(t: number): string {
  for (let i = 0; i < LEVEL_GRADIENT_STOPS.length - 1; i++) {
    const [t0, c0] = LEVEL_GRADIENT_STOPS[i];
    const [t1, c1] = LEVEL_GRADIENT_STOPS[i + 1];
    if (t >= t0 && t <= t1) return lerpHexColor(c0, c1, (t - t0) / (t1 - t0));
  }
  return LEVEL_GRADIENT_STOPS[LEVEL_GRADIENT_STOPS.length - 1][1];
}

function LevelBar({ filled }: { filled: number }) {
  return (
    <div className="flex gap-1 w-full">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 flex-1 rounded-full"
          style={{ backgroundColor: i < filled ? levelGradientColorAt(i / 4) : '#E4DFD0' }}
        />
      ))}
    </div>
  );
}

/** Barra de nivel + el valor en texto debajo (usada por "Grasa corporal"). */
function LevelBarWithValue({ filled, value }: { filled: number; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <LevelBar filled={filled} />
      <span>{value}</span>
    </div>
  );
}

interface ComparisonRow {
  label: string;
  now: ReactNode;
  goal: ReactNode;
}

export default function ComparisonScreenComp({ screen }: Props) {
  const { userAge, userGender, answers, goNext, goBack, currentScreen } = useQuizStore();

  const isMale = userGender === 'male';

  const weightKg = answers.userWeightKg as number | undefined;
  const targetWeightKg = answers.userTargetWeightKg as number | undefined;
  const heightCm = answers.userHeightCm as number | undefined;
  const bmi = weightKg && heightCm ? weightKg / Math.pow(heightCm / 100, 2) : 26;

  const bodyFatNowRange = isMale ? getMaleBodyFatRangeNow(bmi) : getFemaleBodyFatRangeNow(userAge);
  const bodyFatGoalRange = isMale ? MALE_BODY_FAT_GOAL : FEMALE_BODY_FAT_GOAL;

  const energyPercent = energyLevelPercent(answers.energyLevel as string | undefined);
  const energyFilledNow = percentToFilled(energyPercent);
  const energyFilledGoal = percentToFilled(ENERGY_GOAL_PERCENT);

  const balancePercent = calculateBalanceScorePercent(answers);
  const balanceFilledNow = percentToFilled(balancePercent);
  const balanceFilledGoal = percentToFilled(BALANCE_GOAL_PERCENT);

  // Grasa corporal: además del rango en texto, se dibuja con la misma barra
  // multicolor que equilibrio/energía (menos grasa = más segmentos activos).
  const bodyFatFilledNow = percentToFilled(bodyFatFitnessPercent(bodyFatNowRange, isMale));
  const bodyFatFilledGoal = percentToFilled(bodyFatFitnessPercent(bodyFatGoalRange, isMale));

  const titleText = isMale
    ? 'Conoce a tu yo del futuro. Más fuerte, con más energía y sin dolor.'
    : 'Conoce a tu yo del futuro. Más liviana, feliz y relajada.';
  const titleParts = titleText.split(/(liviana|feliz|fuerte)/i);

  const rows: ComparisonRow[] = isMale
    ? [
        { label: 'Peso', now: `${weightKg ?? '—'} kg`, goal: `${targetWeightKg ?? '—'} kg` },
        {
          label: 'Grasa corporal',
          now: <LevelBarWithValue filled={bodyFatFilledNow} value={formatRange(bodyFatNowRange)} />,
          goal: <LevelBarWithValue filled={bodyFatFilledGoal} value={formatRange(bodyFatGoalRange)} />,
        },
        { label: 'Nivel de energía', now: <LevelBar filled={energyFilledNow} />, goal: <LevelBar filled={energyFilledGoal} /> },
      ]
    : [
        { label: 'Nivel de equilibrio', now: <LevelBar filled={balanceFilledNow} />, goal: <LevelBar filled={balanceFilledGoal} /> },
        {
          label: 'Grasa corporal',
          now: <LevelBarWithValue filled={bodyFatFilledNow} value={formatRange(bodyFatNowRange)} />,
          goal: <LevelBarWithValue filled={bodyFatFilledGoal} value={formatRange(bodyFatGoalRange)} />,
        },
        { label: 'Nivel de energía', now: <LevelBar filled={energyFilledNow} />, goal: <LevelBar filled={energyFilledGoal} /> },
      ];

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-4">
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn self-start">
          ← Volver
        </button>
      )}

      <h2 className="text-2xl font-bold text-main text-center leading-snug px-1">
        {titleParts.map((part, i) =>
          /^(liviana|feliz|fuerte)$/i.test(part) ? (
            <span key={i} style={{ color: 'var(--color-primary)' }}>{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl p-4"
        style={{ backgroundColor: 'var(--color-primary-bg)' }}
      >
        {/* Header labels */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="flex-1 text-center text-xs font-bold uppercase tracking-wide text-secondary py-2">
            Ahora
          </span>
          <span
            className="flex-1 text-center text-xs font-extrabold uppercase tracking-wide py-2 rounded-full bg-white shadow-xs"
            style={{ color: 'var(--color-primary)' }}
          >
            Objetivo
          </span>
        </div>

        {/* Photos side by side */}
        <div className="grid grid-cols-2 gap-2.5">
          {isMale ? (
            <img
              src={ahoraMasculino}
              width={160}
              height={213}
              loading="lazy"
              decoding="async"
              alt="Foto de referencia — estado actual"
              className="w-full aspect-[3/4] object-cover object-top rounded-2xl"
            />
          ) : (
            <img
              src={ahoraFemenino}
              width={160}
              height={213}
              loading="lazy"
              decoding="async"
              alt="Foto de referencia — estado actual"
              className="w-full aspect-[3/4] object-cover object-top rounded-2xl"
            />
          )}
          {isMale ? (
            <img
              src={objetivoMasculino}
              width={160}
              height={213}
              loading="lazy"
              decoding="async"
              alt="Foto de referencia — objetivo"
              className="w-full aspect-[3/4] object-cover object-top rounded-2xl"
            />
          ) : (
            <img
              src={objetivoFemenino}
              width={160}
              height={213}
              loading="lazy"
              decoding="async"
              alt="Foto de referencia — objetivo"
              className="w-full aspect-[3/4] object-cover object-top rounded-2xl"
            />
          )}
        </div>

        {/* 3 metric rows, Ahora | Objetivo columns */}
        <div className="flex flex-col gap-3 mt-4">
          {rows.map((row) => (
            <div key={row.label}>
              <p className="text-xs font-semibold text-main text-center mb-1.5">{row.label}</p>
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex justify-center text-sm font-bold text-secondary">{row.now}</div>
                <div className="flex justify-center text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                  {row.goal}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-secondary/70 text-center mt-4">
          Los resultados pueden variar según la persona y la constancia en la práctica.
        </p>
      </motion.div>

      <p className="text-sm text-secondary text-center leading-relaxed px-2">
        Esta es tu meta: <strong className="text-main font-bold">nosotros te guiamos, hábito tras hábito</strong>.
      </p>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        onClick={goNext}
        className="cta-btn"
      >
        {screen.ctaLabel}
      </motion.button>
    </div>
  );
}
