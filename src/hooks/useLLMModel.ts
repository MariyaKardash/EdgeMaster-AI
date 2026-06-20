import {
  downloadAsset,
  LLAMA_3_2_1B_INST_Q4_0,
  loadModel,
  type ModelProgressUpdate,
  unloadModel,
  VERBOSITY,
} from '@qvac/sdk';
import { useEffect, useRef, useState } from 'react';

import { auditModelLoad, auditModelUnload } from '@/lib/qvac-audit';

export type LLMModelStatus = 'idle' | 'downloading' | 'loading' | 'ready' | 'error';

export type UseLLMModelResult = {
  modelId: string | null;
  status: LLMModelStatus;
  statusLabel: string;
  downloadPct: number | null;
  isReady: boolean;
};

type UseLLMModelParams = {
  ctxSize?: number;
};

export function useLLMModel({ ctxSize = 1024 }: UseLLMModelParams = {}): UseLLMModelResult {
  const [modelId, setModelId] = useState<string | null>(null);
  const [status, setStatus] = useState<LLMModelStatus>('idle');
  const [statusLabel, setStatusLabel] = useState('Initializing…');
  const [downloadPct, setDownloadPct] = useState<number | null>(null);

  const mountedRef = useRef(true);
  // Capture ctxSize at mount time — changing it after load would require a full model reload
  const ctxSizeRef = useRef(ctxSize);

  useEffect(() => {
    mountedRef.current = true;

    (async () => {
      try {
        setStatus('downloading');
        setStatusLabel('Downloading LLM…');

        await downloadAsset({
          assetSrc: LLAMA_3_2_1B_INST_Q4_0,
          onProgress: (p: ModelProgressUpdate) => {
            if (mountedRef.current) setDownloadPct(Math.round(p.percentage));
          },
        });

        if (!mountedRef.current) return;

        setStatus('loading');
        setStatusLabel('Loading LLM into memory…');
        setDownloadPct(null);

        const id = await loadModel({
          modelSrc: LLAMA_3_2_1B_INST_Q4_0,
          modelType: 'llamacpp-completion',
          modelConfig: {
            device: 'gpu',
            ctx_size: ctxSizeRef.current,
            verbosity: VERBOSITY.ERROR,
          },
          onProgress: (p: ModelProgressUpdate) => {
            if (mountedRef.current) setDownloadPct(Math.round(p.percentage));
          },
        });

        if (!mountedRef.current) return;

        auditModelLoad(LLAMA_3_2_1B_INST_Q4_0.name, 'llamacpp-completion', id, 'gpu');
        setModelId(id);
        setStatus('ready');
        setStatusLabel('LLM ready');
        setDownloadPct(null);
      } catch (e: unknown) {
        if (mountedRef.current) {
          const message = e instanceof Error ? e.message : String(e);
          setStatus('error');
          setStatusLabel(`LLM failed: ${message}`);
        }
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (modelId) {
        auditModelUnload(LLAMA_3_2_1B_INST_Q4_0.name, modelId);
        void unloadModel({ modelId, clearStorage: false }).catch(() => {});
      }
    };
  }, [modelId]);

  return {
    modelId,
    status,
    statusLabel,
    downloadPct,
    isReady: status === 'ready',
  };
}
