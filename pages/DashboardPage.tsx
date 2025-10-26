import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/ui/StatCard';
import NeonButton from '../components/ui/NeonButton';
import { Page } from '../types';
import { BotIcon, CheckCircleIcon, UsersIcon, ActivityIcon, PlusIcon, WellnessPlanIcon } from '../components/icons/NavIcons';

interface DashboardPageProps {
    onNavigate: (page: Page) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold">Good Afternoon!</h1>
                <p className="text-soft-gray mt-1">Ready to find your balance?</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={<ActivityIcon className="w-6 h-6" />}
                    title="Activities Logged"
                    value="3"
                    change="+1"
                    changeType="increase"
                    color="#C71585"
                />
                <StatCard 
                    icon={<CheckCircleIcon className="w-6 h-6" />}
                    title="Goals Completed"
                    value="75%"
                    change="+5%"
                    changeType="increase"
                    color="#32CD32"
                />
                <StatCard 
                    icon={<UsersIcon className="w-6 h-6" />}
                    title="Community Posts"
                    value="2"
                    change=""
                    changeType="neutral"
                    color="#1E90FF"
                />
                <StatCard 
                    icon={<BotIcon className="w-6 h-6" />}
                    title="AI Chats"
                    value="5"
                    change="-1"
                    changeType="decrease"
                    color="#8B5A8B"
                />
            </div>
            
            {/* Quick Actions & Plan Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassCard className="lg:col-span-2">
                    <h3 className="text-xl font-bold mb-4 neon-text-orchid">Your Plan for Today</h3>
                    <div className="space-y-3">
                        {['15-min Mindful Meditation', '30-min Energizing Walk', 'Evening Digital Detox'].map(item => (
                             <div key={item} className="bg-card-bg/50 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <span className="font-semibold">{item}</span>
                                <button className="w-full sm:w-auto px-3 py-1 text-xs bg-secondary-bg rounded-full font-semibold hover:bg-card-bg transition-colors flex items-center justify-center">
                                    <PlusIcon className="w-3 h-3 mr-1" /> Log
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => onNavigate('plan')} className="text-sm font-semibold text-neon-pink mt-4 hover:underline">
                        View Full Plan →
                    </button>
                </GlassCard>

                <GlassCard className="lg:col-span-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2 neon-text-orchid">Quick Actions</h3>
                        <p className="text-sm text-soft-gray mb-4">Jump right into your wellness journey.</p>
                    </div>
                    <div className="space-y-3">
                        <NeonButton onClick={() => onNavigate('assistant')}>Chat with AI</NeonButton>
                        <button onClick={() => onNavigate('activities')} className="w-full mt-2 px-8 py-3 bg-transparent text-white font-bold rounded-full border-2 border-neon-pink/90 transition-all duration-300 transform hover:bg-neon-pink/20">
                            Log an Activity
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default DashboardPage;