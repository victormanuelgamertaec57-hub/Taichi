import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';
import { screens } from '../data/screens';
import { trackCustomEvent } from '../utils/pixel';
import ProgressBar from './ProgressBar';

const PreIntroScreenComp = lazy(() => import('./screens/PreIntroScreen'));
const GenderScreenComp = lazy(() => import('./screens/GenderScreen'));
const IntroScreenComp = lazy(() => import('./screens/IntroScreen'));
const QuestionScreenComp = lazy(() => import('./screens/QuestionScreen'));
const InfoScreenComp = lazy(() => import('./screens/InfoScreen'));
const HarvardSpotlightScreenComp = lazy(() => import('./screens/HarvardSpotlightScreen'));
const StatScreenComp = lazy(() => import('./screens/StatScreen'));
const NameInputScreenComp = lazy(() => import('./screens/NameInputScreen'));
const EmailInputScreenComp = lazy(() => import('./screens/EmailInputScreen'));
const DateInputScreenComp = lazy(() => import('./screens/DateInputScreen'));
const HeightInputScreenComp = lazy(() => import('./screens/HeightInputScreen'));
const WeightInputScreenComp = lazy(() => import('./screens/WeightInputScreen'));
const BmiFeedbackScreenComp = lazy(() => import('./screens/BmiFeedbackScreen'));
const CommitmentScreenComp = lazy(() => import('./screens/CommitmentScreen'));
const FadeSequenceComp = lazy(() => import('./screens/FadeSequence'));
const ComparisonScreenComp = lazy(() => import('./screens/ComparisonScreen'));
const AnalysisScreenComp = lazy(() => import('./screens/AnalysisScreen'));
const ResultPaywallScreenComp = lazy(() => import('./screens/ResultPaywallScreen'));
const ConfirmationScreenComp = lazy(() => import('./screens/ConfirmationScreen'));
const SaboteursScreenComp = lazy(() => import('./screens/SaboteursScreen'));

import type { AnyScreen } from '../types/quiz';

// ─── Framer Motion variants ───────────────────────────────────────────────────

const transition = { duration: 0.3, ease: 'easeInOut' as const };

// ─── Screen Renderer ──────────────────────────────────────────────────────────

function renderScreen(screen: AnyScreen) {
  switch (screen.type) {
    case 'pre-intro':
      return <PreIntroScreenComp screen={screen} />;
    case 'gender':
      return <GenderScreenComp screen={screen} />;
    case 'intro':
      return <IntroScreenComp />;
    case 'question':
      return <QuestionScreenComp screen={screen} />;
    case 'info':
      if (screen.trackingName === 'harvard_spotlight') {
        return <HarvardSpotlightScreenComp screen={screen} />;
      }
      return <InfoScreenComp screen={screen} />;
    case 'stat':
      return <StatScreenComp screen={screen} />;
    case 'name-input':
      return <NameInputScreenComp screen={screen} />;
    case 'email-input':
      return <EmailInputScreenComp screen={screen} />;
    case 'date-input':
      return <DateInputScreenComp screen={screen} />;
    case 'height-input':
      return <HeightInputScreenComp screen={screen} />;
    case 'weight-input':
      return <WeightInputScreenComp screen={screen} />;
    case 'bmi-feedback':
      return <BmiFeedbackScreenComp screen={screen} />;
    case 'commitment':
      return <CommitmentScreenComp screen={screen} />;
    case 'fade-sequence':
      return <FadeSequenceComp screen={screen} />;
    case 'comparison':
      return <ComparisonScreenComp screen={screen} />;
    case 'analysis':
      return <AnalysisScreenComp screen={screen} />;
    case 'result-paywall':
      return <ResultPaywallScreenComp screen={screen} />;
    case 'confirmation':
      return <ConfirmationScreenComp screen={screen} />;
    case 'saboteurs':
      return <SaboteursScreenComp screen={screen} />;
    default:
      return null;
  }
}

// ─── Quiz Container ───────────────────────────────────────────────────────────

export default function QuizContainer() {
  const { currentScreen, direction } = useQuizStore();

  const screen = screens.find((s) => s.id === currentScreen);
  const hideProgress =
    screen?.type === 'analysis' ||
    screen?.type === 'result-paywall' ||
    screen?.type === 'fade-sequence' ||
    screen?.type === 'comparison';

  // ─── Meta Pixel: per-step funnel tracking ────────────────────────────────────
  // Fires once per (re)mount and every time the user navigates to a new step —
  // including back-navigation, so the funnel in Eventos reflects every "reach"
  // of each step. This lets you see exactly which of the 24 screens has the
  // biggest drop-off, not just the aggregate 83% non-completion.
  useEffect(() => {
    if (!screen) return;
    trackCustomEvent('QuizStep', {
      step: screen.id,
      step_name: screen.trackingName ?? `paso_${screen.id}`,
    });
  }, [currentScreen, screen]);

  if (!screen) return null;

  return (
    <div className="min-h-screen bg-warm flex flex-col items-center">
      {/* Fixed header with progress bar */}
      <div className="w-full max-w-lg sticky top-0 z-10 bg-warm/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center px-4 py-3">
          {/* Logo / Brand */}
          <span className="text-xl font-bold text-primary tracking-tight flex items-center gap-1.5">
            <i className="ti ti-activity text-lg"></i>
            FirmMe
          </span>
        </div>
        {!hideProgress && (
          <ProgressBar />
        )}
      </div>

      {/* Screen content */}
      <div className="w-full max-w-lg flex-1 overflow-hidden">
        <motion.div
          key={currentScreen}
          initial={{ x: direction === 'forward' ? 40 : -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={transition}
          className="w-full"
        >
          <Suspense fallback={
            <div className="w-full min-h-[400px] flex items-center justify-center">
              <div 
                className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" 
                style={{ borderTopColor: '#5C7AE0', willChange: 'transform' }} 
              />
            </div>
          }>
            {renderScreen(screen)}
          </Suspense>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-lg px-6 py-4 text-center">
        <p className="text-xs text-secondary/60 flex items-center justify-center gap-1">
          <i className="ti ti-lock text-xs"></i>
          <span>Tus datos están protegidos · FirmMe © 2025</span>
        </p>
      </footer>
    </div>
  );
}
