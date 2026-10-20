import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./business";
import { ChatMessage } from "./validation";

/**
 * Gemini API integration module.
 *
 * Uses the official @google/genai SDK (v2.x).
 * Runs strictly server-side — API keys are never exposed to the client.
 *
 * In a future RAG version, this module can be extended to augment
 * the system instruction or user prompt with retrieved knowledge-base chunks.
 */

export interface ChatResponse {
  reply: string;
}

/**
 * Calls Gemini to generate a response given the user message and conversation history.
 *
 * @param message - The latest message from the user.
 * @param history - Previous conversation messages (user & assistant).
 * @returns The model's response string.
 */
export async function chat(
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add your Gemini API key to .env.local"
    );
  }

  // Configurable model name with recommended default
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  const ai = new GoogleGenAI({ apiKey });

  // Map the conversation history to Gemini content structure
  // Gemini uses 'user' and 'model' roles
  const contents = [
    ...history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const replyText = response.text;

    if (!replyText || replyText.trim().length === 0) {
      throw new Error("No text response received from Gemini.");
    }

    return {
      reply: replyText.trim(),
    };
  } catch (error: unknown) {
    // Re-throw with clear error message for the route handler to format
    const errMsg = error instanceof Error ? error.message : String(error);
    throw new Error(errMsg);
  }
}
