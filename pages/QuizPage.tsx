import React, { useState, useMemo } from 'react';
import { QuizAnswers } from '../types';
import { QUIZ_QUESTIONS } from '../constants';
import GlassCard from '../components/ui/GlassCard';
import BrainLogo from '../components/ui/BrainLogo';
import NeonButton from '../components/ui/NeonButton';

interface QuizPageProps {
  onQuizComplete: (answers: QuizAnswers) => void;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-gray-700/50 rounded-full h-4 my-4 relative overflow-hidden border border-orchid-purple/20">
        <div 
            className="progress-bar-fill h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
        ></div>
        <BrainLogo isPulsing={false} className="absolute h-6 w-6 text-white -top-1 transition-all duration-500 ease-out" style={{ left: `calc(${progress}% - 12px)` }} />
    </div>
);


const QuizPage: React.FC<QuizPageProps> = ({ onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const progress = useMemo(() => 
    ((currentQuestionIndex) / QUIZ_QUESTIONS.length) * 100, 
    [currentQuestionIndex]
  );
  
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: optionIndex };
    setAnswers(newAnswers);

    // Special workflow for question 10 (index 9)
    if (currentQuestionIndex === 9 && optionIndex > 0) {
        setShowSafetyModal(true);
        // We still proceed, but show the modal first
    } else {
        advanceQuestion(newAnswers);
    }
  };

  const advanceQuestion = (currentAnswers: QuizAnswers) => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onQuizComplete(currentAnswers);
    }
  };
  
  const handleCloseModalAndContinue = () => {
      setShowSafetyModal(false);
      advanceQuestion(answers);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center pt-10 pb-20">
        <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-4">
                <p className="text-neon-pink font-semibold">Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</p>
                <ProgressBar progress={progress} />
            </div>

            <GlassCard className="animate-fadeIn">
                <h2 className="text-2xl md:text-3xl font-bold text-center">
                    {currentQuestion.question}
                </h2>
                <div className="mt-8 space-y-4">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className="w-full text-left p-4 bg-orchid-purple/10 border-2 border-orchid-purple/30 rounded-full text-lg hover:bg-orchid-purple/30 hover:border-neon-pink/70 transition-all duration-300 transform hover:scale-105"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </GlassCard>
        </div>

        {showSafetyModal && (
            <div className="fixed inset-0 bg-deep-black/70 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
                <GlassCard className="max-w-md w-full border-2 border-neon-pink shadow-2xl shadow-neon-pink/40 text-center">
                    <h3 className="text-2xl font-bold text-neon-pink">🖤 It's okay to need help.</h3>
                    <p className="mt-4 text-soft-gray">Your safety is the top priority. If you're struggling, please know that support is available.</p>
                    <div className="mt-6 space-y-2 text-white">
                        <p><strong>Crisis Hotline:</strong> <a href="tel:988" className="underline hover:text-neon-pink">Call 988</a></p>
                        <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                    </div>
                    <div className="mt-8">
                        <NeonButton onClick={handleCloseModalAndContinue}>
                            Continue Quiz
                        </NeonButton>
                    </div>
                </GlassCard>
            </div>
        )}
    </div>
  );
};

export default QuizPage;
