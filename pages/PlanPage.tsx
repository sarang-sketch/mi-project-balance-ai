
import React, { useState } from 'react';
import { WellnessPlan, WellnessCategory, WellnessActivity, Page } from '../types';
import GlassCard from '../components/ui/GlassCard';
import ExerciseDemoModal from '../components/modals/ExerciseDemoModal';
import { BotIcon, VideoIcon } from '../components/icons/NavIcons';
import NeonButton from '../components/ui/NeonButton';

interface PlanPageProps {
    plan: WellnessPlan | null;
    onNavigate: (page: Page) => void;
}

const CategoryCard: React.FC<{ category: WellnessCategory, onActivitySelect: (activity: WellnessActivity) => void }> = ({ category, onActivitySelect }) => (
    <GlassCard>
        <h2 className="text-2xl font-bold mb-2 neon-text-orchid">{category.title}</h2>
        <p className="text-sm text-soft-gray mb-6">{category.description}</p>
        <div className="space-y-3">
            {(category?.activities || []).map((activity, index) => (
                <div 
                    key={index} 
                    className="bg-card-bg/50 p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-card-bg transition-colors"
                    onClick={() => onActivitySelect(activity)}
                >
                    <div>
                        <h4 className="font-bold">{activity.name}</h4>
                        <p className="text-xs text-soft-gray">{activity.duration}</p>
                    </div>
                    <span className="text-xs font-semibold text-neon-pink">View Demo →</span>
                </div>
            ))}
        </div>
    </GlassCard>
);

const PlanPage: React.FC<PlanPageProps> = ({ plan, onNavigate }) => {
    const [selectedActivity, setSelectedActivity] = useState<WellnessActivity | null>(null);

    if (!plan) {
        return (
            <div className="min-h-full flex flex-col justify-center items-center text-center">
                <h1 className="text-3xl font-bold">No Wellness Plan Found</h1>
                <p className="text-soft-gray mt-2">Please complete the initial assessment to generate your personalized plan.</p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn space-y-8">
             <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">Your Wellness Plan</h1>
                <p className="text-lg text-soft-gray mt-2">A personalized guide to a more balanced you.</p>
            </header>

            <GlassCard className="border-neon-pink/50">
                 <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orchid-purple/20 flex items-center justify-center">
                        <BotIcon className="w-6 h-6 text-neon-pink" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">AI Summary</h3>
                        <p className="text-soft-gray mt-1">{plan.summary}</p>
                    </div>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <CategoryCard category={plan.mentalWellness} onActivitySelect={setSelectedActivity} />
                <CategoryCard category={plan.physicalWellness} onActivitySelect={setSelectedActivity} />
                <CategoryCard category={plan.digitalWellness} onActivitySelect={setSelectedActivity} />
            </div>

            <GlassCard className="text-center">
                <h2 className="text-2xl font-bold neon-text-orchid">Bring Your Plan to Life</h2>
                <p className="text-soft-gray mt-2 mb-6">Use AI to generate a motivational video based on your personalized plan.</p>
                <div className="max-w-xs mx-auto">
                    <NeonButton onClick={() => onNavigate('video-creator')}>
                        <div className="flex items-center justify-center gap-2">
                            <VideoIcon className="w-5 h-5"/>
                            <span>Visualize Your Plan</span>
                        </div>
                    </NeonButton>
                </div>
            </GlassCard>

            {selectedActivity && (
                <ExerciseDemoModal 
                    activity={selectedActivity}
                    onClose={() => setSelectedActivity(null)}
                />
            )}
        </div>
    );
};

export default PlanPage;
