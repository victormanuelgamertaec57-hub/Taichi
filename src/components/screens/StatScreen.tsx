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

interface Props {
  screen: StatScreen;
}

const SAGE = '#5C7AE0';
const TERRACOTTA = '#D97A4E';
const MUTED = '#B9C4BB';

// ─── SVG visuals & Micro-Animations ──────────────────────────────────────────

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

// Counts up to `target` once mounted, easing out via requestAnimationFrame (no setInterval)
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

function SVGAnimatedCheck({ delay = 0 }: { delay?: number }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="#5C7AE0" strokeWidth="2" fill="#EEF1FB" />
      <motion.path
        d="M7 12.5L10 15.5L17 8.5"
        stroke="#5C7AE0"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.15, duration: 0.4, ease: 'easeOut' }}
      />
    </svg>
  );
}

function StatCountUp({ target, prefix = '', suffix = '', delay = 0 }: { target: number; prefix?: string; suffix?: string; delay?: number }) {
  const count = useCountUp(target, delay, 750);
  return (
    <span className="font-extrabold tabular-nums tracking-tight">
      {prefix}{count}{suffix}
    </span>
  );
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

// ─── 2-Column Touchable Comparator (Gimnasio vs Tai Chi) + Animated Stats ─────
function FatigueClock() {
  const [selectedCol, setSelectedCol] = useState<'chair' | 'gym'>('chair');

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      {/* 2-Column Touchable Comparator */}
      <div className="grid grid-cols-2 gap-3 text-left">
        {/* Column 1: Gimnasio Tradicional */}
        <div
          onClick={() => setSelectedCol('gym')}
          className={`relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            selectedCol === 'gym'
              ? 'border-[#D97A4E] bg-[#FDF4F0] shadow-sm scale-[1.02]'
              : 'border-border bg-white hover:border-border/80'
          }`}
          style={{ willChange: 'transform' }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-6 h-6 rounded-full bg-[#D97A4E]/10 flex items-center justify-center text-[#D97A4E] text-xs">
              <i className="ti ti-barbell"></i>
            </div>
            <span className="text-xs font-bold text-main leading-tight">Gimnasio tradicional</span>
          </div>
          
          <ul className="space-y-1.5 text-[11px] text-secondary leading-snug">
            <li className="flex items-center gap-1.5">
              <i className="ti ti-x text-red-500 text-xs flex-shrink-0"></i>
              <span>Alto impacto</span>
            </li>
            <li className="flex items-center gap-1.5">
              <i className="ti ti-x text-red-500 text-xs flex-shrink-0"></i>
              <span>Requiere equipo</span>
            </li>
            <li className="flex items-center gap-1.5">
              <i className="ti ti-x text-red-500 text-xs flex-shrink-0"></i>
              <span>Fatiga articular</span>
            </li>
          </ul>
        </div>

        {/* Column 2: Tai Chi en silla (Recomendado) */}
        <div
          onClick={() => setSelectedCol('chair')}
          className={`relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            selectedCol === 'chair'
              ? 'border-primary bg-[#EEF1FB] shadow-md scale-[1.02] ring-2 ring-primary/20'
              : 'border-border bg-white hover:border-border/80'
          }`}
          style={{ willChange: 'transform' }}
        >
          <div className="absolute -top-2.5 right-2 bg-primary text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs tracking-wider">
            Recomendado
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
              <i className="ti ti-chair"></i>
            </div>
            <span className="text-xs font-bold text-primary leading-tight">Tai Chi en silla</span>
          </div>

          <ul className="space-y-1.5 text-[11px] text-main font-medium leading-snug">
            <li className="flex items-center gap-1.5">
              <i className="ti ti-check text-primary font-bold text-xs flex-shrink-0"></i>
              <span className="font-semibold text-primary">0% impacto</span>
            </li>
            <li className="flex items-center gap-1.5">
              <i className="ti ti-check text-primary font-bold text-xs flex-shrink-0"></i>
              <span>Solo una silla</span>
            </li>
            <li className="flex items-center gap-1.5">
              <i className="ti ti-check text-primary font-bold text-xs flex-shrink-0"></i>
              <span>Sin dolor</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3 Animated Evidence Metrics with SVG checkmarks */}
      <div className="bg-white rounded-2xl p-4 border border-border shadow-xs flex flex-col gap-3">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary text-center">
          Evidencia Clínica Respaldada
        </span>

        <div className="flex flex-col gap-2.5">
          {/* Metric 1: 0% impacto articular */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex items-center justify-between p-2.5 rounded-xl bg-warm/60 border border-border/50"
          >
            <div className="flex items-center gap-2.5 text-left">
              <SVGAnimatedCheck delay={0.1} />
              <span className="text-xs text-main font-semibold">Impacto o sobrecarga articular</span>
            </div>
            <span className="text-base font-extrabold text-primary ml-2">
              <StatCountUp target={0} suffix="%" delay={0.1} />
            </span>
          </motion.div>

          {/* Metric 2: +85% mejora funcional */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="flex items-center justify-between p-2.5 rounded-xl bg-warm/60 border border-border/50"
          >
            <div className="flex items-center gap-2.5 text-left">
              <SVGAnimatedCheck delay={0.25} />
              <span className="text-xs text-main font-semibold">Mejora funcional en estudios</span>
            </div>
            <span className="text-base font-extrabold text-primary ml-2">
              <StatCountUp target={85} prefix="+" suffix="%" delay={0.25} />
            </span>
          </motion.div>

          {/* Metric 3: -24% riesgo de caídas */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex items-center justify-between p-2.5 rounded-xl bg-warm/60 border border-border/50"
          >
            <div className="flex items-center gap-2.5 text-left">
              <SVGAnimatedCheck delay={0.4} />
              <span className="text-xs text-main font-semibold">Riesgo de caídas comprobado</span>
            </div>
            <span className="text-base font-extrabold text-primary ml-2">
              <StatCountUp target={24} prefix="-" suffix="%" delay={0.4} />
            </span>
          </motion.div>
        </div>
      </div>
    </div>
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
  'fatigue-clock': () => <FatigueClock />,
  'impact-compare': ({ isMale }) => <ImpactCompare isMale={isMale} />,
  'joint-motion': () => <JointMotion />,
  'fall-risk-1': () => <FallRisk1 />,
  'fall-risk-2': () => <FallRisk2 />,
  'fall-risk-3': () => <FallRisk3 />,
};

// Hook de cuenta regresiva usando requestAnimationFrame (100% -> 0%)
function useCountdown(start: number, end: number, delaySeconds: number, durationMs = 1200): number {
  const [value, setValue] = useState(start);

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
      const current = Math.round(start + (end - start) * eased);
      setValue(current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [start, end, delaySeconds, durationMs]);

  return value;
}

function AnimatedBigStat({ stat, statColor }: { stat: string; statColor: string }) {
  const isZeroPercent = stat === '0%';
  const animatedZero = useCountdown(100, 0, 0.1, 1300);

  const displayVal = isZeroPercent ? `${animatedZero}%` : stat;

  return (
    <p
      className="font-extrabold leading-none tracking-tight tabular-nums"
      style={{ color: statColor, fontSize: displayVal.length > 4 ? '2.6rem' : '3.4rem' }}
    >
      {displayVal}
    </p>
  );
}

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
            <AnimatedBigStat stat={screen.stat} statColor={statColor} />
          )}
          <h2 className="text-[22px] font-bold text-main leading-snug">{headline}</h2>
          <p className="text-[15px] text-secondary leading-relaxed">{subtext}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 350,
            damping: 25
          }}
          className="flex justify-center w-full"
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
