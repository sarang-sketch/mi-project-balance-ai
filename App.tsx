import React, { useState, useMemo, useEffect } from 'react';
import { Page, QuizAnswers, WellnessPlan, Notification, LoggedActivity } from './types';
import ParticleBackground from './components/layout/ParticleBackground';
import WelcomePage from './pages/WelcomePage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import DashboardPage from './pages/DashboardPage';
import PlanPage from './pages/PlanPage';
import ProgressPage from './pages/ProgressPage';
import ScannerPage from './pages/ScannerPage';
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import AssistantPage from './pages/AssistantPage';
import CommunityPage from './pages/CommunityPage';
import SettingsPage from './pages/SettingsPage';
import VideoCreatorPage from './pages/VideoCreatorPage';
import ActivityTrackerPage from './pages/ActivityTrackerPage';
import ActivitiesPage from './pages/ActivitiesPage';
import NotificationsPage from './pages/NotificationsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Header from './components/layout/Header';

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, type: 'goal', text: "Congratulations! You completed your 'Mindful Morning' goal.", time: '2 hours ago' },
    { id: 2, type: 'streak', text: 'You\'re on a 3-day streak for physical activity. Keep it up!', time: '1 day ago' },
    { id: 3, type: 'task', text: 'Reminder: Your plan suggests a 15-minute digital detox.', time: '3 days ago' },
    { id: 4, type: 'wakeup', text: 'Good Morning! Time to start your day with a positive mindset.', time: '5 days ago' },
    { id: 5, type: 'system', text: 'Welcome to BalanceAI! Complete your assessment to get started.', time: '5 days ago' }
];

const MOCK_ACTIVITIES: LoggedActivity[] = [
    { name: 'Morning Meditation', category: 'Mental', duration: '10 mins', time: 'Today' },
    { name: 'Team Project Work', category: 'Digital', duration: '3 hours', time: 'Today' },
    { name: 'Lunchtime Walk', category: 'Physical', duration: '30 mins', time: 'Yesterday' },
];

const NOTIFICATIONS_STORAGE_KEY = 'balance-ai-notifications';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('welcome');
    const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
    const [wellnessPlan, setWellnessPlan] = useState<WellnessPlan | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loggedActivities, setLoggedActivities] = useState<LoggedActivity[]>(MOCK_ACTIVITIES);

     useEffect(() => {
        try {
            const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
            if (storedNotifications) {
                setNotifications(JSON.parse(storedNotifications));
            } else {
                setNotifications(MOCK_NOTIFICATIONS);
            }
        } catch (error) {
            console.error("Could not load notifications from local storage", error);
            setNotifications(MOCK_NOTIFICATIONS);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
        } catch (error) {
            console.error("Could not save notifications to local storage", error);
        }
    }, [notifications]);

    const handleNavigate = (page: Page) => setCurrentPage(page);

    const handleStartQuiz = () => setCurrentPage('quiz');

    const handleQuizComplete = (answers: QuizAnswers) => {
        setQuizAnswers(answers);
        setCurrentPage('result');
    };

    const handlePlanGenerated = (plan: WellnessPlan) => {
        setWellnessPlan(plan);
        setCurrentPage('dashboard');
    };
    
    const handleAddActivity = (activity: Omit<LoggedActivity, 'time'>) => {
        const newActivity: LoggedActivity = { ...activity, time: 'Today' };
        setLoggedActivities(prev => [newActivity, ...prev]);
    };

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        const newNotification: Notification = {
            id: Date.now(),
            ...notification
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const pageTitle = useMemo(() => {
        const titles: Record<Page, string> = {
            dashboard: 'Dashboard',
            plan: 'Wellness Plan',
            progress: 'My Progress',
            scanner: 'AI Scanners',
            'voice-assistant': 'Voice Assistant',
            assistant: 'Text Assistant',
            community: 'Community Hub',
            settings: 'Settings',
            'video-creator': 'AI Video Creator',
            'activity-tracker': 'Live Activity Tracking',
            activities: 'My Activities',
            notifications: 'Notifications',
            welcome: 'Welcome',
            quiz: 'Assessment',
            result: 'Assessment Result',
            login: 'Login',
            signup: 'Sign Up'
        };
        return titles[currentPage] || 'BalanceAI';
    }, [currentPage]);
    
    const renderPage = () => {
        switch (currentPage) {
            case 'welcome':
                return <WelcomePage onStartQuiz={handleStartQuiz} onNavigate={handleNavigate} />;
            case 'quiz':
                return <QuizPage onQuizComplete={handleQuizComplete} />;
            case 'result':
                return <ResultPage answers={quizAnswers} onPlanGenerated={handlePlanGenerated} />;
            case 'dashboard':
                 return <DashboardPage plan={wellnessPlan} loggedActivities={loggedActivities} onNavigate={handleNavigate} />;
            case 'plan':
                return <PlanPage plan={wellnessPlan} onNavigate={handleNavigate} />;
            case 'progress':
                return <ProgressPage />;
            case 'scanner':
                return <ScannerPage />;
            case 'voice-assistant':
                return <VoiceAssistantPage />;
            case 'assistant':
                return <AssistantPage />;
            case 'community':
                return <CommunityPage />;
            case 'settings':
                return <SettingsPage />;
            case 'video-creator':
                return <VideoCreatorPage plan={wellnessPlan} />;
            case 'activity-tracker':
                return <ActivityTrackerPage />;
            case 'activities':
                return <ActivitiesPage loggedActivities={loggedActivities} onAddActivity={handleAddActivity} />;
            case 'notifications':
                return <NotificationsPage notifications={notifications} addNotification={addNotification} />;
            case 'login':
                return <LoginPage />;
            case 'signup':
                return <SignUpPage />;
            default:
                return <WelcomePage onStartQuiz={handleStartQuiz} onNavigate={handleNavigate} />;
        }
    };

    const showLayout = !['welcome', 'quiz', 'result', 'login', 'signup'].includes(currentPage);

    return (
        <div className="bg-deep-black text-white font-sans min-h-screen">
            <ParticleBackground />
            <div className="relative z-10 flex">
                {showLayout && <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />}
                <main className={`flex-grow transition-all duration-300 ${showLayout ? 'lg:ml-64' : ''}`}>
                    {showLayout && <Header title={pageTitle} onNavigate={handleNavigate} />}
                    <div className={showLayout ? "p-6 lg:p-8" : ""}>
                        {renderPage()}
                    </div>
                </main>
                {showLayout && <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />}
            </div>
        </div>
    );
};

export default App;