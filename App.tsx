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
import FloatingMonitorWidget from './components/ui/FloatingMonitorWidget';
import ScreenMonitorModal from './components/modals/ScreenMonitorModal';

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, type: 'goal', text: "Congratulations! You completed your 'Mindful Morning' goal.", time: '2 hours ago' },
    { id: 2, type: 'streak', text: 'You\'re on a 3-day streak for physical activity. Keep it up!', time: '1 day ago' },
    { id: 3, type: 'task', text: 'Reminder: Your plan suggests a 15-minute digital detox.', time: '3 days ago' },
];

const NOTIFICATIONS_STORAGE_KEY = 'balance-ai-notifications';
const ACTIVITIES_STORAGE_KEY = 'balance-ai-activities';
const MONITOR_ENABLED_KEY = 'balance-ai-monitor-enabled';


const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('welcome');
    const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
    const [wellnessPlan, setWellnessPlan] = useState<WellnessPlan | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loggedActivities, setLoggedActivities] = useState<LoggedActivity[]>([]);
    
    // AI Screen Monitor State
    const [isMonitorEnabled, setIsMonitorEnabled] = useState(false);
    const [isMonitorModalOpen, setIsMonitorModalOpen] = useState(false);

     useEffect(() => {
        // Load persisted state from localStorage
        try {
            const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
            setNotifications(storedNotifications ? JSON.parse(storedNotifications) : MOCK_NOTIFICATIONS);

            const storedActivities = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
            setLoggedActivities(storedActivities ? JSON.parse(storedActivities) : []);

            const monitorEnabled = localStorage.getItem(MONITOR_ENABLED_KEY);
            setIsMonitorEnabled(monitorEnabled === 'true');

        } catch (error) {
            console.error("Could not load from local storage", error);
        }
    }, []);

    useEffect(() => {
        // Persist state changes to localStorage
        try {
            localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
            localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(loggedActivities));
            localStorage.setItem(MONITOR_ENABLED_KEY, String(isMonitorEnabled));
        } catch (error) {
            console.error("Could not save to local storage", error);
        }
    }, [notifications, loggedActivities, isMonitorEnabled]);

    const handleNavigate = (page: Page) => setCurrentPage(page);
    const handleStartQuiz = () => setCurrentPage('quiz');

    const handleQuizComplete = (answers: QuizAnswers) => {
        setQuizAnswers(answers);
        setCurrentPage('result');
    };

    const handlePlanGenerated = (plan: WellnessPlan) => {
        setWellnessPlan(plan);
        addNotification({ type: 'system', text: 'Your new personalized wellness plan is ready!', time: 'Just now'});
        setCurrentPage('dashboard');
    };
    
    const handleAddActivity = (activity: Omit<LoggedActivity, 'time'>) => {
        const newActivity: LoggedActivity = { ...activity, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) };
        setLoggedActivities(prev => [newActivity, ...prev]);
    };

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        const newNotification: Notification = { id: Date.now(), ...notification };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const handleToggleMonitor = () => {
        setIsMonitorEnabled(prev => !prev);
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
                 return <DashboardPage plan={wellnessPlan} onAddActivity={handleAddActivity} onNavigate={handleNavigate} />;
            case 'plan':
                return <PlanPage plan={wellnessPlan} onNavigate={handleNavigate} />;
            case 'progress':
                return <ProgressPage />;
            case 'scanner':
                return <ScannerPage />;
            case 'voice-assistant':
                return <VoiceAssistantPage addNotification={addNotification} />;
            case 'assistant':
                return <AssistantPage />;
            case 'community':
                return <CommunityPage />;
            case 'settings':
                return <SettingsPage isMonitorEnabled={isMonitorEnabled} onToggleMonitor={handleToggleMonitor} />;
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
                 {showLayout && isMonitorEnabled && <FloatingMonitorWidget onClick={() => setIsMonitorModalOpen(true)} />}
                 {isMonitorModalOpen && <ScreenMonitorModal onClose={() => setIsMonitorModalOpen(false)} />}
            </div>
        </div>
    );
};

export default App;