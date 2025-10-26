import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import { UserIcon, BellIcon, ChecklistIcon } from '../components/icons/NavIcons';

const SettingsToggle: React.FC<{ label: string; description: string; enabled: boolean }> = ({ label, description, enabled }) => (
    <div className="flex justify-between items-center">
        <div>
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-soft-gray">{description}</p>
        </div>
        <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${enabled ? 'bg-neon-pink' : 'bg-secondary-bg'}`}>
            <div className={`w-6 h-6 rounded-full bg-white transform transition-transform ${enabled ? 'translate-x-6' : ''}`} />
        </div>
    </div>
);

const SettingsPage: React.FC = () => {
    return (
        <div className="animate-fadeIn space-y-8">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">Settings</h1>
                <p className="text-lg text-soft-gray mt-2">Manage your account and preferences.</p>
            </header>
            
            <div className="max-w-2xl mx-auto space-y-8">
                <GlassCard>
                    <div className="flex items-center gap-4 mb-6">
                         <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orchid-purple/30 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-soft-gray"/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Profile</h2>
                            <p className="text-sm text-soft-gray">Manage your personal information.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <button className="w-full text-left p-3 bg-card-bg/50 rounded-lg hover:bg-card-bg transition-colors">Change Name</button>
                        <button className="w-full text-left p-3 bg-card-bg/50 rounded-lg hover:bg-card-bg transition-colors">Change Email</button>
                        <button className="w-full text-left p-3 bg-card-bg/50 rounded-lg hover:bg-card-bg transition-colors">Change Password</button>
                    </div>
                </GlassCard>

                 <GlassCard>
                    <div className="flex items-center gap-4 mb-6">
                         <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orchid-purple/30 flex items-center justify-center">
                            <BellIcon className="w-6 h-6 text-soft-gray"/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Notifications</h2>
                            <p className="text-sm text-soft-gray">Control how you receive alerts.</p>
                        </div>
                    </div>
                     <div className="space-y-6">
                        <SettingsToggle label="Push Notifications" description="Receive alerts on your device" enabled={true} />
                        <SettingsToggle label="Email Summaries" description="Get weekly progress reports" enabled={true} />
                        <SettingsToggle label="Community Alerts" description="Notify me of new community posts" enabled={false} />
                    </div>
                </GlassCard>
                
                 <GlassCard>
                    <div className="flex items-center gap-4 mb-6">
                         <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orchid-purple/30 flex items-center justify-center">
                            <ChecklistIcon className="w-6 h-6 text-soft-gray"/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Data & Privacy</h2>
                             <p className="text-sm text-soft-gray">Manage your data and privacy settings.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                         <button className="w-full text-left p-3 bg-card-bg/50 rounded-lg hover:bg-card-bg transition-colors">Export My Data</button>
                         <button className="w-full text-left p-3 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">Delete My Account</button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default SettingsPage;
