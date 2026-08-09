import { useEffect, useState, type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import type { StatScreen, StatVisualKind } from '../../types/quiz';
import jointMotionIcon from '../../assets/icons/icono-articulaciones-movimiento.png';

import brollExtendidos400 from '../../assets/avatars/optimized/avatar-broll-brazos-extendidos-400w.webp';
import brollExtendidos600 from '../../assets/avatars/optimized/avatar-broll-brazos-extendidos-600w.webp';
import brollExtendidos800 from '../../assets/avatars/optimized/avatar-broll-brazos-extendidos-800w.webp';

import movimiento1_400 from '../../assets/avatars/optimized/avatar-masculino-movimiento-1-400w.webp';
import movimiento1_600 from '../../assets/avatars/optimized/avatar-masculino-movimiento-1-600w.webp';
import movimiento1_800 from '../../assets/avatars/optimized/avatar-masculino-movimiento-1-800w.webp';

import antesEstres400 from '../../assets/avatars/optimized/avatar-antes-estres-400w.webp';
import antesEstres600 from '../../assets/avatars/optimized/avatar-antes-estres-600w.webp';
import antesEstres800 from '../../assets/avatars/optimized/avatar-antes-estres-800w.webp';

import articulaciones400 from '../../assets/avatars/optimized/avatar-masculino-articulaciones-400w.webp';
import articulaciones600 from '../../assets/avatars/optimized/avatar-masculino-articulaciones-600w.webp';
import articulaciones800 from '../../assets/avatars/optimized/avatar-masculino-articulaciones-800w.webp';

interface Props {
  screen: StatScreen;
}

// Palette: sage/cream come from the design tokens; terracotta only on the
// "gym te deja agotada/o" screen.
const SAGE = '#5C7AE0';
const TERRACOTTA = '#D97A4E';
const MUTED = '#B9C4BB';

// ─── SVG visuals (one per StatVisualKind) ─────────────────────────────────────

interface FallRiskDatum {
  value: number; // 0-100, relative fall-risk index
  color: string;
  lines: [string] | [string, string];
}

const FALL_RISK_BARS: FallRiskDatum[] = [
  { value: 100, color: MUTED, lines: ['Estiramiento', 'tradicional'] },
  { value: 42, color: SAGE, lines: ['Tai Chi', 'en silla'] },
];

const CHART_BASELINE_Y = 132;
const CHART_MAX_BAR_HEIGHT = 92;
const CHART_VIEW_WIDTH = 240;
const BAR_WIDTH = 44;
const BAR_GAP = 36;

// Counts up to `target` once mounted, easing out
function useCountUp(target: number, delaySeconds: number, durationMs = 700): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    let cancelled = false;
    const startAt = performance.now() + delaySeconds * 1000;

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startAt;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [target, delaySeconds, durationMs]);

  return value;
}

