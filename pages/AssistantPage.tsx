import React, { useState, useRef, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { BotIcon } from '../components/icons/NavIcons';
import BrainLogo from '../components/ui/BrainLogo';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AssistantPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "Hello! I'm your BalanceAI assistant. How can I help you on your wellness journey today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await getChatResponse(input);
            const modelMessage: ChatMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("AI chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I'm having a little trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn h-full flex flex-col">
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">AI Assistant</h1>
                <p className="text-lg text-soft-gray mt-2">Your personal wellness guide.</p>
            </header>
            
            <GlassCard className="flex-grow flex flex-col p-4">
                <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-orchid-purple/30 flex items-center justify-center"><BotIcon className="w-5 h-5 text-neon-pink" /></div>}
                            <div className={`px-4 py-2 rounded-2xl max-w-md ${msg.role === 'user' ? 'bg-neon-pink/80 text-white rounded-br-none' : 'bg-card-bg text-light-gray rounded-bl-none'}`}>
                                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                             <div className="w-8 h-8 flex-shrink-0 rounded-full bg-orchid-purple/30 flex items-center justify-center"><BotIcon className="w-5 h-5 text-neon-pink" /></div>
                             <div className="px-4 py-2 rounded-2xl bg-card-bg text-light-gray rounded-bl-none">
                                <BrainLogo isPulsing={true} className="w-5 h-5" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="mt-auto flex gap-2 border-t border-orchid-purple/20 pt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about your plan or for motivation..."
                        className="flex-grow bg-secondary-bg border border-orchid-purple/30 rounded-full py-3 px-4 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="px-5 py-3 bg-neon-pink/80 rounded-full font-semibold hover:bg-neon-pink transition-colors disabled:opacity-50">
                        Send
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};

export default AssistantPage;