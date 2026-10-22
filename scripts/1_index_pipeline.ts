import fs from "fs";
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

// Define explicit interfaces for type safety
interface Doc {
  filename: string;
  content: string;
}

interface Chunk {
  id: string;
  text: string;
  metadata: {
    source: string;
    chunk_index: number;
  };
}

// ==========================================
// STEP 1: Read Markdown Documents
// ==========================================
function loadMarkdownFiles(directory: string): Doc[] {
  // Check primary directory or fallback to ./docs
  const targetDir = fs.existsSync(directory)
    ? directory
    : fs.existsSync("./docs")
      ? "./docs"
      : directory;

  if (!fs.existsSync(targetDir)) {
    throw new Error(`Knowledge base directory not found at: ${targetDir}`);
  }

  const fileNames = fs
    .readdirSync(targetDir)
    .filter((file) => file.endsWith(".md"));

  const documents: Doc[] = fileNames.map((filename) => {
    const fullPath = path.join(targetDir, filename);
    return {
      filename,
      content: fs.readFileSync(fullPath, "utf-8"),
    };
  });

  console.log(
    `[Step 1] Loaded ${documents.length} Markdown files:`,
    documents.map((d) => d.filename)
  );
  return documents;
}

// ==========================================
// STEP 2: Chunking (Section-Aware Markdown Chunking)
// ==========================================
function chunkDocuments(documents: Doc[]): Chunk[] {
  const chunks: Chunk[] = [];

  for (const doc of documents) {
    // Normalize line breaks and split by top-level sections (## Header)
    const normalized = doc.content.replace(/\r\n/g, "\n");
    const rawSections = normalized.split(/\n(?=##\s+)/);

    let chunkIndex = 1;
    for (const section of rawSections) {
      const trimmed = section.trim();
      // Filter out empty blocks or standalone horizontal rule dividers
      if (!trimmed || trimmed === "---" || trimmed.length < 20) {
        continue;
      }

      chunks.push({
        id: `${doc.filename}#section_${chunkIndex}`,
        text: trimmed,
        metadata: {
          source: doc.filename,
          chunk_index: chunkIndex,
        },
      });
      chunkIndex++;
    }
  }

  console.log(`[Step 2] Split documents into ${chunks.length} semantic section chunks.`);
  if (chunks.length > 1) {
    console.log(
      `   └── Sample Chunk (${chunks[1]?.id}): ${chunks[1]?.text.substring(0, 80).replace(/\n/g, " ")}...`
    );
  }
  return chunks;
}

// ==========================================
// STEP 3: Embedding Generation (Gemini gemini-embedding-001)
// ==========================================
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateEmbeddings(chunks: Chunk[]): Promise<number[][]> {
  const texts = chunks.map((c) => c.text);
  const embeddings: number[][] = [];
  const BATCH_SIZE = 15; // Safe batch size for Gemini free tier quota

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(texts.length / BATCH_SIZE);

    console.log(`   [Step 3] Processing embedding batch ${batchNum}/${totalBatches} (${batch.length} chunks)...`);

    let attempts = 0;
    let success = false;

    while (!success && attempts < 4) {
      try {
        attempts++;
        const response = await ai.models.embedContent({
          model: "gemini-embedding-001",
          contents: batch,
        });

        if (!response.embeddings || response.embeddings.length === 0) {
          throw new Error("No embeddings returned by Gemini API.");
        }

        for (const item of response.embeddings) {
          if (item.values) {
            embeddings.push(item.values);
          }
        }
        success = true;

        // Friendly throttle delay to respect free tier rate limit
        if (i + BATCH_SIZE < texts.length) {
          await sleep(800);
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const isRateLimit = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED");

        if (isRateLimit && attempts < 4) {
          // Extract retry delay from error if available or wait 22 seconds
          console.warn(`  Gemini rate limit reached. Waiting 22 seconds before retrying batch ${batchNum}...`);
          await sleep(22000);
        } else {
          throw err;
        }
      }
    }
  }

  const sampleVec = embeddings[0]
    .slice(0, 4)
    .map((x) => Number(x.toFixed(4)));

  console.log(
    `[Step 3] Successfully generated ${embeddings.length} vectors (dim=${embeddings[0].length}).`
  );
  console.log(`   └── Sample Vector preview: [${sampleVec.join(", ")}...]`);
  return embeddings;
}

// ==========================================
// STEP 4: Vector Database Storage
// ==========================================
async function storeInVectorDb(chunks: Chunk[], embeddings: number[][]) {
  const chromaClient = new LocalVectorClient({ path: "./data" });

  let collection;
  try {
    await chromaClient.deleteCollection({ name: "knowledge_base" });
  } catch (e) {
    // Collection might not exist yet
  }

  collection = await chromaClient.createCollection({
    name: "knowledge_base",
    metadata: { "hnsw:space": "cosine" },
  });

  await collection.add({
    ids: chunks.map((c) => c.id),
    embeddings: embeddings,
    documents: chunks.map((c) => c.text),
    metadatas: chunks.map((c) => c.metadata),
  });

  console.log(`[Step 4] Stored embeddings, chunk text, and metadata in Vector Store (data/knowledge_base_vectors.json).\n`);
}

async function main() {
  console.log("\n--- STARTING INDEXING PHASE ---");
  const docs = loadMarkdownFiles("./knowledge-base");
  const chunks = chunkDocuments(docs);
  const vectors = await generateEmbeddings(chunks);
  await storeInVectorDb(chunks, vectors);
  console.log("--- INDEXING COMPLETE ---\n");
}

main().catch(console.error);
