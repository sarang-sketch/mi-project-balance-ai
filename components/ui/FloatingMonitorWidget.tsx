import React from 'react';
import { BotIcon } from '../icons/NavIcons';

interface FloatingMonitorWidgetProps {
    onClick: () => void;
}

const FloatingMonitorWidget: React.FC<FloatingMonitorWidgetProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-24 lg:bottom-8 right-6 w-16 h-16 bg-gradient-to-br from-orchid-purple to-neon-pink rounded-full flex items-center justify-center text-white shadow-lg shadow-neon-pink/30 transform hover:scale-110 transition-transform z-20"
      aria-label="Open AI Screen Monitor"
    >
      <BotIcon className="w-8 h-8" />
    </button>
  );
};

export default FloatingMonitorWidget;