import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import { trackPixelEvent } from '../../utils/pixel';

// ─── Optimized WebP images (3 sizes each) ─────────────────────────────────────
// Using static imports so Vite/imagetools can process them at build time.
// srcset serves the right size per viewport; explicit width/height prevents CLS.

import img4049_400 from '../../assets/avatars/optimized/avatar-edad-40-49-400w.webp';
import img4049_600 from '../../assets/avatars/optimized/avatar-edad-40-49-600w.webp';
import img4049_800 from '../../assets/avatars/optimized/avatar-edad-40-49-800w.webp';

import img5059_400 from '../../assets/avatars/optimized/avatar-edad-50-59-400w.webp';
import img5059_600 from '../../assets/avatars/optimized/avatar-edad-50-59-600w.webp';
import img5059_800 from '../../assets/avatars/optimized/avatar-edad-50-59-800w.webp';

import img6069_400 from '../../assets/avatars/optimized/avatar-edad-60-69-400w.webp';
import img6069_600 from '../../assets/avatars/optimized/avatar-edad-60-69-600w.webp';
import img6069_800 from '../../assets/avatars/optimized/avatar-edad-60-69-800w.webp';

import img70_400 from '../../assets/avatars/optimized/avatar-edad-70mas-400w.webp';
import img70_600 from '../../assets/avatars/optimized/avatar-edad-70mas-600w.webp';
import img70_800 from '../../assets/avatars/optimized/avatar-edad-70mas-800w.webp';

// ─── Age card data ─────────────────────────────────────────────────────────────

interface AgeCard {
  id: string;
  label: string;
  storeLabel: string; // value stored in userAge
  src400: string;
  src600: string;
  src800: string;
  loading: 'eager' | 'lazy';
  alt: string;
}

const AGE_CARDS: AgeCard[] = [
  {
    id: '40-49',
    label: '40 – 49',
    storeLabel: '40-49',
    src400: img4049_400,
    src600: img4049_600,
    src800: img4049_800,
    loading: 'eager',   // first card in viewport — no lazy
    alt: 'Mujer activa de 40 a 49 años practicando tai chi en silla',
  },
  {
    id: '50-59',
    label: '50 – 59',
    storeLabel: '50-59',
    src400: img5059_400,
    src600: img5059_600,
    src800: img5059_800,
    loading: 'lazy',
    alt: 'Mujer activa de 50 a 59 años practicando tai chi en silla',
  },
  {
    id: '60-69',
    label: '60 – 69',
    storeLabel: '60-69',
    src400: img6069_400,
    src600: img6069_600,
    src800: img6069_800,
    loading: 'lazy',
    alt: 'Mujer activa de 60 a 69 años practicando tai chi en silla',
  },
  {
    id: '70+',
    label: '70 +',
    storeLabel: '70+',
    src400: img70_400,
    src600: img70_600,
    src800: img70_800,
    loading: 'lazy',
    alt: 'Mujer activa de más de 70 años practicando tai chi en silla',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function IntroScreen() {
  const { setAnswer, setUserAge, goNext } = useQuizStore();

  function handleSelect(card: AgeCard) {
    setAnswer('userAge', card.id);
    setUserAge(card.storeLabel);
    trackPixelEvent('ViewContent', { content_name: 'Quiz Started', age_range: card.id });
    goNext();
  }

  return (
    <div className="px-4 pt-6 pb-10 flex flex-col gap-5">
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
          Personalizamos tu programa según tu etapa de vida.
        </p>
      </motion.div>

      {/* 2×2 Photo card grid */}
      <div className="grid grid-cols-2 gap-3">
        {AGE_CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.3, ease: 'easeOut' }}
            onClick={() => handleSelect(card)}
            className="age-photo-card group"
            aria-label={`Seleccionar rango de edad ${card.label} años`}
          >
            {/* Photo */}
            <img
              src={card.src400}
              srcSet={`${card.src400} 400w, ${card.src600} 600w, ${card.src800} 800w`}
              sizes="(max-width: 480px) calc(50vw - 24px), 220px"
              width={400}
              height={400}
              loading={card.loading}
              decoding="async"
              alt={card.alt}
              className="age-photo-img"
            />

            {/* Bottom badge */}
            <div className="age-photo-badge">
              <span className="age-photo-label">{card.label}</span>
              <span className="age-photo-arrow">→</span>
            </div>
          </motion.button>
        ))}
      </div>

      <p className="text-xs text-secondary/60 text-center flex items-center justify-center gap-1">
        <i className="ti ti-lock text-xs"></i>
        <span>Tu información es confidencial</span>
      </p>
    </div>
  );
}
