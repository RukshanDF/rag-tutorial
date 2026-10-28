/**
 * AI Guardrails for the ComputeIQ Tech assistant (Stage 3).
 *
 * These checks run on the server BEFORE any embedding or LLM call is made,
 * so blocked requests cost zero API tokens.
 *
 *   Gate 1 — Prompt Injection Firewall: detectPromptInjection()
 *   Gate 2 — Domain Scope Guardrail:    isDomainRelevant()
 *
 * Note: Pattern/keyword guardrails are a fast first line of defence for a
 * tutorial. Production systems typically layer an LLM-based classifier on top.
 */

export type GuardrailResult =
  | { allowed: true }
  | { allowed: false; reason: "prompt_injection" | "off_topic"; reply: string };

export const INJECTION_REPLY =
  "I'm sorry, but I can't follow that request. I am ComputeIQ AI Assistant, and I can only help with ComputeIQ Tech products, store policies, and orders.";

export const OFF_TOPIC_REPLY =
  "I am ComputeIQ AI Assistant, dedicated to helping with our products, store policies, and orders. I cannot answer unrelated questions.";

// ==========================================
// GATE 1: Prompt Injection Firewall
// ==========================================
const INJECTION_PATTERNS: RegExp[] = [
  /\bsystem\s*override\b/i,
  /\bignore\s+(all\s+|any\s+|the\s+|your\s+)?(previous|prior|above|earlier|safety|existing)?\s*(rules|instructions|prompts?|guidelines|directions)\b/i,
  /\bignore\s+(all\s+)?(previous|prior|above|earlier)\b/i,
  /\b(forget|disregard|override|bypass)\s+(all\s+|your\s+|the\s+|any\s+)?(previous\s+|prior\s+|safety\s+)?(rules|instructions|guidelines|restrictions|programming)\b/i,
  /\byou\s+are\s+now\b/i,
  /\bpretend\s+(to\s+be|you\s+are)\b/i,
  /\b(system|secret|hidden|initial)\s+(prompt|instructions?|message)\b/i,
  /\b(reveal|show|print|repeat|leak)\s+(me\s+)?(your|the)\s+(prompt|instructions|rules|system)\b/i,
  /\bdeveloper\s+mode\b/i,
  /\bjail\s*break\b/i,
  /\bDAN\b/,
  /<\/?\s*(system|instructions?)\s*>/i,
  /\[\s*(system|inst)\s*\]/i,
];

export function detectPromptInjection(message: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(message));
}

// ==========================================
// GATE 2: Domain Scope Guardrail
// ==========================================
const DOMAIN_KEYWORDS: string[] = [
  // Brand & products
  "computeiq", "nova", "novabook", "novabuds", "novacharge", "novadock", "novasleeve", "novasound",
  "laptop", "notebook", "ultrabook", "computer", "pc", "workstation", "earbud", "earphone",
  "headphone", "audio", "charger", "charging", "gan", "dock", "hub", "adapter", "sleeve", "case",
  "cable", "accessor", "product", "device", "electronic", "gadget",
  // Specs
  "spec", "processor", "cpu", "gpu", "graphics", "ram", "memory", "storage", "ssd", "display",
  "screen", "battery", "port", "usb", "thunderbolt", "hdmi", "weight", "bluetooth", "noise",
  "anc", "wifi", "wi-fi", "keyboard", "webcam",
  // Commerce & policies
  "price", "cost", "how much", "cheap", "expensive", "discount", "student", "deal", "sale",
  "buy", "purchase", "order", "stock", "available", "availability", "tax",
  "warranty", "guarantee", "repair", "care+", "defect", "broken", "damaged",
  "return", "refund", "exchange", "restocking", "opened", "unopened", "box", "packaging",
  "ship", "shipping", "deliver", "delivery", "pickup", "pick up",
  "pay", "payment", "card", "visa", "mastercard", "amex", "paypal", "apple pay", "google pay",
  "klarna", "affirm", "afterpay", "installment", "financing", "cash", "crypto", "bitcoin",
  // Store information
  "store", "shop", "showroom", "location", "address", "located", "where are you",
  "hours", "open", "close", "sunday", "holiday", "contact", "phone", "email", "support",
  "new york", "manhattan",
];

const GREETING_PATTERN =
  /^(hi|hello|hey|good\s+(morning|afternoon|evening)|thanks|thank\s+you|ok(ay)?|bye|help)\b[\s!.?]*$/i;

// Match keywords at a word start (prefix match allows plurals, e.g. "laptops")
const DOMAIN_REGEXES: RegExp[] = DOMAIN_KEYWORDS.map(
  (keyword) => new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i")
);

export function isDomainRelevant(message: string): boolean {
  const trimmed = message.trim();
  if (GREETING_PATTERN.test(trimmed)) return true;
  return DOMAIN_REGEXES.some((regex) => regex.test(trimmed));
}

// ==========================================
// Combined evaluation used by /api/chat
// ==========================================
export function evaluateGuardrails(message: string): GuardrailResult {
  if (detectPromptInjection(message)) {
    console.warn("[Guardrail Blocked: Prompt Injection detected]");
    return { allowed: false, reason: "prompt_injection", reply: INJECTION_REPLY };
  }

  if (!isDomainRelevant(message)) {
    console.warn("[Guardrail Blocked: Off-topic query]");
    return { allowed: false, reason: "off_topic", reply: OFF_TOPIC_REPLY };
  }

  return { allowed: true };
}
