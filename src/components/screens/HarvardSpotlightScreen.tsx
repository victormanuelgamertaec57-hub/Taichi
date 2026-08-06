import { motion } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import type { InfoScreen } from '../../types/quiz';

interface Props {
  screen: InfoScreen;
}

const INDIGO = '#5C7AE0';

export default function HarvardSpotlightScreenComp({ screen }: Props) {
  const { userName, userAge, userGender, goNext, goBack, currentScreen } = useQuizStore();

  const headline = interpolate(screen.headline, userName, userAge, userGender);
  const subtext = screen.subtext ? interpolate(screen.subtext, userName, userAge, userGender) : '';

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col justify-between min-h-[520px] bg-warm rounded-3xl border border-border overflow-hidden relative">
      
      {/* Floating Back Button */}
      {currentScreen > 1 && (
        <button 
          onClick={goBack} 
          className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-border text-main backdrop-blur-xs transition hover:bg-white hover:scale-105 active:scale-95 shadow-xs"
          aria-label="Volver"
        >
          <i className="ti ti-arrow-left text-lg"></i>
        </button>
      )}

      <div className="flex-1 flex flex-col gap-6 mt-8">
        
        {/* Harvard Medical School Citation Visual */}
        <div className="w-full bg-white rounded-2xl p-5 border border-border shadow-xs flex flex-col items-center gap-4 text-center">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
            style={{ backgroundColor: '#A51C30' }} // Harvard Red
          >
            H
          </div>
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Publicação de Saúde de</span>
            <h3 className="text-base font-extrabold text-main uppercase tracking-tight" style={{ color: '#A51C30' }}>
              Harvard Medical School
            </h3>
          </div>

          <div className="w-12 h-0.5 bg-border" />

          <p className="text-sm font-medium text-main italic leading-relaxed">
            "O Tai Chi é uma das melhores atividades para manter o equilíbrio e prevenir quedas, sendo superior a caminhadas ou alongamentos comuns."
          </p>
        </div>

        {/* Headline & Subtext */}
        <div className="space-y-2 text-center sm:text-left px-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-main leading-snug">{headline}</h2>
          {subtext && <p className="text-sm text-secondary leading-relaxed">{subtext}</p>}
        </div>

        {/* Benefits Checklist */}
        <div className="flex flex-col gap-3.5 px-1">
          {screen.checklist.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.25 }}
              className="flex items-start gap-3"
            >
              <div 
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: INDIGO }}
              >
                <i className={`${item.icon} text-xs`}></i>
              </div>
              <span className="text-sm sm:text-base text-main leading-snug">
                {interpolate(item.text, userName, userAge, userGender)}
              </span>
            </motion.div>
          ))}
        </div>

      </div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        onClick={goNext}
        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-[14px] p-[15px] shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] text-lg cursor-pointer mt-6"
      >
        <span>{screen.ctaLabel}</span>
        <i className="ti ti-arrow-right"></i>
      </motion.button>
    </div>
  );
}
