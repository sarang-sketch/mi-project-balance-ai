import React from 'react';
import GlassCard from '../ui/GlassCard';
import { XIcon } from '../icons/NavIcons';

interface ScreenMonitorModalProps {
    onClose: () => void;
}

const ScreenMonitorModal: React.FC<ScreenMonitorModalProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-deep-black/70 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
            onClick={onClose}
        >
            <GlassCard 
                className="relative max-w-lg w-full m-4 border-2 border-neon-pink shadow-2xl shadow-neon-pink/40"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-neon-pink">Screen Time Monitor</h3>
                     <button 
                        onClick={onClose} 
                        className="text-soft-gray hover:text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-soft-gray">This feature is coming soon! It will help you monitor your screen time and promote digital wellness.</p>
            </GlassCard>
        </div>
    );
};

export default ScreenMonitorModal;
