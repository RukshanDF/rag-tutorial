import { GoogleGenAI } from "@google/genai";
import { LocalVectorClient, LocalVectorCollection } from "./vector-store";

/**
 * Server-side RAG service (Stage 3).
 *
 * Bridges the standalone Stage 2 query pipeline into a reusable Next.js
 * server module. Runs only on the server — never import from client components.
 *
 * Prerequisite: run `npm run rag:index` so data/knowledge_base_vectors.json exists.
 */

const EMBEDDING_MODEL = "gemini-embedding-001";
const COLLECTION_NAME = "knowledge_base";

export interface RetrievedSource {
  id: string;
  source: string;
  score: number;
  text: string;
}

// Singleton: load the pre-indexed vectors into server memory once per process
let collectionPromise: Promise<LocalVectorCollection> | null = null;

function getCollection(): Promise<LocalVectorCollection> {
  if (!collectionPromise) {
    const client = new LocalVectorClient({ path: "./data" });
    collectionPromise = client.getCollection({ name: COLLECTION_NAME }).then((collection) => {
      if (collection.count() === 0) {
        collectionPromise = null; // allow retry after indexing
        throw new Error(
          "Knowledge base is empty. Run `npm run rag:index` to build data/knowledge_base_vectors.json."
        );
      }
      console.log(`[RAG] Loaded ${collection.count()} knowledge chunks into memory.`);
      return collection;
    });
  }
  return collectionPromise;
}

/**
 * Embeds the query with Gemini and returns the top-K most similar knowledge chunks.
 */
export async function retrieveRelevantContext(
  ai: GoogleGenAI,
  query: string,
  topK: number = 2
): Promise<RetrievedSource[]> {
  const collection = await getCollection();

  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: query,
  });

  const queryVector = response.embeddings?.[0]?.values;
  if (!queryVector) {
    throw new Error("Failed to generate query embedding.");
  }

  const results = await collection.query({
    queryEmbeddings: [queryVector],
    nResults: topK,
  });

  const sources: RetrievedSource[] = results.ids[0].map((id, i) => ({
    id,
    source: String(results.metadatas[0][i]?.source ?? id.split("#")[0]),
    score: Number((1 - results.distances[0][i]).toFixed(2)),
    text: results.documents[0][i] ?? "",
  }));

  console.log(
    `[RAG] Retrieved: ${sources.map((s) => `${s.id} (${s.score})`).join(", ")}`
  );
  return sources;
}

/**
 * Builds the grounded system instruction containing the retrieved store context.
 */
export function buildRAGPrompt(sources: RetrievedSource[]): string {
  const contextBlock = sources
    .map((s) => `[Source: ${s.id}]\n${s.text.replace(/\r/g, "")}`)
    .join("\n\n---\n\n");

  return `You are ComputeIQ AI Assistant, a friendly, concise, and professional customer-support assistant for ComputeIQ Tech, an electronics store in New York, NY, USA.

Use ONLY the retrieved store context below to answer. If the context does not contain the answer, politely state that you cannot confirm it.

Do not invent prices, warranty terms, delivery promises, or policies. Do not claim access to real orders, accounts, inventory, or payment systems.

### RETRIEVED STORE CONTEXT:
${contextBlock}`;
}
