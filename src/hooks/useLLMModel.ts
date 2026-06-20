import { useEffect, useRef, useState } from 'react';

import {
  getSharedLLMService,
  LLM_DEFAULT_CTX_SIZE,
  STATUS_LABELS,
  type LLMModelStatus,
  type LLMProgressCallback,
} from '@/services/llm';

export type { LLMModelStatus };

export type UseLLMModelResult = {
  modelId: string | null;
  status: LLMModelStatus;
  statusLabel: string;
  downloadPct: number | null;
  isReady: boolean;
};

type UseLLMModelParams = {
  /** Kept for API compatibility — the shared service always loads LLM_MAX_CTX_SIZE. */
  ctxSize?: number;
};

export function useLLMModel({
  ctxSize: _ctxSize = LLM_DEFAULT_CTX_SIZE,
}: UseLLMModelParams = {}): UseLLMModelResult {
  const [modelId, setModelId] = useState<string | null>(null);
  const [status, setStatus] = useState<LLMModelStatus>('idle');
  const [statusLabel, setStatusLabel] = useState(STATUS_LABELS.idle);
  const [downloadPct, setDownloadPct] = useState<number | null>(null);

  const onProgressRef = useRef<LLMProgressCallback | null>(null);

  useEffect(() => {
    const service = getSharedLLMService();
    let cancelled = false;

    const onProgress: LLMProgressCallback = (nextStatus, pct) => {
      if (cancelled) return;
      setStatus(nextStatus);
      setStatusLabel(STATUS_LABELS[nextStatus] ?? nextStatus);
      setDownloadPct(
        nextStatus === 'downloading' || nextStatus === 'loading' ? (pct ?? null) : null,
      );
    };

    onProgressRef.current = onProgress;

    void (async () => {
      try {
        const id = await service.acquire(onProgress);
        if (cancelled) return;
        setModelId(id);
        setStatus('ready');
        setStatusLabel(STATUS_LABELS.ready);
        setDownloadPct(null);
      } catch (e: unknown) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : String(e);
        if (message === 'LLM acquire cancelled' || message === 'LLM load cancelled') {
          return;
        }
        setStatus('error');
        setStatusLabel(`LLM failed: ${message}`);
      }
    })();

    return () => {
      cancelled = true;
      service.release(onProgressRef.current ?? undefined);
      onProgressRef.current = null;
    };
  }, []);

  return {
    modelId,
    status,
    statusLabel,
    downloadPct,
    isReady: status === 'ready',
  };
}
