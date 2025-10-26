import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';
import { VoiceAssistantState } from '../types';
import GlassCard from '../components/ui/GlassCard';
import BrainLogo from '../components/ui/BrainLogo';
import { MicIcon } from '../components/icons/NavIcons';

// Audio utility functions as per guidelines
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const VoiceAssistantPage: React.FC = () => {
    const [state, setState] = useState<VoiceAssistantState>({
        isConnecting: false,
        isActive: false,
        transcription: [],
        currentTranscription: { user: '', model: '' },
        sessionPromise: null,
    });
    
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const stopAllAudio = useCallback(() => {
        audioSourcesRef.current.forEach(source => {
            source.stop();
        });
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    }, []);

    const cleanup = useCallback(() => {
        if (state.sessionPromise) {
            state.sessionPromise.then(session => session.close());
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current.onaudioprocess = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
        }
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close();
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close();
        }
        stopAllAudio();
        setState(prev => ({ ...prev, isActive: false, isConnecting: false, sessionPromise: null }));
    }, [state.sessionPromise, stopAllAudio]);

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    const handleToggleConnection = async () => {
        if (state.isActive || state.isConnecting) {
            cleanup();
            return;
        }

        setState(prev => ({ ...prev, isConnecting: true, transcription: [], currentTranscription: {user: '', model: ''} }));

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setState(prev => ({ ...prev, isConnecting: false, isActive: true }));
                        
                        mediaStreamSourceRef.current = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessorRef.current.onaudioprocess = (event) => {
                            const inputData = event.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        
                        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent) {
                            if (message.serverContent.inputTranscription) {
                                setState(prev => ({...prev, currentTranscription: { ...prev.currentTranscription, user: prev.currentTranscription.user + message.serverContent.inputTranscription.text }}));
                            }
                            if (message.serverContent.outputTranscription) {
                                setState(prev => ({...prev, currentTranscription: { ...prev.currentTranscription, model: prev.currentTranscription.model + message.serverContent.outputTranscription.text }}));
                            }
                            if (message.serverContent.turnComplete) {
                                setState(prev => {
                                    const fullTurn = prev.currentTranscription;
                                    return {
                                        ...prev,
                                        transcription: [...prev.transcription, fullTurn],
                                        currentTranscription: { user: '', model: '' }
                                    };
                                });
                            }
                            if(message.serverContent.interrupted) {
                                stopAllAudio();
                            }

                            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                            if (audioData && outputAudioContextRef.current) {
                                const outputCtx = outputAudioContextRef.current;
                                const audioBuffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
                                const source = outputCtx.createBufferSource();
                                source.buffer = audioBuffer;
                                source.connect(outputCtx.destination);
                                
                                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                                source.start(nextStartTimeRef.current);
                                nextStartTimeRef.current += audioBuffer.duration;

                                audioSourcesRef.current.add(source);
                                source.onended = () => {
                                    audioSourcesRef.current.delete(source);
                                };
                            }
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        cleanup();
                    },
                    onclose: () => {
                        cleanup();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Zephyr'}},
                    },
                }
            });
            setState(prev => ({...prev, sessionPromise}));
        } catch (error) {
            console.error('Failed to start voice assistant:', error);
            setState(prev => ({ ...prev, isConnecting: false }));
        }
    };
    
    return (
        <div className="animate-fadeIn h-full flex flex-col justify-center items-center text-center">
            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">Voice Assistant</h1>
                <p className="text-lg text-soft-gray mt-2">Talk to your wellness companion in real-time.</p>
            </header>
            <GlassCard className="max-w-2xl w-full h-[65vh] flex flex-col">
                <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4 text-left">
                    {state.transcription.map((t, i) => (
                        <div key={i} className="p-2 rounded-lg bg-card-bg/50">
                            <p><strong className="text-soft-gray">You:</strong> {t.user}</p>
                            <p><strong className="text-neon-pink">AI:</strong> {t.model}</p>
                        </div>
                    ))}
                    { (state.currentTranscription.user || state.currentTranscription.model) &&
                        <div className="p-2">
                            <p className="text-gray-400"><strong className="text-soft-gray">You:</strong> {state.currentTranscription.user}</p>
                            <p className="text-gray-400"><strong className="text-neon-pink">AI:</strong> {state.currentTranscription.model}</p>
                        </div>
                    }
                </div>
                <div className="mt-auto flex flex-col items-center justify-center">
                    <button onClick={handleToggleConnection} className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 ${state.isActive ? 'bg-red-500/80 shadow-red-500/40' : 'bg-gradient-to-br from-orchid-purple to-neon-pink shadow-lg shadow-neon-pink/30'}`}>
                        { state.isConnecting ? <BrainLogo isPulsing className="w-10 h-10" /> : <MicIcon className="w-10 h-10" /> }
                    </button>
                    <p className="mt-4 text-sm text-soft-gray">
                        { state.isConnecting ? 'Connecting...' : state.isActive ? 'Tap to disconnect' : 'Tap to start talking' }
                    </p>
                </div>
            </GlassCard>
        </div>
    );
};

export default VoiceAssistantPage;
