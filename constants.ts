import { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        question: "How would you rate your overall mood today?",
        options: ["Excellent 🌱", "Good", "Okay", "Not so great", "Really struggling"],
        type: 'mcq'
    },
    {
        question: "How many hours of quality sleep did you get last night?",
        options: ["Less than 4 hours", "4-6 hours", "7-8 hours 🌙", "More than 8 hours"],
        type: 'mcq'
    },
    {
        question: "How physically active have you been in the last 24 hours?",
        options: ["Very active", "Moderately active", "Lightly active", "Not active at all"],
        type: 'mcq'
    },
    {
        question: "How connected do you feel to friends or family right now?",
        options: ["Very connected", "Somewhat connected", "A little disconnected", "Very isolated"],
        type: 'mcq'
    },
    {
        question: "How much time did you spend on social media today?",
        options: ["Less than 30 minutes", "30-60 minutes", "1-2 hours", "More than 2 hours"],
        type: 'mcq'
    },
    {
        question: "How would you describe your energy levels?",
        options: ["High energy", "Steady energy", "Feeling a bit sluggish", "Completely drained"],
        type: 'mcq'
    },
    {
        question: "How often have you felt overwhelmed by your responsibilities lately?",
        options: ["Rarely or never", "Sometimes", "Often", "Almost constantly"],
        type: 'mcq'
    },
    {
        question: "How easily can you focus on a single task without getting distracted?",
        options: ["Very easily", "Somewhat easily", "With some difficulty", "It's a real struggle"],
        type: 'mcq'
    },
    {
        question: "How often do you find yourself worrying about the future?",
        options: ["Rarely", "Occasionally", "Frequently", "Almost all the time"],
        type: 'mcq'
    },
    {
        question: "In the past two weeks, how often have you had thoughts that you would be better off dead or of hurting yourself in some way?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
        type: 'mcq'
    },
    {
        question: "How would you describe your short-term memory (e.g., remembering a phone number)?",
        options: ["Excellent, like a vault", "Pretty good", "A bit fuzzy", "What was the question?"],
        type: 'mcq'
    },
    {
        question: "When faced with a complex problem, how do you typically feel?",
        options: ["Energized and ready to solve", "Cautiously optimistic", "A little anxious", "Completely overwhelmed"],
        type: 'mcq'
    },
    {
        question: "How often do you engage in creative activities (e.g., drawing, writing, music)?",
        options: ["Daily", "A few times a week", "Once in a while", "Almost never"],
        type: 'mcq'
    },
    {
        question: "How adaptable are you to unexpected changes in your routine?",
        options: ["Very adaptable, I love spontaneity", "I can adjust with some effort", "I find it difficult", "I strongly dislike change"],
        type: 'mcq'
    },
    {
        question: "How would you rate your ability to learn a new skill?",
        options: ["I learn very quickly", "Average learning pace", "It takes me a while", "I struggle to learn new things"],
        type: 'mcq'
    },
    {
        question: "How often do you feel mentally 'sharp' and alert?",
        options: ["Most of the time", "About half the time", "Occasionally", "Rarely"],
        type: 'mcq'
    },
    {
        question: "When you make a mistake, how do you typically react?",
        options: ["Learn from it and move on", "Feel a bit down but recover", "Criticize myself harshly", "Dwell on it for a long time"],
        type: 'mcq'
    }
];
