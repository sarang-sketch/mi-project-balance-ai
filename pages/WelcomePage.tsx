import React from 'react';
import { Page } from '../types';
import BrainLogo from '../components/ui/BrainLogo';

const WandSparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.71 0L11 10l-1.5 1.5 3 3L18 9l3.64-3.64a1.21 1.21 0 0 0 0-1.72z" />
        <path d="m14 7 3 3" />
        <path d="M5 6v4" />
        <path d="M19 14v4" />
        <path d="M10 2v2" />
        <path d="M7 8H3" />
        <path d="M17 18H13" />
        <path d="M21 12h-2" />
    </svg>
);


interface WelcomePageProps {
    onStartQuiz: () => void;
    onNavigate: (page: Page) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStartQuiz, onNavigate }) => {
    return (
        <div className="min-h-screen flex flex-col bg-deep-black text-white overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[600px] bg-orchid-purple/20 rounded-full blur-[150px] opacity-30 z-0"></div>

            <div className="relative z-10 flex flex-col flex-grow p-6">
                {/* Header */}
                <header className="flex justify-between items-center w-full max-w-7xl mx-auto py-4">
                    <div className="flex items-center gap-2">
                        <BrainLogo isPulsing={false} className="w-8 h-8 text-white" />
                        <span className="font-bold text-2xl">BalanceAI</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-soft-gray hidden sm:block">Welcome, sara</span>
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="px-6 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-orchid-purple to-neon-pink hover:opacity-90 transition-opacity"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow flex flex-col justify-center items-center text-center">
                    <div className="mb-8 animate-fadeIn">
                        <div className="w-20 h-20 rounded-full bg-secondary-bg/80 backdrop-blur-sm border border-orchid-purple/30 flex items-center justify-center">
                           <BrainLogo isPulsing={false} className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fadeIn-delay-1">
                        Balance Your Mind,<br />
                        <span className="text-gradient">Body & Digital Life</span>
                    </h1>
                    <p className="mt-6 text-lg text-soft-gray max-w-2xl animate-fadeIn-delay-2">
                        Track, analyze, and optimize your mental, physical, and emotional health with cutting-edge AI technology. Your journey to wellness starts here. 💜
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fadeIn-delay-2">
                        <button
                            onClick={onStartQuiz}
                            className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-orchid-purple to-neon-pink shadow-lg shadow-neon-pink/30 hover:opacity-90 transition-opacity transform hover:scale-105"
                        >
                            <WandSparklesIcon className="w-6 h-6" />
                            Start Assessment
                        </button>
                        <button
                            onClick={() => onNavigate('community')}
                            className="px-8 py-4 text-lg font-semibold rounded-full bg-secondary-bg border border-soft-gray/30 hover:bg-card-bg hover:border-soft-gray transition-colors"
                        >
                            Explore Community
                        </button>
                    </div>
                </main>

                {/* Footer Stats */}
                <footer className="w-full max-w-4xl mx-auto pt-8 pb-4">
                    <div className="flex flex-col sm:flex-row justify-around items-center gap-8">
                        <div className="text-center animate-fadeIn">
                            <p className="text-3xl font-bold">10k+</p>
                            <p className="text-sm text-soft-gray">Active Users</p>
                        </div>
                        <div className="text-center animate-fadeIn-delay-1">
                            <p className="text-3xl font-bold">95%</p>
                            <p className="text-sm text-soft-gray">Satisfaction Rate</p>
                        </div>
                        <div className="text-center animate-fadeIn-delay-2">
                            <p className="text-3xl font-bold">24/7</p>
                            <p className="text-sm text-soft-gray">AI Support</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default WelcomePage;