import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore, interpolate } from '../../store/quizStore';
import type { AnalysisScreen } from '../../types/quiz';
import { testimonials } from '../../data/testimonials';

interface Props {
  screen: AnalysisScreen;
}

const SAGE = '#5A6FD6';
const GOLD = '#D4A24C';
const TRACK = '#B9C4BB';

// Circular progress ring — replaces the old spinner + linear bar with a
// single indicator: the ring IS the percentage, so there's only one number
// to track instead of two redundant progress displays on the same screen.
function ProgressRing({ progress, done }: { progress: number; done: boolean }) {
  const size = 96;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={TRACK} strokeWidth={strokeWidth} />
        <defs>
          <linearGradient id="analysisRingGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SAGE} />
            <stop offset="100%" stopColor={GOLD} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#analysisRingGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 80ms linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.i
              key="check"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="ti ti-circle-check text-3xl text-primary"
            />
          ) : (
            <motion.span
              key="pct"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-extrabold text-main"
            >
              {Math.round(progress)}%
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Reusable filled-star SVG (inline because @tabler/icons-webfont
// v3.44 ships only outline variants — no ti-star-filled exists) ──────────
function FilledStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
  );
}

export default function AnalysisScreenComp({ screen }: Props) {
  const { userName, userAge, userGender, goNext } = useQuizStore();

  // Progress state
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);

  // Testimonial rotator — same-gender testimonials shown first
  const orderedTestimonials = useMemo(() => {
    if (!userGender) return testimonials;
    const sameGender = testimonials.filter((t) => t.gender === userGender);
    const otherGender = testimonials.filter((t) => t.gender !== userGender);
    return [...sameGender, ...otherGender];
  }, [userGender]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const headline = interpolate(screen.headline, userName, userAge, userGender);
  const subtext = interpolate(screen.subtext, userName, userAge, userGender);

  // ─── Progress animation ────────────────────────────────────────────────────
  // Key fix: setDone and setStepIndex are called OUTSIDE the setProgress
  // updater to avoid a React 18 batching edge case where nested setState
  // calls inside an updater can silently fail under StrictMode or concurrent
  // rendering, causing the interval to die and progress to freeze at 0%.
  useEffect(() => {
    const totalDuration = 6000; // 6 seconds to complete
    const interval = 60; // ms per tick
    const increment = (100 / totalDuration) * interval;
    progressRef.current = 0;

    timerRef.current = setInterval(() => {
      const next = Math.min(progressRef.current + increment, 100);
      progressRef.current = next;
      setProgress(next);
      setStepIndex(Math.floor((next / 100) * (screen.steps.length - 1)));

      if (next >= 100 && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setDone(true);
      }
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [screen.steps.length]);

  // ─── Auto-advance after done ───────────────────────────────────────────────
  useEffect(() => {
    if (done) {
      const delay = screen.autoAdvanceMs ?? 1000;
      const t = setTimeout(() => goNext(), delay);
      return () => clearTimeout(t);
    }
  }, [done, goNext, screen.autoAdvanceMs]);

  // ─── Testimonial rotation every 3s ────────────────────────────────────────
  useEffect(() => {
    testimonialTimer.current = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % orderedTestimonials.length);
    }, 3000);
    return () => {
      if (testimonialTimer.current) clearInterval(testimonialTimer.current);
    };
  }, [orderedTestimonials.length]);

  const currentTestimonial = orderedTestimonials[testimonialIndex];

  return (
    <div className="px-5 pt-8 pb-10 flex flex-col gap-8 min-h-[80vh]">
      {/* Status indicator */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mx-auto mb-2">
          <ProgressRing progress={progress} done={done} />
        </div>
        <h2 className="text-2xl font-bold text-main">{headline}</h2>
        <p className="text-base text-secondary">{subtext}</p>
      </div>

      {/* Current step label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-sm text-secondary text-center"
        >
          {screen.steps[stepIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Testimonial carousel */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xs uppercase tracking-widest text-secondary/60 text-center mb-4">
          Lo que dicen nuestros alumnos
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={testimonialIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="card"
          >
            {/* Stars — filled SVG because ti-star is outline-only */}
            <div className="flex gap-0.5 mb-3 text-yellow-500">
              {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                <span key={i}><FilledStar /></span>
              ))}
            </div>

            <p className="text-base text-secondary leading-relaxed mb-4 italic">
              "{currentTestimonial.text}"
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary-bg)] flex items-center justify-center text-primary">
                <i className="ti ti-user text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-main text-sm">
                  {currentTestimonial.name}, {currentTestimonial.age} años
                </p>
                <p className="text-xs text-secondary">{currentTestimonial.location}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {orderedTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setTestimonialIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === testimonialIndex ? 'bg-primary w-5' : 'bg-border'
              }`}
              aria-label={`Testimonio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
