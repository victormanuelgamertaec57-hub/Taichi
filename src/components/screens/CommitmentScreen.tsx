import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import type { CommitmentScreen } from '../../types/quiz';

import heroCloudHands400 from '../../assets/avatars/optimized/avatar-hero-cloud-hands-400w.webp';
import heroCloudHands600 from '../../assets/avatars/optimized/avatar-hero-cloud-hands-600w.webp';

interface Props {
  screen: CommitmentScreen;
}

const SAGE = '#5B8A72';

/**
 * Psychological-commitment screen: every option advances the funnel — this
 * exists to generate commitment, not to filter users out.
 */
export default function CommitmentScreenComp({ screen }: Props) {
  const { userName, userAge, userGender, setAnswer, goNext, goBack, currentScreen } = useQuizStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const headline = interpolate(screen.headline, userName, userAge, userGender);
  // Highlight the word "lista" in sage green, matching the rest of the headline.
  const parts = headline.split(/(lista)/i);

  function handleSelect(optId: string) {
    if (selectedId) return;
    setSelectedId(optId);
    setAnswer(screen.answerKey!, optId);
    setTimeout(() => goNext(), 450);
  }

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-6">
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn">
          ← Atrás
        </button>
      )}

      <div className="flex flex-col items-center gap-3 text-center">
        {/* The instructor's photo — makes the question feel like it's coming
            from her directly, not a generic form. */}
        <motion.img
          src={heroCloudHands400}
          srcSet={`${heroCloudHands400} 400w, ${heroCloudHands600} 600w`}
          sizes="88px"
          width={88}
          height={88}
          loading="lazy"
          decoding="async"
          alt="Tu instructora de FirmMe"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-[88px] h-[88px] rounded-full object-cover object-top shadow-md"
          style={{ border: `3px solid ${SAGE}` }}
        />

        <motion.span
          initial={{ opacity: 0, y: -6, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1, type: 'spring', stiffness: 320, damping: 16 }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-base font-extrabold shadow-sm"
          style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}
        >
          🎉 {screen.badge}
        </motion.span>

        <h2 className="text-2xl font-bold text-main leading-snug">
          {parts.map((part, i) =>
            /^lista$/i.test(part) ? (
              <span key={i} style={{ color: 'var(--color-primary)' }}>
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {screen.options.map((opt, i) => {
          const isSelected = selectedId === opt.id;
          const isOtherSelected = selectedId !== null && !isSelected;

          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: isOtherSelected ? 0.45 : 1,
                y: 0,
                scale: isSelected ? [1, 1.04, 1] : 1,
              }}
              transition={{
                delay: selectedId ? 0 : i * 0.08,
                duration: isSelected ? 0.35 : 0.25,
                ease: 'easeOut',
              }}
              whileTap={!selectedId ? { scale: 0.98 } : undefined}
              onClick={() => handleSelect(opt.id)}
              disabled={selectedId !== null}
              className={`quiz-option-btn ${isSelected ? 'selected' : ''}`}
            >
              {opt.icon && (
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#E8F0E9] flex items-center justify-center text-primary">
                  <i className={`${opt.icon} text-lg`}></i>
                </span>
              )}
              <span className="text-lg font-semibold text-main text-left flex-1">{opt.label}</span>
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: SAGE }}
                  >
                    <i className="ti ti-check text-base"></i>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
