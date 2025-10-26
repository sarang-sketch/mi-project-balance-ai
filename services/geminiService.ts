import { GoogleGenAI, Type, Chat } from "@google/genai";
import { QuizAnswers, WellnessPlan } from "../types";
import { QUIZ_QUESTIONS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createWellnessPrompt = (answers: QuizAnswers, goals: string[]): string => {
    let prompt = "Based on the following user's self-assessment answers and goals, create a personalized wellness plan. The user is looking for a balanced approach to mental, physical, and digital health.\n\n";

    prompt += "== User's Self-Assessment ==\n";
    for (const questionIndex in answers) {
        const question = QUIZ_QUESTIONS[parseInt(questionIndex)];
        const answerIndex = answers[parseInt(questionIndex)];
        const answerText = question.options[answerIndex];
        prompt += `- ${question.question}: ${answerText}\n`;
    }

    prompt += "\n== User's Goals ==\n";
    goals.forEach(goal => {
        prompt += `- ${goal}\n`;
    });

    prompt += "\n== Instructions ==\n";
    prompt += "Generate a comprehensive but gentle and actionable wellness plan with three sections: Mental Wellness, Physical Wellness, and Digital Wellness. For each section, provide a title, a brief description (1-2 sentences), and 3-4 specific, actionable activities with a name, description, suggested duration (e.g., '15 minutes'), and a list of step-by-step instructions. Conclude with a short, encouraging summary (2-3 sentences). The tone should be supportive, positive, and non-judgmental. The entire output must be in JSON format conforming to the provided schema.";

    return prompt;
};

export const generateWellnessPlan = async (answers: QuizAnswers, goals: string[]): Promise<WellnessPlan> => {
    const prompt = createWellnessPrompt(answers, goals);

    const activitySchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "Name of the activity." },
            description: { type: Type.STRING, description: "Brief description of how to do the activity." },
            duration: { type: Type.STRING, description: "Suggested duration, e.g., '15 minutes' or '1 hour'." },
            instructions: {
                type: Type.ARRAY,
                description: "A list of step-by-step instructions for the exercise.",
                items: { type: Type.STRING }
            },
        },
        required: ['name', 'description', 'duration', 'instructions'],
    };

    const wellnessSectionSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "Title for the wellness section." },
            description: { type: Type.STRING, description: "A brief, encouraging description of this section's focus." },
            activities: {
                type: Type.ARRAY,
                description: "A list of 3-4 suggested activities.",
                items: activitySchema,
            },
        },
        required: ['title', 'description', 'activities'],
    };

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            mentalWellness: { ...wellnessSectionSchema, description: "Section focusing on mental clarity and emotional health." },
            physicalWellness: { ...wellnessSectionSchema, description: "Section focusing on physical health and energy." },
            digitalWellness: { ...wellnessSectionSchema, description: "Section focusing on healthy technology habits." },
            summary: { type: Type.STRING, description: "A final, encouraging summary of the plan." },
        },
        required: ['mentalWellness', 'physicalWellness', 'digitalWellness', 'summary'],
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    try {
        const text = response.text.trim();
        return JSON.parse(text) as WellnessPlan;
    } catch (e) {
        console.error("Failed to parse wellness plan JSON:", e);
        console.error("Raw Gemini response:", response.text);
        throw new Error("Could not generate a valid wellness plan. The AI's response was not in the correct format.");
    }
};

export const analyzeFoodImage = async (base64Data: string, mimeType: string): Promise<string> => {
    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: "Analyze this image of a meal. Provide a brief nutritional overview, including an estimated calorie count, main macronutrients (protein, carbs, fat), and potential health benefits or considerations. Format the response as simple HTML for display.",
    };
    
    const model = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [imagePart, textPart] },
    });

    return response.text;
};

// --- New AI Chat Feature ---
let chat: Chat | null = null;

const getChat = (): Chat => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are BalanceAI, a friendly, supportive, and knowledgeable wellness assistant. Your goal is to provide helpful, encouraging, and safe advice on topics like mental health, physical fitness, and digital wellbeing. Keep your responses concise and easy to understand. Do not provide medical advice; if a user asks for medical advice, gently guide them to consult a healthcare professional.",
            }
        });
    }
    return chat;
}

export const getChatResponse = async (message: string): Promise<string> => {
    const chatSession = getChat();
    const response = await chatSession.sendMessage({ message });
    return response.text;
};