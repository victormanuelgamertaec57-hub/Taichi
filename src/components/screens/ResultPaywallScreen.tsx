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

import ahoraComparacion400 from '../../assets/avatars/optimized/avatar-ahora-comparacion-400w.webp';
import ahoraComparacion600 from '../../assets/avatars/optimized/avatar-ahora-comparacion-600w.webp';

import objetivoComparacion400 from '../../assets/avatars/optimized/avatar-objetivo-comparacion-400w.webp';
import objetivoComparacion600 from '../../assets/avatars/optimized/avatar-objetivo-comparacion-600w.webp';

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

const CHEVRON_TRAIL_LAYERS = [
  { left: -16, opacity: 0.22 },
  { left: -8, opacity: 0.5 },
  { left: 0, opacity: 1 },
];

function ChevronTrail() {
  return (
    <span className="relative flex-shrink-0 inline-block" style={{ width: 56, height: 40 }}>
      {CHEVRON_TRAIL_LAYERS.map((layer, i) => (
        <i
          key={i}
          className="ti ti-chevrons-right absolute top-0"
          style={{ fontSize: 40, lineHeight: '40px', color: SAGE, opacity: layer.opacity, left: layer.left }}
        ></i>
      ))}
    </span>
  );
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

export default function ResultPaywallScreenComp({ screen }: Props) {
  const { userName, userAge, userGender, answers, selectedPlan, setSelectedPlan, goBack, currentScreen } =
    useQuizStore();
  const [hasTracked, setHasTracked] = useState(false);

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
          ← Voltar
        </button>
      )}

      {/* 1. Comparación "Ahora vs. Tu objetivo" */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl p-5"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center justify-center gap-2">
          <img
            src={ahoraComparacion400}
            srcSet={`${ahoraComparacion400} 400w, ${ahoraComparacion600} 600w`}
            sizes="160px"
            width={160}
            height={213}
            loading="lazy"
            decoding="async"
            alt="Foto de corpo inteiro — estado atual"
            className="flex-1 max-w-[160px] aspect-[3/4] object-cover object-top rounded-xl"
          />
          <ChevronTrail />
          <img
            src={objetivoComparacion400}
            srcSet={`${objetivoComparacion400} 400w, ${objetivoComparacion600} 600w`}
            sizes="160px"
            width={160}
            height={213}
            loading="lazy"
            decoding="async"
            alt="Foto de corpo inteiro — objetivo"
            className="flex-1 max-w-[160px] aspect-[3/4] object-cover object-top rounded-xl"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-secondary">Agora</p>
            <div className="w-full space-y-2">
              <div>
                <p className="text-xs text-secondary mb-1">Nível de equilíbrio</p>
                <LevelBar filled={1} />
              </div>
              <div>
                <p className="text-xs text-secondary">
                  Grasa corporal: <span className="font-semibold text-main">28%</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: SAGE }}>
              Seu objetivo
            </p>
            <div className="w-full space-y-2">
              <div>
                <p className="text-xs text-secondary mb-1">Nível de equilíbrio</p>
                <LevelBar filled={4} />
              </div>
              <div>
                <p className="text-xs text-secondary">
                  Grasa corporal: <span className="font-semibold text-main">25-26%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-secondary/70 text-center mt-4">
          Os resultados variam de pessoa para pessoa e da constância na prática.
        </p>
      </motion.div>

      {/* 2. Headline + resumen del plan */}
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
        <h2 className="text-2xl font-bold text-main">Vantagens</h2>
        <p className="text-sm text-secondary leading-relaxed max-w-sm mx-auto">
          Nosso algoritmo inteligente monta um plano de treinos personalizado a partir dos seus dados e objetivos.
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

      {/* 6. Testimonios */}
      <TestimonialsSection />

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
