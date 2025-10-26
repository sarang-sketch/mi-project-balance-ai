import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';
import { XIcon } from '../icons/NavIcons';
import BrainLogo from '../ui/BrainLogo';
import { analyzeDigitalHabits } from '../../services/geminiService';

interface ScreenMonitorModalProps {
    onClose: () => void;
}

const ScreenMonitorModal: React.FC<ScreenMonitorModalProps> = ({ onClose }) => {
    const [textInput, setTextInput] = useState<string>('');
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!textInput.trim()) return;
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await analyzeDigitalHabits(textInput);
            setAnalysis(result);
        } catch (e: any) {
            setError(e.message || "An error occurred during analysis.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-deep-black/70 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
            onClick={onClose}
        >
            <GlassCard 
                className="relative max-w-lg w-full m-4 border-2 border-neon-pink shadow-2xl shadow-neon-pink/40 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-neon-pink">AI Screen Monitor</h3>
                     <button 
                        onClick={onClose} 
                        className="text-soft-gray hover:text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                     <p className="text-sm text-soft-gray">Get instant digital wellness feedback. Paste text to check for negativity, or describe your screen time habits for advice.</p>
                     <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={5}
                        className="w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg p-2 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink"
                        placeholder="Paste text here or describe your habits..."
                    />
                    <NeonButton onClick={handleAnalyze} disabled={isLoading}>
                        {isLoading ? 'Analyzing...' : 'Get AI Insight'}
                    </NeonButton>
                </div>
                
                 <div className="mt-4 pt-4 border-t border-orchid-purple/20 min-h-[100px] overflow-y-auto">
                    <h4 className="font-bold text-lg mb-2">Analysis:</h4>
                    {isLoading && <div className="flex items-center gap-4 pt-4"><BrainLogo isPulsing={true} className="w-8 h-8 text-neon-pink" /><p className="text-soft-gray">AI is analyzing your input...</p></div>}
                    {error && <p className="text-red-400">{error}</p>}
                    {analysis && <div className="prose prose-invert prose-sm text-gray-300" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />}
                </div>

            </GlassCard>
        </div>
    );
};

export default ScreenMonitorModal;