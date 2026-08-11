import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SiApple, SiGoogleplay } from 'react-icons/si';

import { WEEK_1 } from '../data/weekPlan';

import heroCloudHands400 from '../assets/avatars/optimized/avatar-hero-cloud-hands-400w.webp';
import heroCloudHands600 from '../assets/avatars/optimized/avatar-hero-cloud-hands-600w.webp';
import closeupConfianza400 from '../assets/avatars/optimized/avatar-closeup-confianza-400w.webp';

/**
 * Marco de iPhone con apariencia real (iPhone 14/15 Pro style):
 *  - Bezel oscuro casi negro con sutil gradiente
 *  - Esquinas redondeadas grandes (~14% del ancho)
 *  - Dynamic Island (pill negro en el centro superior)
 *  - Botones laterales: volumen a la izquierda, power a la derecha
 *
 * El contenido de pantalla (children) se renderiza sin cambios — solo cambia el marco.
 */
function PhoneFrame({
  children,
  width,
  height,
}: {
  children: ReactNode;
  width: number;
  height: number;
}) {
  const bezelWidth = Math.max(2, width * 0.025);
  const screenRadius = width * 0.105;
  const outerRadius = screenRadius + bezelWidth;
  // Dynamic Island: pill horizontal en la parte superior de la pantalla
  const islandWidth = width * 0.34;
  const islandHeight = width * 0.082;

  return (
    <div
      className="relative shadow-2xl"
      style={{
        width,
        height,
        borderRadius: outerRadius,
        // Gradiente sutil en el marco (no totalmente plano — captura reflejo tipo aluminio)
        background: 'linear-gradient(150deg, #1a1a1c 0%, #0d0d0e 50%, #1f1f22 100%)',
        padding: bezelWidth,
      }}
    >
      {/* Botones laterales — detalles oscuros que sobresalen del marco */}
      {/* Volumen (2 botones a la izquierda) */}
      <div
        className="absolute"
        style={{
          left: -2,
          top: height * 0.18,
          width: 3,
          height: height * 0.06,
          background: '#0a0a0a',
          borderRadius: '2px 0 0 2px',
        }}
      />
      <div
        className="absolute"
        style={{
          left: -2,
          top: height * 0.27,
          width: 3,
          height: height * 0.06,
          background: '#0a0a0a',
          borderRadius: '2px 0 0 2px',
        }}
      />
      {/* Power / Side button (a la derecha) */}
      <div
        className="absolute"
        style={{
          right: -2,
          top: height * 0.24,
          width: 3,
          height: height * 0.1,
          background: '#0a0a0a',
          borderRadius: '0 2px 2px 0',
        }}
      />

      {/* Pantalla */}
      <div
        className="relative w-full h-full overflow-hidden bg-white flex flex-col"
        style={{ borderRadius: screenRadius }}
      >
        {children}

        {/* Dynamic Island — pill negro flotante en el centro superior */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-black"
          style={{
            top: bezelWidth + width * 0.018,
            width: islandWidth,
            height: islandHeight,
            borderRadius: 9999,
            zIndex: 10,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset',
          }}
        />
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-0.5 text-[10px] font-semibold text-main flex-shrink-0">
      <span>9:41</span>
      <span className="flex items-center gap-1 text-[11px]">
        <i className="ti ti-antenna-bars-4"></i>
        <i className="ti ti-wifi"></i>
        <i className="ti ti-battery-4"></i>
      </span>
    </div>
  );
}

function CenterPhoneContent() {
  return (
    <div className="flex flex-col h-full">
      <StatusBar />
      <div className="flex-1 overflow-hidden px-4 pb-4 pt-1 flex flex-col gap-2.5">
        <div className="text-center">
          <p className="text-[15px] font-bold text-main leading-tight">Tu plan está listo</p>
          <p className="text-[10px] text-secondary mt-1 leading-snug">
            Comienza con algo simple. ¡Vuelve cada semana para seguir avanzando!
          </p>
        </div>
        <div className="rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={heroCloudHands400}
            srcSet={`${heroCloudHands400} 400w, ${heroCloudHands600} 600w`}
            sizes="170px"
            width={170}
            height={128}
            loading="lazy"
            decoding="async"
            alt="Vista previa del módulo: Equilibrio en tu silla"
            className="w-full aspect-[4/3] object-cover"
          />
        </div>
        <div>
          <p className="text-[13px] font-bold text-main">Equilibrio en tu silla</p>
          <p className="text-[10px] text-secondary leading-snug mt-0.5">
            Mejora tu equilibrio y fuerza con una rutina sentada para principiantes.
          </p>
        </div>
        <div
          className="mt-auto w-full rounded-full py-2 text-center text-[12px] font-bold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Comenzar mi plan
        </div>
      </div>
    </div>
  );
}

function LeftPhoneContent() {
  return (
    <div className="flex flex-col h-full px-3.5 pt-4 pb-4 gap-3">
      <p className="text-[13px] font-bold text-main">Tu sesión</p>
      <div className="flex gap-2">
        <span
          className="text-[10px] px-2.5 py-1 rounded-full border font-medium text-secondary"
          style={{ borderColor: 'var(--color-border)' }}
        >
          Suave
        </span>
        <span
          className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Media
        </span>
      </div>
      <p className="text-[11px] text-secondary">8 min · Equilibrio</p>
      <div
        className="mt-auto w-full rounded-full py-2 text-center text-[11px] font-bold text-white"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Guardar
      </div>
    </div>
  );
}

function RightPhoneContent() {
  return (
    <div className="flex flex-col h-full px-3.5 pt-4 pb-4 gap-1.5 overflow-hidden">
      <p className="text-[13px] font-bold text-main">Explorar</p>
      <p className="text-[10px] text-secondary -mt-1">Plan de entrenamiento</p>
      <div
        className="relative rounded-lg border p-2 mt-1 overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <p className="text-[11px] font-bold text-main mb-1.5">Semana 1</p>
        <div className="flex flex-col gap-1">
          {WEEK_1.map((row) => (
            <div key={row.day} className="flex items-center justify-between text-[9px] px-1.5 py-1 rounded bg-warm">
              <span className="font-semibold text-main">{row.day}</span>
              <span className="text-secondary">{row.activity}</span>
            </div>
          ))}
        </div>
        <img
          src={closeupConfianza400}
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          alt=""
          aria-hidden="true"
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full object-cover border-2 border-white shadow"
        />
      </div>
    </div>
  );
}

const PHONE_CONTENTS = [LeftPhoneContent, CenterPhoneContent, RightPhoneContent] as const;
const AUTO_ADVANCE_MS = 4000;
const RESUME_DELAY_MS = 8000;
const SWIPE_THRESHOLD_PX = 50;

type Slot = 'left' | 'center' | 'right';

export default function PhoneCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef(0);

  // Auto-advance cada 4s, salvo que esté en pausa (tras interacción manual).
  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % PHONE_CONTENTS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [isPaused]);

  // Limpia el timeout de resume si el componente se desmonta.
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  function handleManualNav(newIndex: number) {
    setActiveIndex(newIndex);
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), RESUME_DELAY_MS);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const delta = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      // swipe right → previous, swipe left → next
      const direction = delta > 0 ? -1 : 1;
      const newIndex = (activeIndex + direction + PHONE_CONTENTS.length) % PHONE_CONTENTS.length;
      handleManualNav(newIndex);
    }
  }

  // Para cada slot (left/center/right), elige qué contenido de phone renderizar
  // según el `activeIndex`. El slot del centro siempre es el activo.
  function getPhoneForSlot(slot: Slot) {
    if (slot === 'left') return PHONE_CONTENTS[(activeIndex - 1 + PHONE_CONTENTS.length) % PHONE_CONTENTS.length];
    if (slot === 'center') return PHONE_CONTENTS[activeIndex];
    return PHONE_CONTENTS[(activeIndex + 1) % PHONE_CONTENTS.length];
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="-mx-5 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-center">
          {(['left', 'center', 'right'] as const).map((slot) => {
            const isCenter = slot === 'center';
            const PhoneComponent = getPhoneForSlot(slot);
            return (
              <motion.div
                key={slot}
                className="relative flex-shrink-0"
                style={{
                  marginRight: isCenter ? 0 : -42,
                  marginLeft: isCenter ? 0 : -42,
                  zIndex: isCenter ? 10 : 0,
                }}
                initial={false}
                animate={{
                  scale: isCenter ? 1 : 0.82,
                  opacity: isCenter ? 1 : 0.55,
                  y: isCenter ? 0 : 10,
                  filter: isCenter ? 'blur(0px)' : 'blur(1.5px)',
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <PhoneFrame width={isCenter ? 200 : 172} height={isCenter ? 396 : 372}>
                  <PhoneComponent />
                </PhoneFrame>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dots indicator — clickeables, pausan auto-advance */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {PHONE_CONTENTS.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleManualNav(i)}
              aria-label={`Ir a la pantalla ${i + 1}`}
              aria-pressed={isActive}
              className="rounded-full"
              style={{
                width: isActive ? 22 : 8,
                height: 8,
                backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                transition: 'width 0.3s ease, background-color 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          );
        })}
      </div>

      <h3 className="text-xl font-bold text-main text-center mt-5 leading-snug max-w-xs">
        Muévete con confianza, recupera tu independencia
      </h3>

      {/* Rating ilustrativo — actualizar con datos reales cuando existan */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-4">
        <div className="flex items-center gap-1.5">
          <span className="flex gap-0.5" style={{ color: '#D4A24C' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <i key={i} className="text-base" style={{ lineHeight: 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
                </svg>
              </i>
            ))}
          </span>
          <span className="text-sm font-semibold text-main">4,8 de 5</span>
        </div>
        <div className="flex items-center gap-1.5 text-secondary">
          <SiApple size={18} color="#000000" />
          <span className="text-sm font-medium">App Store</span>
        </div>
        <div className="flex items-center gap-1.5 text-secondary">
          <SiGoogleplay size={18} />
          <span className="text-sm font-medium">Google Play</span>
        </div>
      </div>
    </div>
  );
}
