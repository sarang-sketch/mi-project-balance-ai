import React from 'react';

// Fix: Extend React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`glass-card rounded-2xl p-6 shadow-lg shadow-neon-pink/10 transition-all duration-300 hover:shadow-neon-pink/20 hover:border-orchid-purple/40 ${className}`} {...props}>
            {children}
        </div>
    );
};

export default GlassCard;