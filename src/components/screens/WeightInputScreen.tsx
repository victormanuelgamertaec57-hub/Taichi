import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import type { WeightInputScreen } from '../../types/quiz';

interface Props {
  screen: WeightInputScreen;
}

export default function WeightInputScreenComp({ screen }: Props) {
  const { setAnswer, goNext, goBack, currentScreen } = useQuizStore();
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getKgValue = (): number | null => {
    const n = parseFloat(value);
    if (isNaN(n)) return null;
    if (unit === 'kg') return n;
    return Math.round(n / 2.205);
  };

  const isValid = (): boolean => {
    const kg = getKgValue();
    if (kg === null) return false;
    return kg >= 30 && kg <= 250;
  };

  const handleSubmit = useCallback(() => {
    setTouched(true);
    if (!isValid()) {
      inputRef.current?.focus();
      return;
    }
    const kg = getKgValue()!;
    setAnswer('userWeightKg', kg);
    setAnswer(screen.answerKey!, unit === 'kg' ? `${value} kg` : `${value} lb (${kg} kg)`);
    goNext();
  }, [value, unit, screen.answerKey, setAnswer, goNext]);

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-6">
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn">← Volver</button>
      )}

      {/* Headline */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-main">{screen.headline}</h2>
        {screen.subtext && <p className="text-base text-secondary">{screen.subtext}</p>}
      </div>

      {/* Unit toggle */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex rounded-xl border border-border overflow-hidden"
      >
        {(['kg', 'lb'] as const).map((u) => (
          <button
            key={u}
            onClick={() => { setUnit(u); setTouched(false); setValue(''); }}
            className="flex-1 py-2.5 text-sm font-semibold transition-colors"
            style={{
              background: unit === u ? 'var(--color-primary)' : 'transparent',
              color: unit === u ? '#fff' : 'var(--color-secondary)',
            }}
          >
            {u}
          </button>
        ))}
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-3"
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={unit === 'kg' ? 'ej. 80' : 'ej. 176'}
            autoFocus
            className={`name-input pr-16 ${touched && !isValid() ? 'border-red-400' : ''}`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-medium">{unit}</span>
        </div>

        {touched && !isValid() && (
          <p className="text-sm text-red-500">Por favor ingresa un peso válido.</p>
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
        <span>Tu información es privada y nunca se comparte.</span>
      </p>
    </div>
  );
}
