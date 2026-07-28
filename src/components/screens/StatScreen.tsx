import { useEffect, useState, type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import type { StatScreen, StatVisualKind } from '../../types/quiz';
import jointMotionIcon from '../../assets/icons/icono-articulaciones-movimiento.png';

import brollExtendidos400 from '../../assets/avatars/optimized/avatar-broll-brazos-extendidos-400w.webp';
import brollExtendidos600 from '../../assets/avatars/optimized/avatar-broll-brazos-extendidos-600w.webp';
import brollExtendidos800 from '../../assets/avatars/optimized/avatar-broll-brazos-extendidos-800w.webp';

import antesEstres400 from '../../assets/avatars/optimized/avatar-antes-estres-400w.webp';
import antesEstres600 from '../../assets/avatars/optimized/avatar-antes-estres-600w.webp';
import antesEstres800 from '../../assets/avatars/optimized/avatar-antes-estres-800w.webp';

interface Props {
  screen: StatScreen;
}

// Palette: sage/cream come from the design tokens; terracotta only on the
// "gym te deja agotada" screen.
const SAGE = '#5C7AE0';
const TERRACOTTA = '#D97A4E';
const MUTED = '#B9C4BB';

// ─── SVG visuals (one per StatVisualKind) ─────────────────────────────────────

interface FallRiskDatum {
  value: number; // 0-100, relative fall-risk index
  color: string;
  lines: [string] | [string, string];
}

// Only the studied comparison gets a bar: Tai Chi vs. estiramiento
// tradicional is the actual 58%-reduction figure. "Sin hacer ejercicio" is
// mentioned in the subtext as a separate, broader finding (24 studies) but
// isn't given a bar here — we don't have a number for "estiramiento vs. sin
// ejercicio" to back up plotting them at different heights.
const FALL_RISK_BARS: FallRiskDatum[] = [
  { value: 100, color: MUTED, lines: ['Alongamento', 'tradicional'] },
  { value: 42, color: SAGE, lines: ['Tai Chi', 'na cadeira'] },
];

const CHART_BASELINE_Y = 132;
const CHART_MAX_BAR_HEIGHT = 92;
const CHART_VIEW_WIDTH = 240;
const BAR_WIDTH = 44;
const BAR_GAP = 36;

// Counts up to `target` once mounted, easing out — synced to the bar's own
// grow animation so the number "arrives" as the bar finishes rising.
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
      {/* highlight ring around the standout (Tai Chi) bar.
          Rect is drawn at its final geometry and grown via scaleY (anchored
          to the baseline with originY) rather than animating the height/y
          attributes directly — SVG attribute tweening isn't reliably
          committed to the DOM in all render contexts, while transform-based
          animation is. */}
      {isBest && (
        <motion.rect
          x={x - 5}
          y={barY - 5}
          width={BAR_WIDTH + 10}
          height={barHeight + 10}
          rx={13}
          fill="none"
          stroke={SAGE}
          strokeWidth={2}
          strokeOpacity={0.45}
          style={{ originY: 1 }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      <motion.rect
        x={x}
        y={barY}
        width={BAR_WIDTH}
        height={barHeight}
        rx={9}
        fill={datum.color}
        style={{ originY: 1 }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
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

// Real avatar photo used in place of an abstract icon — rounded portrait
// card, consistent with the other StatScreen visuals' footprint.
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

function FatigueClock() {
  return (
    <AvatarPhoto
      src400={antesEstres400}
      src600={antesEstres600}
      src800={antesEstres800}
      alt="Mulher com expressão de cansaço e tensão, sentada na sua cadeira"
    />
  );
}

function ImpactCompare() {
  return (
    <AvatarPhoto
      src400={brollExtendidos400}
      src600={brollExtendidos600}
      src800={brollExtendidos800}
      alt="Mulher sentada na sua cadeira com os braços estendidos e os pés apoiados no chão"
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

const VISUALS: Record<StatVisualKind, () => ReactElement> = {
  'fall-risk-bars': FallRiskBars,
  'fatigue-clock': FatigueClock,
  'impact-compare': ImpactCompare,
  'joint-motion': JointMotion,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StatScreenComp({ screen }: Props) {
  const { userName, userAge, userGender, goNext, goBack, currentScreen } = useQuizStore();

  const headline = interpolate(screen.headline, userName, userAge, userGender);
  const subtext = interpolate(screen.subtext, userName, userAge, userGender);
  const note = screen.note ? interpolate(screen.note, userName, userAge, userGender) : undefined;
  const isTerracotta = screen.accent === 'terracotta';
  const statColor = isTerracotta ? TERRACOTTA : SAGE;
  const Visual = VISUALS[screen.visual];

  return (
    <div
      className="px-6 pt-6 pb-10 flex flex-col gap-6 min-h-[560px]"
      style={{ fontFamily: "'Nunito', 'Inter', sans-serif" }}
    >
      {/* Back button */}
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn self-start">
          ← Voltar
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
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex justify-center w-full"
        >
          <Visual />
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
