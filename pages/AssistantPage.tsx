
import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse, getGroundedChatResponse } from '../services/geminiService';
import GlassCard from '../components/ui/GlassCard';
import BrainLogo from '../components/ui/BrainLogo';
import { BotIcon, UserIcon, MapPinIcon } from '../components/icons/NavIcons';
import { ChatMessage } from '../types';

const LOCATION_KEYWORDS = ['nearby', 'near me', 'around here', 'closest', 'where can i find'];

const AssistantPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'model', text: "Hello! I'm BalanceAI. How can I help you on your wellness journey today? You can ask me for nearby places to walk or relax!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const isLocationQuery = LOCATION_KEYWORDS.some(keyword => currentInput.toLowerCase().includes(keyword));

            if (isLocationQuery) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        const response = await getGroundedChatResponse(currentInput, latitude, longitude);
                        const modelMessage: ChatMessage = {
                            sender: 'model',
                            text: response.text,
                            groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[] || []
                        };
                        setMessages(prev => [...prev, modelMessage]);
                        setIsLoading(false);
                    },
                    (geoError) => {
                        console.error("Geolocation Error:", geoError);
                        setError("Couldn't get your location. Please enable location services to find nearby places.");
                        const errorMessage: ChatMessage = { sender: 'model', text: "I can't find nearby places without your location. You can enable it in your browser settings." };
                        setMessages(prev => [...prev, errorMessage]);
                        setIsLoading(false);
                    }
                );
            } else {
                const history = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
                const responseText = await generateChatResponse(history, currentInput);
                const modelMessage: ChatMessage = { sender: 'model', text: responseText };
                setMessages(prev => [...prev, modelMessage]);
                setIsLoading(false);
            }

        } catch (err) {
            console.error("Failed to get response from AI", err);
            const errorMessage: ChatMessage = { sender: 'model', text: "Sorry, I'm having a little trouble connecting right now. Please try again in a moment." };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn h-full flex flex-col justify-center items-center text-center">
            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">Text Assistant</h1>
                <p className="text-lg text-soft-gray mt-2">Your wellness companion. Ask me anything.</p>
            </header>
            <GlassCard className="max-w-2xl w-full h-[65vh] flex flex-col">
                <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'model' && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-orchid-purple/30 flex items-center justify-center"><BotIcon className="w-5 h-5 text-neon-pink" /></div>}
                            <div className={`px-4 py-2 rounded-2xl max-w-md text-left ${msg.sender === 'user' ? 'bg-neon-pink/80 text-white rounded-br-none' : 'bg-card-bg text-light-gray rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                                    <div className="mt-3 border-t border-orchid-purple/30 pt-2 space-y-2">
                                        <h4 className="text-xs font-bold text-soft-gray">Suggested Places:</h4>
                                        {msg.groundingChunks.map((chunk, i) => (
                                            <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" key={i} className="flex items-center gap-2 text-sm text-neon-pink hover:underline">
                                                <MapPinIcon className="w-4 h-4" />
                                                <span>{chunk.maps.title}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {msg.sender === 'user' && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary-bg flex items-center justify-center"><UserIcon className="w-5 h-5 text-soft-gray" /></div>}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-orchid-purple/30 flex items-center justify-center"><BotIcon className="w-5 h-5 text-neon-pink" /></div>
                            <div className="px-4 py-2 rounded-2xl max-w-md bg-card-bg text-light-gray rounded-bl-none">
                                <BrainLogo isPulsing className="w-5 h-5" />
                            </div>
                        </div>
                    )}
                     {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="mt-auto flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow bg-secondary-bg border border-orchid-purple/30 rounded-full py-2 px-4 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="px-5 py-2 bg-neon-pink text-white font-semibold rounded-full disabled:opacity-50 hover:bg-neon-pink/90 transition-colors">
                        Send
                    </button>
                </form>
            </GlassCard>
        </div>
    );
};

export default AssistantPage;
