import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import type { BmiFeedbackScreen } from '../../types/quiz';
// ─── WebP variants — 21-69KB vs 3.4MB original ───────────────────────────────
import avatarFisico400 from '../../assets/avatars/optimized/avatar-masculino-fisico-referencia-sinfondo-400w.webp';
import avatarFisico600 from '../../assets/avatars/optimized/avatar-masculino-fisico-referencia-sinfondo-600w.webp';
import avatarFisico800 from '../../assets/avatars/optimized/avatar-masculino-fisico-referencia-sinfondo-800w.webp';

interface Props {
  screen: BmiFeedbackScreen;
}

// ─── BMI Ranges ───────────────────────────────────────────────────────────────
interface BmiRange {
  label: string;
  color: string;
  message: string;
  icon: string;
}

function getBmiRange(bmi: number): BmiRange {
  if (bmi < 18.5) return {
    label: 'Bajo peso',
    color: '#60a5fa',
    message: 'Fortalecer el tono muscular y la densidad ósea es tu prioridad — el Tai Chi en silla es ideal para construir fuerza sin riesgo articular.',
    icon: 'ti ti-trending-up',
  };
  if (bmi < 25) return {
    label: 'Normal',
    color: '#34d399',
    message: 'Partes de un buen punto de partida para fortalecer tu equilibrio y proteger tus articulaciones a largo plazo.',
    icon: 'ti ti-circle-check',
  };
  if (bmi < 30) return {
    label: 'Sobrepeso',
    color: '#f59e0b',
    message: 'Cada kilo extra añade presión sobre las rodillas. El Tai Chi en silla reduce esta carga mientras tonifica sin desgastar.',
    icon: 'ti ti-scale',
  };
  return {
    label: 'Obesidad',
    color: '#f87171',
    message: 'El movimiento suave en silla elimina el impacto vertical mientras activa la circulación y reduce la grasa abdominal — sin esfuerzo articular.',
    icon: 'ti ti-heart-rate-monitor',
  };
}

// ─── Animated BMI Slider ──────────────────────────────────────────────────────
function BmiSlider({ bmi }: { bmi: number }) {
  const [animatedBmi, setAnimatedBmi] = useState(15);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const clampedBmi = Math.min(Math.max(bmi, 15), 40);
  const DURATION = 1400; // ms
  const MIN = 15;
  const MAX = 40;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = MIN + eased * (clampedBmi - MIN);
      setAnimatedBmi(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hasStarted, clampedBmi]);

  const percent = ((animatedBmi - MIN) / (MAX - MIN)) * 100;
  const range = getBmiRange(animatedBmi);

  // Zone widths (as % of total 15-40 range)
  const zones = [
    { label: 'Bajo', color: '#60a5fa', from: 0, to: (18.5 - 15) / 25 * 100 },
    { label: 'Normal', color: '#34d399', from: (18.5 - 15) / 25 * 100, to: (25 - 15) / 25 * 100 },
    { label: 'Sobrepeso', color: '#f59e0b', from: (25 - 15) / 25 * 100, to: (30 - 15) / 25 * 100 },
    { label: 'Obesidad', color: '#f87171', from: (30 - 15) / 25 * 100, to: 100 },
  ];

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      {/* BMI value display */}
      <div className="flex items-baseline gap-2 justify-center">
        <span className="text-5xl font-extrabold" style={{ color: range.color, fontVariantNumeric: 'tabular-nums' }}>
          {animatedBmi.toFixed(1)}
        </span>
        <span className="text-lg text-secondary font-medium">IMC</span>
        <span
          className="ml-2 px-2.5 py-0.5 rounded-full text-sm font-bold text-white"
          style={{ background: range.color }}
        >
          {range.label}
        </span>
      </div>

      {/* Gradient track */}
      <div className="relative h-5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
        {/* Colored zones */}
        {zones.map((z) => (
          <div
            key={z.label}
            className="absolute top-0 bottom-0"
            style={{
              left: `${z.from}%`,
              width: `${z.to - z.from}%`,
              background: z.color,
              opacity: 0.35,
            }}
          />
        ))}
        {/* Filled progress */}
        <div
          className="absolute top-0 left-0 bottom-0 rounded-full transition-none"
          style={{
            width: `${percent}%`,
            background: range.color,
            opacity: 0.85,
          }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md"
          style={{ left: `${percent}%`, background: range.color }}
        />
      </div>

      {/* Zone labels */}
      <div className="flex justify-between text-xs text-secondary/70">
        <span>15</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>
    </div>
  );
}

