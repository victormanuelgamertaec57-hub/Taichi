import { motion } from 'framer-motion';

interface Props {
  icon: string;    // Tabler icon class, e.g. "ti ti-target"
  headline: string;
  body: string;
  delay?: number;
}

/**
 * Reusable context card: small icon top-left, bold headline, explanatory
 * paragraph. Sage-green background — used below question options and,
 * potentially, on other screens that need a supporting-context aside.
 */
export default function InfoCard({ icon, headline, body, delay = 0.15 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{ backgroundColor: 'var(--color-primary-bg)' }}
    >
      <span
        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)' }}
      >
        <i className={`${icon} text-lg`}></i>
      </span>
      <p className="font-bold text-main text-[15px] leading-snug">{headline}</p>
      <p className="text-[14px] text-secondary leading-relaxed">{body}</p>
    </motion.div>
  );
}
