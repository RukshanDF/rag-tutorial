import fs from "fs";
import path from "path";

/**
 * Interface representing a stored chunk vector in the collection.
 */
export interface VectorRecord {
  id: string;
  embedding: number[];
  document: string;
  metadata: Record<string, any>;
}

export interface QueryParams {
  queryEmbeddings: number[][];
  nResults?: number;
  include?: ("documents" | "metadatas" | "distances")[];
}

export interface QueryResults {
  ids: string[][];
  documents: (string | null)[][];
  metadatas: (Record<string, any> | null)[][];
  distances: number[][];
}

/**
 * Calculates Cosine Similarity between two numerical vectors of the same dimension.
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error(`Vector dimension mismatch: ${vecA.length} vs ${vecB.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return dotProduct / denominator;
}

/**
 * A lightweight, standalone Chroma-compatible Vector Collection.
 * Persists vector data to a readable JSON file on disk.
 */
export class LocalVectorCollection {
  public name: string;
  private filePath: string;
  private records: Map<string, VectorRecord> = new Map();

  constructor(name: string, storageDir: string = "./data") {
    this.name = name;
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    this.filePath = path.join(storageDir, `${name}_vectors.json`);
    this.load();
  }

  private load(): void {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        const list: VectorRecord[] = JSON.parse(raw);
        this.records.clear();
        for (const item of list) {
          this.records.set(item.id, item);
        }
      } catch (e) {
        this.records.clear();
      }
    }
  }

  private save(): void {
    const list = Array.from(this.records.values());
    fs.writeFileSync(this.filePath, JSON.stringify(list, null, 2), "utf-8");
  }

  /**
   * Clears all records from this collection.
   */
  public clear(): void {
    this.records.clear();
    if (fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath);
    }
  }

  /**
   * Adds or updates documents and their vector embeddings in the collection.
   */
  public async add(params: {
    ids: string[];
    embeddings: number[][];
    documents: string[];
    metadatas?: Record<string, any>[];
  }): Promise<void> {
    const { ids, embeddings, documents, metadatas = [] } = params;

    for (let i = 0; i < ids.length; i++) {
      this.records.set(ids[i], {
        id: ids[i],
        embedding: embeddings[i],
        document: documents[i],
        metadata: metadatas[i] || {},
      });
    }

    this.save();
  }

  /**
   * Queries the collection using cosine distance similarity.
   * Matches ChromaDB query format where distance = 1 - cosine_similarity.
   */
  public async query(params: QueryParams): Promise<QueryResults> {
    const queryVec = params.queryEmbeddings[0];
    const topK = params.nResults ?? 2;

    if (!queryVec) {
      throw new Error("No query embedding provided.");
    }

    const allRecords = Array.from(this.records.values());
    const scored = allRecords.map((rec) => {
      const similarity = cosineSimilarity(queryVec, rec.embedding);
      // ChromaDB cosine distance convention: distance = 1 - similarity
      const distance = 1 - similarity;
      return { rec, similarity, distance };
    });

    // Sort ascending by distance (lowest distance = highest similarity)
    scored.sort((a, b) => a.distance - b.distance);

    const topMatches = scored.slice(0, topK);

    return {
      ids: [topMatches.map((m) => m.rec.id)],
      documents: [topMatches.map((m) => m.rec.document)],
      metadatas: [topMatches.map((m) => m.rec.metadata)],
      distances: [topMatches.map((m) => m.distance)],
    };
  }

  public count(): number {
    return this.records.size;
  }
}

/**
 * Chroma-compatible Client facade.
 */
export class LocalVectorClient {
  private storageDir: string;

  constructor(options?: { path?: string }) {
    this.storageDir = options?.path || "./data";
  }

  public async createCollection(params: {
    name: string;
    metadata?: Record<string, any>;
  }): Promise<LocalVectorCollection> {
    const collection = new LocalVectorCollection(params.name, this.storageDir);
    collection.clear();
    return collection;
  }

  public async getCollection(params: {
    name: string;
  }): Promise<LocalVectorCollection> {
    return new LocalVectorCollection(params.name, this.storageDir);
  }

  public async deleteCollection(params: { name: string }): Promise<void> {
    const collection = new LocalVectorCollection(params.name, this.storageDir);
    collection.clear();
  }
}
