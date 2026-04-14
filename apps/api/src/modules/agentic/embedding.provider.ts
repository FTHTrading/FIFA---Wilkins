import { Injectable, Logger } from '@nestjs/common';
import { withRetry, fetchWithTimeout } from '../../common/utils/retry';

/**
 * EmbeddingProvider — generates vector embeddings for RAG ingestion and query time.
 *
 * Supports two backends (configured via env):
 *   - openai        — OpenAI API (text-embedding-3-small / text-embedding-ada-002)
 *   - azure-openai  — Azure OpenAI Service
 *
 * Usage:
 *   const vector = await embeddingProvider.embed("halal food near the stadium");
 */

export type EmbeddingBackend = 'openai' | 'azure-openai';

@Injectable()
export class EmbeddingProvider {
  private readonly logger = new Logger(EmbeddingProvider.name);
  private readonly backend: EmbeddingBackend;
  private readonly model: string;
  private readonly dimensions = 1536;

  constructor() {
    this.backend = (process.env.EMBEDDING_PROVIDER ?? 'openai') as EmbeddingBackend;
    this.model = process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small';
  }

  get modelName(): string {
    return this.model;
  }

  /**
   * Generate an embedding vector for a single piece of text.
   * Returns null when credentials are not configured — caller should
   * fall back to lexical matching rather than throwing.
   */
  async embed(text: string): Promise<number[] | null> {
    if (!this.isConfigured()) {
      this.logger.warn('Embedding provider not configured — skipping vector generation');
      return null;
    }

    try {
      return await withRetry(() => this.embedOnce(text), { attempts: 3, baseDelayMs: 400 });
    } catch (err) {
      this.logger.error(`Embedding failed: ${(err as Error).message}`);
      return null;
    }
  }

  /**
   * Batch-embed multiple strings. Uses the batching endpoint where available.
   * Falls back to sequential calls on error.
   */
  async embedBatch(texts: string[]): Promise<(number[] | null)[]> {
    if (!this.isConfigured() || texts.length === 0) {
      return texts.map(() => null);
    }
    try {
      return await withRetry(() => this.embedBatchOnce(texts), { attempts: 2, baseDelayMs: 600 });
    } catch (err) {
      this.logger.error(`Batch embedding failed: ${(err as Error).message}`);
      // Fall back to individual calls
      return Promise.all(texts.map((t) => this.embed(t)));
    }
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  private isConfigured(): boolean {
    if (this.backend === 'openai') return !!process.env.OPENAI_API_KEY;
    if (this.backend === 'azure-openai') {
      return !!(process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT);
    }
    return false;
  }

  private async embedOnce(text: string): Promise<number[] | null> {
    const { url, headers, body } = this.buildRequest([text]);
    const response = await fetchWithTimeout(url, { method: 'POST', headers, body: JSON.stringify(body) }, 15_000);
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Embedding API error ${response.status}: ${errText}`);
    }
    const data = (await response.json()) as { data: Array<{ embedding: number[] }> };
    return data.data[0]?.embedding ?? null;
  }

  private async embedBatchOnce(texts: string[]): Promise<number[][]> {
    const { url, headers, body } = this.buildRequest(texts);
    const response = await fetchWithTimeout(url, { method: 'POST', headers, body: JSON.stringify(body) }, 30_000);
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Batch embedding API error ${response.status}: ${errText}`);
    }
    const data = (await response.json()) as { data: Array<{ index: number; embedding: number[] }> };
    // Sort by index to preserve input order
    return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
  }

  private buildRequest(inputs: string[]): {
    url: string;
    headers: Record<string, string>;
    body: Record<string, unknown>;
  } {
    if (this.backend === 'azure-openai') {
      const deployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT ?? this.model;
      const endpoint = (process.env.AZURE_OPENAI_ENDPOINT ?? '').replace(/\/$/, '');
      return {
        url: `${endpoint}/openai/deployments/${deployment}/embeddings?api-version=2024-02-01`,
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_API_KEY!,
        },
        body: { input: inputs },
      };
    }

    // Default: OpenAI
    return {
      url: 'https://api.openai.com/v1/embeddings',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: {
        input: inputs,
        model: this.model,
        dimensions: this.dimensions,
      },
    };
  }
}
