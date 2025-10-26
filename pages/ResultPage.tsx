import React, { useMemo, useState, useEffect } from 'react';
import { QuizAnswers, WellnessPlan } from '../types';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { generateWellnessPlan } from '../services/geminiService';
import BrainLogo from '../components/ui/BrainLogo';

interface ResultPageProps {
  answers: QuizAnswers | null;
  onPlanGenerated: (plan: WellnessPlan) => void;
}

type MoodResult = {
    title: string;
    description: string;
    glowClass: string;
    icon: string;
};

const ResultPage: React.FC<ResultPageProps> = ({ answers, onPlanGenerated }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [animatedScore, setAnimatedScore] = useState(0);

    const { score, mood } = useMemo(() => {
        if (!answers) return { score: 0, mood: null };
        let totalScore = 0;
        // Simple scoring: lower index for answer = better score (0 is best). Max score is 4 per question.
        const totalPossibleScore = Object.keys(answers).length * 4; 
        Object.values(answers).forEach(answerIndex => {
            // FIX: Explicitly convert answerIndex to a number to prevent type errors in arithmetic operations.
            totalScore += (4 - Number(answerIndex));
        });

        const percentage = Math.max(0, Math.min(100, Math.round((totalScore / totalPossibleScore) * 100)));
        
        let moodResult: MoodResult;
        if (percentage > 75) {
            moodResult = { title: "Balanced", icon: "🌟", description: "You're in a great state of harmony. Let's keep the momentum going!", glowClass: 'border-neon-pink shadow-neon-pink/40' };
        } else if (percentage > 45) {
            moodResult = { title: "Needs Attention", icon: "🌤️", description: "A few areas could use a little boost. We can build a plan to find more balance.", glowClass: 'border-orchid-purple shadow-orchid-purple/30' };
        } else {
            moodResult = { title: "Overloaded", icon: "🌧️", description: "It seems like you're carrying a heavy load. Let's create a gentle plan to support you.", glowClass: 'border-blue-400 shadow-blue-400/30' };
        }
        return { score: percentage, mood: moodResult };
    }, [answers]);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedScore(score), 300);
        return () => clearTimeout(timer);
    }, [score]);


    const handleGeneratePlan = async () => {
        if (!answers) return;
        setIsLoading(true);
        setError(null);
        try {
            // Placeholder goals, can be expanded with a goal selection step
            const goals = ["Improve mental clarity", "Increase physical energy"];
            const plan = await generateWellnessPlan(answers, goals);
            onPlanGenerated(plan);
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!answers || !mood) {
        return <div className="min-h-screen flex justify-center items-center">Loading results...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center py-12">
            <GlassCard className={`w-full max-w-md mx-auto animate-fadeIn ${mood.glowClass}`}>
                <span className="text-6xl">{mood.icon}</span>
                <h2 className={`text-4xl font-bold mt-4 ${mood.title === 'Balanced' ? 'text-neon-pink' : mood.title === 'Needs Attention' ? 'text-orchid-purple' : 'text-blue-400'}`}>{mood.title}</h2>
                <p className="text-soft-gray mt-2">{mood.description}</p>
            </GlassCard>

            <GlassCard className="w-full max-w-md mx-auto mt-8 animate-fadeIn-delay-1">
                <h3 className="text-xl font-bold neon-text-orchid">Your Balance Score</h3>
                <div className="relative my-4">
                    <p className="text-6xl font-bold">{animatedScore}%</p>
                    <div className="w-full bg-gray-700/50 rounded-full h-3 mt-2 border border-orchid-purple/20">
                        <div className="progress-bar-fill h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${animatedScore}%` }}></div>
                    </div>
                </div>
                <p className="text-xs text-soft-gray/70">This score reflects your cognitive, physical, and digital wellness based on your quiz answers.</p>
            </GlassCard>
            
            <div className="w-full max-w-md mx-auto mt-8 animate-fadeIn-delay-2">
                {error && <p className="text-red-400 mb-4">{error}</p>}
                <NeonButton onClick={handleGeneratePlan} disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                           <BrainLogo isPulsing={true} className="w-6 h-6 mr-2" /> Generating Plan...
                        </div>
                    ) : (
                        'Generate Personalized Plan 🖤'
                    )}
                </NeonButton>
            </div>
        </div>
    );
};

export default ResultPage;