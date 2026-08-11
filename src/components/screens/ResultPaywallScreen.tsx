import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import type { ResultPaywallScreen, PricingPlanId } from '../../types/quiz';
import { pricingPlans } from '../../data/pricing';
import { activityLevelLabel, metaIdealLabel } from '../../utils/copy';
import { formatDateBr, defaultFechaObjetivo } from '../../utils/date';
import { trackPixelEvent } from '../../utils/pixel';
import PhoneCarousel from '../PhoneCarousel';
import VentajasHeader from '../VentajasHeader';
import TestimonialsSection from '../TestimonialsSection';
import CountdownTimer from '../CountdownTimer';

import selloGarantia from '../../assets/icons/sello-garantia-30dias.webp';

// Plan prices in BRL (numeric values for Meta Pixel)
const PLAN_VALUES: Record<string, number> = {
  mensal: 77.90,
  trimestral: 132.90,
  semestral: 239.90,
};

interface Props {
  screen: ResultPaywallScreen;
}

const SAGE = '#5A6FD6';
const SAGE_BG = '#EEF1FB';
const SAGE_CHART = '#5C7AE0';

/**
 * Devuelve el label de duración en español del plan highlighted (el que tiene
 * `highlighted: true` en `pricingPlans`). Se usa para componer la línea de
 * prueba social del primer pedido de modo que, si mañana se cambia el plan
 * destacado, la frase se actualiza sola.
 */
function recommendedDurationLabel(): string {
  const recommended = pricingPlans.find((p) => p.highlighted) ?? pricingPlans[0];
  const map: Record<string, string> = {
    mensal: '1 mes',
    trimestral: '3 meses',
    semestral: '6 meses',
  };
  return map[recommended.id] ?? recommended.label;
}

/**
 * SVG del gráfico de proyección (movido inline desde el antiguo
 * ProjectionScreen.tsx). Línea ascendente de AHORA hasta la fecha objetivo,
 * con banda sombreada y animación de dibujo.
 */
function ProjectionChart({ targetLabel }: { targetLabel: string }) {
  // S-curve orgánica con dos cubic-bezier: arranca plana, se acelera al medio, aterriza suave arriba.
  const linePath = 'M22 158 C 80 156, 120 138, 168 102 C 220 60, 258 32, 298 18';
  // Curva paralela arriba (para definir el area del gradiente).
  const areaPath = `${linePath} L 298 172 L 22 172 Z`;

  // Nodos intermedios + extremos — distribuidos a lo largo de la curva.
  const nodes: { cx: number; cy: number }[] = [
    { cx: 22, cy: 158 },
    { cx: 95, cy: 140 },
    { cx: 168, cy: 102 },
    { cx: 232, cy: 56 },
    { cx: 298, cy: 18 },
  ];

  return (
    <svg viewBox="0 0 320 190" fill="none" className="w-full max-w-[340px]" aria-hidden="true">
      <defs>
        {/* Degradado azul de marca → transparente para el área bajo la curva */}
        <linearGradient id="projectionAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SAGE_CHART} stopOpacity="0.35" />
          <stop offset="60%" stopColor={SAGE_CHART} stopOpacity="0.15" />
          <stop offset="100%" stopColor={SAGE_CHART} stopOpacity="0" />
        </linearGradient>
        {/* Glow suave alrededor del nodo meta */}
        <radialGradient id="goalGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={SAGE_CHART} stopOpacity="0.35" />
          <stop offset="60%" stopColor={SAGE_CHART} stopOpacity="0.1" />
          <stop offset="100%" stopColor={SAGE_CHART} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Línea base sutil (en gris neutro, no verde) */}
      <path d="M22 172 L298 172" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="2 4" />

      {/* Área bajo la curva con degradado */}
      <motion.path
        d={areaPath}
        fill="url(#projectionAreaGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />

      {/* Glow del nodo meta (debajo del nodo) */}
      <motion.circle
        cx={nodes[4].cx}
        cy={nodes[4].cy}
        r="22"
        fill="url(#goalGlow)"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
      />

      {/* Línea principal de la curva, dibujada progresivamente */}
      <motion.path
        d={linePath}
        stroke={SAGE_CHART}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.2 }}
      />

      {/* Nodos a lo largo de la curva, con stagger */}
      {nodes.slice(0, -1).map((n, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={n.cx}
          cy={n.cy}
          r="4"
          fill="#FFFFFF"
          stroke={SAGE_CHART}
          strokeWidth="2.5"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 + i * 0.18, ease: 'easeOut' }}
        />
      ))}

      {/* Nodo meta (último): anillo exterior + círculo sólido */}
      <motion.circle
        cx={nodes[4].cx}
        cy={nodes[4].cy}
        r="10"
        fill="none"
        stroke={SAGE_CHART}
        strokeWidth="1.5"
        opacity="0.4"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      />
      <motion.circle
        cx={nodes[4].cx}
        cy={nodes[4].cy}
        r="6"
        fill={SAGE_CHART}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 1.5, ease: 'easeOut' }}
      />

      {/* Label "AHORA" en gris neutro (no verde) */}
      <text
        x="22"
        y="188"
        fontSize="10"
        fontWeight="800"
        fill="#94A3B8"
        letterSpacing="0.5"
        fontFamily="Nunito, sans-serif"
      >
        AHORA
      </text>

      {/* Label fecha objetivo */}
      <text
        x="298"
        y="188"
        fontSize="10"
        fontWeight="800"
        fill={SAGE_CHART}
        textAnchor="end"
        letterSpacing="0.5"
        fontFamily="Nunito, sans-serif"
      >
        {targetLabel.toUpperCase()}
      </text>
    </svg>
  );
}

