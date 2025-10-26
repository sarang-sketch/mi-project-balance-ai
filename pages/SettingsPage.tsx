import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

const SettingsItem: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-4 border-b border-orchid-purple/20">
        <div>
            <h4 className="font-semibold text-lg">{title}</h4>
            <p className="text-sm text-soft-gray">{description}</p>
        </div>
        <div className="flex-shrink-0 pt-2 sm:pt-0">
            {children}
        </div>
    </div>
);

const ToggleSwitch: React.FC = () => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-neon-pink peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-pink"></div>
    </label>
);


const SettingsPage: React.FC = () => {
    return (
        <div className="py-12 animate-fadeIn">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">Settings</h1>
                <p className="text-lg text-soft-gray mt-2">Customize your BalanceAI experience.</p>
            </header>

            <GlassCard className="max-w-2xl mx-auto">
                <SettingsItem title="Dark Orchid Theme" description="Current theme">
                    <span className="font-bold text-neon-pink">Active</span>
                </SettingsItem>
                <SettingsItem title="Push Notifications" description="Daily goals and check-ins">
                    <ToggleSwitch />
                </SettingsItem>
                <SettingsItem title="Wearable Sync" description="Connect your fitness tracker">
                    <button className="text-sm py-1 px-3 bg-orchid-purple/50 rounded-full font-semibold hover:bg-orchid-purple/80 transition-colors">Connect</button>
                </SettingsItem>
                <SettingsItem title="WhatsApp Integration" description="Enable activity tracking">
                    <ToggleSwitch />
                </SettingsItem>
            </GlassCard>

             <GlassCard className="max-w-2xl mx-auto mt-8">
                <h3 className="text-xl font-bold neon-text-orchid mb-4">Data & Privacy</h3>
                 <SettingsItem title="Export My Data" description="Download all your personal data">
                    <button className="text-sm text-soft-gray hover:text-white">Export</button>
                 </SettingsItem>
                  <SettingsItem title="Delete Account" description="Permanently delete your account and data">
                     <button className="text-sm text-red-500 hover:text-red-400">Delete</button>
                 </SettingsItem>
            </GlassCard>
        </div>
    );
};

export default SettingsPage;