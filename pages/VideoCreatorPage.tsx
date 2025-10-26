// pages/VideoCreatorPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { WellnessPlan } from '../types';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { generateWellnessVideo, getWellnessVideoOperation } from '../services/geminiService';
import BrainLogo from '../components/ui/BrainLogo';
import { GenerateVideosOperation } from '@google/genai';

interface VideoCreatorPageProps {
    plan: WellnessPlan | null;
}

const loadingMessages = [
    "Warming up the digital canvas...",
    "Mixing vibrant digital paints...",
    "Teaching the AI about wellness...",
    "Rendering the first few frames...",
    "Applying a futuristic glow...",
    "This is taking a moment, your vision is complex and beautiful...",
    "Polishing the final cut...",
    "Almost there, preparing for playback..."
];

const VideoCreatorPage: React.FC<VideoCreatorPageProps> = ({ plan }) => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // FIX: Add defensive checks to prevent crash if the AI-generated plan is incomplete.
        if (
            plan &&
            plan.mentalWellness?.activities?.[0] &&
            plan.physicalWellness?.activities?.[0] &&
            plan.digitalWellness?.activities?.[0]
        ) {
            setPrompt(`An inspiring, futuristic video about a wellness journey. Visualize these concepts: for mental wellness, "${plan.mentalWellness.activities[0].name}"; for physical wellness, "${plan.physicalWellness.activities[0].name}"; and for digital wellness, "${plan.digitalWellness.activities[0].name}". The mood is uplifting and motivational, with neon accents and smooth transitions.`);
        } else {
            setPrompt("A futuristic video showing a person finding balance between mind, body, and technology, with glowing neon accents.");
        }
    }, [plan]);

    const checkApiKey = useCallback(async () => {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
        }
    }, []);

    useEffect(() => {
        checkApiKey();
    }, [checkApiKey]);

    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Assume success and update UI immediately to avoid race conditions
            setApiKeySelected(true); 
        }
    };
    
    const pollOperation = useCallback(async (operation: GenerateVideosOperation) => {
        try {
            const updatedOp = await getWellnessVideoOperation(operation);
            if (updatedOp.done) {
                setIsLoading(false);
                const uri = updatedOp.response?.generatedVideos?.[0]?.video?.uri;
                if (uri) {
                    // The URI needs the API key to be accessed
                    const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
                    const blob = await response.blob();
                    const videoUrl = URL.createObjectURL(blob);
                    setGeneratedVideoUrl(videoUrl);
                } else {
                    setError('Video generation completed, but no video was returned.');
                }
            } else {
                 // Cycle through loading messages
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    return loadingMessages[(currentIndex + 1) % loadingMessages.length];
                });
                setTimeout(() => pollOperation(updatedOp), 10000); // Poll every 10 seconds
            }
        } catch (e: any) {
            console.error("Polling error:", e);
             if (e.message.includes("Requested entity was not found")) {
                setError("Your API key is invalid or expired. Please select a new one.");
                setApiKeySelected(false); // Force re-selection
            } else {
                setError(`An error occurred while checking video status: ${e.message}`);
            }
            setIsLoading(false);
        }
    }, []);

    const handleGenerateVideo = async () => {
        setError(null);
        setIsLoading(true);
        setGeneratedVideoUrl(null);
        setLoadingMessage(loadingMessages[0]);

        try {
            const operation = await generateWellnessVideo(prompt, aspectRatio);
            pollOperation(operation);
        } catch (e: any) {
             if (e.message.includes("API key not valid")) {
                setError("Your API key is invalid or expired. Please select a new one to continue.");
                setApiKeySelected(false); // Force re-selection
            } else {
                setError(`Failed to start video generation: ${e.message}`);
            }
            setIsLoading(false);
        }
    };

    if (!apiKeySelected) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
                <GlassCard className="max-w-lg">
                    <h2 className="text-2xl font-bold neon-text-orchid mb-4">API Key Required for Video Generation</h2>
                    <p className="text-soft-gray mb-6">
                        The Veo 3 video model requires you to use your own API key. Please select a key to proceed. For more information on billing, visit the official documentation.
                    </p>
                     <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm text-neon-pink hover:underline mb-6 block">
                        View Billing Information
                    </a>
                    <NeonButton onClick={handleSelectKey}>
                        Select API Key
                    </NeonButton>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn space-y-8">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">AI Video Creator</h1>
                <p className="text-lg text-soft-gray mt-2">Turn your wellness plan into a motivational video.</p>
            </header>

            {isLoading ? (
                 <GlassCard className="text-center">
                    <BrainLogo isPulsing={true} className="w-16 h-16 mx-auto text-neon-pink" />
                    <h2 className="text-2xl font-bold mt-4">Generating Your Vision...</h2>
                    <p className="text-soft-gray mt-2">{loadingMessage}</p>
                 </GlassCard>
            ) : generatedVideoUrl ? (
                <GlassCard>
                    <h2 className="text-2xl font-bold mb-4 neon-text-orchid">Your Video is Ready!</h2>
                    <div className="aspect-video bg-deep-black rounded-lg overflow-hidden">
                       <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                    </div>
                    <button onClick={() => setGeneratedVideoUrl(null)} className="w-full mt-4 px-8 py-3 bg-transparent text-white font-bold rounded-full border-2 border-neon-pink/90 transition-all duration-300 transform hover:bg-neon-pink/20">
                        Create Another Video
                    </button>
                </GlassCard>
            ) : (
                <GlassCard>
                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-soft-gray" htmlFor="prompt">Video Prompt</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={5}
                                className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink"
                                placeholder="Describe the video you want to create..."
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-soft-gray">Aspect Ratio</label>
                            <div className="mt-2 flex gap-4">
                                {(['16:9', '9:16'] as const).map(ratio => (
                                    <button
                                        key={ratio}
                                        onClick={() => setAspectRatio(ratio)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${aspectRatio === ratio ? 'bg-neon-pink text-white' : 'bg-secondary-bg hover:bg-card-bg'}`}
                                    >
                                        {ratio === '16:9' ? 'Landscape (16:9)' : 'Portrait (9:16)'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <NeonButton onClick={handleGenerateVideo} disabled={isLoading}>
                            {isLoading ? 'Generating...' : 'Generate Video'}
                        </NeonButton>
                    </div>
                </GlassCard>
            )}
        </div>
    );
};

export default VideoCreatorPage;