import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import type { SaboteursScreen } from '../../types/quiz';
import { calculateSaboteurs } from '../../utils/saboteurs';

interface Props {
  screen: SaboteursScreen;
}

export default function SaboteursScreenComp({ screen: _screen }: Props) {
  const { userGender, userName, answers, goNext, goBack, currentScreen } = useQuizStore();

  const genderKey: 'female' | 'male' = userGender === 'male' ? 'male' : 'female';
  const data = useMemo(() => {
    return calculateSaboteurs(genderKey, answers, userName);
  }, [genderKey, answers, userName]);

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-6">
      {currentScreen > 1 && (
        <button onClick={goBack} className="back-btn">
          ← Volver
        </button>
      )}

      {/* Header section with obstacle/shield icon */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <i className="ti ti-barrier-block text-2xl" style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-main">{data.title}</h2>
        <p className="text-sm text-secondary leading-relaxed">{data.subtitle}</p>
      </div>

      {/* Card with 4 horizontal progress bars */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-5 border flex flex-col gap-4"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-col gap-3.5">
          {data.items.map((item, idx) => (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-main">
                <span className="flex items-center gap-2">
                  <i className={`${item.icon} text-sm`} style={{ color: 'var(--color-primary)' }} />
                  {item.name}
                </span>
                <span className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>
                  {item.percent}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="h-3.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Closing note inside card */}
        <p className="text-xs text-secondary/70 text-center pt-2 border-t border-border/60">
          Usaremos estos datos para trazar un plan a tu justa medida.
        </p>
      </motion.div>

      {/* Bottom empathetic block for Top Saboteur */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl p-5 border flex flex-col gap-2.5"
        style={{
          background: 'var(--color-primary-bg, rgba(90, 111, 214, 0.08))',
          borderColor: 'rgba(90, 111, 214, 0.25)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-primary flex-shrink-0">
            <i className={`${data.topSaboteur.icon} text-lg`} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-secondary font-bold">
              Tu saboteador principal #{1}
            </span>
            <h3 className="text-base font-bold text-main leading-tight">{data.topSaboteur.name}</h3>
          </div>
        </div>

        <p className="text-sm text-secondary leading-relaxed pt-1">
          {data.topSaboteur.description}
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        onClick={goNext}
        className="cta-btn mt-1"
      >
        Continuar
      </motion.button>
    </div>
  );
}
