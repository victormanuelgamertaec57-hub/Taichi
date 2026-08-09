import { motion } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import { accentColor } from '../../utils/colors';
import type { InfoScreen } from '../../types/quiz';

// ─── Static image imports for optimized WebP variants ─────────────────────────
import confianza400 from '../../assets/avatars/optimized/avatar-closeup-confianza-400w.webp';
import confianza600 from '../../assets/avatars/optimized/avatar-closeup-confianza-600w.webp';
import confianza800 from '../../assets/avatars/optimized/avatar-closeup-confianza-800w.webp';

import noSolo400 from '../../assets/avatars/optimized/avatar-masculino-no-solo-400w.webp';
import noSolo600 from '../../assets/avatars/optimized/avatar-masculino-no-solo-600w.webp';
import noSolo800 from '../../assets/avatars/optimized/avatar-masculino-no-solo-800w.webp';

import estres400 from '../../assets/avatars/optimized/avatar-antes-estres-banner-400w.webp';
import estres600 from '../../assets/avatars/optimized/avatar-antes-estres-banner-600w.webp';
import estres800 from '../../assets/avatars/optimized/avatar-antes-estres-banner-800w.webp';

import hero400 from '../../assets/avatars/optimized/avatar-hero-cloud-hands-banner-400w.webp';
import hero600 from '../../assets/avatars/optimized/avatar-hero-cloud-hands-banner-600w.webp';
import hero800 from '../../assets/avatars/optimized/avatar-hero-cloud-hands-banner-800w.webp';

import articulaciones400 from '../../assets/avatars/optimized/avatar-masculino-articulaciones-400w.webp';
import articulaciones600 from '../../assets/avatars/optimized/avatar-masculino-articulaciones-600w.webp';
import articulaciones800 from '../../assets/avatars/optimized/avatar-masculino-articulaciones-800w.webp';

import movimiento2_400 from '../../assets/avatars/optimized/avatar-masculino-movimiento-2-400w.webp';
import movimiento2_600 from '../../assets/avatars/optimized/avatar-masculino-movimiento-2-600w.webp';
import movimiento2_800 from '../../assets/avatars/optimized/avatar-masculino-movimiento-2-800w.webp';

import grasaAbdominalPng from '../../assets/avatars/grasa-abdominal-transparente.png';

interface ImageMapItem {
  w400: string;
  w600?: string;
  w800?: string;
  alt: string;
  isTransparent?: boolean;
}

const IMAGE_MAP: Record<string, ImageMapItem> = {
  'avatar-closeup-confianza': {
    w400: confianza400,
    w600: confianza600,
    w800: confianza800,
    alt: 'Mujer de 60 años sonriendo con confianza para la cámara',
  },
  'avatar-closeup-confianza-male': {
    w400: noSolo400,
    w600: noSolo600,
    w800: noSolo800,
    alt: 'Hombre de 60 años sonriendo con confianza para la cámara',
  },
  'avatar-antes-estres': {
    w400: estres400,
    w600: estres600,
    w800: estres800,
    alt: 'Mujer de 60 años con expresión de cansancio y tensión, sentada en su silla',
  },
  'avatar-masculino-articulaciones': {
    w400: articulaciones400,
    w600: articulaciones600,
    w800: articulaciones800,
    alt: 'Hombre maduro ejercitando sus articulaciones en la silla',
  },
  'avatar-hero-cloud-hands': {
    w400: hero400,
    w600: hero600,
    w800: hero800,
    alt: 'Mujer practicando Tai Chi en la silla con los brazos al frente',
  },
  'avatar-masculino-movimiento-2': {
    w400: movimiento2_400,
    w600: movimiento2_600,
    w800: movimiento2_800,
    alt: 'Hombre practicando el método FirmMe de Tai Chi en silla',
  },
  'grasa-abdominal-transparente': {
    w400: grasaAbdominalPng,
    alt: 'Hombre mostrando resultados de reducción de grasa abdominal con Tai Chi',
    isTransparent: true,
  },
};

interface Props {
  screen: InfoScreen;
}

