

import React from 'react';
import { Page } from '../../types';
import BrainLogo from '../ui/BrainLogo';
import { HomeIcon, WellnessPlanIcon, ScanIcon, ActivityIcon, MicIcon, UsersIcon, SettingsIcon, VideoIcon, BellIcon, MapPinIcon, BotIcon } from '../icons/NavIcons';

interface SidebarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const mainNavItems = [
    { page: 'dashboard' as Page, icon: HomeIcon, label: 'Dashboard' },
    { page: 'plan' as Page, icon: WellnessPlanIcon, label: 'Wellness Plan' },
    { page: 'progress' as Page, icon: ActivityIcon, label: 'My Progress' },
];

const toolsNavItems = [
    { page: 'activity-tracker' as Page, icon: MapPinIcon, label: 'Live Tracking' },
    { page: 'voice-assistant' as Page, icon: MicIcon, label: 'Voice Assistant' },
    { page: 'assistant' as Page, icon: BotIcon, label: 'Text Assistant' },
    { page: 'scanner'as Page, icon: ScanIcon, label: 'AI Scanners' },
    { page: 'video-creator' as Page, icon: VideoIcon, label: 'Video Creator' },
];

const communityNavItems = [
    { page: 'community' as Page, icon: UsersIcon, label: 'Community' },
    { page: 'notifications' as Page, icon: BellIcon, label: 'Notifications' },
];

const NavSection: React.FC<{title?: string, items: typeof mainNavItems, currentPage: Page, onNavigate: (page: Page) => void}> = ({ title, items, currentPage, onNavigate }) => (
    <div>
        {title && <h3 className="px-4 py-2 text-xs font-semibold text-soft-gray/60 uppercase tracking-wider">{title}</h3>}
        <ul>
            {items.map(item => (
                <li key={item.page}>
                    <button
                        onClick={() => onNavigate(item.page)}
                        className={`w-full flex items-center gap-4 px-4 py-3 my-1 rounded-lg text-left transition-all duration-300 ${
                            currentPage === item.page 
                                ? 'bg-neon-pink/80 text-white font-semibold shadow-md shadow-neon-pink/30' 
                                : 'text-soft-gray hover:bg-card-bg/60 hover:text-white'
                        }`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span>{item.label}</span>
                    </button>
                </li>
            ))}
        </ul>
    </div>
);


const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen fixed top-0 left-0 bg-secondary-bg/80 backdrop-blur-lg border-r border-orchid-purple/20 z-20 p-6">
            <div className="flex items-center gap-3 mb-8">
                <BrainLogo isPulsing={false} className="w-9 h-9 text-white" />
                <span className="font-bold text-2xl">BalanceAI</span>
            </div>
            
            <nav className="flex-grow space-y-4">
               <NavSection items={mainNavItems} currentPage={currentPage} onNavigate={onNavigate} />
               <NavSection title="Tools" items={toolsNavItems} currentPage={currentPage} onNavigate={onNavigate} />
               <NavSection title="Connect" items={communityNavItems} currentPage={currentPage} onNavigate={onNavigate} />
            </nav>

            <div>
                 <button
                    onClick={() => onNavigate('settings')}
                    className={`w-full flex items-center gap-4 px-4 py-3 my-1 rounded-lg text-left transition-all duration-300 ${
                        currentPage === 'settings' 
                            ? 'bg-neon-pink/80 text-white font-semibold shadow-md shadow-neon-pink/30' 
                            : 'text-soft-gray hover:bg-card-bg/60 hover:text-white'
                    }`}
                >
                    <SettingsIcon className="w-6 h-6" />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;