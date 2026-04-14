import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { EmbeddingProvider } from './embedding.provider';

export interface RagDocument {
  id: string;
  source: string;
  language: string;
  content: string;
  tags: string[];
  freshnessScore: number;
  similarityScore?: number;
  /** Combined weighted rank: 0.65×similarity + 0.25×freshness + 0.1×cultural. */
  finalScore?: number;
}

interface RawRagRow {
  id: string;
  source: string;
  language: string;
  content: string;
  tags: string[];
  updatedat: Date;
  similarity: number | null;
}

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  private readonly provider = process.env.RAG_PROVIDER ?? 'pgvector';
  private readonly topK = 6;
  /** Minimum cosine similarity score — results below this are discarded. */
  private readonly minSimilarity = parseFloat(process.env.RAG_MIN_SIMILARITY ?? '0.35');

  constructor(
    private prisma: PrismaService,
    private embedding: EmbeddingProvider,
  ) {}

  async retrieveContext(params: {
    query: string;
    language: string;
    latitude?: number;
    longitude?: number;
    tags?: string[];
    eventId?: string;
    limit?: number;
  }): Promise<RagDocument[]> {
    if (this.provider !== 'pgvector') {
      return this.lexicalFallback(params);
    }

    try {
      return await this.vectorRetrieve(params);
    } catch (err) {
      this.logger.warn(`pgvector retrieval failed, falling back to lexical: ${(err as Error).message}`);
      return this.lexicalFallback(params);
    }
  }

  // ─── pgvector similarity search ──────────────────────────────────────────

  private async vectorRetrieve(params: {
    query: string;
    language: string;
    tags?: string[];
    eventId?: string;
    limit?: number;
  }): Promise<RagDocument[]> {
    const limit = params.limit ?? this.topK;

    // Generate query embedding
    const queryVec = await this.embedding.embed(params.query);

    if (!queryVec) {
      this.logger.warn('Embedding unavailable — falling back to lexical search');
      return this.lexicalFallback(params);
    }

    // Build pgvector cosine similarity query
    // Language filter: return docs in requested language OR language-agnostic docs ('en' as default)
    // Tag filter is soft (ORDER BY) not hard (WHERE) to avoid zero-result queries
    const vecLiteral = `[${queryVec.join(',')}]`;
    const eventFilter: Prisma.Sql = params.eventId
      ? Prisma.sql`AND ("eventId" = ${params.eventId} OR "eventId" IS NULL)`
      : Prisma.sql``;

    const rows = await this.prisma.$queryRaw<RawRagRow[]>`
      SELECT
        id,
        source,
        language,
        content,
        tags,
        "updatedAt" AS updatedat,
        1 - (embedding <=> ${vecLiteral}::vector) AS similarity
      FROM "RagChunk"
      WHERE
        "isActive" = TRUE
        AND (language = ${params.language} OR language = 'en')
        ${eventFilter}
      ORDER BY embedding <=> ${vecLiteral}::vector
      LIMIT ${limit}
    `;

    return rows
      .filter((row) => (row.similarity ?? 0) >= this.minSimilarity)
      .map((row) => {
        const similarityScore = row.similarity ?? 0;
        const freshnessScore = this.computeFreshnessScore(row.updatedat);
        // Cultural boost: prefer docs in the guest's exact language
        const langBoost = row.language === params.language ? 0.05 : 0;
        const finalScore = 0.65 * similarityScore + 0.25 * freshnessScore + 0.1 * (1 + langBoost);
        return {
          id: row.id,
          source: row.source,
          language: row.language,
          content: row.content,
          tags: row.tags ?? [],
          similarityScore,
          freshnessScore,
          finalScore,
        };
      })
      .sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));
  }

  // ─── Lexical fallback (no embedding / pgvector unavailable) ──────────────

  private async lexicalFallback(params: {
    query: string;
    language: string;
    tags?: string[];
    eventId?: string;
    limit?: number;
  }): Promise<RagDocument[]> {
    const limit = params.limit ?? this.topK;
    const queryTokens = params.query.toLowerCase().split(/\s+/).filter(Boolean);

    const chunks = await this.prisma.ragChunk.findMany({
      where: {
        isActive: true,
        language: { in: [params.language, 'en'] },
        ...(params.eventId ? { OR: [{ eventId: params.eventId }, { eventId: null }] } : {}),
      },
      take: limit * 4, // over-fetch then re-rank
      orderBy: { updatedAt: 'desc' },
    });

    return chunks
      .map((chunk) => {
        const tokenHits = queryTokens.filter(
          (t) => chunk.content.toLowerCase().includes(t) || chunk.title?.toLowerCase().includes(t),
        ).length;
        const semanticScore = tokenHits / Math.max(queryTokens.length, 1);
        const langScore = chunk.language === params.language ? 1 : 0.5;
        const tagScore =
          params.tags?.length
            ? chunk.tags.some((t) => params.tags!.includes(t)) ? 0.2 : 0
            : 0;
        const score = 0.6 * semanticScore + 0.25 * langScore + 0.15 * tagScore;
        return { chunk, score };
      })
      .filter(({ score }) => score > 0)   // drop zero-hit results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ chunk, score }) => ({
        id: chunk.id,
        source: chunk.source,
        language: chunk.language,
        content: chunk.content,
        tags: chunk.tags,
        freshnessScore: this.computeFreshnessScore(chunk.updatedAt),
        finalScore: score,
      }));
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private computeFreshnessScore(updatedAt: Date): number {
    const ageMs = Date.now() - updatedAt.getTime();
    const ageDays = ageMs / 86_400_000;
    // Linear decay: 1.0 at 0 days → 0.5 at 60 days → floor 0.2
    return Math.max(0.2, 1 - (ageDays / 60) * 0.5);
  }

  /**
   * Upsert a chunk into the RAG index. Used by the ingestion script.
   * Generates an embedding if the embedding provider is available.
   */
  async upsertChunk(params: {
    id?: string;
    source: string;
    sourceId?: string;
    eventId?: string;
    language: string;
    title?: string;
    content: string;
    tags?: string[];
  }) {
    const embedding = await this.embedding.embed(params.content);

    const data = {
      source: params.source,
      sourceId: params.sourceId ?? null,
      eventId: params.eventId ?? null,
      language: params.language,
      title: params.title ?? null,
      content: params.content,
      tags: params.tags ?? [],
      embeddingModel: embedding ? this.embedding.modelName : null,
    };

    if (params.id) {
      // Use raw query to write the vector column (Prisma can't handle Unsupported types in create/update)
      if (embedding) {
        const vec = `[${embedding.join(',')}]`;
        await this.prisma.$executeRaw`
          INSERT INTO "RagChunk" (id, source, "sourceId", "eventId", language, title, content, tags, embedding, "embeddingModel", "isActive", "createdAt", "updatedAt")
          VALUES (${params.id}, ${data.source}, ${data.sourceId}, ${data.eventId}, ${data.language}, ${data.title}, ${data.content}, ${data.tags}, ${vec}::vector, ${data.embeddingModel}, TRUE, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET
            content = EXCLUDED.content,
            embedding = EXCLUDED.embedding,
            "embeddingModel" = EXCLUDED."embeddingModel",
            "updatedAt" = NOW()
        `;
      } else {
        await this.prisma.ragChunk.upsert({
          where: { id: params.id },
          create: { id: params.id, ...data },
          update: data,
        });
      }
    } else {
      // No stable ID — always insert
      if (embedding) {
        const id = `rag-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const vec = `[${embedding.join(',')}]`;
        await this.prisma.$executeRaw`
          INSERT INTO "RagChunk" (id, source, "sourceId", "eventId", language, title, content, tags, embedding, "embeddingModel", "isActive", "createdAt", "updatedAt")
          VALUES (${id}, ${data.source}, ${data.sourceId}, ${data.eventId}, ${data.language}, ${data.title}, ${data.content}, ${data.tags}, ${vec}::vector, ${data.embeddingModel}, TRUE, NOW(), NOW())
        `;
      } else {
        await this.prisma.ragChunk.create({ data });
      }
    }
  }
}

