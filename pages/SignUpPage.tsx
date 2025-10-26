import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import BrainLogo from '../components/ui/BrainLogo';

const SignUpPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
            <GlassCard className="max-w-md w-full animate-fadeIn">
                <BrainLogo isPulsing={false} className="w-16 h-16 mx-auto text-neon-pink" />
                <h1 className="text-3xl font-bold mt-4">
                    Create Your Account
                </h1>
                <p className="text-soft-gray mt-2">
                    Start your path to a balanced life.
                </p>
                
                <form className="mt-8 text-left space-y-4">
                    <div>
                        <label className="text-sm font-medium text-soft-gray" htmlFor="name">Name</label>
                        <input type="text" id="name" required className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-soft-gray" htmlFor="email">Email</label>
                        <input type="email" id="email" required className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-soft-gray" htmlFor="password">Password</label>
                        <input type="password" id="password" required className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink" />
                    </div>
                    <div className="pt-4">
                        <NeonButton type="submit">
                            Sign Up
                        </NeonButton>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default SignUpPage;
