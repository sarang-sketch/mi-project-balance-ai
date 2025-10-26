export interface QuizQuestion {
    question: string;
    options: string[];
    type: 'mcq';
}

export interface QuizAnswers {
    [key: number]: number;
}

export interface WellnessActivity {
    name: string;
    description: string;
    duration: string;
    instructions: string[];
}

export interface WellnessSection {
    title: string;
    description: string;
    activities: WellnessActivity[];
}

export interface WellnessPlan {
    mentalWellness: WellnessSection;
    physicalWellness: WellnessSection;
    digitalWellness: WellnessSection;
    summary: string;
}

export type Page = 
    | 'welcome'
    | 'quiz'
    | 'results'
    | 'dashboard'
    | 'plan'
    | 'assistant'
    | 'scanner'
    | 'community'
    | 'activities'
    | 'progress'
    | 'settings'
    | 'notifications'
    | 'login'
    | 'signup';

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface Notification {
    id: number;
    type: 'goal' | 'family' | 'check-in' | 'alert' | 'call';
    message: string;
    time: string;
}