export default function InfoScreenComp({ screen }: Props) {
  const { userName, userAge, userGender, goNext, goBack, currentScreen } = useQuizStore();
  const genderKey: 'female' | 'male' = userGender === 'male' ? 'male' : 'female';

  const rawHeadline = typeof screen.headline === 'object' && screen.headline !== null && 'female' in screen.headline
    ? screen.headline[genderKey]
    : screen.headline;

  const rawSubtext = typeof screen.subtext === 'object' && screen.subtext !== null && 'female' in screen.subtext
    ? screen.subtext[genderKey]
    : screen.subtext;

  const rawBgImage = typeof screen.backgroundImage === 'object' && screen.backgroundImage !== null && 'female' in screen.backgroundImage
    ? screen.backgroundImage[genderKey]
    : screen.backgroundImage;

  const rawChecklist = typeof screen.checklist === 'object' && screen.checklist !== null && 'female' in screen.checklist
    ? screen.checklist[genderKey]
    : screen.checklist;

  const headline = interpolate(rawHeadline as string, userName, userAge, userGender);
  const subtext = rawSubtext ? interpolate(rawSubtext as string, userName, userAge, userGender) : '';

  // Resolve dynamic male image for the social proof screen (screen 4)
  let imgKey = rawBgImage as string;
  if (userGender === 'male' && imgKey === 'avatar-closeup-confianza') {
    imgKey = 'avatar-closeup-confianza-male';
  }
  const imgData = IMAGE_MAP[imgKey];

  return (
    <div className="relative flex flex-col min-h-[580px] bg-warm overflow-hidden rounded-3xl border border-border">
      
      {/* 1. Background image area */}
      {imgData?.isTransparent ? (
        <div 
          className="relative h-60 sm:h-64 w-full flex-shrink-0 flex items-end justify-center pt-4 pb-1 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8eef8 100%)' }}
        >
          {imgData && (
            <img
              src={imgData.w400}
              alt={imgData.alt}
              loading="eager"
              decoding="async"
              className="h-full w-auto object-contain object-bottom max-h-full"
            />
          )}

          {/* Floating Back Button */}
          {currentScreen > 1 && (
            <button 
              onClick={goBack} 
              className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-border text-main backdrop-blur-xs transition hover:bg-white hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
              aria-label="Volver"
            >
              <i className="ti ti-arrow-left text-lg"></i>
            </button>
          )}
        </div>
      ) : (
        <div className="relative h-72 sm:h-80 w-full overflow-hidden flex-shrink-0">
          {imgData && (
            <img
              src={imgData.w400}
              srcSet={imgData.w600 ? `${imgData.w400} 400w, ${imgData.w600} 600w, ${imgData.w800} 800w` : undefined}
              sizes="(max-width: 480px) 100vw, 500px"
              width={400}
              height={320}
              loading="eager" // Info screens are important hero assets
              decoding="async"
              alt={imgData.alt}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 25%' }}
            />
          )}
          {/* Gradient overlay - starts fading below the face (70%), fully white at bottom (100%) */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, transparent 70%, var(--color-warm) 100%)'
            }}
          />

          {/* Floating Back Button */}
          {currentScreen > 1 && (
            <button 
              onClick={goBack} 
              className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-border text-main backdrop-blur-xs transition hover:bg-white hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
              aria-label="Volver"
            >
              <i className="ti ti-arrow-left text-lg"></i>
            </button>
          )}
        </div>
      )}

      {/* Content wrapper */}
      <div className="flex-grow px-6 pb-8 pt-2 flex flex-col gap-5 z-2">
        {/* 2. Headline & 3. Subtitle */}
        <div className="space-y-1 text-center sm:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[20px] font-medium text-main leading-tight"
            style={{ fontWeight: 500 }}
          >
            {headline}
          </motion.h2>
          {subtext && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="text-[14px] text-secondary leading-relaxed"
            >
              {subtext}
            </motion.p>
          )}
        </div>

        {/* 4. Checklist (No Emojis, Tabler Icons in 28px circles) */}
        <div className="flex-grow flex flex-col gap-3">
          {rawChecklist.map((item, idx) => {
            const { fg, bg } = accentColor(idx);
            return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.1 + idx * 0.08 }}
              className="flex items-start gap-3.5"
            >
              {/* Icon Circle (28px) */}
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: bg, color: fg }}
              >
                <i className={`${item.icon} text-[15px]`} style={{ fontSize: '15px' }}></i>
              </div>

              {/* Checklist text (max 2 lines) */}
              <p className="text-[15px] text-main font-normal leading-snug pt-0.5 max-w-[85%]">
                {interpolate(item.text, userName, userAge, userGender)}
              </p>
            </motion.div>
            );
          })}
        </div>

        {/* 5. Solid Terracota CTA Button (radius 14px, padding 15px) */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          onClick={goNext}
          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-[14px] p-[15px] shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] text-lg cursor-pointer"
        >
          <span>{screen.ctaLabel}</span>
        </motion.button>
      </div>

    </div>
  );
}
