import type { ReactNode } from 'react';
import { SiApple, SiGoogleplay } from 'react-icons/si';

import { WEEK_1 } from '../data/weekPlan';

import heroCloudHands400 from '../assets/avatars/optimized/avatar-hero-cloud-hands-400w.webp';
import heroCloudHands600 from '../assets/avatars/optimized/avatar-hero-cloud-hands-600w.webp';
import closeupConfianza400 from '../assets/avatars/optimized/avatar-closeup-confianza-400w.webp';

const SAGE = '#5B8A72';
const BEZEL = '#2C3532';

function PhoneFrame({
  children,
  width,
  height,
}: {
  children: ReactNode;
  width: number;
  height: number;
}) {
  return (
    <div className="relative rounded-[2rem] p-1.5 shadow-lg" style={{ backgroundColor: BEZEL, width, height }}>
      <div className="w-full h-full rounded-[1.6rem] overflow-hidden bg-white flex flex-col">{children}</div>
      <div
        className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 rounded-b-xl"
        style={{ backgroundColor: BEZEL }}
      />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-3 pt-2.5 pb-0.5 text-[10px] font-semibold text-main flex-shrink-0">
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
            Empieza con algo sencillo. ¡Vuelve cada semana para seguir avanzando!
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
          style={{ backgroundColor: SAGE }}
        >
          Empezar mi plan
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
          style={{ backgroundColor: SAGE }}
        >
          Media
        </span>
      </div>
      <p className="text-[11px] text-secondary">8 min · Equilibrio</p>
      <div
        className="mt-auto w-full rounded-full py-2 text-center text-[11px] font-bold text-white"
        style={{ backgroundColor: SAGE }}
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

export default function PhoneCarousel() {
  return (
    <div className="flex flex-col items-center">
      <div className="-mx-5 overflow-hidden">
        <div className="flex items-center justify-center">
          <div
            className="relative z-0 flex-shrink-0"
            style={{
              marginRight: -42,
              transform: 'scale(0.82) translateY(10px)',
              opacity: 0.55,
              filter: 'blur(1.5px)',
            }}
          >
            <PhoneFrame width={172} height={372}>
              <LeftPhoneContent />
            </PhoneFrame>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <PhoneFrame width={200} height={396}>
              <CenterPhoneContent />
            </PhoneFrame>
          </div>
          <div
            className="relative z-0 flex-shrink-0"
            style={{
              marginLeft: -42,
              transform: 'scale(0.82) translateY(10px)',
              opacity: 0.55,
              filter: 'blur(1.5px)',
            }}
          >
            <PhoneFrame width={172} height={372}>
              <RightPhoneContent />
            </PhoneFrame>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SAGE }} />
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-border)' }} />
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>

      <h3 className="text-xl font-bold text-main text-center mt-5 leading-snug max-w-xs">
        Muévete con confianza, recupera tu independencia
      </h3>

      {/* Rating ilustrativo — actualizar con datos reales cuando existan */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-4">
        <div className="flex items-center gap-1.5">
          <span className="flex gap-0.5" style={{ color: '#D4A24C' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <i key={i} className="ti ti-star text-base"></i>
            ))}
          </span>
          <span className="text-sm font-semibold text-main">4.8 de 5</span>
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
