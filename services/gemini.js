// services/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY; 

const genAI = new GoogleGenerativeAI(API_KEY);

const systemInstruction = {
  parts: [{ text: `You are 'Aura', a supportive and empathetic AI wellness companion...` }], // Your full persona prompt
};

const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest",
  systemInstruction: systemInstruction, 
});

// This is the original, non-streaming function
export async function getGeminiReply(prompt, history) {
  try {
    const chat = model.startChat({
      history: history, 
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    return text;

  } catch (error) {
    console.error("Error in getGeminiReply:", error);
    // Check if it's a quota error to give a specific message
    if (error.message && error.message.includes('429')) {
      return "Looks like I've been a bit too chatty today! My daily limit has been reached. Please try again tomorrow.";
    }
    return "Sorry, I'm having trouble connecting to the AI right now.";
  }
}