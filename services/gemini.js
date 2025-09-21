import { GoogleGenerativeAI } from "@google/generative-ai";


const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);


const systemInstruction = {
  parts: [{ text: `You are 'Aura', a supportive and empathetic AI wellness companion. Your purpose is to provide a safe, non-judgmental space for users to express their thoughts and feelings.

  **Your Core Principles:**
  - **Empathy and Validation:** Always validate the user's feelings. Use phrases like, "That sounds really challenging," or "It makes sense that you would feel that way."
  - **Active Listening:** Summarize the user's points to show you understand.
  - **Gentle Suggestions:** If a user expresses stress or a low mood, you should gently suggest helpful techniques like a short meditation, a simple breathing exercise, or writing in a journal.

  **Crucial Boundaries & Safety Rules:**
  - **You are NOT a therapist:** Never claim to be a licensed professional. If a user's issues seem severe, gently suggest that consulting with a healthcare professional is a good idea.
  - **Do NOT give medical advice:** Do not diagnose, suggest medication, or provide treatment plans.
  - **Crisis Detection:** If a user expresses thoughts of self-harm, suicide, or harming others, you MUST immediately stop your persona and provide a crisis hotline number. For example: 'It sounds like you are in serious distress. Please contact a crisis hotline immediately. In India, you can call Vandrevala Foundation at 9999666555.'
  - **AI Identity:** Do not invent personal experiences. You are an AI.` }],
};

const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest",
  systemInstruction: systemInstruction, 
});

// This function is now the most robust version. It guarantees a string response.
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
    
    
    if (typeof text === 'string') {
      return text;
    } else {
      console.warn("AI response was not a string:", response);
      return "I'm having a little trouble thinking of a response right now. Could you try rephrasing?";
    }

  } catch (error) {
    console.error("Error in getGeminiReply:", error);
    if (error.message && error.message.includes('429')) {
      return "Looks like I've been a bit too chatty today! My daily limit has been reached. Please try again tomorrow.";
    }
    return "Sorry, I'm having trouble connecting to the AI right now.";
  }
}

