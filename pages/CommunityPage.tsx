import React, { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { UsersIcon } from '../components/icons/NavIcons';
import { generateCommunityPosts } from '../services/geminiService';
import BrainLogo from '../components/ui/BrainLogo';

interface Post {
    id?: number;
    user: string;
    text: string;
}

const CommunityPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const generatedPosts = await generateCommunityPosts();
                setPosts(generatedPosts);
            } catch (error) {
                console.error("Failed to fetch community posts:", error);
                // Fallback posts on error
                setPosts([{ id: 1, user: 'Anonymous User', text: "Welcome to the community! Share a positive thought." }]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

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

                {isLoading ? (
                    <GlassCard className="text-center p-8">
                         <BrainLogo isPulsing className="w-12 h-12 mx-auto text-neon-pink" />
                         <p className="mt-4 text-soft-gray">Loading community thoughts...</p>
                    </GlassCard>
                ) : (
                    posts.map((post, index) => (
                        <GlassCard key={index}>
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
                    ))
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
