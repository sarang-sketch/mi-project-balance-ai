import React, { useState, useRef } from 'react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { analyzeFoodImage, editImageWithText, analyzeDigitalHabits } from '../services/geminiService';
import BrainLogo from '../components/ui/BrainLogo';

const GOAL_PROMPTS: Record<string, string> = {
    'fatToFit': "Transform the person in this image to look physically fit, healthy, and happy, as if they have successfully completed a fitness journey. Show a noticeable but realistic reduction in body fat and an increase in muscle tone. They should look energized and confident.",
    'mentalWellness': "Subtly alter the person in this image to reflect a state of deep mental peace and wellness. Their expression should be serene and content, the lighting soft and calming, and their posture relaxed. The overall mood should be tranquil and mindful.",
    'digitalDetox': "Edit this image to show the person having a 'digital detox glow'. They should look refreshed, present, and free from digital distraction. Remove any phones or screens, and enhance the natural lighting to give them a healthy, vibrant appearance."
};


const ScannerPage: React.FC = () => {
    // State for Food Scanner
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [foodAnalysis, setFoodAnalysis] = useState<string | null>(null);
    const [isAnalyzingFood, setIsAnalyzingFood] = useState(false);
    const [foodError, setFoodError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State for Future Self Visualizer
    const [userImageSrc, setUserImageSrc] = useState<string | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<string>('fatToFit');
    const [futureImageSrc, setFutureImageSrc] = useState<string | null>(null);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [visualizerError, setVisualizerError] = useState<string | null>(null);
    const userFileInputRef = useRef<HTMLInputElement>(null);
    
    // State for Digital Wellness Check
    const [textInput, setTextInput] = useState<string>('');
    const [habitAnalysis, setHabitAnalysis] = useState<string | null>(null);
    const [isAnalyzingHabits, setIsAnalyzingHabits] = useState(false);
    const [habitError, setHabitError] = useState<string | null>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
                setFoodAnalysis(null);
                setFoodError(null);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleUserFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUserImageSrc(e.target?.result as string);
                setFutureImageSrc(null);
                setVisualizerError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeFood = async () => {
        if (!imageSrc) return;
        setIsAnalyzingFood(true);
        setFoodError(null);
        setFoodAnalysis(null);
        try {
            const parts = imageSrc.split(',');
            const mimeType = parts[0].match(/:(.*?);/)?.[1];
            const base64Data = parts[1];
            
            if (!mimeType || !base64Data) throw new Error("Invalid image format.");

            const result = await analyzeFoodImage(base64Data, mimeType);
            setFoodAnalysis(result);
        } catch (e: any) {
            setFoodError(e.message);
        } finally {
            setIsAnalyzingFood(false);
        }
    };

    const handleVisualize = async () => {
        if (!userImageSrc) return;
        setIsVisualizing(true);
        setVisualizerError(null);
        setFutureImageSrc(null);
        try {
            const parts = userImageSrc.split(',');
            const mimeType = parts[0].match(/:(.*?);/)?.[1];
            const base64Data = parts[1];
            
            if (!mimeType || !base64Data) throw new Error("Invalid image format.");

            const prompt = GOAL_PROMPTS[selectedGoal];
            const resultBase64 = await editImageWithText(base64Data, mimeType, prompt);
            setFutureImageSrc(`data:image/png;base64,${resultBase64}`);

        } catch (e: any) {
            setVisualizerError(e.message);
        } finally {
            setIsVisualizing(false);
        }
    };
    
    const handleAnalyzeHabits = async () => {
        if (!textInput.trim()) return;
        setIsAnalyzingHabits(true);
        setHabitError(null);
        setHabitAnalysis(null);
        try {
            const result = await analyzeDigitalHabits(textInput);
            setHabitAnalysis(result);
        } catch (e: any) {
            setHabitError(e.message);
        } finally {
            setIsAnalyzingHabits(false);
        }
    };


    return (
        <div className="space-y-12 animate-fadeIn">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">AI Scanners</h1>
                <p className="text-lg text-soft-gray mt-2">Get insights from your world.</p>
            </header>

            <GlassCard className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 neon-text-orchid">Food Image Scanner</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <div className="aspect-square w-full bg-deep-black/30 border-2 border-dashed border-orchid-purple/50 rounded-lg flex items-center justify-center">
                            {imageSrc ? <img src={imageSrc} alt="Food to be analyzed" className="object-contain max-h-full max-w-full rounded-lg" /> : <p className="text-soft-gray">Upload an image of your meal</p>}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <NeonButton onClick={() => fileInputRef.current?.click()} className="mt-4">
                            Upload Image
                        </NeonButton>
                        {imageSrc && (
                             <button onClick={handleAnalyzeFood} disabled={isAnalyzingFood} className="w-full mt-2 px-8 py-3 bg-transparent text-white font-bold rounded-full border-2 border-neon-pink/90 transition-all duration-300 transform hover:bg-neon-pink/20">
                                {isAnalyzingFood ? 'Analyzing...' : 'Analyze Food'}
                            </button>
                        )}
                    </div>

                    <div className="min-h-[200px]">
                        <h3 className="font-bold text-lg mb-2">Analysis:</h3>
                        {isAnalyzingFood && <div className="flex flex-col items-center justify-center text-center space-y-4 pt-8"><BrainLogo isPulsing={true} className="w-12 h-12 text-neon-pink" /><p className="text-soft-gray">AI is analyzing your meal...</p></div>}
                        {foodError && <p className="text-red-400">{foodError}</p>}
                        {foodAnalysis && <div className="prose prose-invert prose-sm text-gray-300" dangerouslySetInnerHTML={{ __html: foodAnalysis.replace(/\n/g, '<br />') }} />}
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 neon-text-orchid">Digital Wellness Check</h2>
                <div>
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={4}
                        className="w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg p-2 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink"
                        placeholder="Paste text to check for negativity, or describe your screen time habits..."
                    />
                    <NeonButton onClick={handleAnalyzeHabits} disabled={isAnalyzingHabits} className="mt-4">
                        {isAnalyzingHabits ? 'Analyzing...' : 'Analyze My Habits'}
                    </NeonButton>
                </div>
                 <div className="min-h-[100px] mt-4">
                    <h3 className="font-bold text-lg mb-2">AI Coach Analysis:</h3>
                    {isAnalyzingHabits && <div className="flex items-center gap-4 pt-4"><BrainLogo isPulsing={true} className="w-8 h-8 text-neon-pink" /><p className="text-soft-gray">AI is analyzing your input...</p></div>}
                    {habitError && <p className="text-red-400">{habitError}</p>}
                    {habitAnalysis && <div className="prose prose-invert prose-sm text-gray-300" dangerouslySetInnerHTML={{ __html: habitAnalysis.replace(/\n/g, '<br />') }} />}
                </div>
            </GlassCard>

            <GlassCard className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 neon-text-orchid">Future Self Visualizer</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <div className="aspect-square w-full bg-deep-black/30 border-2 border-dashed border-orchid-purple/50 rounded-lg flex items-center justify-center">
                            {userImageSrc ? <img src={userImageSrc} alt="User before" className="object-contain max-h-full max-w-full rounded-lg" /> : <p className="text-soft-gray">Upload a photo of yourself</p>}
                        </div>
                        <input type="file" accept="image/*" ref={userFileInputRef} onChange={handleUserFileChange} className="hidden" />
                        <NeonButton onClick={() => userFileInputRef.current?.click()}>
                            Upload Your Photo
                        </NeonButton>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-soft-gray">Select Your Goal</label>
                            <select value={selectedGoal} onChange={e => setSelectedGoal(e.target.value)} className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-neon-pink">
                                <option value="fatToFit">Fat to Fit</option>
                                <option value="mentalWellness">Improve Mental Wellness</option>
                                <option value="digitalDetox">Digital Detox Glow</option>
                            </select>
                        </div>
                        <NeonButton onClick={handleVisualize} disabled={isVisualizing || !userImageSrc}>
                            {isVisualizing ? 'Visualizing...' : 'Visualize My Future Self'}
                        </NeonButton>
                        {visualizerError && <p className="text-red-400 text-sm">{visualizerError}</p>}
                    </div>
                </div>

                {isVisualizing && <div className="flex flex-col items-center justify-center text-center space-y-4 pt-8"><BrainLogo isPulsing={true} className="w-12 h-12 text-neon-pink" /><p className="text-soft-gray">AI is visualizing your transformation...</p></div>}

                {futureImageSrc && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-center mb-4 neon-text-orchid">Your Transformation</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-center mb-2">Before</h4>
                                <img src={userImageSrc!} alt="Before transformation" className="rounded-lg" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-center mb-2">After</h4>
                                <img src={futureImageSrc} alt="After transformation" className="rounded-lg" />
                            </div>
                        </div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default ScannerPage;
