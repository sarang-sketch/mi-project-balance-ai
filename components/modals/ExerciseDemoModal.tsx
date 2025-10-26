import React, { useState, useEffect } from 'react';
import { WellnessActivity } from '../../types';
import GlassCard from '../ui/GlassCard';
import { XIcon } from '../icons/NavIcons';
import { PlayIcon, StopIcon } from '../icons/MediaIcons';

interface ExerciseDemoModalProps {
    activity: WellnessActivity;
    onClose: () => void;
}

const getVideoForActivity = (activityName: string): string => {
    const name = activityName.toLowerCase();
    if (name.includes('meditation') || name.includes('mindful')) {
        return 'https://videos.pexels.com/video-files/4496279/4496279-hd_1280_720_25fps.mp4';
    }
    if (name.includes('stretch') || name.includes('yoga')) {
        return 'https://videos.pexels.com/video-files/4056462/4056462-hd_1920_1080_25fps.mp4';
    }
    if (name.includes('walk') || name.includes('journal')) {
        return 'https://videos.pexels.com/video-files/8009224/8009224-hd_1920_1080_24fps.mp4';
    }
    return 'https://videos.pexels.com/video-files/3254013/3254013-hd_1920_1080_25fps.mp4';
};


const ExerciseDemoModal: React.FC<ExerciseDemoModalProps> = ({ activity, onClose }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const videoSrc = getVideoForActivity(activity.name);
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const handleToggleSpeech = () => {
        if (typeof window.speechSynthesis === 'undefined') {
            alert("Sorry, your browser doesn't support text-to-speech.");
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const fullText = activity.instructions.join('. ');
            const utterance = new SpeechSynthesisUtterance(fullText);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
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
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-neon-pink pr-8">{activity.name}</h3>
                        <p className="text-sm text-neon-pink">{activity.duration}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-soft-gray hover:text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-4 aspect-video bg-deep-black rounded-lg overflow-hidden flex-shrink-0">
                    <video
                        key={videoSrc}
                        className="w-full h-full object-cover"
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>

                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="flex justify-between items-center mb-3">
                         <h4 className="font-bold">Instructions:</h4>
                         <button onClick={handleToggleSpeech} className="px-3 py-1 text-xs bg-orchid-purple/50 rounded-full font-semibold hover:bg-orchid-purple/80 transition-colors flex items-center gap-1.5">
                            {isSpeaking ? <StopIcon className="w-3 h-3" /> : <PlayIcon className="w-3 h-3" />}
                            <span>{isSpeaking ? 'Stop Narration' : 'Play Narration'}</span>
                         </button>
                    </div>
                    <p className="text-sm text-soft-gray mb-4">{activity.description}</p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                        {activity.instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </GlassCard>
        </div>
    );
};

export default ExerciseDemoModal;