import { motion } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import { accentColor } from '../../utils/colors';
import type { ConfirmationScreen } from '../../types/quiz';

interface Props {
  screen: ConfirmationScreen;
}

export default function ConfirmationScreenComp({ screen }: Props) {
  const { userName, userAge, userGender } = useQuizStore();

  const headline = interpolate(screen.headline, userName, userAge, userGender);

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-6">
      {/* Success icon badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="flex-shrink-0 w-16 h-16 rounded-full bg-[#E8F0E9] flex items-center justify-center text-primary mx-auto"
      >
        <i className="ti ti-circle-check text-3xl"></i>
      </motion.div>

      {/* Headline */}
      <h2 className="text-2xl font-bold text-main text-center leading-snug">{headline}</h2>

      {/* Body */}
      <p className="text-base text-secondary leading-relaxed text-center">{screen.body}</p>

      {/* Badges */}
      <div className="flex flex-col gap-3">
        {screen.badges.map((badge, i) => {
          const { fg, bg } = accentColor(i);
          return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className="card flex items-center gap-3 py-3 px-4"
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: bg, color: fg }}
            >
              <i className={`${badge.icon} text-sm`}></i>
            </div>
            <span className="text-sm font-semibold text-main leading-tight">{badge.text}</span>
          </motion.div>
          );
        })}
      </div>
    </div>
  );
}
