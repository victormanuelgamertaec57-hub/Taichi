import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { screens } from '../data/screens';
import ProgressBar from './ProgressBar';
import IntroScreenComp from './screens/IntroScreen';
import QuestionScreenComp from './screens/QuestionScreen';
import InfoScreenComp from './screens/InfoScreen';
import StatScreenComp from './screens/StatScreen';
import NameInputScreenComp from './screens/NameInputScreen';
import EmailInputScreenComp from './screens/EmailInputScreen';
import DateInputScreenComp from './screens/DateInputScreen';
import CommitmentScreenComp from './screens/CommitmentScreen';
import ProjectionScreenComp from './screens/ProjectionScreen';
import FadeSequenceComp from './screens/FadeSequence';
import AnalysisScreenComp from './screens/AnalysisScreen';
import ResultPaywallScreenComp from './screens/ResultPaywallScreen';
import ConfirmationScreenComp from './screens/ConfirmationScreen';
import type { AnyScreen } from '../types/quiz';

// ─── Framer Motion variants ───────────────────────────────────────────────────

const transition = { duration: 0.3, ease: 'easeInOut' as const };

// ─── Screen Renderer ──────────────────────────────────────────────────────────

function renderScreen(screen: AnyScreen) {
  switch (screen.type) {
    case 'intro':
      return <IntroScreenComp />;
    case 'question':
      return <QuestionScreenComp screen={screen} />;
    case 'info':
      return <InfoScreenComp screen={screen} />;
    case 'stat':
      return <StatScreenComp screen={screen} />;
    case 'name-input':
      return <NameInputScreenComp screen={screen} />;
    case 'email-input':
      return <EmailInputScreenComp screen={screen} />;
    case 'date-input':
      return <DateInputScreenComp screen={screen} />;
    case 'commitment':
      return <CommitmentScreenComp screen={screen} />;
    case 'projection':
      return <ProjectionScreenComp screen={screen} />;
    case 'fade-sequence':
      return <FadeSequenceComp screen={screen} />;
    case 'analysis':
      return <AnalysisScreenComp screen={screen} />;
    case 'result-paywall':
      return <ResultPaywallScreenComp screen={screen} />;
    case 'confirmation':
      return <ConfirmationScreenComp screen={screen} />;
    default:
      return null;
  }
}

// ─── Quiz Container ───────────────────────────────────────────────────────────

export default function QuizContainer() {
  const { currentScreen, totalScreens, direction } = useQuizStore();

  const screen = screens.find((s) => s.id === currentScreen);
  const hideProgress = screen?.type === 'analysis' || screen?.type === 'result-paywall' || screen?.type === 'fade-sequence';

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
          <ProgressBar current={currentScreen} total={totalScreens} />
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
          {renderScreen(screen)}
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
