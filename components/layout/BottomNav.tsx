// Fix: Create BottomNav component for mobile navigation.
import React from 'react';
import { HomeIcon, WellnessPlanIcon, BotIcon, ScanIcon, UsersIcon } from '../icons/NavIcons';
import { Page } from '../../types';

interface BottomNavProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
            isActive ? 'text-neon-pink' : 'text-soft-gray hover:text-white'
        }`}
    >
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);


const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: <HomeIcon className="w-6 h-6" /> },
        { id: 'plan', label: 'Plan', icon: <WellnessPlanIcon className="w-6 h-6" /> },
        { id: 'assistant', label: 'AI', icon: <BotIcon className="w-6 h-6" /> },
        { id: 'scanner', label: 'Scan', icon: <ScanIcon className="w-6 h-6" /> },
        { id: 'community', label: 'Community', icon: <UsersIcon className="w-6 h-6" /> },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-secondary-bg border-t border-orchid-purple/20 p-2 z-20">
            <div className="flex justify-around items-center">
                {navItems.map(item => (
                    <NavItem 
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentPage === item.id}
                        onClick={() => onNavigate(item.id as Page)}
                    />
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
