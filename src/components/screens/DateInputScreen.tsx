import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import type { DateInputScreen } from '../../types/quiz';
import { defaultFechaObjetivo, todayIso } from '../../utils/date';

interface Props {
  screen: DateInputScreen;
}

export default function DateInputScreenComp({ screen }: Props) {
  const { setAnswer, goNext, goBack, currentScreen } = useQuizStore();
  const [date, setDate] = useState('');

  const handleContinue = useCallback(() => {
    setAnswer(screen.answerKey!, date || defaultFechaObjetivo());
    goNext();
  }, [date, setAnswer, screen.answerKey, goNext]);

  const handleSkip = useCallback(() => {
    setAnswer(screen.answerKey!, defaultFechaObjetivo());
    goNext();
  }, [setAnswer, screen.answerKey, goNext]);

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-6">
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn">
          ← Voltar
        </button>
      )}

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-main">{screen.headline}</h2>
        {screen.subtext && <p className="text-base text-secondary">{screen.subtext}</p>}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="date"
          value={date}
          min={todayIso()}
          onChange={(e) => setDate(e.target.value)}
          className="name-input"
          aria-label={screen.headline}
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={handleContinue}
        disabled={!date}
        className="cta-btn disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {screen.ctaLabel}
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        onClick={handleSkip}
        className="text-sm text-secondary underline underline-offset-2 text-center mx-auto"
      >
        {screen.skipLabel}
      </motion.button>
    </div>
  );
}
