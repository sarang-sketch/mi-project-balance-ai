import React, { useState } from 'react';
import { LoggedActivity } from '../types';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import AddActivityModal from '../components/modals/AddActivityModal';
import { PlusIcon, ActivityIcon, ChecklistIcon } from '../components/icons/NavIcons';
import BrainLogo from '../components/ui/BrainLogo';


interface ActivitiesPageProps {
    loggedActivities: LoggedActivity[];
    onAddActivity: (activity: { name: string; category: 'Mental' | 'Physical' | 'Digital'; duration: string; }) => void;
}

const CategoryBadge: React.FC<{ category: LoggedActivity['category'] }> = ({ category }) => {
    const styles = {
        Mental: 'bg-blue-500/20 text-blue-300',
        Physical: 'bg-neon-pink/20 text-neon-pink',
        Digital: 'bg-yellow-500/20 text-yellow-300',
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[category]}`}>{category}</span>;
};

const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ loggedActivities, onAddActivity }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleAddActivity = (activity: { name: string; category: 'Mental' | 'Physical' | 'Digital'; duration: string; }) => {
        onAddActivity(activity);
        setIsModalOpen(false);
    };

    return (
        <div className="animate-fadeIn space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">My Activities</h1>
                    <p className="text-lg text-soft-gray mt-2">A log of your wellness journey.</p>
                </div>
                <NeonButton onClick={() => setIsModalOpen(true)} className="w-auto px-4 py-2 flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    <span>Log Activity</span>
                </NeonButton>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <GlassCard className="text-center p-4">
                     <div className="w-10 h-10 mx-auto rounded-full bg-orchid-purple/20 flex items-center justify-center mb-2">
                        <ChecklistIcon className="w-6 h-6 text-neon-pink" />
                    </div>
                    <p className="text-2xl font-bold">{loggedActivities.length}</p>
                    <p className="text-sm text-soft-gray">Total Activities Logged</p>
                </GlassCard>
                 <GlassCard className="text-center p-4">
                     <div className="w-10 h-10 mx-auto rounded-full bg-orchid-purple/20 flex items-center justify-center mb-2">
                        <ActivityIcon className="w-6 h-6 text-accent-green" />
                    </div>
                    <p className="text-2xl font-bold">{loggedActivities.filter(a => a.category === 'Physical').length}</p>
                    <p className="text-sm text-soft-gray">Physical Activities</p>
                </GlassCard>
                <GlassCard className="text-center p-4">
                     <div className="w-10 h-10 mx-auto rounded-full bg-orchid-purple/20 flex items-center justify-center mb-2">
                         <BrainLogo isPulsing={false} className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold">{loggedActivities.filter(a => a.category === 'Mental').length}</p>
                    <p className="text-sm text-soft-gray">Mental Activities</p>
                </GlassCard>
            </div>
            
            <GlassCard>
                <h2 className="text-2xl font-bold mb-4 neon-text-orchid">Activity Log</h2>
                <div className="space-y-3">
                    {loggedActivities.length > 0 ? loggedActivities.map((activity, index) => (
                        <div key={index} className="bg-card-bg p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{activity.name}</h3>
                                <p className="text-xs text-soft-gray">{activity.duration} • {activity.time}</p>
                            </div>
                            <CategoryBadge category={activity.category} />
                        </div>
                    )) : (
                        <p className="text-soft-gray text-center py-8">No activities logged yet. Add one to get started!</p>
                    )}
                </div>
            </GlassCard>

            {isModalOpen && (
                <AddActivityModal 
                    onClose={() => setIsModalOpen(false)}
                    onAddActivity={handleAddActivity}
                />
            )}
        </div>
    );
};

export default ActivitiesPage;
