import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import type { ResultPaywallScreen } from '../../types/quiz';
import { pricingPlans } from '../../data/pricing';
import { activityLevelLabel } from '../../utils/copy';
import { trackPixelEvent } from '../../utils/pixel';
import PhoneCarousel from '../PhoneCarousel';
import VentajasHeader from '../VentajasHeader';
import TestimonialsSection from '../TestimonialsSection';

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

export default function ResultPaywallScreenComp({ screen }: Props) {
  const { userName, userAge, userGender, answers, selectedPlan, setSelectedPlan, goBack, currentScreen } =
    useQuizStore();
  const [hasTracked, setHasTracked] = useState(false);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // Cargar el script de Hotmart una sola vez
  useEffect(() => {
    // Setear plan default (Trimestral) si no hay ninguno seleccionado
    const defaultPlan = pricingPlans.find((p) => p.highlighted) || pricingPlans[0];
    if (!selectedPlan) setSelectedPlan(defaultPlan.id);
    
    if (!hasTracked) {
      trackPixelEvent('InitiateCheckout');
      setHasTracked(true);
    }

    // Cargar widget de Hotmart (solo si no está ya cargado)
    if (!document.querySelector('script[src="https://static.hotmart.com/checkout/widget.min.js"]')) {
      const imported = document.createElement('script');
      imported.src = 'https://static.hotmart.com/checkout/widget.min.js';
      document.head.appendChild(imported);
    }
    if (!document.querySelector('link[href="https://static.hotmart.com/css/hotmart-fb.min.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
      document.head.appendChild(link);
    }
  }, [hasTracked, selectedPlan, setSelectedPlan]);

  const headline = interpolate(screen.headline, userName, userAge, userGender);
  const nivel = activityLevelLabel(answers.activityLevel as string | undefined);

  // Track Purchase event when user clicks checkout button
  const handleCheckout = useCallback(
    (planId: string, hotmartUrl: string) => {
      const value = PLAN_VALUES[planId];
      if (value) {
        trackPixelEvent('Purchase', { value, currency: 'BRL' });
      }
      // Navigate to Hotmart checkout
      window.location.href = hotmartUrl;
    },
    []
  );

  return (
    <div className="px-5 pt-8 pb-12 flex flex-col gap-8">
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn self-start">
          ← Volver
        </button>
      )}

      {/* Banner de testimonios — abre la landing, antes del headline */}
      <TestimonialsSection />

      {/* 2. Headline + resumen del plan — arranca la landing propiamente dicha */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-main leading-snug">{headline}</h2>
        <div className="flex justify-center text-sm">
          <span>
            <span className="text-secondary">Nivel: </span>
            <span className="font-semibold text-main">{nivel}</span>
          </span>
        </div>
      </div>

      {/* Carrusel de vista previa de la app */}
      <PhoneCarousel />

      {/* Ventajas — título + intro, justo antes de la tabla semanal */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-main">Ventajas</h2>
        <p className="text-sm text-secondary leading-relaxed max-w-sm mx-auto">
          Nuestro algoritmo inteligente diseña un plan de entrenamiento personalizado a partir de tus datos y objetivos.
        </p>
      </div>

      {/* Checklist de ventajas */}
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

      {/* Cierre de confianza — dato de Stanford, en card propio para que resalte */}
      <div
        className="rounded-2xl p-8 text-center flex flex-col items-center gap-2"
        style={{ backgroundColor: SAGE_BG, border: `2px solid ${SAGE}` }}
      >
        <p className="font-extrabold leading-none" style={{ color: SAGE, fontSize: 72 }}>
          58%
        </p>
        <p className="text-base font-semibold text-main max-w-[240px]">
          menos quedas do que com alongamento tradicional
        </p>
        <p className="text-xs font-medium text-secondary uppercase tracking-wide">
          Estudo Stanford
        </p>
      </div>

      {/* Tabla Comparativa de Diferenciación */}
      <div className="rounded-2xl p-5 bg-white border border-border flex flex-col gap-4">
        <h3 className="text-base font-bold text-main text-center">Como a FirmMe se compara?</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2.5 pr-2 text-secondary font-semibold">Critério</th>
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
                <td className="py-2.5 pr-2 font-semibold text-main">Risco de queda</td>
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
                  Médio (exige equilíbrio)
                </td>
                <td 
                  onMouseEnter={() => setHoveredCol(3)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-center text-secondary transition-all duration-200 ${
                    hoveredCol === 3 ? 'bg-[#EEF1FB]/40 scale-[1.02]' : ''
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Alto (risco de queda e lesão)
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
                  Média (peso do próprio corpo)
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
                <td className="py-2.5 pr-2 font-semibold text-main">Equipamento</td>
                <td 
                  onMouseEnter={() => setHoveredCol(1)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-2 text-center font-bold text-primary transition-all duration-200 ${
                    hoveredCol === 1 ? 'bg-[#E5EAFA] scale-[1.02]' : 'bg-[#EEF1FB]'
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Apenas 1 cadeira comum
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
                  Conexão labirinto-muscular
                </td>
                <td 
                  onMouseEnter={() => setHoveredCol(2)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-center text-secondary transition-all duration-200 ${
                    hoveredCol === 2 ? 'bg-[#EEF1FB]/40 scale-[1.02]' : ''
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Postura linear
                </td>
                <td 
                  onMouseEnter={() => setHoveredCol(3)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`py-2.5 px-1 text-center text-secondary transition-all duration-200 ${
                    hoveredCol === 3 ? 'bg-[#EEF1FB]/40 scale-[1.02]' : ''
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  Fadiga e ganho de força
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Planes de precio */}
      <div className="flex flex-col gap-3">
        {pricingPlans.map((plan, i) => {
          const isSelected = selectedPlan === plan.id;
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

        <a href="#guarantee" className="text-xs text-center underline text-secondary">
          Garantia de reembolso
        </a>

        {/* 3 botones de Hotmart renderizados desde el inicio - CSS muestra/oculta según selección */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="checkout-buttons-container"
        >
          {/* Botón Mensal */}
          <a
            href="https://pay.hotmart.com/N106896758T?checkoutMode=2&off=gj6hcxhu"
            onClick={(e) => { e.preventDefault(); handleCheckout('mensal', 'https://pay.hotmart.com/N106896758T?checkoutMode=2&off=gj6hcxhu'); }}
            className={`hotmart-fb hotmart__button-checkout checkout-btn-plan ${selectedPlan === 'mensal' ? 'active' : ''}`}
          >
            {screen.ctaLabel}
          </a>

          {/* Botón Trimestral */}
          <a
            href="https://pay.hotmart.com/N106896758T?checkoutMode=2&off=wrzjhjvz"
            onClick={(e) => { e.preventDefault(); handleCheckout('trimestral', 'https://pay.hotmart.com/N106896758T?checkoutMode=2&off=wrzjhjvz'); }}
            className={`hotmart-fb hotmart__button-checkout checkout-btn-plan ${selectedPlan === 'trimestral' ? 'active' : ''}`}
          >
            {screen.ctaLabel}
          </a>

          {/* Botón Semestral */}
          <a
            href="https://pay.hotmart.com/N106896758T?checkoutMode=2&off=6d5ogulh"
            onClick={(e) => { e.preventDefault(); handleCheckout('semestral', 'https://pay.hotmart.com/N106896758T?checkoutMode=2&off=6d5ogulh'); }}
            className={`hotmart-fb hotmart__button-checkout checkout-btn-plan ${selectedPlan === 'semestral' ? 'active' : ''}`}
          >
            {screen.ctaLabel}
          </a>
        </motion.div>
      </div>

      {/* Garantía */}
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