/**
 * Renderiza el bloque de los 3 planes (radio buttons) + un único botón de checkout.
 * El botón redirige al `checkoutUrl` del plan actualmente seleccionado.
 * Se reutiliza tal cual en el primer pedido (#5) y en el segundo (#17),
 * porque el state (`selectedPlan`) vive en el padre.
 */
function PlanPicker({
  screen,
  selectedPlan,
  setSelectedPlan,
  onCheckout,
}: {
  screen: ResultPaywallScreen;
  selectedPlan: string | null;
  setSelectedPlan: (id: PricingPlanId) => void;
  onCheckout: (planId: PricingPlanId) => void;
}) {
  // Plan efectivo: si el usuario aún no eligió, usamos el highlighted (o el primero).
  const effectivePlan =
    pricingPlans.find((p) => p.id === selectedPlan) ??
    pricingPlans.find((p) => p.highlighted) ??
    pricingPlans[0];

  return (
    <div className="flex flex-col gap-3">
      {pricingPlans.map((plan, i) => {
        const isSelected = effectivePlan.id === plan.id;
        return (
          <motion.button
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            onClick={() => setSelectedPlan(plan.id)}
            role="radio"
            aria-checked={isSelected}
            className={`relative flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors ${
              isSelected ? 'border-primary' : 'border-border'
            }`}
            style={{ backgroundColor: isSelected ? 'color-mix(in srgb, var(--color-primary) 6%, white)' : 'var(--color-surface)' }}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-primary bg-primary' : 'border-border'
                }`}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
              <div>
                <p className="font-semibold text-main text-sm">{plan.label}</p>
                <p className="text-xs text-secondary">{plan.dailyEquivalent}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-main">{plan.price}</p>
              {plan.badge && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 whitespace-nowrap"
                  style={{
                    backgroundColor: plan.highlighted ? SAGE_BG : '#F6EEDD',
                    color: plan.highlighted ? SAGE : '#B8863E',
                  }}
                >
                  {plan.badge}
                </span>
              )}
            </div>
          </motion.button>
        );
      })}

      {/* Botón único de checkout: redirige al `checkoutUrl` del plan activo.
          El evento InitiateCheckout de Meta Pixel se dispara en onClick
          (el padre maneja el tracking); la navegación la hace el browser vía href. */}
      <motion.a
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        href={effectivePlan.checkoutUrl}
        onClick={() => onCheckout(effectivePlan.id)}
        className="cta-btn mt-1 no-underline"
      >
        {screen.ctaLabel}
      </motion.a>
    </div>
  );
}

export default function ResultPaywallScreenComp({ screen }: Props) {
  const { userName, userAge, userGender, answers, selectedPlan, setSelectedPlan, goBack, currentScreen } =
    useQuizStore();
  const [hasTracked, setHasTracked] = useState(false);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // Inicializar el plan por defecto y disparar ViewContent una sola vez al montar.
  // NO disparamos InitiateCheckout acá: eso solo se dispara cuando el usuario
  // hace clic en el botón de checkout (intención real), no cuando solo hace scroll.
  // Purchase NUNCA se dispara desde el frontend — lo maneja Hotmart vía postback/CAPI.
  useEffect(() => {
    const defaultPlan = pricingPlans.find((p) => p.highlighted) ?? pricingPlans[0];
    if (!selectedPlan) setSelectedPlan(defaultPlan.id);

    if (!hasTracked) {
      trackPixelEvent('ViewContent', { content_name: 'result_paywall' });
      setHasTracked(true);
    }
  }, [hasTracked, selectedPlan, setSelectedPlan]);

  // Tokens de la proyección (mismo mecanismo que tenía el antiguo ProjectionScreen).
  const metaIdeal = metaIdealLabel(answers.metaIdeal as string | undefined);
  const fechaObjetivo = (answers.fechaObjetivo as string | undefined) ?? defaultFechaObjetivo();
  const fechaFormatted = formatDateBr(fechaObjetivo);

  const projectionHeadline = screen.projectionHeadline
    .replace(/\{\{metaIdeal\}\}/g, metaIdeal)
    .replace(/\{\{fechaObjetivo\}\}/g, fechaFormatted);
  const projectionHeadlineFinal = interpolate(projectionHeadline, userName, userAge, userGender);
  const projectionSubtext = interpolate(screen.projectionSubtext, userName, userAge, userGender);

  const headline = interpolate(screen.headline, userName, userAge, userGender);
  const nivel = activityLevelLabel(answers.activityLevel as string | undefined);
  const recommendedDuration = recommendedDurationLabel();

  // Dispara InitiateCheckout cuando el usuario hace clic en el botón de checkout.
  // Esto SÍ representa intención real de compra (a diferencia del onMount, que era
  // solo "viste la página"). La navegación la maneja el browser via el `href` del <a>.
  //
  // Purchase NUNCA se dispara desde acá — solo Hotmart lo confirma vía postback/CAPI.
  const handleCheckout = useCallback((planId: PricingPlanId) => {
    const value = PLAN_VALUES[planId];
    if (value) {
      trackPixelEvent('InitiateCheckout', { value, currency: 'BRL' });
    } else {
      trackPixelEvent('InitiateCheckout');
    }
  }, []);

  return (
    <div className="px-5 pt-8 pb-12 flex flex-col gap-8">
      {/* 1. Botón "← Volver" (condicional) */}
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn self-start">
          ← Volver
        </button>
      )}

      {/* 2. [FUSIONADO] Proyección: headline + chart + 3 bullets. Sin CTA propio. */}
      <div className="flex flex-col gap-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-main leading-snug">{projectionHeadlineFinal}</h2>
          <p className="text-base text-secondary">{projectionSubtext}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          style={{ willChange: 'transform' }}
          className="flex justify-center"
        >
          <ProjectionChart targetLabel={fechaFormatted} />
        </motion.div>

        <div className="flex flex-col gap-2.5">
          {screen.projectionBullets.map((item, i) => (
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
      </div>

      {/* 3a. Headline de resultado + nivel */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-main leading-snug">{headline}</h2>
        <div className="flex justify-center text-sm">
          <span>
            <span className="text-secondary">Nivel: </span>
            <span className="font-semibold text-main">{nivel}</span>
          </span>
        </div>
      </div>

      {/* 3b. Headline de urgencia — referencia Simple */}
      <h3 className="text-2xl font-bold text-main text-center leading-snug">
        ¡Solo tienes unos minutos para obtener tu plan personal!
      </h3>

      {/* 4. Countdown de 9 minutos */}
      <CountdownTimer initialSeconds={9 * 60} />

      {/* 5. Los 3 planes de precio */}
      <PlanPicker
        screen={screen}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        onCheckout={handleCheckout}
      />

      {/* 6. Prueba social del plan recomendado (lee `duration` dinámicamente) */}
      <div className="text-center -mt-2">
        <p className="text-sm text-main leading-relaxed max-w-sm mx-auto">
          Los usuarios de FirmMe con objetivos parecidos han avanzado más rápido
          con el plan de <strong className="font-semibold">{recommendedDuration}</strong>.
        </p>
        <p className="text-[11px] text-secondary mt-1">
          *Según datos internos de FirmMe.
        </p>
      </div>

      {/* 7. Botones Hotmart: ya incluidos en el <PlanPicker /> de arriba (#5) */}

      {/* 8. Link "Tengo un código promocional" (visual, sin lógica) */}
      <div className="text-center -mt-4">
        <button
          type="button"
          className="text-sm underline text-secondary hover:text-main transition-colors"
        >
          Tengo un código promocional
        </button>
      </div>

      {/* 9. Letra pequeña de términos de suscripción */}
      <p className="text-[11px] text-secondary text-center leading-relaxed max-w-xs mx-auto -mt-4">
        La suscripción se renueva automáticamente al final de cada ciclo. Puedes
        cancelar en cualquier momento desde tu cuenta.
      </p>

      {/* 10. TestimonialsSection (movido de #2 a #10) */}
      <TestimonialsSection />

      {/* 11. Sección de confianza: OMITIDA — no hay dato real que la respalde.
              (Decisión confirmada por el usuario: sin placeholder.) */}

      {/* 12. PhoneCarousel (mockup del plan semanal) */}
      <PhoneCarousel />

      {/* 13. Título "Ventajas" + VentajasHeader + checklist */}
      <div className="flex flex-col gap-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-main">Ventajas</h2>
          <p className="text-sm text-secondary leading-relaxed max-w-sm mx-auto">
            Nuestro algoritmo inteligente diseña un plan de entrenamiento personalizado a partir de tus datos y objetivos.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <VentajasHeader />
          <div className="flex flex-col gap-2.5">
            {screen.checklist.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
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
        </div>
      </div>

      {/* 14. Card stat "58% menos caídas — Estudo Stanford" */}
      <div
        className="rounded-2xl p-8 text-center flex flex-col items-center gap-2"
        style={{ backgroundColor: SAGE_BG, border: `2px solid ${SAGE}` }}
      >
        <p className="font-extrabold leading-none" style={{ color: SAGE, fontSize: 72 }}>
          58%
        </p>
        <p className="text-base font-semibold text-main max-w-[240px]">
          menos caídas que con estiramientos tradicionales
        </p>
        <p className="text-xs font-medium text-secondary uppercase tracking-wide">
          Estudio Stanford
        </p>
      </div>

      {/* 15. Tabla comparativa FirmMe vs Tai Chi de pie vs Academia */}
      <div className="rounded-2xl p-5 bg-white border border-border flex flex-col gap-4">
        <h3 className="text-base font-bold text-main text-center">¿Cómo se compara FirmMe?</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2.5 pr-2 text-secondary font-semibold">Criterio</th>
                <th
                  onMouseEnter={() => setHoveredCol(1)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-2 text-primary font-bold text-center transition-all duration-200 ${
                    hoveredCol === 1 ? 'bg-[#E5EAFA] scale-[1.02]' : 'bg-[#EEF1FB]'
                  } rounded-t-lg`}
                  style={{ transformOrigin: 'bottom', willChange: 'transform' }}
                >
                  FirmMe (Cadeira)
                </th>
                <th
                  onMouseEnter={() => setHoveredCol(2)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-secondary font-semibold text-center transition-all duration-200 ${
                    hoveredCol === 2 ? 'bg-[#EEF1FB]/60 scale-[1.02]' : ''
                  }`}
                  style={{ transformOrigin: 'bottom', willChange: 'transform' }}
                >
                  Tai Chi de Pé
                </th>
                <th
                  onMouseEnter={() => setHoveredCol(3)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-secondary font-semibold text-center transition-all duration-200 ${
                    hoveredCol === 3 ? 'bg-[#EEF1FB]/60 scale-[1.02]' : ''
                  }`}
                  style={{ transformOrigin: 'bottom', willChange: 'transform' }}
                >
                  Academia
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/60">
                <td className="py-2.5 pr-2 font-semibold text-main">Riesgo de caída</td>
                <td
                  onMouseEnter={() => setHoveredCol(1)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-2 text-center font-bold text-primary transition-all duration-200 ${
                    hoveredCol === 1 ? 'bg-[#E5EAFA] scale-[1.02]' : 'bg-[#EEF1FB]'
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  0% (Totalmente seguro)
                </td>
                <td
                  onMouseEnter={() => setHoveredCol(2)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-center text-secondary transition-all duration-200 ${
                    hoveredCol === 2 ? 'bg-[#EEF1FB]/40 scale-[1.02]' : ''
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Medio (requiere equilibrio)
                </td>
                <td
                  onMouseEnter={() => setHoveredCol(3)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-center text-secondary transition-all duration-200 ${
                    hoveredCol === 3 ? 'bg-[#EEF1FB]/40 scale-[1.02]' : ''
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Alto (riesgo de caída y lesión)
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-2.5 pr-2 font-semibold text-main">Carga Articular</td>
                <td
                  onMouseEnter={() => setHoveredCol(1)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-2 text-center font-bold text-primary transition-all duration-200 ${
                    hoveredCol === 1 ? 'bg-[#E5EAFA] scale-[1.02]' : 'bg-[#EEF1FB]'
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  0% (Sem impacto)
                </td>
                <td
                  onMouseEnter={() => setHoveredCol(2)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-center text-secondary transition-all duration-200 ${
                    hoveredCol === 2 ? 'bg-[#EEF1FB]/40 scale-[1.02]' : ''
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Media (peso del propio cuerpo)
                </td>
                <td
                  onMouseEnter={() => setHoveredCol(3)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-center text-secondary transition-all duration-200 ${
                    hoveredCol === 3 ? 'bg-[#EEF1FB]/40 scale-[1.02]' : ''
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Alta (impacto vertical alto)
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-2.5 pr-2 font-semibold text-main">Equipamiento</td>
                <td
                  onMouseEnter={() => setHoveredCol(1)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-2 text-center font-bold text-primary transition-all duration-200 ${
                    hoveredCol === 1 ? 'bg-[#E5EAFA] scale-[1.02]' : 'bg-[#EEF1FB]'
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Solo 1 silla común
                </td>
                <td
                  onMouseEnter={() => setHoveredCol(2)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-center text-secondary transition-all duration-200 ${
                    hoveredCol === 2 ? 'bg-[#EEF1FB]/40 scale-[1.02]' : ''
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Espaço amplo
                </td>
                <td
                  onMouseEnter={() => setHoveredCol(3)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-center text-secondary transition-all duration-200 ${
                    hoveredCol === 3 ? 'bg-[#EEF1FB]/40 scale-[1.02]' : ''
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Aparelhos e pesos caros
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-2 font-semibold text-main">Foco principal</td>
                <td
                  onMouseEnter={() => setHoveredCol(1)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-2 text-center font-bold text-primary transition-all duration-200 ${
                    hoveredCol === 1 ? 'bg-[#E5EAFA] scale-[1.02]' : 'bg-[#EEF1FB]'
                  } rounded-b-lg`}
                  style={{ willChange: 'transform' }}
                >
                  Conexión vestibular-muscular
                </td>
                <td
                  onMouseEnter={() => setHoveredCol(2)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-center text-secondary transition-all duration-200 ${
                    hoveredCol === 2 ? 'bg-[#EEF1FB]/40 scale-[1.02]' : ''
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Postura lineal
                </td>
                <td
                  onMouseEnter={() => setHoveredCol(3)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-center text-secondary transition-all duration-200 ${
                    hoveredCol === 3 ? 'bg-[#EEF1FB]/40 scale-[1.02]' : ''
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Fatiga y ganancia de fuerza
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 16. Link ancla a garantía */}
      <a href="#guarantee" className="text-xs text-center underline text-secondary">
        Garantía de reembolso
      </a>

      {/* 17. Los 3 planes de precio, repetidos (segundo pedido) */}
      <PlanPicker
        screen={screen}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        onCheckout={handleCheckout}
      />

      {/* 18. Botones Hotmart repetidos: ya incluidos en el <PlanPicker /> de arriba */}

      {/* 19. Insignia de garantía + texto + logos de pago */}
      <div id="guarantee" className="flex flex-col gap-4 items-center text-center scroll-mt-6">
        <img
          src={selloGarantia}
          alt="Selo de garantia de 30 dias"
          width={160}
          height={160}
          style={{ width: 160, height: 160 }}
        />
        <h3 className="text-xl font-bold text-main">{screen.guaranteeHeadline}</h3>
        <p className="text-sm text-secondary leading-relaxed max-w-sm">{screen.guaranteeBody}</p>
        <div className="flex items-center gap-3 text-2xl text-secondary/70">
          <i className="ti ti-brand-visa"></i>
          <i className="ti ti-brand-mastercard"></i>
          <i className="ti ti-brand-paypal"></i>
        </div>
      </div>
    </div>
  );
}
