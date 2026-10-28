import { NextRequest, NextResponse } from "next/server";
import { validateChatRequest } from "@/lib/validation";
import { chatWithRAG } from "@/lib/gemini";
import { evaluateGuardrails } from "@/lib/guardrails";

/**
 * Basic in-memory rate limiter for local demonstration.
 *
 * Limitation note: This uses local in-memory state. In a multi-instance or serverless
 * production deployment, a distributed rate limiter (such as Upstash Redis) should be used.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    // Basic IP-based rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            "Too many requests. Please wait a moment before sending another message.",
        },
        { status: 429 }
      );
    }

    // Parse and validate request JSON body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format in request body." },
        { status: 400 }
      );
    }

    const validation = validateChatRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      );
    }

    const { message, history } = validation.data;

    // Guardrails: block prompt injections and off-topic questions
    // BEFORE any embedding or LLM call (zero token cost when blocked)
    const guardrail = evaluateGuardrails(message);
    if (!guardrail.allowed) {
      return NextResponse.json({
        reply: guardrail.reply,
        sources: [],
        blocked: guardrail.reason,
      });
    }

    // RAG: retrieve relevant knowledge chunks, then call Gemini with history
    const response = await chatWithRAG(message, history);

    return NextResponse.json({
      reply: response.reply,
      sources: response.sources,
    });
  } catch (error: unknown) {
    const rawError = error instanceof Error ? error.message : String(error);

    if (rawError.includes("Knowledge base is empty")) {
      return NextResponse.json(
        {
          error:
            "The knowledge base has not been indexed yet. Run `npm run rag:index` and try again.",
        },
        { status: 503 }
      );
    }

    // Provide friendly, non-leaking error responses
    if (rawError.includes("GEMINI_API_KEY is not configured")) {
      return NextResponse.json(
        {
          error:
            "The AI assistant is not yet configured with an API key. Please set GEMINI_API_KEY in your .env.local file.",
        },
        { status: 503 }
      );
    }

    if (
      rawError.includes("API key not valid") ||
      rawError.includes("API_KEY_INVALID") ||
      rawError.includes("401")
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid Gemini API key. Please verify your GEMINI_API_KEY in .env.local.",
        },
        { status: 401 }
      );
    }

    if (
      rawError.includes("429") ||
      rawError.includes("RESOURCE_EXHAUSTED") ||
      rawError.includes("quota")
    ) {
      return NextResponse.json(
        {
          error:
            "The Gemini API rate limit or quota has been reached. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    if (
      rawError.includes("404") ||
      rawError.includes("models/") ||
      rawError.includes("not found")
    ) {
      return NextResponse.json(
        {
          error:
            "The configured Gemini model was not found. Please check your GEMINI_MODEL setting in .env.local.",
        },
        { status: 502 }
      );
    }

    console.error("Chat API error:", rawError);

    return NextResponse.json(
      {
        error:
          "Unable to communicate with the AI assistant right now. Please try again in a few moments.",
      },
      { status: 500 }
    );
  }
}
