import {
  downloadAsset,
  EMBEDDINGGEMMA_300M_Q4_0,
  loadModel,
  type ModelProgressUpdate,
  ragDeleteEmbeddings,
  ragIngest,
  ragListWorkspaces,
  ragSearch,
  unloadModel,
} from '@qvac/sdk';

import type { CampaignDoc, DocType } from '@/types/campaign.types';

export type RAGServiceStatus =
  | 'idle'
  | 'downloading-embedder'
  | 'loading-embedder'
  | 'seeding'
  | 'ready'
  | 'error';

export type RAGServiceProgressCallback = (status: RAGServiceStatus, pct?: number) => void;

const WORKSPACE_PREFIX = 'campaign-';

const DOC_TYPE_LABELS: Record<DocType, string> = {
  overview: 'OVERVIEW',
  lore: 'LORE',
  'chapter-description': 'CHAPTER-DESCRIPTION',
  'session-summary': 'SESSION-SUMMARY',
  npc: 'NPC',
  location: 'LOCATION',
  faction: 'FACTION',
  custom: 'NOTE',
};

/**
 * Formats a CampaignDoc into a richly prefixed string so the LLM receives
 * structural context from every retrieved chunk, even without metadata filtering.
 *
 * Example output:
 *   [SESSION-SUMMARY | Session 4 | Chapter 3 | master-written]
 *   After a tense negotiation with Pressa…
 */
function formatDocContent(doc: CampaignDoc): string {
  const typeLabel = DOC_TYPE_LABELS[doc.type];
  const parts = [typeLabel, doc.title];
  if (doc.chapterId) parts.push(`Chapter ${doc.chapterId}`);
  if (doc.sessionNumber != null) parts.push(`Session ${doc.sessionNumber}`);
  parts.push(doc.source);
  return `[${parts.join(' | ')}]\n${doc.content}`;
}

export class CampaignRAGService {
  private embeddingModelId: string | null = null;
  private campaignId: string | null = null;

  get isReady() {
    return this.embeddingModelId !== null && this.campaignId !== null;
  }

  get workspaceName() {
    return this.campaignId ? `${WORKSPACE_PREFIX}${this.campaignId}` : null;
  }

  async initialize(onProgress?: RAGServiceProgressCallback): Promise<void> {
    if (this.embeddingModelId) return;

    onProgress?.('downloading-embedder');

    await downloadAsset({
      assetSrc: EMBEDDINGGEMMA_300M_Q4_0,
      onProgress: (p: ModelProgressUpdate) => {
        onProgress?.('downloading-embedder', Math.round(p.percentage));
      },
    });

    onProgress?.('loading-embedder');

    this.embeddingModelId = await loadModel({
      modelSrc: EMBEDDINGGEMMA_300M_Q4_0,
      modelType: 'llamacpp-embedding',
      onProgress: (p: ModelProgressUpdate) => {
        onProgress?.('loading-embedder', Math.round(p.percentage));
      },
    });
  }

  async openWorkspace(
    campaignId: string,
    seedDocuments: CampaignDoc[],
    onProgress?: RAGServiceProgressCallback,
  ): Promise<void> {
    if (!this.embeddingModelId) {
      throw new Error('CampaignRAGService: call initialize() before openWorkspace()');
    }

    this.campaignId = campaignId;
    const workspace = `${WORKSPACE_PREFIX}${campaignId}`;

    const existing = await ragListWorkspaces();
    const alreadySeeded = existing.some((w) => w.name === workspace);

    if (!alreadySeeded) {
      onProgress?.('seeding');
      await ragIngest({
        modelId: this.embeddingModelId,
        documents: seedDocuments.map(formatDocContent),
        workspace,
        onProgress: (_stage, current, total) => {
          if (total > 0) onProgress?.('seeding', Math.round((current / total) * 100));
        },
      });
    }

    onProgress?.('ready');
  }

  /**
   * Returns the top-K relevant chunks as a single string, or null if no result
   * meets the minimum similarity threshold (meaning the query is off-topic for
   * this campaign).
   *
   * HyperDB returns cosine similarity scores in [0, 1]; chunks scoring below
   * minScore are considered unrelated and are dropped. If all results are
   * dropped, null is returned so the caller can skip context injection.
   */
  async search(query: string, topK = 4, minScore = 0.5): Promise<string | null> {
    if (!this.embeddingModelId || !this.campaignId) {
      return null;
    }

    const results = await ragSearch({
      modelId: this.embeddingModelId,
      query,
      topK,
      workspace: `${WORKSPACE_PREFIX}${this.campaignId}`,
    });

    const relevant = results.filter((r) => r.score >= minScore);

    if (relevant.length === 0) return null;

    return relevant.map((r) => r.content).join('\n\n');
  }

  /**
   * Upserts documents into the workspace. If a document with the same ID
   * already exists it is deleted first, then re-ingested with the new content.
   * This ensures master edits never produce duplicate vectors.
   */
  async addDocuments(docs: CampaignDoc[]): Promise<void> {
    if (!this.embeddingModelId || !this.campaignId) {
      throw new Error('CampaignRAGService: service not ready');
    }

    const workspace = `${WORKSPACE_PREFIX}${this.campaignId}`;

    // Silently ignore delete failures — the doc may not exist yet on first add.
    await ragDeleteEmbeddings({ ids: docs.map((d) => d.id), workspace }).catch(() => {});

    await ragIngest({
      modelId: this.embeddingModelId,
      documents: docs.map(formatDocContent),
      workspace,
      chunk: false,
    });
  }

  async addChapterDescription(chapterId: string, title: string, content: string): Promise<void> {
    await this.addDocuments([
      {
        id: `chapter-description-${chapterId}`,
        type: 'chapter-description',
        title,
        content,
        chapterId,
        source: 'master-written',
        createdAt: Date.now(),
      },
    ]);
  }

  async addSessionSummary(
    sessionNumber: number,
    chapterId: string,
    content: string,
  ): Promise<void> {
    await this.addDocuments([
      {
        id: `session-summary-${sessionNumber}`,
        type: 'session-summary',
        title: `Session ${sessionNumber} Summary`,
        content,
        chapterId,
        sessionNumber,
        source: 'master-written',
        createdAt: Date.now(),
      },
    ]);
  }

  async close(): Promise<void> {
    if (this.embeddingModelId) {
      await unloadModel({ modelId: this.embeddingModelId, clearStorage: false }).catch(() => {});
      this.embeddingModelId = null;
    }
    this.campaignId = null;
  }
}
