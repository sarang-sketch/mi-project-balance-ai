
import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';
import { XIcon } from '../icons/NavIcons';

interface AddActivityModalProps {
    onClose: () => void;
    onAddActivity: (activity: { name: string; category: 'Mental' | 'Physical' | 'Digital'; duration: string; }) => void;
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({ onClose, onAddActivity }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<'Mental' | 'Physical' | 'Digital'>('Physical');
    const [duration, setDuration] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !duration.trim()) return;
        onAddActivity({ name, category, duration });
    };

    return (
        <div
            className="fixed inset-0 bg-deep-black/70 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
            onClick={onClose}
        >
            <GlassCard
                className="relative max-w-md w-full m-4 border-2 border-neon-pink shadow-2xl shadow-neon-pink/40"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-neon-pink">Log a New Activity</h3>
                    <button
                        onClick={onClose}
                        className="text-soft-gray hover:text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-soft-gray" htmlFor="activityName">Activity Name</label>
                        <input
                            type="text"
                            id="activityName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink"
                            placeholder="e.g., 30-min Energizing Walk"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-soft-gray" htmlFor="duration">Duration</label>
                        <input
                            type="text"
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                            className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink"
                            placeholder="e.g., 30 mins"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-soft-gray" htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as 'Mental' | 'Physical' | 'Digital')}
                            className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-neon-pink"
                        >
                            <option>Physical</option>
                            <option>Mental</option>
                            <option>Digital</option>
                        </select>
                    </div>
                    <div className="pt-4">
                        <NeonButton type="submit">
                            Add Activity
                        </NeonButton>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default AddActivityModal;
