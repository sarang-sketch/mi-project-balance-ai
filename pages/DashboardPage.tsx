import React from 'react';
import { WellnessPlan, Page, LoggedActivity } from '../types';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/ui/StatCard';
import { ActivityIcon, BotIcon, ChecklistIcon, HomeIcon, WellnessPlanIcon } from '../components/icons/NavIcons';
import NeonButton from '../components/ui/NeonButton';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import BrainLogo from '../components/ui/BrainLogo';

interface DashboardPageProps {
    plan: WellnessPlan | null;
    loggedActivities: LoggedActivity[];
    onNavigate: (page: Page) => void;
}

// Mock data for the chart
const balanceScoreData = [
    { name: 'Mon', score: 75 },
    { name: 'Tue', score: 78 },
    { name: 'Wed', score: 82 },
    { name: 'Thu', score: 80 },
    { name: 'Fri', score: 85 },
    { name: 'Sat', score: 88 },
    { name: 'Sun', score: 91 },
];

const DashboardPage: React.FC<DashboardPageProps> = ({ plan, loggedActivities, onNavigate }) => {
    const todayActivities = plan ? [
        plan.mentalWellness.activities[0],
        plan.physicalWellness.activities[0],
        plan.digitalWellness.activities[0],
    ] : [];

    return (
        <div className="animate-fadeIn space-y-8">
            <header>
                <h1 className="text-4xl md:text-5xl font-bold">Hello, Sara</h1>
                <p className="text-lg text-soft-gray mt-2">Ready to balance your day?</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Balance Score" value="91%" change="+3%" changeType="increase" color="#C71585" icon={<HomeIcon />} />
                <StatCard title="Activities Done" value={`${loggedActivities.length}`} change="+1 Today" changeType="increase" color="#8A2BE2" icon={<ActivityIcon />} />
                <StatCard title="Current Streak" value="7 Days" change="+1" changeType="increase" color="#32CD32" icon={<ChecklistIcon />} />
                 <StatCard title="Plan Adherence" value="85%" change="-2%" changeType="decrease" color="#FFA500" icon={<WellnessPlanIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassCard className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4 neon-text-orchid">Weekly Balance</h2>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={balanceScoreData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 42, 0.8)', border: '1px solid #C71585', borderRadius: '12px' }}/>
                                <Line type="monotone" dataKey="score" stroke="#C71585" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
                <GlassCard>
                    <h2 className="text-2xl font-bold mb-4 neon-text-orchid">AI Coach Tip</h2>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orchid-purple/20 flex items-center justify-center">
                            <BotIcon className="w-5 h-5 text-neon-pink" />
                        </div>
                        <p className="text-soft-gray text-sm">Remember to take a 5-minute screen break every hour. Your eyes and mind will thank you! Try looking out a window and focusing on a distant object.</p>
                    </div>
                </GlassCard>
            </div>
            
             <GlassCard>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold neon-text-orchid">Today's Focus</h2>
                    <button onClick={() => onNavigate('plan')} className="text-sm text-neon-pink hover:underline">View Full Plan →</button>
                </div>
                {plan ? (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {todayActivities.map((activity, index) => (
                            <div key={index} className="bg-card-bg p-4 rounded-lg">
                                <h3 className="font-bold">{activity.name}</h3>
                                <p className="text-xs text-soft-gray">{activity.duration}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-soft-gray">You don't have a wellness plan yet.</p>
                        <NeonButton className="mt-4 max-w-xs mx-auto" onClick={() => onNavigate('quiz')}>
                            Start Your Assessment
                        </NeonButton>
                    </div>
                )}
            </GlassCard>

        </div>
    );
};

export default DashboardPage;
