import { LiveSession } from "@google/genai";

export type Page =
  | 'welcome'
  | 'quiz'
  | 'result'
  | 'dashboard'
  | 'plan'
  | 'progress'
  | 'scanner'
  | 'voice-assistant'
  | 'assistant'
  | 'community'
  | 'settings'
  | 'video-creator'
  | 'activity-tracker'
  | 'activities'
  | 'notifications'
  | 'login'
  | 'signup';

export interface QuizQuestion {
  question: string;
  options: string[];
  type: 'mcq';
}

export type QuizAnswers = {
  [questionIndex: number]: number;
};

export interface WellnessActivity {
  name: string;
  duration: string;
  description: string;
  instructions: string[];
}

export interface WellnessCategory {
  title: string;
  description: string;
  activities: WellnessActivity[];
}

export interface WellnessPlan {
  summary: string;
  mentalWellness: WellnessCategory;
  physicalWellness: WellnessCategory;
  digitalWellness: WellnessCategory;
}

export interface ChatMessage {
  sender: 'user' | 'model';
  text: string;
  groundingChunks?: any[];
}

export type LatLngTuple = [number, number];

export interface Notification {
  id: number;
  type: 'system' | 'goal' | 'streak' | 'task' | 'wakeup' | 'reminder';
  text: string;
  time: string;
}

export interface LoggedActivity {
    name: string;
    category: 'Mental' | 'Physical' | 'Digital';
    duration: string;
    time: string;
}

export type VoiceAssistantState = {
  isConnecting: boolean;
  isActive: boolean;
  transcription: { user: string; model: string }[];
  currentTranscription: { user: string; model: string };
  sessionPromise: Promise<LiveSession> | null;
}