function FallRiskBarColumn({ datum, x, index }: { datum: FallRiskDatum; x: number; index: number }) {
  const delay = index * 0.15;
  const barHeight = (datum.value / 100) * CHART_MAX_BAR_HEIGHT;
  const barY = CHART_BASELINE_Y - barHeight;
  const count = useCountUp(datum.value, delay);
  const isBest = datum.color === SAGE;
  const centerX = x + BAR_WIDTH / 2;

  return (
    <g>
      {isBest && (
        <motion.rect
          x={x - 5}
          y={barY - 5}
          width={BAR_WIDTH + 10}
          height={barHeight + 5}
          rx="10"
          fill="none"
          stroke={SAGE}
          strokeWidth="2"
          strokeDasharray="4 3"
          style={{ originY: `${CHART_BASELINE_Y}px` }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.6 }}
          transition={{ delay: delay + 0.1, duration: 0.45 }}
        />
      )}

      <motion.rect
        x={x}
        y={barY}
        width={BAR_WIDTH}
        height={barHeight}
        rx="8"
        fill={datum.color}
        style={{ originY: `${CHART_BASELINE_Y}px` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      />

      <motion.text
        x={centerX}
        y={barY - 10}
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        fill={datum.color}
        fontFamily="Nunito, sans-serif"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.35, duration: 0.25 }}
      >
        {count}%
      </motion.text>

      {datum.lines.map((line, i) => (
        <text
          key={line}
          x={centerX}
          y={147 + i * 12}
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill={isBest ? SAGE : '#6B7A70'}
          fontFamily="Nunito, sans-serif"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function FallRiskBars() {
  const totalWidth = FALL_RISK_BARS.length * BAR_WIDTH + (FALL_RISK_BARS.length - 1) * BAR_GAP;
  const startX = (CHART_VIEW_WIDTH - totalWidth) / 2;

  return (
    <svg viewBox={`0 0 ${CHART_VIEW_WIDTH} 170`} fill="none" className="w-full max-w-[260px]" aria-hidden="true">
      <path
        d={`M20 ${CHART_BASELINE_Y} L${CHART_VIEW_WIDTH - 20} ${CHART_BASELINE_Y}`}
        stroke={MUTED}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {FALL_RISK_BARS.map((datum, i) => (
        <FallRiskBarColumn key={datum.lines[0]} datum={datum} index={i} x={startX + i * (BAR_WIDTH + BAR_GAP)} />
      ))}
    </svg>
  );
}

interface AvatarPhotoProps {
  src400: string;
  src600: string;
  src800: string;
  alt: string;
}

function AvatarPhoto({ src400, src600, src800, alt }: AvatarPhotoProps) {
  return (
    <img
      src={src400}
      srcSet={`${src400} 400w, ${src600} 600w, ${src800} 800w`}
      sizes="200px"
      width={200}
      height={268}
      loading="lazy"
      decoding="async"
      alt={alt}
      className="w-[200px] h-[268px] rounded-2xl object-cover border border-border shadow-sm"
    />
  );
}

function FatigueClock({ isMale }: { isMale: boolean }) {
  return (
    <AvatarPhoto
      src400={isMale ? articulaciones400 : antesEstres400}
      src600={isMale ? articulaciones600 : antesEstres600}
      src800={isMale ? articulaciones800 : antesEstres800}
      alt={isMale ? 'Hombre maduro con tensión y rigidez muscular' : 'Mujer con expresión de cansancio y tensión, sentada en su silla'}
    />
  );
}

function ImpactCompare({ isMale }: { isMale: boolean }) {
  return (
    <AvatarPhoto
      src400={isMale ? movimiento1_400 : brollExtendidos400}
      src600={isMale ? movimiento1_600 : brollExtendidos600}
      src800={isMale ? movimiento1_800 : brollExtendidos800}
      alt={isMale ? 'Hombre realizando ejercicio de Tai Chi en silla sin impacto' : 'Mujer sentada en su silla con los brazos extendidos y los pies apoyados en el suelo'}
    />
  );
}

function JointMotion() {
  return (
    <img
      src={jointMotionIcon}
      alt="Ícono de una articulación con flechas circulares, representando movimiento suave sin carga"
      className="w-full max-w-[220px]"
    />
  );
}

function FallRisk1() {
  return (
    <svg viewBox="0 0 320 180" fill="none" className="w-full max-w-[280px]" aria-hidden="true">
      <line x1="40" y1="20" x2="300" y2="20" stroke="#E4DFD0" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="40" y1="80" x2="300" y2="80" stroke="#E4DFD0" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="40" y1="140" x2="300" y2="140" stroke="#E4DFD0" strokeWidth="1" />
      <line x1="40" y1="20" x2="40" y2="140" stroke="#B9C4BB" strokeWidth="2" />
      
      {/* Curve: Without exercise (Red/Muted ascending) */}
      <motion.path
        d="M 40 120 Q 150 110 300 30"
        stroke="#D97A4E"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <text x="130" y="45" fontSize="10" fontWeight="bold" fill="#D97A4E" fontFamily="Nunito, sans-serif">Sin entrenamiento (3x riesgo)</text>

      {/* Curve: With FirmMe (Green/Sage stable) */}
      <motion.path
        d="M 40 120 Q 150 125 300 115"
        stroke="#5C7AE0"
        strokeWidth="4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
      />
      <text x="140" y="105" fontSize="10" fontWeight="bold" fill="#5C7AE0" fontFamily="Nunito, sans-serif">Con FirmMe</text>

      {/* Eje X labels */}
      <text x="40" y="158" fontSize="9" fontWeight="bold" fill="#6B7A70" textAnchor="middle" fontFamily="Nunito, sans-serif">40 años</text>
      <text x="170" y="158" fontSize="9" fontWeight="bold" fill="#6B7A70" textAnchor="middle" fontFamily="Nunito, sans-serif">55 años</text>
      <text x="290" y="158" fontSize="9" fontWeight="bold" fill="#6B7A70" textAnchor="middle" fontFamily="Nunito, sans-serif">70+ años</text>
    </svg>
  );
}

function FallRisk2() {
  return (
    <svg viewBox="0 0 320 180" fill="none" className="w-full max-w-[280px]" aria-hidden="true">
      <line x1="40" y1="20" x2="300" y2="20" stroke="#E4DFD0" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="40" y1="80" x2="300" y2="80" stroke="#E4DFD0" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="40" y1="140" x2="300" y2="140" stroke="#E4DFD0" strokeWidth="1" />
      <line x1="40" y1="20" x2="40" y2="140" stroke="#B9C4BB" strokeWidth="2" />

      {/* Curve showing Stability index going up */}
      <motion.path
        d="M 40 130 C 100 120, 120 40, 300 30"
        stroke="#5C7AE0"
        strokeWidth="4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
      <text x="120" y="45" fontSize="11" fontWeight="extrabold" fill="#5C7AE0" fontFamily="Nunito, sans-serif">Estabilidad (+85%)</text>
      
      <text x="40" y="158" fontSize="9" fontWeight="bold" fill="#6B7A70" textAnchor="middle" fontFamily="Nunito, sans-serif">Día 1</text>
      <text x="170" y="158" fontSize="9" fontWeight="bold" fill="#6B7A70" textAnchor="middle" fontFamily="Nunito, sans-serif">Semana 2</text>
      <text x="290" y="158" fontSize="9" fontWeight="bold" fill="#6B7A70" textAnchor="middle" fontFamily="Nunito, sans-serif">Semana 4</text>
    </svg>
  );
}

function FallRisk3() {
  return (
    <svg viewBox="0 0 320 180" fill="none" className="w-full max-w-[280px]" aria-hidden="true">
      <line x1="20" y1="140" x2="300" y2="140" stroke="#B9C4BB" strokeWidth="2" />
      
      {/* Bar 1: Sedentarismo */}
      <motion.rect
        x="50"
        y="110"
        width="40"
        height="30"
        rx="6"
        fill="#B9C4BB"
        style={{ originY: 1 }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6 }}
      />
      <text x="70" y="100" fontSize="10" fontWeight="bold" fill="#6B7A70" textAnchor="middle" fontFamily="Nunito, sans-serif">20%</text>
      <text x="70" y="158" fontSize="9" fontWeight="bold" fill="#6B7A70" textAnchor="middle" fontFamily="Nunito, sans-serif">Inactivo</text>

      {/* Bar 2: Academia/Caminhada */}
      <motion.rect
        x="140"
        y="80"
        width="40"
        height="60"
        rx="6"
        fill="#B9C4BB"
        style={{ originY: 1 }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      />
      <text x="160" y="70" fontSize="10" fontWeight="bold" fill="#6B7A70" textAnchor="middle" fontFamily="Nunito, sans-serif">45%</text>
      <text x="160" y="158" fontSize="9" fontWeight="bold" fill="#6B7A70" textAnchor="middle" fontFamily="Nunito, sans-serif">Gimnasio</text>

      {/* Bar 3: FirmMe */}
      <motion.rect
        x="230"
        y="20"
        width="40"
        height="120"
        rx="6"
        fill="#5C7AE0"
        style={{ originY: 1 }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      <text x="250" y="12" fontSize="11" fontWeight="extrabold" fill="#5C7AE0" textAnchor="middle" fontFamily="Nunito, sans-serif">90%</text>
      <text x="250" y="158" fontSize="9" fontWeight="extrabold" fill="#5C7AE0" textAnchor="middle" fontFamily="Nunito, sans-serif">FirmMe</text>
    </svg>
  );
}

const VISUALS: Record<StatVisualKind, (props: { isMale: boolean }) => ReactElement> = {
  'fall-risk-bars': () => <FallRiskBars />,
  'fatigue-clock': ({ isMale }) => <FatigueClock isMale={isMale} />,
  'impact-compare': ({ isMale }) => <ImpactCompare isMale={isMale} />,
  'joint-motion': () => <JointMotion />,
  'fall-risk-1': () => <FallRisk1 />,
  'fall-risk-2': () => <FallRisk2 />,
  'fall-risk-3': () => <FallRisk3 />,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StatScreenComp({ screen }: Props) {
  const { userName, userAge, userGender, goNext, goBack, currentScreen } = useQuizStore();
  const isMale = userGender === 'male';

  const headline = interpolate(screen.headline, userName, userAge, userGender);
  const subtext = interpolate(screen.subtext, userName, userAge, userGender);
  const note = screen.note ? interpolate(screen.note, userName, userAge, userGender) : undefined;
  const isTerracotta = screen.accent === 'terracotta';
  const statColor = isTerracotta ? TERRACOTTA : SAGE;
  const renderVisual = VISUALS[screen.visual];

  return (
    <div
      className="px-6 pt-6 pb-10 flex flex-col gap-6 min-h-[560px]"
      style={{ fontFamily: "'Nunito', 'Inter', sans-serif" }}
    >
      {/* Back button */}
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn self-start">
          ← Volver
        </button>
      )}

      {/* One message per screen: stat + headline + subtext, generous whitespace */}
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-2 max-w-sm"
        >
          {screen.stat && (
            <p
              className="font-extrabold leading-none tracking-tight"
              style={{ color: statColor, fontSize: screen.stat.length > 4 ? '2.6rem' : '3.4rem' }}
            >
              {screen.stat}
            </p>
          )}
          <h2 className="text-[22px] font-bold text-main leading-snug">{headline}</h2>
          <p className="text-[15px] text-secondary leading-relaxed">{subtext}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ 
            type: 'spring',
            stiffness: 350,
            damping: 25
          }}
          style={{ willChange: 'transform' }}
          className="flex justify-center w-full cursor-pointer"
        >
          {renderVisual({ isMale })}
        </motion.div>

        {note && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="text-[13px] text-secondary/80 leading-relaxed max-w-sm"
          >
            {note}
          </motion.p>
        )}
      </div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        onClick={goNext}
        className="cta-btn flex items-center justify-center gap-2"
      >
        <span>{screen.ctaLabel.replace(' →', '')}</span>
        <i className="ti ti-arrow-right"></i>
      </motion.button>
    </div>
  );
}