// ─── Profile Block — Side-by-side layout ──────────────────────────────────────
function ProfileBlock() {
  const { answers, userAge } = useQuizStore();

  const painZones = (answers['painZones'] as string[] | undefined) ?? [];
  const painLabel = painZones.length > 0
    ? painZones.map((z) => {
        const map: Record<string, string> = { knees: 'Rodillas', lower_back: 'Lumbar', hips: 'Caderas', ankles: 'Tobillos', none: 'Sin dolor' };
        return map[z] ?? z;
      }).join(', ')
    : 'Sin datos';

  const activityMap: Record<string, string> = {
    none: 'Sedentario',
    light: 'Actividad ligera',
    moderate: 'Moderado',
    active: 'Bastante activo',
  };
  const activityLevel = activityMap[(answers['activityLevel'] as string) ?? ''] ?? 'No indicado';

  const metaMap: Record<string, string> = {
    grandkids: 'Jugar con nietos',
    travel: 'Caminar sin límites',
    stairs: 'Subir escaleras',
    confidence: 'Caminar con confianza',
  };
  const objetivo = metaMap[(answers['metaIdeal'] as string) ?? ''] ?? 'Mejorar movilidad';

  const mobilityMap: Record<string, string> = {
    yes_frequent: 'Articulaciones rígidas',
    sometimes: 'Rigidez ocasional',
    never: 'Buena movilidad',
  };
  const movilidad = mobilityMap[(answers['stiffness'] as string) ?? ''] ?? 'Sin datos';

  const fields = [
    { icon: 'ti ti-activity', label: 'Movilidad', value: movilidad },
    { icon: 'ti ti-walk', label: 'Estilo de vida', value: activityLevel },
    { icon: 'ti ti-bone', label: 'Zona de tensión', value: painLabel },
    { icon: 'ti ti-target', label: 'Objetivo', value: objetivo },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      {/* Side-by-side layout: info left | avatar right */}
      <div className="flex items-stretch min-h-[160px]">
        {/* Left: profile info */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <p className="text-sm font-bold text-main">Hombre, {userAge || '50-59'} años</p>
            <p className="text-xs text-secondary/70 mt-0.5">Perfil de referencia</p>
          </div>

          {/* 2×2 grid of stats */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-3">
            {fields.map((f) => (
              <div key={f.label} className="flex flex-col gap-0.5">
                <p className="text-[10px] text-secondary/60 flex items-center gap-1 uppercase tracking-wide font-medium">
                  <i className={`${f.icon} text-[10px]`} style={{ color: 'var(--color-primary)' }} />
                  {f.label}
                </p>
                <p className="text-xs font-semibold text-main leading-tight">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: avatar image — transparent background, no overlay */}
        <div
          className="relative flex-shrink-0 flex items-end justify-center overflow-hidden"
          style={{
            width: '42%',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #e8eef8 100%)',
          }}
        >
          <img
            src={avatarFisico400}
            srcSet={`${avatarFisico400} 400w, ${avatarFisico600} 600w, ${avatarFisico800} 800w`}
            sizes="(max-width: 480px) 42vw, 200px"
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            alt="Referencia física masculina"
            className="w-full h-auto object-contain object-bottom"
            style={{ maxHeight: '180px' }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BmiFeedbackScreenComp({ screen }: Props) {
  const { answers, goNext, goBack, currentScreen } = useQuizStore();

  const heightCm = (answers['userHeightCm'] as number | undefined) ?? 170;
  const weightKg = (answers['userWeightKg'] as number | undefined) ?? 80;
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const clampedBmi = Math.min(Math.max(bmi, 15), 40);
  const range = getBmiRange(clampedBmi);

  // Optional: show target weight delta if user entered one
  const targetKg = (answers['userTargetWeightKg'] as number | undefined) ?? null;
  const deltaKg = targetKg !== null ? Math.round((weightKg - targetKg) * 10) / 10 : null;

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-6">
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn">← Volver</button>
      )}

      {/* Headline */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-main">{screen.headline}</h2>
        {screen.subtext && <p className="text-sm text-secondary">{screen.subtext}</p>}
      </div>

      {/* Animated BMI Slider */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <BmiSlider bmi={clampedBmi} />
      </motion.div>

      {/* Interpretive message */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl p-4 flex gap-3 items-start"
        style={{ background: `${range.color}18`, border: `1px solid ${range.color}40` }}
      >
        <i className={`${range.icon} text-xl mt-0.5`} style={{ color: range.color }} />
        <p className="text-sm text-main leading-relaxed">{range.message}</p>
      </motion.div>

      {/* Target weight delta badge — only if user entered target weight */}
      {deltaKg !== null && deltaKg > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.38, type: 'spring', stiffness: 200 }}
          className="rounded-xl p-3 flex gap-3 items-center"
          style={{ background: 'var(--color-primary)10', border: '1px solid var(--color-primary)30' }}
        >
          <i className="ti ti-trending-down text-xl" style={{ color: 'var(--color-primary)' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
              Meta: {targetKg} kg — bajar {deltaKg} kg
            </p>
            <p className="text-xs text-secondary">Tu plan se ajusta a este objetivo</p>
          </div>
        </motion.div>
      )}

      {/* Profile block — side-by-side */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Tu perfil actual</p>
        <ProfileBlock />
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={goNext}
        className="cta-btn"
      >
        {screen.ctaLabel}
      </motion.button>
    </div>
  );
}
