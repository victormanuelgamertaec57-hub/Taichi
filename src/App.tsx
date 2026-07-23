import { useEffect } from 'react';
import QuizContainer from './components/QuizContainer';
import { initMetaPixel } from './utils/pixel';

export default function App() {
  useEffect(() => {
    initMetaPixel();
  }, []);

  return <QuizContainer />;
}
