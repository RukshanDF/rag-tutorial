/**
 * Validation utilities for the /api/chat route.
 * Keeps validation logic separate from request handling for clarity and testability.
 */

export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_HISTORY_TURNS = 10; // Keep up to last 10 messages (5 turns)

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ValidatedChatPayload {
  message: string;
  history: ChatMessage[];
}

export interface ValidationSuccess {
  valid: true;
  data: ValidatedChatPayload;
}

export interface ValidationError {
  valid: false;
  error: string;
  status: number;
}

export type ValidationResult = ValidationSuccess | ValidationError;

/**
 * Validates and sanitizes incoming chat request payloads.
 */
export function validateChatRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body is required and must be a JSON object.", status: 400 };
  }

  const { message, history } = body as Record<string, unknown>;

  // Validate message
  if (typeof message !== "string") {
    return { valid: false, error: "Message must be a string.", status: 400 };
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length === 0) {
    return { valid: false, error: "Message cannot be empty.", status: 400 };
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`,
      status: 400,
    };
  }

  // Validate and normalize history if provided
  const validatedHistory: ChatMessage[] = [];

  if (history !== undefined && history !== null) {
    if (!Array.isArray(history)) {
      return { valid: false, error: "History must be an array of messages.", status: 400 };
    }

    // Take only the most recent messages up to MAX_HISTORY_TURNS
    const sliced = history.slice(-MAX_HISTORY_TURNS);

    for (let i = 0; i < sliced.length; i++) {
      const item = sliced[i];
      if (!item || typeof item !== "object") {
        return { valid: false, error: `Invalid history item at index ${i}.`, status: 400 };
      }

      const { role, content } = item as Record<string, unknown>;

      if (role !== "user" && role !== "assistant") {
        return {
          valid: false,
          error: `Invalid role at history index ${i}. Must be 'user' or 'assistant'.`,
          status: 400,
        };
      }

      if (typeof content !== "string") {
        return {
          valid: false,
          error: `Invalid content at history index ${i}. Must be a string.`,
          status: 400,
        };
      }

      const trimmedContent = content.trim();
      if (trimmedContent.length > 0) {
        // Enforce length limit on historic messages too to prevent prompt bloat
        validatedHistory.push({
          role,
          content: trimmedContent.slice(0, MAX_MESSAGE_LENGTH),
        });
      }
    }
  }

  return {
    valid: true,
    data: {
      message: trimmedMessage,
      history: validatedHistory,
    },
  };
}
