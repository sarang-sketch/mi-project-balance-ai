import React, { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { BellIcon, CheckCircleIcon, ActivityIcon, ChecklistIcon, AlarmClockIcon, InfoIcon, PlusIcon } from '../components/icons/NavIcons';
import { Notification } from '../types';
import AddReminderModal from '../components/modals/AddReminderModal';
import NeonButton from '../components/ui/NeonButton';

interface NotificationsPageProps {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
}

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'goal':
            return <CheckCircleIcon className="w-5 h-5 text-accent-green" />;
        case 'streak':
            return <ActivityIcon className="w-5 h-5 text-yellow-400" />;
        case 'task':
            return <ChecklistIcon className="w-5 h-5 text-blue-400" />;
        case 'wakeup':
            return <AlarmClockIcon className="w-5 h-5 text-orange-400" />;
        case 'reminder':
            return <BellIcon className="w-5 h-5 text-neon-pink" />;
        case 'system':
        default:
            return <InfoIcon className="w-5 h-5 text-soft-gray" />;
    }
};

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, addNotification }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddReminder = (reminder: { text: string; time: string; }) => {
        addNotification({ ...reminder, type: 'reminder' });
        setIsModalOpen(false);
    };

    return (
        <div className="animate-fadeIn space-y-8">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">Notifications</h1>
                <p className="text-lg text-soft-gray mt-2">Stay up to date with your wellness journey.</p>
            </header>
            
            <div className="max-w-2xl mx-auto">
                 <NeonButton onClick={() => setIsModalOpen(true)} className="w-full mb-8 flex items-center justify-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add a Custom Reminder</span>
                </NeonButton>

                <GlassCard>
                    <div className="space-y-4">
                        {notifications.length > 0 ? notifications.map(notification => (
                            <div key={notification.id} className="flex items-start gap-4 p-4 rounded-lg bg-card-bg/50">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orchid-purple/30 flex items-center justify-center">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div>
                                    <p className="text-gray-300">{notification.text}</p>
                                    <p className="text-xs text-soft-gray mt-1">{notification.time}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-soft-gray text-center py-8">You have no notifications yet.</p>
                        )}
                    </div>
                </GlassCard>
            </div>

            {isModalOpen && (
                <AddReminderModal 
                    onClose={() => setIsModalOpen(false)}
                    onAddReminder={handleAddReminder}
                />
            )}
        </div>
    );
};

export default NotificationsPage;