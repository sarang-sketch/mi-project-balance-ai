import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease' | 'neutral';
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, changeType, color }) => {
    const changeColorClass = changeType === 'increase' ? 'text-accent-green' : changeType === 'decrease' ? 'text-red-500' : 'text-soft-gray';
    
    return (
        <div className="bg-secondary-bg p-5 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                    <div style={{ color: color }}>{icon}</div>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-sm font-semibold ${changeColorClass} bg-opacity-10 ${changeType === 'increase' ? 'bg-accent-green' : 'bg-red-500'}`}>
                    {change}
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold mt-4">{value}</p>
                <p className="text-soft-gray text-sm">{title}</p>
            </div>
        </div>
    );
};

export default StatCard;
