import {
    GoogleGenAI,
    Type,
    GenerateContentResponse,
    GenerateVideosOperation,
    Modality,
} from '@google/genai';
import { QuizAnswers, WellnessPlan } from '../types';
import { QUIZ_QUESTIONS } from '../constants';


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper to format quiz answers for the prompt
const formatQuizForPrompt = (answers: QuizAnswers): string => {
    return QUIZ_QUESTIONS.map((q, index) => {
        const answerIndex = answers[index];
        if (answerIndex === undefined || !q.options[answerIndex]) return '';
        const answerText = q.options[answerIndex];
        return `Question: ${q.question}\nAnswer: ${answerText}`;
    }).filter(Boolean).join('\n\n');
};

export const generateWellnessPlan = async (answers: QuizAnswers, goals: string[]): Promise<WellnessPlan> => {
    const quizData = formatQuizForPrompt(answers);
    const prompt = `
Based on the following quiz answers, create a personalized wellness plan.

Quiz Answers:
${quizData}

User's Goals: ${goals.join(', ')}

The plan should be holistic, covering mental, physical, and digital wellness.
- For each category (mental, physical, digital), provide a title, a short description, and exactly 3 actionable activities.
- Each activity needs a name, a duration (e.g., "15 minutes"), a brief description, and a short, numbered list of instructions.
- Provide an overall summary of the plan, written in a supportive and encouraging tone.
- The entire response MUST be a valid JSON object. Do not include any text outside of the JSON structure.
`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            mentalWellness: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    activities: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                duration: { type: Type.STRING },
                                description: { type: Type.STRING },
                                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                            },
                            required: ["name", "duration", "description", "instructions"],
                        },
                    },
                },
                 required: ["title", "description", "activities"],
            },
            physicalWellness: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    activities: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                duration: { type: Type.STRING },
                                description: { type: Type.STRING },
                                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                            },
                             required: ["name", "duration", "description", "instructions"],
                        },
                    },
                },
                 required: ["title", "description", "activities"],
            },
            digitalWellness: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    activities: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                duration: { type: Type.STRING },
                                description: { type: Type.STRING },
                                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                            },
                             required: ["name", "duration", "description", "instructions"],
                        },
                    },
                },
                 required: ["title", "description", "activities"],
            },
        },
         required: ["summary", "mentalWellness", "physicalWellness", "digitalWellness"],
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema,
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as WellnessPlan;
    } catch (e) {
        console.error("Failed to parse wellness plan JSON:", response.text, e);
        throw new Error("The AI returned an invalid plan format. Please try again.");
    }
};

export const analyzeFoodImage = async (base64Data: string, mimeType: string): Promise<string> => {
    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType,
        },
    };
    const textPart = {
        text: 'Analyze the food in this image. Provide a nutritional estimate (calories, protein, carbs, fats) and a general health assessment. Format the response as markdown.'
    };
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
};

export const editImageWithText = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType,
        },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("AI did not return an image.");
};

export const analyzeDigitalHabits = async (textInput: string): Promise<string> => {
    const prompt = `As an AI wellness coach, analyze the following text describing a user's digital habits or containing content they've been exposed to. Provide constructive, positive, and actionable feedback. If the text is negative, offer strategies for coping. If it describes habits, suggest ways to improve digital wellness. Format as markdown. \n\nUser input: "${textInput}"`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

export const generateCommunityPosts = async (): Promise<{ user: string; text: string; }[]> => {
    const prompt = `Generate 5 anonymous, supportive, and motivational posts for a wellness app community. Each post should have a 'user' (like "Mindful User" or "Active Soul") and 'text'. The entire response must be a valid JSON array of objects.`;

    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                user: { type: Type.STRING },
                text: { type: Type.STRING },
            },
            required: ["user", "text"],
        },
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema,
        },
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse community posts JSON:", e);
        return [{ user: 'Admin', text: 'Welcome to the community! Something went wrong loading posts, but we\'re glad you\'re here.' }];
    }
};

export const generateChatResponse = async (history: string, currentInput: string): Promise<string> => {
    const prompt = `You are BalanceAI, a friendly and supportive wellness assistant. Here is the conversation history:\n${history}\n\nUser: ${currentInput}\nBalanceAI:`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

export const getGroundedChatResponse = async (currentInput: string, latitude: number, longitude: number): Promise<GenerateContentResponse> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: currentInput,
        config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
                retrievalConfig: {
                    latLng: {
                        latitude,
                        longitude,
                    }
                }
            }
        }
    });
    return response;
};


export const generateWellnessVideo = async (prompt: string, aspectRatio: '16:9' | '9:16'): Promise<GenerateVideosOperation> => {
    // Re-instantiate to ensure the latest API key from the selection dialog is used
    const videoAI = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    let operation = await videoAI.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio,
        }
    });
    return operation;
};

export const getWellnessVideoOperation = async (operation: GenerateVideosOperation): Promise<GenerateVideosOperation> => {
    // Re-instantiate for API key freshness
    const videoAI = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const updatedOperation = await videoAI.operations.getVideosOperation({ operation: operation });
    return updatedOperation;
};
