import React from 'react';
import { BellIcon, UserIcon } from '../icons/NavIcons';
import { Page } from '../../types';

interface HeaderProps {
    title: string;
    onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ title, onNavigate }) => {
    return (
        <header className="flex justify-between items-center py-4 px-6 bg-deep-black/50 backdrop-blur-sm sticky top-0 z-10 border-b border-orchid-purple/20">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <div className="flex items-center gap-4">
                <button onClick={() => onNavigate('notifications')} className="relative text-soft-gray hover:text-white">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-pink opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-pink"></span>
                    </span>
                </button>
                <div className="w-8 h-8 rounded-full bg-orchid-purple/50 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                </div>
            </div>
        </header>
    );
};

export default Header;