import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import type { QuestionScreen } from '../../types/quiz';
import InfoCard from '../InfoCard';

interface Props {
  screen: QuestionScreen;
}

export default function QuestionScreenComp({ screen }: Props) {
  const { answers, userName, userAge, userGender, setAnswer, goNext, goTo, goBack, currentScreen } =
    useQuizStore();
  const [selected, setSelected] = useState<string[]>(
    () => {
      const existing = answers[screen.answerKey!];
      if (Array.isArray(existing)) return existing;
      if (typeof existing === 'string') return [existing];
      return [];
    }
  );

  const headline = interpolate(screen.headline, userName, userAge, userGender);
  const subtext = screen.subtext ? interpolate(screen.subtext, userName, userAge, userGender) : undefined;

  function handleSelect(optId: string) {
    if (screen.multiSelect) {
      // Toggle selection
      setSelected((prev) => {
        // "none" is exclusive
        if (optId === 'none') return ['none'];
        const withoutNone = prev.filter((id) => id !== 'none');
        if (withoutNone.includes(optId)) {
          return withoutNone.filter((id) => id !== optId);
        }
        return [...withoutNone, optId];
      });
    } else {
      setAnswer(screen.answerKey!, optId);
      if (screen.autoAdvance) {
        const opt = screen.options.find((o) => o.id === optId);
        setTimeout(() => {
          if (opt?.skipNextScreen) {
            goTo(currentScreen + 2);
          } else {
            goNext();
          }
        }, 150);
      } else {
        setSelected([optId]);
      }
    }
  }

  function handleContinue() {
    if (screen.multiSelect) {
      setAnswer(screen.answerKey!, selected);
    }
    goNext();
  }

  const showContinueBtn = screen.multiSelect || !screen.autoAdvance;

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-6">
      {/* Back button */}
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn">
          ← Volver
        </button>
      )}

      {/* Headline */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-main leading-snug">{headline}</h2>
        {subtext && <p className="text-base text-secondary">{subtext}</p>}
        {screen.multiSelect && (
          <p className="text-sm text-secondary/80 italic">Puedes seleccionar varias opciones</p>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {screen.options.map((opt, i) => {
          const isSelected = selected.includes(opt.id);
          const label = interpolate(opt.label, userName, userAge, userGender);
          const optSubtext = opt.subtext ? interpolate(opt.subtext, userName, userAge, userGender) : undefined;
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
              onClick={() => handleSelect(opt.id)}
              className={`quiz-option-btn ${isSelected ? 'selected' : ''}`}
            >
              {opt.icon ? (
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#E8F0E9] flex items-center justify-center text-primary">
                  <i className={`${opt.icon} text-lg`}></i>
                </span>
              ) : opt.emoji ? (
                <span className="text-2xl">{opt.emoji}</span>
              ) : null}
              <div className="flex flex-col items-start text-left flex-1">
                <span className="text-lg font-semibold text-main">{label}</span>
                {optSubtext && (
                  <span className="text-sm text-secondary">{optSubtext}</span>
                )}
              </div>
              {isSelected && (
                <span className="text-primary text-xl font-bold ml-auto">
                  <i className="ti ti-check"></i>
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Optional context card (e.g. "Meta realista: mejorar tu equilibrio en 4 semanas") */}
      {screen.infoCard && (
        <InfoCard
          icon={screen.infoCard.icon}
          headline={screen.infoCard.headline}
          body={screen.infoCard.body}
          delay={0.2 + screen.options.length * 0.06}
        />
      )}

      {/* Continue button for multi-select */}
      {showContinueBtn && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleContinue}
          disabled={selected.length === 0}
          className="cta-btn disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>{screen.ctaLabel}</span>
          <i className="ti ti-arrow-right"></i>
        </motion.button>
      )}
    </div>
  );
}
