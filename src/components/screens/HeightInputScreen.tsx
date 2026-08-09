import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import type { HeightInputScreen } from '../../types/quiz';

interface Props {
  screen: HeightInputScreen;
}

export default function HeightInputScreenComp({ screen }: Props) {
  const { setAnswer, goNext, goBack, currentScreen } = useQuizStore();
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [valueCm, setValueCm] = useState('');
  const [valueFtInt, setValueFtInt] = useState(''); // feet part
  const [valueFtDec, setValueFtDec] = useState(''); // inches part
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert to cm for storage
  const getCmValue = (): number | null => {
    if (unit === 'cm') {
      const n = parseInt(valueCm, 10);
      return isNaN(n) ? null : n;
    } else {
      const ft = parseInt(valueFtInt, 10);
      const inches = parseInt(valueFtDec, 10) || 0;
      if (isNaN(ft)) return null;
      return Math.round(ft * 30.48 + inches * 2.54);
    }
  };

  const isValid = (): boolean => {
    const cm = getCmValue();
    if (cm === null) return false;
    return cm >= 100 && cm <= 230;
  };

  const handleSubmit = useCallback(() => {
    setTouched(true);
    if (!isValid()) {
      inputRef.current?.focus();
      return;
    }
    const cm = getCmValue()!;
    setAnswer('userHeightCm', cm);
    setAnswer(screen.answerKey!, unit === 'cm' ? `${valueCm} cm` : `${valueFtInt}'${valueFtDec || '0'}" (${cm} cm)`);
    goNext();
  }, [valueCm, valueFtInt, valueFtDec, unit, screen.answerKey, setAnswer, goNext]);

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
        {(['cm', 'ft'] as const).map((u) => (
          <button
            key={u}
            onClick={() => { setUnit(u); setTouched(false); }}
            className="flex-1 py-2.5 text-sm font-semibold transition-colors"
            style={{
              background: unit === u ? 'var(--color-primary)' : 'transparent',
              color: unit === u ? '#fff' : 'var(--color-secondary)',
            }}
          >
            {u === 'cm' ? 'cm' : 'ft / in'}
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
        {unit === 'cm' ? (
          <div className="relative">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={valueCm}
              onChange={(e) => setValueCm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="ej. 170"
              min={100}
              max={230}
              autoFocus
              className={`name-input pr-16 ${touched && !isValid() ? 'border-red-400' : ''}`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-medium">cm</span>
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                value={valueFtInt}
                onChange={(e) => setValueFtInt(e.target.value)}
                placeholder="5"
                min={3}
                max={7}
                autoFocus
                className={`name-input pr-10 ${touched && !isValid() ? 'border-red-400' : ''}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-medium">ft</span>
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                inputMode="numeric"
                value={valueFtDec}
                onChange={(e) => setValueFtDec(e.target.value)}
                placeholder="9"
                min={0}
                max={11}
                className="name-input pr-10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-medium">in</span>
            </div>
          </div>
        )}

        {touched && !isValid() && (
          <p className="text-sm text-red-500">Por favor ingresa una estatura válida.</p>
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
