import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { LocalVectorClient } from "../lib/vector-store";

// Load environment variables (.env.local first, fallback to .env)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === "your_gemini_api_key_here") {
  console.error(" Error: GEMINI_API_KEY is not configured in .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

interface RetrievedChunk {
  id: string;
  text: string;
  score: number;
}

// ==========================================
// STEP 5: Question Embedding (Gemini gemini-embedding-001)
// ==========================================
async function embedQuestion(question: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: question,
  });

  const vec = response.embeddings?.[0]?.values;
  if (!vec) {
    throw new Error("Failed to generate question embedding vector.");
  }

  const preview = vec.slice(0, 4).map((x) => Number(x.toFixed(4)));
  console.log(`[Step 5] Converted question into vector: [${preview.join(", ")}...]`);
  return vec;
}

// ==========================================
// STEP 6 & 7: Similarity Search & Retrieval
// ==========================================
async function searchAndRetrieve(
  questionVector: number[],
  topK: number = 2
): Promise<RetrievedChunk[]> {
  const chromaClient = new LocalVectorClient({ path: "./data" });
  const collection = await chromaClient.getCollection({ name: "knowledge_base" });

  const results = await collection.query({
    queryEmbeddings: [questionVector],
    nResults: topK,
    include: ["documents", "metadatas", "distances"],
  });

  console.log(`[Step 6] Ranked chunks by Cosine Similarity:`);
  const retrievedChunks: RetrievedChunk[] = [];

  const ids = results.ids[0] || [];
  const documents = results.documents[0] || [];
  const distances = results.distances ? results.distances[0] : [];

  for (let i = 0; i < ids.length; i++) {
    // Chroma distance is 1 - cosine_similarity
    const distance = distances[i] ?? 0;
    const similarity = Number((1 - distance).toFixed(2));
    const chunkId = ids[i];
    const text = documents[i] as string;

    console.log(`   └── Score: ${similarity} | Source: ${chunkId}`);
    retrievedChunks.push({ id: chunkId, text, score: similarity });
  }

  console.log(`[Step 7] Returned top ${retrievedChunks.length} most relevant text chunks.`);
  return retrievedChunks;
}

// ==========================================
// STEP 8: Augment the Prompt
// ==========================================
function buildAugmentedPrompt(
  question: string,
  retrievedChunks: RetrievedChunk[]
): string {
  const contextBlock = retrievedChunks
    .map((c) => `[Source: ${c.id}]\n${c.text.replace(/\r/g, "")}`)
    .join("\n\n---\n\n");

  const augmentedPrompt = `Use ONLY the retrieved context below to answer the user question.

### RETRIEVED CONTEXT:
${contextBlock}

### USER QUESTION:
${question}
`;
  console.log(`[Step 8] Augmented Prompt created (Combined Question + Retrieved Context).`);
  return augmentedPrompt;
}

// ==========================================
// STEP 9 & 10: LLM Generation & Final Answer
// ==========================================
async function generateFinalAnswer(augmentedPrompt: string): Promise<string> {
  console.log(`[Step 9] Sending augmented prompt to LLM (${modelName})...`);

  const response = await ai.models.generateContent({
    model: modelName,
    contents: augmentedPrompt,
    config: {
      systemInstruction: "You are a helpful customer support assistant for ComputeIQ Tech.",
      temperature: 0.2,
    },
  });

  return response.text || "";
}

async function main() {
  const cliArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  const userQuestion =
    cliArgs.length > 0 ? cliArgs.join(" ") : "What is your refund policy?";

  console.log(`\nUser Question: '${userQuestion}'\n` + "-".repeat(45));

  const qVec = await embedQuestion(userQuestion);
  const topChunks = await searchAndRetrieve(qVec, 2);
  const prompt = buildAugmentedPrompt(userQuestion, topChunks);

  console.log("\n--- PEEK INSIDE STEP 8 PROMPT ---");
  console.log(prompt.trim());
  console.log("---------------------------------\n");

  const answer = await generateFinalAnswer(prompt);
  console.log(`\n[Step 10] Final Answer:\n${answer.trim()}\n`);
}

main().catch(console.error);
