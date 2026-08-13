import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import { trackPixelEvent } from '../../utils/pixel';
import type { Gender } from '../../utils/gender';

// ─── Age photos (WebP optimizados) ──────────────────────────────────────────
import imgFemale4049 from '../../assets/avatars/optimized/avatar-edad-40-49-400w.webp';
import imgFemale5059 from '../../assets/avatars/optimized/avatar-edad-50-59-400w.webp';
import imgFemale6069 from '../../assets/avatars/optimized/avatar-edad-60-69-400w.webp';
import imgFemale70 from '../../assets/avatars/optimized/avatar-edad-70mas-400w.webp';
import imgMale4049 from '../../assets/avatars/optimized/avatar-masculino-40-49-400w.webp';
import imgMale5059 from '../../assets/avatars/optimized/avatar-masculino-50-59-400w.webp';
import imgMale6069 from '../../assets/avatars/optimized/avatar-masculino-60-69-400w.webp';
import imgMale70 from '../../assets/avatars/optimized/avatar-masculino-70+-400w.webp';

// ─── Color token: periwinkle indigo vívido ─────────────────────────────────
const INDIGO = '#5C7AE0';

// ─── Age card data ─────────────────────────────────────────────────────────

interface AgeCard {
  id: string;
  label: string;
  storeLabel: string;
  src: string;
  loading: 'eager' | 'lazy';
  alt: string;
}

const AGE_CARDS_BY_GENDER: Record<'female' | 'male', AgeCard[]> = {
  female: [
    {
      id: '30-39',
      label: '30 – 39',
      storeLabel: '30-39',
      src: imgFemale4049,
      loading: 'lazy',
      alt: 'Mujer activa de 30 a 39 años practicando tai chi en la silla',
    },
    {
      id: '40-49',
      label: '40 – 49',
      storeLabel: '40-49',
      src: imgFemale4049,
      loading: 'lazy',
      alt: 'Mujer activa de 40 a 49 años practicando tai chi en la silla',
    },
    {
      id: '50-59',
      label: '50 – 59',
      storeLabel: '50-59',
      src: imgFemale5059,
      loading: 'lazy',
      alt: 'Mujer activa de 50 a 59 años practicando tai chi en la silla',
    },
    {
      id: '60-69',
      label: '60 – 69',
      storeLabel: '60-69',
      src: imgFemale6069,
      loading: 'lazy',
      alt: 'Mujer activa de 60 a 69 años practicando tai chi en la silla',
    },
    {
      id: '70+',
      label: '70 +',
      storeLabel: '70+',
      src: imgFemale70,
      loading: 'lazy',
      alt: 'Mujer activa con más de 70 años practicando tai chi en la silla',
    },
  ],
  male: [
    {
      id: '30-39',
      label: '30 – 39',
      storeLabel: '30-39',
      src: imgMale4049,
      loading: 'lazy',
      alt: 'Hombre activo de 30 a 39 años practicando tai chi en la silla',
    },
    {
      id: '40-49',
      label: '40 – 49',
      storeLabel: '40-49',
      src: imgMale4049,
      loading: 'lazy',
      alt: 'Hombre activo de 40 a 49 años practicando tai chi en la silla',
    },
    {
      id: '50-59',
      label: '50 – 59',
      storeLabel: '50-59',
      src: imgMale5059,
      loading: 'lazy',
      alt: 'Hombre activo de 50 a 59 años practicando tai chi en la silla',
    },
    {
      id: '60-69',
      label: '60 – 69',
      storeLabel: '60-69',
      src: imgMale6069,
      loading: 'lazy',
      alt: 'Hombre activo de 60 a 69 años practicando tai chi en la silla',
    },
    {
      id: '70+',
      label: '70 +',
      storeLabel: '70+',
      src: imgMale70,
      loading: 'lazy',
      alt: 'Hombre activo con más de 70 años practicando tai chi en la silla',
    },
  ],
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function IntroScreen() {
  const { setAnswer, setUserAge, userGender, goNext, goBack, currentScreen } = useQuizStore();
  const genderKey: 'female' | 'male' = (userGender as Gender) === 'male' ? 'male' : 'female';
  const AGE_CARDS = AGE_CARDS_BY_GENDER[genderKey];

  function handleSelect(card: AgeCard) {
    setAnswer('userAge', card.id);
    setUserAge(card.storeLabel);
    trackPixelEvent('ViewContent', { content_name: 'Quiz Started', age_range: card.id });
    goNext();
  }

  return (
    <div className="px-4 pt-6 pb-10 flex flex-col gap-5" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Back button */}
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn self-start">
          ← Volver
        </button>
      )}

      {/* Header copy */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center space-y-1.5"
      >
        <h1 className="text-3xl font-bold text-main leading-tight">
          ¿Cuántos años tienes?
        </h1>
        <p className="text-base text-secondary leading-relaxed max-w-sm mx-auto">
          Personalizamos tu programa de acuerdo con tu etapa de vida.
        </p>
      </motion.div>

      {/* Photo card grid — 2 columnas; con 5 tarjetas, la última ocupa el
          ancho de fila completo pero se acota al ancho de una columna y se
          centra, para no verse estirada. */}
      <div className="grid grid-cols-2 gap-3">
        {AGE_CARDS.map((card, i) => {
          const isLastOdd = AGE_CARDS.length % 2 === 1 && i === AGE_CARDS.length - 1;
          return (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.3, ease: 'easeOut' }}
            onClick={() => handleSelect(card)}
            aria-label={`Seleccionar rango de edad ${card.label} años`}
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              aspectRatio: '3 / 4',
              cursor: 'pointer',
              border: `3px solid ${INDIGO}`,
              backgroundColor: '#F5F5F5',
              transition: 'transform 120ms ease, box-shadow 150ms ease',
              minHeight: '44px',
              ...(isLastOdd
                ? { gridColumn: '1 / -1', justifySelf: 'center', width: 'calc(50% - 6px)' }
                : {}),
            }}
          >
            {/* Photo */}
            <img
              src={card.src}
              width={400}
              height={533}
              loading={card.loading}
              decoding="async"
              alt={card.alt}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                display: 'block',
              }}
            />

            {/* Bottom badge - gradient azul indigo */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: `linear-gradient(to bottom, transparent 0%, color-mix(in srgb, ${INDIGO} 75%, black) 100%)`,
                padding: '28px 14px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'padding-bottom 150ms ease',
              }}
            >
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '0.01em',
                  lineHeight: 1,
                  textShadow: '0 1px 4px rgba(0,0,0,0.25)',
                }}
              >
                {card.label}
              </span>
              {/* Flecha circular azul */}
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

      <p className="text-xs text-secondary/60 text-center flex items-center justify-center gap-1">
        <i className="ti ti-lock text-xs"></i>
        <span>Tu información es confidencial</span>
      </p>
    </div>
  );
}
