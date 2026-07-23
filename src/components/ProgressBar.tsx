import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-secondary">
          Paso {current} de {total}
        </span>
        <span className="text-sm font-semibold text-primary">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(to right, #5B8A72, #6B8CAE, #D4A24C)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
