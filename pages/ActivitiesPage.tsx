// Fix: Create the ActivitiesPage component.
import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { ActivityIcon, PlusIcon } from '../components/icons/NavIcons';

const activities = [
    { name: "Mindful Meditation", category: "Mental", icon: "🧠" },
    { name: "Morning Walk", category: "Physical", icon: "🚶" },
    { name: "Digital Detox", category: "Digital", icon: "📱" },
    { name: "Journaling", category: "Mental", icon: "✍️" },
    { name: "Yoga Session", category: "Physical", icon: "🧘" },
    { name: "Read a Book", category: "Digital", icon: "📖" },
];

const ActivitiesPage: React.FC = () => {
    return (
        <div className="animate-fadeIn">
             <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">Log Activities</h1>
                <p className="text-lg text-soft-gray mt-2">Keep track of your wellness journey.</p>
            </header>
            
            <GlassCard>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities.map(activity => (
                        <div key={activity.name} className="bg-card-bg/50 p-4 rounded-lg flex flex-col items-center text-center">
                            <span className="text-4xl mb-2">{activity.icon}</span>
                            <h3 className="font-bold">{activity.name}</h3>
                            <p className="text-xs text-neon-pink mb-3">{activity.category}</p>
                            <button className="mt-auto w-full text-xs py-2 bg-orchid-purple/50 rounded-full font-semibold hover:bg-orchid-purple/80 transition-colors flex items-center justify-center">
                                <PlusIcon className="w-3 h-3 mr-1" /> Log
                            </button>
                        </div>
                    ))}
                </div>
            </GlassCard>

            <GlassCard className="mt-8 text-center">
                <ActivityIcon className="w-12 h-12 text-soft-gray mx-auto mb-3" />
                <h2 className="text-xl font-bold">Custom Activity</h2>
                <p className="text-soft-gray text-sm mb-4">Can't find an activity? Add your own.</p>
                <div className="max-w-sm mx-auto">
                    <NeonButton>Add Custom Activity</NeonButton>
                </div>
            </GlassCard>
        </div>
    );
};

export default ActivitiesPage;
