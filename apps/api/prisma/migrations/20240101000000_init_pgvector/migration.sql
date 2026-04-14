-- Enable pgvector extension required for RAG similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- RagChunk table: stores text chunks + their vector embeddings for retrieval
CREATE TABLE IF NOT EXISTS "RagChunk" (
    "id"             TEXT NOT NULL,
    "source"         TEXT NOT NULL,
    "sourceId"       TEXT,
    "eventId"        TEXT,
    "language"       TEXT NOT NULL DEFAULT 'en',
    "title"          TEXT,
    "content"        TEXT NOT NULL,
    "tags"           TEXT[] DEFAULT ARRAY[]::TEXT[],
    "embedding"      vector(1536),
    "embeddingModel" TEXT,
    "tokenCount"     INTEGER,
    "isActive"       BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RagChunk_pkey" PRIMARY KEY ("id")
);

-- Indexes for query-time filtering (applied before ANN search)
CREATE INDEX IF NOT EXISTS "RagChunk_eventId_language_idx"   ON "RagChunk" ("eventId", "language");
CREATE INDEX IF NOT EXISTS "RagChunk_source_language_idx"    ON "RagChunk" ("source", "language");

-- HNSW index for fast approximate nearest-neighbor cosine search.
-- m=16, ef_construction=64 are good defaults for < 1M rows.
-- Increase ef_construction for higher recall at ingestion cost.
CREATE INDEX IF NOT EXISTS "RagChunk_embedding_hnsw_idx"
    ON "RagChunk"
    USING hnsw ("embedding" vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Trigger to auto-update updatedAt
CREATE OR REPLACE FUNCTION update_rag_chunk_updated_at()
    RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "rag_chunk_updated_at" ON "RagChunk";
CREATE TRIGGER "rag_chunk_updated_at"
    BEFORE UPDATE ON "RagChunk"
    FOR EACH ROW EXECUTE FUNCTION update_rag_chunk_updated_at();
