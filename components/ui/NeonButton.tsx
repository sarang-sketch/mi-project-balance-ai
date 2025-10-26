import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

const NeonButton: React.FC<NeonButtonProps> = ({ children, className = '', ...props }) => {
    return (
        <button
            className={`w-full px-8 py-3 bg-neon-pink/80 text-white font-bold rounded-full border-2 border-neon-pink/90 neon-glow-orchid transition-all duration-300 transform hover:scale-105 hover:bg-neon-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deep-black focus:ring-neon-pink ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default NeonButton;
