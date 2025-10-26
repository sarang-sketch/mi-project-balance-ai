import React, { useState, useRef } from 'react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { analyzeFoodImage } from '../services/geminiService';
import BrainLogo from '../components/ui/BrainLogo';

const ScannerPage: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
                setAnalysis(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!imageSrc) return;
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            // base64 string is "data:mime/type;base64,..." - we need to split it
            const parts = imageSrc.split(',');
            const mimeType = parts[0].match(/:(.*?);/)?.[1];
            const base64Data = parts[1];
            
            if (!mimeType || !base64Data) {
                throw new Error("Invalid image format.");
            }

            const result = await analyzeFoodImage(base64Data, mimeType);
            setAnalysis(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-12 animate-fadeIn">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">AI Scanners</h1>
                <p className="text-lg text-soft-gray mt-2">Get insights from your world.</p>
            </header>

            <GlassCard className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 neon-text-orchid">Food Image Scanner</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <div className="aspect-square w-full bg-deep-black/30 border-2 border-dashed border-orchid-purple/50 rounded-lg flex items-center justify-center">
                            {imageSrc ? (
                                <img src={imageSrc} alt="Food to be analyzed" className="object-contain max-h-full max-w-full rounded-lg" />
                            ) : (
                                <p className="text-soft-gray">Upload an image of your meal</p>
                            )}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <NeonButton onClick={() => fileInputRef.current?.click()} className="mt-4">
                            Upload Image
                        </NeonButton>
                        {imageSrc && (
                             <button onClick={handleAnalyze} disabled={isLoading} className="w-full mt-2 px-8 py-3 bg-transparent text-white font-bold rounded-full border-2 border-neon-pink/90 transition-all duration-300 transform hover:bg-neon-pink/20">
                                {isLoading ? 'Analyzing...' : 'Analyze Food'}
                            </button>
                        )}
                    </div>

                    <div className="min-h-[200px]">
                        <h3 className="font-bold text-lg mb-2">Analysis:</h3>
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center text-center space-y-4 pt-8">
                                <BrainLogo isPulsing={true} className="w-12 h-12 text-neon-pink" />
                                <p className="text-soft-gray">AI is analyzing your meal...</p>
                            </div>
                        )}
                        {error && <p className="text-red-400">{error}</p>}
                        {analysis && (
                            <div className="prose prose-invert prose-sm text-gray-300" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
                        )}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default ScannerPage;
