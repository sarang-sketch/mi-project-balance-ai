import React from 'react';
import BrainLogo from '../ui/BrainLogo';
import { HomeIcon, WellnessPlanIcon, BotIcon, ScanIcon, UsersIcon, ActivityIcon, BarChartIcon, SettingsIcon, LogOutIcon, BellIcon } from '../icons/NavIcons';
import { Page } from '../../types';

interface SidebarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <li>
        <button
            onClick={onClick}
            className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-neon-pink/20 text-neon-pink' : 'text-soft-gray hover:bg-white/10'
            }`}
        >
            {icon}
            <span className="ml-3 font-semibold">{label}</span>
        </button>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
    const mainNavItems = [
        { id: 'dashboard', label: 'Home', icon: <HomeIcon className="w-6 h-6" /> },
        { id: 'plan', label: 'My Plan', icon: <WellnessPlanIcon className="w-6 h-6" /> },
        { id: 'assistant', label: 'AI Assistant', icon: <BotIcon className="w-6 h-6" /> },
        { id: 'scanner', label: 'AI Scanners', icon: <ScanIcon className="w-6 h-6" /> },
        { id: 'community', label: 'Community', icon: <UsersIcon className="w-6 h-6" /> },
    ];

    const secondaryNavItems = [
        { id: 'activities', label: 'Log Activities', icon: <ActivityIcon className="w-6 h-6" /> },
        { id: 'progress', label: 'My Progress', icon: <BarChartIcon className="w-6 h-6" /> },
        { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-6 h-6" /> },
    ];

    return (
        <aside className="hidden md:block w-64 bg-secondary-bg h-screen fixed top-0 left-0 z-20 p-4 border-r border-orchid-purple/20">
            <div className="flex items-center mb-10">
                <BrainLogo isPulsing={false} className="w-10 h-10 text-neon-pink" />
                <h1 className="text-2xl font-bold ml-2 neon-text-orchid">BalanceAI</h1>
            </div>
            
            <nav className="flex flex-col h-[calc(100%-80px)]">
                <ul className="space-y-2">
                    {mainNavItems.map(item => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={currentPage === item.id}
                            onClick={() => onNavigate(item.id as Page)}
                        />
                    ))}
                </ul>

                <p className="text-xs font-semibold text-soft-gray/50 uppercase mt-8 mb-2 px-3">Tracking</p>
                 <ul className="space-y-2">
                    {secondaryNavItems.map(item => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={currentPage === item.id}
                            onClick={() => onNavigate(item.id as Page)}
                        />
                    ))}
                </ul>

                <div className="mt-auto">
                    <ul className="space-y-2">
                       <NavItem
                            icon={<SettingsIcon className="w-6 h-6" />}
                            label="Settings"
                            isActive={currentPage === 'settings'}
                            onClick={() => onNavigate('settings')}
                        />
                         <NavItem
                            icon={<LogOutIcon className="w-6 h-6" />}
                            label="Logout"
                            isActive={false} // Logout is an action, not a page
                            onClick={() => alert('Logout functionality not implemented.')}
                        />
                    </ul>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;