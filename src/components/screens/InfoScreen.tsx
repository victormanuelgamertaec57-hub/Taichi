import { motion } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import { accentColor } from '../../utils/colors';
import type { InfoScreen } from '../../types/quiz';

// ─── Static image imports for optimized WebP variants ─────────────────────────
import confianza400 from '../../assets/avatars/optimized/avatar-closeup-confianza-400w.webp';
import confianza600 from '../../assets/avatars/optimized/avatar-closeup-confianza-600w.webp';
import confianza800 from '../../assets/avatars/optimized/avatar-closeup-confianza-800w.webp';

import estres400 from '../../assets/avatars/optimized/avatar-antes-estres-banner-400w.webp';
import estres600 from '../../assets/avatars/optimized/avatar-antes-estres-banner-600w.webp';
import estres800 from '../../assets/avatars/optimized/avatar-antes-estres-banner-800w.webp';

import hero400 from '../../assets/avatars/optimized/avatar-hero-cloud-hands-banner-400w.webp';
import hero600 from '../../assets/avatars/optimized/avatar-hero-cloud-hands-banner-600w.webp';
import hero800 from '../../assets/avatars/optimized/avatar-hero-cloud-hands-banner-800w.webp';

const IMAGE_MAP: Record<string, { w400: string; w600: string; w800: string; alt: string }> = {
  'avatar-closeup-confianza': {
    w400: confianza400,
    w600: confianza600,
    w800: confianza800,
    alt: 'Mujer de 60 años sonriendo con confianza a la cámara',
  },
  'avatar-antes-estres': {
    w400: estres400,
    w600: estres600,
    w800: estres800,
    alt: 'Mujer de 60 años con gesto de cansancio y tensión, sentada en su silla',
  },
  'avatar-hero-cloud-hands': {
    w400: hero400,
    w600: hero600,
    w800: hero800,
    alt: 'Mujer practicando Tai Chi en silla con los brazos al frente',
  },
};

interface Props {
  screen: InfoScreen;
}

export default function InfoScreenComp({ screen }: Props) {
  const { userName, userAge, userGender, goNext, goBack, currentScreen } = useQuizStore();

  const headline = interpolate(screen.headline, userName, userAge, userGender);
  const subtext = screen.subtext ? interpolate(screen.subtext, userName, userAge, userGender) : '';
  const imgData = IMAGE_MAP[screen.backgroundImage];

  return (
    <div className="relative flex flex-col min-h-[580px] bg-warm overflow-hidden rounded-3xl border border-border">
      
      {/* 1. Background image area with smooth fade-to-cream bottom gradient */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden flex-shrink-0">
        {imgData && (
          <img
            src={imgData.w400}
            srcSet={`${imgData.w400} 400w, ${imgData.w600} 600w, ${imgData.w800} 800w`}
            sizes="(max-width: 480px) 100vw, 500px"
            width={400}
            height={280}
            loading="eager" // Info screens are important hero assets
            decoding="async"
            alt={imgData.alt}
            className="w-full h-full object-cover object-center"
          />
        )}
        {/* Gradient overlay - starts fading from 60%, fully cream at bottom (100%) */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, var(--color-warm) 98%, var(--color-warm) 100%)'
          }}
        />

        {/* Floating Back Button */}
        {currentScreen > 1 && (
          <button 
            onClick={goBack} 
            className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-border text-main backdrop-blur-xs transition hover:bg-white hover:scale-105 active:scale-95 shadow-xs"
            aria-label="Volver atrás"
          >
            <i className="ti ti-arrow-left text-lg"></i>
          </button>
        )}
      </div>

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
          {screen.checklist.map((item, idx) => {
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
