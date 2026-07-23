import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import type { FadeSequenceScreen } from '../../types/quiz';
import { formatDateEs, subDays, defaultFechaObjetivo } from '../../utils/date';

interface Props {
  screen: FadeSequenceScreen;
}

const SAGE = '#5B8A72';
const DATE_TOKEN_RE = /(\{\{fechaObjetivoMenos7\}\}|\{\{fechaObjetivo\}\})/g;

export default function FadeSequenceComp({ screen }: Props) {
  const { userName, userAge, userGender, answers, goNext } = useQuizStore();
  const [lineIndex, setLineIndex] = useState(0);
  const msPerLine = screen.msPerLine ?? 2500;

  const fechaObjetivo = (answers.fechaObjetivo as string | undefined) ?? defaultFechaObjetivo();
  const fechaFormatted = formatDateEs(fechaObjetivo);
  const fechaMenos7Formatted = formatDateEs(subDays(fechaObjetivo, 7));

  // Auto-advance through the lines, then hand off to the normal flow.
  useEffect(() => {
    if (lineIndex >= screen.lines.length - 1) {
      const t = setTimeout(() => goNext(), msPerLine);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLineIndex((i) => i + 1), msPerLine);
    return () => clearTimeout(t);
  }, [lineIndex, screen.lines.length, msPerLine, goNext]);

  function renderLine(line: string) {
    const parts = line.split(DATE_TOKEN_RE);
    return parts.map((part, i) => {
      if (part === '{{fechaObjetivoMenos7}}') {
        return (
          <span key={i} style={{ color: SAGE }}>
            {fechaMenos7Formatted}
          </span>
        );
      }
      if (part === '{{fechaObjetivo}}') {
        return (
          <span key={i} style={{ color: SAGE }}>
            {fechaFormatted}
          </span>
        );
      }
      return <span key={i}>{interpolate(part, userName, userAge, userGender)}</span>;
    });
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-8">
      <AnimatePresence mode="wait">
        <motion.p
          key={lineIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-main text-center leading-snug"
        >
          {renderLine(screen.lines[lineIndex])}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
