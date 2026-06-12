import { useCallback, useEffect, useRef, useState } from 'react';

import type { CampaignDoc } from '@/types/campaign.types';
import { CampaignRAGService, type RAGServiceStatus } from '@/services/CampaignRAGService';

export type UseCampaignRAGParams = {
  campaignId: string;
  seedDocuments: CampaignDoc[];
};

export type UseCampaignRAGResult = {
  search: (query: string, topK?: number) => Promise<string | null>;
  addChapterDescription: (chapterId: string, title: string, content: string) => Promise<void>;
  addSessionSummary: (sessionNumber: number, chapterId: string, content: string) => Promise<void>;
  addDocuments: (docs: CampaignDoc[]) => Promise<void>;
  status: RAGServiceStatus;
  statusLabel: string;
  downloadPct: number | null;
  isReady: boolean;
};

const STATUS_LABELS: Record<RAGServiceStatus, string> = {
  idle: 'Initializing…',
  'downloading-embedder': 'Downloading embedding model…',
  'loading-embedder': 'Loading embedding model…',
  seeding: 'Seeding campaign knowledge…',
  ready: 'Campaign knowledge ready',
  error: 'Embedding model failed',
};

export function useCampaignRAG({
  campaignId,
  seedDocuments,
}: UseCampaignRAGParams): UseCampaignRAGResult {
  const serviceRef = useRef<CampaignRAGService>(new CampaignRAGService());

  const [status, setStatus] = useState<RAGServiceStatus>('idle');
  const [downloadPct, setDownloadPct] = useState<number | null>(null);

  useEffect(() => {
    const service = serviceRef.current;
    let cancelled = false;

    (async () => {
      try {
        await service.initialize((s, pct) => {
          if (cancelled) return;
          setStatus(s);
          setDownloadPct(pct ?? null);
        });

        if (cancelled) return;

        await service.openWorkspace(campaignId, seedDocuments, (s, pct) => {
          if (cancelled) return;
          setStatus(s);
          setDownloadPct(pct ?? null);
        });
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      void service.close();
    };
    // campaignId and seedDocuments are treated as stable — pass new instance to reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = useCallback(
    (query: string, topK?: number): Promise<string | null> =>
      serviceRef.current.search(query, topK),
    [],
  );

  const addChapterDescription = useCallback(
    (chapterId: string, title: string, content: string) =>
      serviceRef.current.addChapterDescription(chapterId, title, content),
    [],
  );

  const addSessionSummary = useCallback(
    (sessionNumber: number, chapterId: string, content: string) =>
      serviceRef.current.addSessionSummary(sessionNumber, chapterId, content),
    [],
  );

  const addDocuments = useCallback(
    (docs: CampaignDoc[]) => serviceRef.current.addDocuments(docs),
    [],
  );

  return {
    search,
    addChapterDescription,
    addSessionSummary,
    addDocuments,
    status,
    statusLabel: STATUS_LABELS[status],
    downloadPct: status.includes('downloading') || status === 'seeding' ? downloadPct : null,
    isReady: status === 'ready',
  };
}
