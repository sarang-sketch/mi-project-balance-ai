import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';
import { XIcon } from '../icons/NavIcons';

interface AddReminderModalProps {
    onClose: () => void;
    onAddReminder: (reminder: { text: string; time: string; }) => void;
}

const AddReminderModal: React.FC<AddReminderModalProps> = ({ onClose, onAddReminder }) => {
    const [text, setText] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !time.trim()) return;
        onAddReminder({ text, time });
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
                    <h3 className="text-2xl font-bold text-neon-pink">Add a New Reminder</h3>
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
                        <label className="text-sm font-medium text-soft-gray" htmlFor="reminderText">Reminder</label>
                        <input
                            type="text"
                            id="reminderText"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                            className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink"
                            placeholder="e.g., Drink a glass of water"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-soft-gray" htmlFor="reminderTime">Time</label>
                        <input
                            type="text"
                            id="reminderTime"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink"
                            placeholder="e.g., In 15 minutes, or at 3:00 PM"
                        />
                    </div>
                    <div className="pt-4">
                        <NeonButton type="submit">
                            Set Reminder
                        </NeonButton>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default AddReminderModal;
