import React from 'react';

const ParticleBackground: React.FC = () => {
    const particles = Array.from({ length: 25 });

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0" aria-hidden="true">
            {particles.map((_, i) => {
                const size = Math.random() * 3 + 1; // size between 1px and 4px
                const style = {
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 15 + 10}s`, // 10s to 25s
                    animationDelay: `${Math.random() * 5}s`,
                    boxShadow: `0 0 6px 2px ${Math.random() > 0.5 ? '#C71585' : '#8B5A8B'}`,
                };
                return (
                    <div
                        key={i}
                        className="absolute rounded-full bg-orchid-purple/70 animate-float"
                        style={style}
                    ></div>
                );
            })}
        </div>
    );
};

export default ParticleBackground;
