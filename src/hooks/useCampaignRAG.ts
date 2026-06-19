import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { CampaignDoc } from '@/types/campaign.types';
import { getSharedCampaignRAGService, type RAGServiceStatus } from '@/services/campaign-rag';

export type UseCampaignRAGParams = {
  campaignId: string;
  seedDocuments: CampaignDoc[];
};

export type UseCampaignRAGResult = {
  search: (query: string, topK?: number) => Promise<string | null>;
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

function buildDocumentsFingerprint(documents: CampaignDoc[]): string {
  return documents
    .map((doc) => `${doc.id}:${doc.content.length}`)
    .sort()
    .join('|');
}

export function useCampaignRAG({
  campaignId,
  seedDocuments,
}: UseCampaignRAGParams): UseCampaignRAGResult {
  const serviceRef = useRef(getSharedCampaignRAGService());

  const [status, setStatus] = useState<RAGServiceStatus>('idle');
  const [downloadPct, setDownloadPct] = useState<number | null>(null);

  const documentsFingerprint = useMemo(
    () => buildDocumentsFingerprint(seedDocuments),
    [seedDocuments],
  );

  useEffect(() => {
    const service = serviceRef.current;
    let cancelled = false;

    (async () => {
      try {
        setStatus('idle');
        setDownloadPct(null);

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
    };
  }, [campaignId, documentsFingerprint]);

  const search = useCallback(
    (query: string, topK?: number): Promise<string | null> =>
      serviceRef.current.search(query, topK),
    [],
  );

  return {
    search,
    status,
    statusLabel: STATUS_LABELS[status],
    downloadPct: status.includes('downloading') || status === 'seeding' ? downloadPct : null,
    isReady: status === 'ready',
  };
}
