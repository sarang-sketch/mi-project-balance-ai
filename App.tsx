import React, { useState, useCallback, useMemo } from 'react';
import { Page, QuizAnswers, WellnessPlan } from './types';
import ParticleBackground from './components/layout/ParticleBackground';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import WelcomePage from './pages/WelcomePage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import DashboardPage from './pages/DashboardPage';
import PlanPage from './pages/PlanPage';
import AssistantPage from './pages/AssistantPage';
import ScannerPage from './pages/ScannerPage';
import CommunityPage from './pages/CommunityPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';


const App: React.FC = () => {
    // Start with 'welcome' page for new users
    const [currentPage, setCurrentPage] = useState<Page>('welcome');
    const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
    const [wellnessPlan, setWellnessPlan] = useState<WellnessPlan | null>(null);

    const handleNavigate = useCallback((page: Page) => {
        setCurrentPage(page);
    }, []);

    const handleQuizStart = () => {
        setCurrentPage('quiz');
    };

    const handleQuizComplete = (answers: QuizAnswers) => {
        setQuizAnswers(answers);
        setCurrentPage('results');
    };

    const handlePlanGenerated = (plan: WellnessPlan) => {
        setWellnessPlan(plan);
        setCurrentPage('dashboard');
    };

    const pageTitle = useMemo(() => {
        switch (currentPage) {
            case 'plan': return 'Wellness Plan';
            case 'assistant': return 'AI Assistant';
            case 'scanner': return 'AI Scanners';
            case 'welcome': case 'quiz': case 'results': case 'login': case 'signup': return 'BalanceAI';
            default:
                return currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
        }
    }, [currentPage]);
    
    const showLayout = !['welcome', 'quiz', 'results', 'login', 'signup'].includes(currentPage);

    const renderPage = () => {
        switch (currentPage) {
            case 'welcome':
                return <WelcomePage onStartQuiz={handleQuizStart} onNavigate={handleNavigate} />;
            case 'quiz':
                return <QuizPage onQuizComplete={handleQuizComplete} />;
            case 'results':
                return <ResultPage answers={quizAnswers} onPlanGenerated={handlePlanGenerated} />;
            case 'dashboard':
                return <DashboardPage onNavigate={handleNavigate} />;
            case 'plan':
                return <PlanPage plan={wellnessPlan} />;
            case 'assistant':
                return <AssistantPage />;
            case 'scanner':
                return <ScannerPage />;
            case 'community':
                return <CommunityPage />;
            case 'activities':
                return <ActivitiesPage />;
            case 'progress':
                return <ProgressPage />;
            case 'settings':
                return <SettingsPage />;
            case 'notifications':
                return <NotificationsPage />;
            case 'login':
                return <LoginPage />;
            case 'signup':
                return <SignUpPage />;
            default:
                return <DashboardPage onNavigate={handleNavigate}/>;
        }
    };

    return (
        <div className="bg-primary-bg text-light-gray min-h-screen font-sans">
            <ParticleBackground />
            <div className="relative z-10 flex">
                {showLayout && <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />}
                <main className={`flex-1 transition-all duration-300 ${showLayout ? 'md:ml-64' : ''}`}>
                    {showLayout && <Header title={pageTitle} onNavigate={handleNavigate} />}
                    <div className={`p-4 md:p-8 ${showLayout ? 'h-[calc(100vh-80px)] overflow-y-auto' : ''}`}>
                      {renderPage()}
                    </div>
                </main>
            </div>
            {showLayout && <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />}
        </div>
    );
};

export default App;