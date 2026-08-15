import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import type { GenderScreen } from '../../types/quiz';

// ─── WebP variants (LCP-critical: 5-20KB vs 99-354KB originals) ──────────────
import femaleAvatar400 from '../../assets/avatars/optimized/avatar-femenino-manos-juntas-400w.webp';
import femaleAvatar600 from '../../assets/avatars/optimized/avatar-femenino-manos-juntas-600w.webp';
import femaleAvatar800 from '../../assets/avatars/optimized/avatar-femenino-manos-juntas-800w.webp';
import maleAvatar400 from '../../assets/avatars/optimized/avatar-masculino-manos-juntas-400w.webp';
import maleAvatar600 from '../../assets/avatars/optimized/avatar-masculino-manos-juntas-600w.webp';
import maleAvatar800 from '../../assets/avatars/optimized/avatar-masculino-manos-juntas-800w.webp';

interface Props {
  screen: GenderScreen;
}

const INDIGO = '#5C7AE0';

export default function GenderScreenComp({ screen }: Props) {
  const { setAnswer, setUserGender, goNext, goBack, currentScreen } = useQuizStore();
  const [selected, setSelected] = useState<'female' | 'male' | null>(null);

  function handleSelect(gender: 'female' | 'male') {
    setSelected(gender);
    setUserGender(gender);
    setAnswer('userGender', gender);
    
    // Auto-advance with brief visual feedback delay
    setTimeout(() => {
      goNext();
    }, 250);
  }

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-6 bg-warm min-h-[500px]">
      {/* Back button */}
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn self-start">
          ← Volver
        </button>
      )}

      {/* Headline */}
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-main leading-snug">{screen.headline}</h2>
        <p className="text-base text-secondary">{screen.subtext}</p>
      </div>

      {/* Choice Grid - side-by-side even on mobile */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        {screen.options.map((opt, i) => {
          const gender = opt.id as 'female' | 'male';
          const isSelected = selected === gender;
          
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.3, ease: 'easeOut' }}
              onClick={() => handleSelect(gender)}
              aria-label={`Seleccionar sexo biológico ${opt.label}`}
              className="relative rounded-2xl overflow-hidden cursor-pointer bg-white transition-all duration-150 active:scale-[0.98] min-h-[180px] shadow-sm"
              style={{
                aspectRatio: '3 / 4',
                border: isSelected ? `3px solid ${INDIGO}` : '3px solid var(--color-border)',
                willChange: 'transform, border-color',
              }}
            >
              {/* Photo background — LCP candidate: WebP srcset + fetchpriority=high */}
              {(() => {
                const isFemale = gender === 'female';
                const src400 = isFemale ? femaleAvatar400 : maleAvatar400;
                const src600 = isFemale ? femaleAvatar600 : maleAvatar600;
                const src800 = isFemale ? femaleAvatar800 : maleAvatar800;
                return (
                  <img
                    src={src600}
                    srcSet={`${src400} 400w, ${src600} 600w, ${src800} 800w`}
                    sizes="(max-width: 640px) 50vw, 320px"
                    width={600}
                    height={800}
                    alt={opt.label}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className={`absolute inset-0 w-full h-full object-cover ${
                      isFemale ? 'object-[center_20%]' : 'object-[center_15%]'
                    }`}
                  />
                );
              })()}

              {/* Bottom badge - gradient azul indigo */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: `linear-gradient(to bottom, transparent 0%, color-mix(in srgb, ${INDIGO} 85%, black) 100%)`,
                  padding: '28px 12px 12px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                }}
              >
                <div className="flex flex-col gap-0.5 text-left">
                  <span
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      letterSpacing: '0.01em',
                      lineHeight: 1.1,
                      textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    {opt.label}
                  </span>
                  {opt.subtext && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.85)',
                        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }}
                    >
                      {opt.subtext}
                    </span>
                  )}
                </div>
                
                {/* Blue circular arrow icon matching age screen */}
                <span
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: INDIGO,
                    border: '1.5px solid rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    color: '#ffffff',
                    flexShrink: 0,
                    fontWeight: 'bold',
                    boxShadow: `0 2px 8px ${INDIGO}50`,
                  }}
                >
                  →
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-secondary/60 text-center mt-auto flex items-center justify-center gap-1">
        <i className="ti ti-lock text-xs"></i>
        <span>Tu información es confidencial</span>
      </p>
    </div>
  );
}
