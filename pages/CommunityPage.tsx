import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import { UsersIcon } from '../components/icons/NavIcons';

const CommunityPage: React.FC = () => {
    const posts = [
        { id: 1, user: 'Anonymous User', text: "Just wanted to share a small win: I went for a 15-minute walk today instead of scrolling on my phone. Feeling good! 🌱" },
        { id: 2, user: 'Anonymous User', text: "Feeling a bit overloaded today, but reading everyone's tips here is helping. Thanks for being a positive space. 🖤" },
        { id: 3, user: 'Anonymous User', text: "Quick tip: I've started putting my phone on airplane mode for the first 30 minutes of my day. It's been a game-changer for my focus." },
    ];
    return (
        <div className="py-12 animate-fadeIn">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">Community Hub</h1>
                <p className="text-lg text-soft-gray mt-2">Share tips and motivation anonymously.</p>
            </header>
            
            <div className="max-w-2xl mx-auto space-y-6">
                 <GlassCard>
                    <textarea className="w-full bg-deep-black/30 border border-orchid-purple/30 rounded-lg p-2 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink" placeholder="Share a positive thought or tip..."></textarea>
                    <button className="mt-2 w-full text-sm py-2 bg-neon-pink/80 rounded-full font-semibold hover:bg-neon-pink transition-colors">Post Anonymously</button>
                 </GlassCard>
                {posts.map(post => (
                    <GlassCard key={post.id}>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orchid-purple/30 flex items-center justify-center">
                                <UsersIcon className="w-5 h-5 text-soft-gray"/>
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-neon-pink">{post.user}</p>
                                <p className="text-gray-300 mt-1">{post.text}</p>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

export default CommunityPage;
