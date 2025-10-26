import React, { useState } from 'react';
import { WellnessPlan, WellnessActivity } from '../types';
import GlassCard from '../components/ui/GlassCard';
import { WellnessPlanIcon, PlusIcon } from '../components/icons/NavIcons';
import ExerciseDemoModal from '../components/modals/ExerciseDemoModal';

interface PlanPageProps {
    plan: WellnessPlan | null;
}

const ActivityCard: React.FC<{
    activity: WellnessActivity;
    onDemoClick: (activity: WellnessActivity) => void;
}> = ({ activity, onDemoClick }) => (
    <div className="bg-card-bg/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-grow">
            <h4 className="font-bold">{activity.name}</h4>
            <p className="text-sm text-soft-gray">{activity.description}</p>
            <p className="text-xs text-neon-pink mt-1">{activity.duration}</p>
        </div>
        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto justify-end flex-shrink-0">
            <button
                onClick={() => onDemoClick(activity)}
                className="px-3 py-1 text-xs bg-orchid-purple/50 rounded-full font-semibold hover:bg-orchid-purple/80 transition-colors w-full sm:w-auto"
            >
                Demo
            </button>
             <button className="px-3 py-1 text-xs bg-secondary-bg rounded-full font-semibold hover:bg-card-bg transition-colors flex items-center justify-center w-full sm:w-auto">
                <PlusIcon className="w-3 h-3 mr-1" /> Log
            </button>
        </div>
    </div>
);

const PlanPage: React.FC<PlanPageProps> = ({ plan }) => {
    const [selectedExercise, setSelectedExercise] = useState<WellnessActivity | null>(null);

    if (!plan) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <WellnessPlanIcon className="w-16 h-16 text-soft-gray mb-4" />
                <h2 className="text-2xl font-bold">No Wellness Plan Found</h2>
                <p className="text-soft-gray mt-2">Complete the initial assessment to generate your personalized plan.</p>
            </div>
        );
    }
    
    const { mentalWellness, physicalWellness, digitalWellness, summary } = plan;

    return (
        <div className="space-y-8 animate-fadeIn">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">Your AI Wellness Plan</h1>
                <p className="text-lg text-soft-gray mt-2 max-w-2xl mx-auto">{summary}</p>
            </header>

            <GlassCard>
                <h3 className="text-2xl font-bold mb-4">{mentalWellness.title} 🧠</h3>
                <p className="text-soft-gray mb-6">{mentalWellness.description}</p>
                <div className="space-y-4">
                    {mentalWellness.activities.map((activity, index) => (
                        <ActivityCard key={`mental-${index}`} activity={activity} onDemoClick={setSelectedExercise} />
                    ))}
                </div>
            </GlassCard>

            <GlassCard>
                <h3 className="text-2xl font-bold mb-4">{physicalWellness.title} 💪</h3>
                <p className="text-soft-gray mb-6">{physicalWellness.description}</p>
                <div className="space-y-4">
                    {physicalWellness.activities.map((activity, index) => (
                        <ActivityCard key={`physical-${index}`} activity={activity} onDemoClick={setSelectedExercise} />
                    ))}
                </div>
            </GlassCard>

            <GlassCard>
                <h3 className="text-2xl font-bold mb-4">{digitalWellness.title} 📱</h3>
                <p className="text-soft-gray mb-6">{digitalWellness.description}</p>
                <div className="space-y-4">
                    {digitalWellness.activities.map((activity, index) => (
                        <ActivityCard key={`digital-${index}`} activity={activity} onDemoClick={setSelectedExercise} />
                    ))}
                </div>
            </GlassCard>

            {selectedExercise && (
                <ExerciseDemoModal
                    activity={selectedExercise}
                    onClose={() => setSelectedExercise(null)}
                />
            )}
        </div>
    );
};

export default PlanPage;