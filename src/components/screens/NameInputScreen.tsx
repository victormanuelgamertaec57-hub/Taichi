import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import type { NameInputScreen } from '../../types/quiz';

interface Props {
  screen: NameInputScreen;
}

export default function NameInputScreenComp({ screen }: Props) {
  const { setUserName, setAnswer, goNext, goBack, currentScreen } = useQuizStore();
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const isValid = name.trim().length >= 2;

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    if (!isValid) {
      setTouched(true);
      nameRef.current?.focus();
      return;
    }
    const trimmed = name.trim();
    setSubmitted(true);
    setUserName(trimmed);
    setAnswer(screen.answerKey!, trimmed);
    goNext();
  }, [submitted, isValid, name, setUserName, setAnswer, screen.answerKey, goNext]);

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-6">
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn">
          ← Voltar
        </button>
      )}

      {/* Headline */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-main">{screen.headline}</h2>
        <p className="text-base text-secondary">{screen.subtext}</p>
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-2"
      >
        <input
          ref={nameRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          onBlur={() => isValid && handleSubmit()}
          placeholder={screen.placeholder}
          autoComplete="given-name"
          inputMode="text"
          autoFocus
          className={`name-input ${touched && !isValid ? 'border-red-400' : ''}`}
        />
        {touched && !isValid && (
          <p className="text-sm text-red-500">Por favor, digite pelo menos 2 caracteres.</p>
        )}
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        onClick={handleSubmit}
        className="cta-btn"
      >
        {screen.ctaLabel}
      </motion.button>

      <p className="text-xs text-secondary/60 text-center flex items-center justify-center gap-1">
        <i className="ti ti-lock text-xs"></i>
        <span>Suas informações são privadas e nunca são compartilhadas.</span>
      </p>
    </div>
  );
}
