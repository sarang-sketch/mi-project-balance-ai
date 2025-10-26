import React, { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { BellIcon, CheckCircleIcon, UsersIcon, AlertTriangleIcon, PhoneIcon } from '../components/icons/NavIcons';
import { Notification } from '../types';

const initialNotifications: Notification[] = [
    { id: 1, type: 'goal', message: 'You completed your 30-minute walk goal!', time: '2h ago' },
    { id: 2, type: 'family', message: 'Family update: Alex hit their step goal!', time: 'Yesterday' },
    { id: 3, type: 'check-in', message: '🖤 Balance check-in time! How are you feeling today?', time: '3 days ago' },
];

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    const iconClass = "w-6 h-6";
    switch (type) {
        case 'goal': return <CheckCircleIcon className={`${iconClass} text-accent-green`} />;
        case 'family': return <UsersIcon className={`${iconClass} text-blue-400`} />;
        case 'check-in': return <BellIcon className={`${iconClass} text-orchid-purple`} />;
        case 'alert': return <AlertTriangleIcon className={`${iconClass} text-yellow-400`} />;
        case 'call': return <PhoneIcon className={`${iconClass} text-sky-400`} />;
        default: return <BellIcon className={`${iconClass} text-soft-gray`} />;
    }
};

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [isScheduling, setIsScheduling] = useState(false);
    const [reminderType, setReminderType] = useState<'SMS Reminder' | 'Voice Call Check-in'>('SMS Reminder');

    const handleSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        setIsScheduling(true);
        // Mock API call
        setTimeout(() => {
            const isCall = reminderType === 'Voice Call Check-in';
            const newNotification: Notification = {
                id: Date.now(),
                type: isCall ? 'call' : 'check-in',
                message: isCall 
                    ? 'Your scheduled voice call check-in was placed.' 
                    : 'Your scheduled SMS check-in was sent.',
                time: 'Just now'
            };
            setNotifications(prev => [newNotification, ...prev]);
            setIsScheduling(false);
            alert(`Reminder scheduled successfully! (${reminderType})`);
        }, 1500);
    };

    return (
        <div className="animate-fadeIn space-y-12">
             <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">Notifications & Reminders</h1>
                <p className="text-lg text-soft-gray mt-2">Manage your alerts and scheduled check-ins.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <GlassCard className="lg:col-span-1">
                    <h2 className="text-2xl font-bold mb-4 neon-text-orchid">Timeline</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {notifications.map((notification) => (
                             <div key={notification.id} className="flex items-start space-x-4 p-3 bg-card-bg/50 rounded-lg">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-bg flex items-center justify-center">
                                    <NotificationIcon type={notification.type} />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm text-light-gray">{notification.message}</p>
                                    <p className="text-xs text-soft-gray mt-1">{notification.time}</p>
                                </div>
                             </div>
                        ))}
                    </div>
                </GlassCard>

                 <GlassCard className="lg:col-span-1">
                    <h2 className="text-2xl font-bold mb-4 neon-text-orchid">Schedule a Reminder</h2>
                    <form onSubmit={handleSchedule} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-soft-gray" htmlFor="reminderType">Type</label>
                            <select 
                                id="reminderType" 
                                value={reminderType}
                                onChange={(e) => setReminderType(e.target.value as 'SMS Reminder' | 'Voice Call Check-in')}
                                className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-neon-pink"
                            >
                                <option>SMS Reminder</option>
                                <option>Voice Call Check-in</option>
                            </select>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-soft-gray" htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" placeholder="(555) 123-4567" required className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-soft-gray" htmlFor="datetime">Date & Time</label>
                            <input type="datetime-local" id="datetime" required className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink" />
                        </div>
                        <NeonButton type="submit" disabled={isScheduling}>
                            {isScheduling ? 'Scheduling...' : 'Schedule Now'}
                        </NeonButton>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
};

export default NotificationsPage;