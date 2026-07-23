import { motion } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import type { ProjectionScreen } from '../../types/quiz';
import { metaIdealLabel } from '../../utils/copy';
import { formatDateEs, defaultFechaObjetivo } from '../../utils/date';

interface Props {
  screen: ProjectionScreen;
}

const SAGE = '#5B8A72';
const SAGE_SOFT = '#7C9070';
const SAGE_BG = '#E8F0E9';

// Ascending line from "AHORA" (low) to the target date (high), with a soft
// shaded band around it — same visual language as StatScreen's SVG visuals,
// adapted from the "Simple" app projection-chart pattern.
function ProjectionChart({ targetLabel }: { targetLabel: string }) {
  const linePath = 'M20 150 C 90 140, 150 100, 220 55 C 250 35, 270 25, 300 15';
  const bandTop = 'M20 130 C 90 118, 150 78, 220 35 C 250 18, 270 8, 300 -2';
  const bandBottom = 'M300 32 C 270 42, 250 52, 220 75 C 150 122, 90 162, 20 172 Z';

  return (
    <svg viewBox="0 0 320 190" fill="none" className="w-full max-w-[340px]" aria-hidden="true">
      {/* soft shaded band around the line */}
      <path d={`${bandTop} L300 32 ${bandBottom}`} fill={SAGE_BG} opacity="0.7" />
      {/* baseline */}
      <path d="M20 172 L300 172" stroke="#E4DFD0" strokeWidth="2" />
      {/* ascending line */}
      <path d={linePath} stroke={SAGE} strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* start point */}
      <circle cx="20" cy="150" r="6" fill={SAGE_SOFT} />
      <text x="20" y="188" fontSize="12" fontWeight="800" fill="#6B7A70" fontFamily="Nunito, sans-serif">
        AHORA
      </text>
      {/* end point */}
      <circle cx="300" cy="15" r="7" fill={SAGE} />
      <text x="223" y="188" fontSize="12" fontWeight="800" fill={SAGE} fontFamily="Nunito, sans-serif">
        {targetLabel.toUpperCase()}
      </text>
    </svg>
  );
}

export default function ProjectionScreenComp({ screen }: Props) {
  const { userName, userAge, userGender, answers, goNext, goBack, currentScreen } = useQuizStore();

  const metaIdeal = metaIdealLabel(answers.metaIdeal as string | undefined);
  const fechaObjetivo = (answers.fechaObjetivo as string | undefined) ?? defaultFechaObjetivo();
  const fechaFormatted = formatDateEs(fechaObjetivo);

  const headlineWithTokens = screen.headline
    .replace(/\{\{metaIdeal\}\}/g, metaIdeal)
    .replace(/\{\{fechaObjetivo\}\}/g, fechaFormatted);
  const headline = interpolate(headlineWithTokens, userName, userAge, userGender);
  const subtext = interpolate(screen.subtext, userName, userAge, userGender);

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-6">
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn">
          ← Atrás
        </button>
      )}

      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-main leading-snug">{headline}</h2>
        <p className="text-base text-secondary">{subtext}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex justify-center"
      >
        <ProjectionChart targetLabel={fechaFormatted} />
      </motion.div>

      <div className="flex flex-col gap-2.5">
        {screen.bullets.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: SAGE_BG, color: SAGE }}
            >
              <i className="ti ti-check text-sm"></i>
            </span>
            <span className="text-[15px] text-main leading-snug">
              {interpolate(item, userName, userAge, userGender)}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        onClick={goNext}
        className="cta-btn flex items-center justify-center gap-2"
      >
        <span>{screen.ctaLabel}</span>
        <i className="ti ti-arrow-right"></i>
      </motion.button>
    </div>
  );
}
