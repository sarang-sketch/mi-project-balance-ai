import React from 'react';
import { Page } from '../../types';
import { HomeIcon, WellnessPlanIcon, ScanIcon, ActivityIcon, MicIcon } from '../icons/NavIcons';

interface BottomNavProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const navItems = [
    { page: 'dashboard' as Page, icon: HomeIcon },
    { page: 'plan' as Page, icon: WellnessPlanIcon },
    { page: 'voice-assistant' as Page, icon: MicIcon, isCentral: true },
    { page: 'scanner' as Page, icon: ScanIcon },
    { page: 'progress' as Page, icon: ActivityIcon },
];

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-secondary-bg/80 backdrop-blur-lg border-t border-orchid-purple/20 z-20">
            <div className="flex justify-around items-center h-full">
                {navItems.map(item => {
                    const isActive = currentPage === item.page;
                    if (item.isCentral) {
                        return (
                            <button
                                key={item.page}
                                onClick={() => onNavigate(item.page)}
                                className="w-16 h-16 -mt-8 bg-gradient-to-br from-orchid-purple to-neon-pink rounded-full flex items-center justify-center text-white shadow-lg shadow-neon-pink/30 transform hover:scale-110 transition-transform"
                                aria-label="Start Voice Assistant"
                            >
                                <item.icon className="w-8 h-8" />
                            </button>
                        );
                    }
                    return (
                        <button
                            key={item.page}
                            onClick={() => onNavigate(item.page)}
                            className={`flex flex-col items-center gap-1 transition-colors ${
                                isActive ? 'text-neon-pink' : 'text-soft-gray hover:text-white'
                            }`}
                        >
                            <item.icon className="w-7 h-7" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
