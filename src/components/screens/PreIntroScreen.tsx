import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import type { PreIntroScreen } from '../../types/quiz';

interface Props {
  screen: PreIntroScreen;
}

const INDIGO = '#5C7AE0';

export default function PreIntroScreenComp({ screen }: Props) {
  const { goNext } = useQuizStore();
  const [loadingText, setLoadingText] = useState('Analizando factores de estabilidad postural...');

  useEffect(() => {
    // Rotate loading messages during the 3-second block
    const textTimer = setTimeout(() => {
      setLoadingText('Preparando tu evaluación personalizada...');
    }, 1500);

    const completeTimer = setTimeout(() => {
      setLoadingText('¡Análisis completado!');
      goNext();
    }, 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [goNext]);

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col items-center justify-between min-h-[520px] bg-warm text-center">
      <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-sm w-full">
        
        {/* Ring Donut SVG analysis animation */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg viewBox="0 0 140 140" className="w-full h-full transform -rotate-90">
            {/* Background track circle */}
            <circle
              cx="70"
              cy="70"
              r="58"
              stroke="#EEF1FB"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Animated filling circle (GPU-accelerated pathLength / strokeDashoffset animation) */}
            <motion.circle
              cx="70"
              cy="70"
              r="58"
              stroke={INDIGO}
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={364.4}
              initial={{ strokeDashoffset: 364.4 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </svg>
          
          {/* Inner Yin Yang Icon with micro-scale pulse */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [0.94, 1.04, 0.94] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center"
              style={{ willChange: 'transform' }}
            >
              <i className="ti ti-yin-yang text-4xl text-primary" style={{ color: INDIGO }}></i>
              <span className="text-[10px] font-bold text-secondary/60 tracking-wider uppercase mt-1">Estabilidad</span>
            </motion.div>
          </div>
        </div>

        {/* Copy Section */}
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 bg-white border border-border rounded-full text-xs font-bold uppercase tracking-wider text-secondary">
            Método Clínicamente Comprobado
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl font-extrabold text-main leading-tight tracking-tight"
          >
            {screen.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm sm:text-base text-secondary leading-relaxed"
          >
            {screen.subtext}
          </motion.p>
        </div>

        {/* Harvard/Stanford support trust badge */}
        <div className="flex items-center gap-2 text-xs text-secondary/70 bg-secondary/5 px-3.5 py-2 rounded-xl border border-border/40">
          <i className="ti ti-school text-sm"></i>
          <span>Basado en directrices de Harvard y Stanford</span>
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-4 mt-8">
        {/* Additional Linear loading bar right above the CTA */}
        <div className="w-full space-y-1.5">
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: INDIGO }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </div>
          <p className="text-[11px] text-secondary/70 font-semibold tracking-wide h-4 flex items-center justify-center">
            {loadingText}
          </p>
        </div>
      </div>
    </div>
  );
}
