

import { GoogleGenAI, Chat } from "@google/genai";
// FIX: The error "File 'file:///types.ts' is not a module." is resolved by creating the types.ts file with exported types.
import { DisasterType } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSurvivalGuide = async (disasterType: DisasterType): Promise<string> => {
  try {
    const prompt = `Generate a concise survival guide for a ${disasterType} in India. The guide should be easy to understand for the general public during a stressful situation. Structure the response with clear, actionable steps under 'Before', 'During', and 'After' the event. Use bullet points. The tone must be calm, authoritative, and reassuring. Start directly with the guide content.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating survival guide:", error);
    return "Failed to generate survival guide. Please check your connection and try again.";
  }
};

export const createChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are 'MITRA', a helpful and calm AI assistant for the Aapda Mitra disaster management app. Your primary goal is to provide clear, concise, and reassuring information about disaster preparedness and response in the context of India. Prioritize safety and provide actionable advice. If a user seems in immediate distress, advise them to contact emergency services first. Keep responses brief and easy to understand.`,
        },
    });
};