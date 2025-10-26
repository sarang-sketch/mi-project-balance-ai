import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area } from 'recharts';
import { ActivityIcon } from '../components/icons/NavIcons';

// Mock data for the charts
const balanceScoreData = [
    { date: '2 wks ago', score: 65 },
    { date: '13 days ago', score: 68 },
    { date: '12 days ago', score: 72 },
    { date: '11 days ago', score: 70 },
    { date: '10 days ago', score: 75 },
    { date: '9 days ago', score: 78 },
    { date: '8 days ago', score: 82 },
    { date: '7 days ago', score: 80 },
    { date: '6 days ago', score: 85 },
    { date: '5 days ago', score: 88 },
    { date: '4 days ago', score: 86 },
    { date: '3 days ago', score: 90 },
    { date: 'Yesterday', score: 92 },
    { date: 'Today', score: 91 },
];

const activityFocusData = [
    { category: 'Mental', count: 8, fullMark: 15 },
    { category: 'Physical', count: 12, fullMark: 15 },
    { category: 'Digital', count: 5, fullMark: 15 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-2 border-neon-pink/50">
                <p className="label text-sm text-soft-gray">{`${label}`}</p>
                <p className="intro text-md font-bold text-white">{`Score : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <GlassCard className="text-center p-4">
        <div className="w-10 h-10 mx-auto rounded-full bg-orchid-purple/20 flex items-center justify-center mb-2">
            {icon}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-soft-gray">{title}</p>
    </GlassCard>
);

const ProgressPage: React.FC = () => {
    return (
        <div className="animate-fadeIn space-y-8">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">My Progress</h1>
                <p className="text-lg text-soft-gray mt-2">Visualize your wellness journey over time.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard title="Current Streak" value="7 Days" icon={<ActivityIcon className="w-6 h-6 text-accent-green" />} />
                 <StatCard title="Total Activities" value="42" icon={<ActivityIcon className="w-6 h-6 text-neon-pink" />} />
                 <StatCard title="Best Score" value="92%" icon={<ActivityIcon className="w-6 h-6 text-orchid-purple" />} />
            </div>

            <GlassCard>
                <h2 className="text-2xl font-bold mb-6 neon-text-orchid">Balance Score Over Time</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={balanceScoreData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#C71585" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#C71585" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#8B5A8B" strokeOpacity={0.1} />
                            <XAxis dataKey="date" stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(199, 21, 133, 0.1)' }}/>
                            <Area type="monotone" dataKey="score" stroke="#C71585" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <GlassCard>
                <h2 className="text-2xl font-bold mb-6 neon-text-orchid">Activity Focus</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={activityFocusData}>
                            <PolarGrid stroke="#8B5A8B" strokeOpacity={0.2} />
                            <PolarAngleAxis dataKey="category" stroke="#a0a0a0" fontSize={14} />
                            <Radar name="Activities" dataKey="count" stroke="#C71585" fill="#C71585" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>
        </div>
    );
};

export default ProgressPage;