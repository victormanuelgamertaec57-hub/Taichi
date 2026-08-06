import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';

export default function ProgressBar() {
  const { getStageProgress } = useQuizStore();
  const { currentStep, totalSteps, stageName, stageId } = getStageProgress();

  if (totalSteps === 0) return null;
  const pct = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="w-full px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
          Etapa {stageId} de 7: {stageName}
        </span>
        <span className="text-xs font-bold text-primary">
          Paso {currentStep} de {totalSteps} ({Math.round(pct)}%)
        </span>
      </div>
      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(to right, #5A6FD6, #7B8FE0, #D4A24C)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
