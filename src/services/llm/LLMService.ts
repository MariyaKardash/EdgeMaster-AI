import {
  downloadAsset,
  LLAMA_3_2_1B_INST_Q4_0,
  loadModel,
  type ModelProgressUpdate,
  unloadModel,
  VERBOSITY,
} from '@qvac/sdk';

import { auditModelLoad, auditModelUnload } from '@/lib/qvac-audit';

import { LLM_MAX_CTX_SIZE } from './llm.constants';
import type { LLMModelStatus, LLMProgressCallback } from './llm.types';

const STATUS_LABELS: Record<string, string> = {
  idle: 'Initializing…',
  downloading: 'Downloading LLM…',
  loading: 'Loading LLM into memory…',
  ready: 'LLM ready',
};

export class LLMService {
  private modelId: string | null = null;
  private refCount = 0;
  private loadPromise: Promise<string> | null = null;
  private unloadPromise: Promise<void> | null = null;
  private progressListeners = new Set<LLMProgressCallback>();

  get isReady() {
    return this.modelId !== null;
  }

  get currentModelId() {
    return this.modelId;
  }

  async acquire(onProgress?: LLMProgressCallback): Promise<string> {
    this.refCount++;

    if (onProgress) {
      this.progressListeners.add(onProgress);
    }

    try {
      await this.unloadPromise;

      if (this.modelId) {
        this.notify('ready');
        return this.modelId;
      }

      if (!this.loadPromise) {
        this.loadPromise = this.load().finally(() => {
          this.loadPromise = null;
        });
      }

      const id = await this.loadPromise;

      if (this.refCount === 0) {
        await this.unload();
        throw new Error('LLM acquire cancelled');
      }

      return id;
    } catch (error) {
      this.refCount = Math.max(0, this.refCount - 1);
      if (onProgress) {
        this.progressListeners.delete(onProgress);
      }
      throw error;
    }
  }

  release(onProgress?: LLMProgressCallback): void {
    this.refCount = Math.max(0, this.refCount - 1);

    if (onProgress) {
      this.progressListeners.delete(onProgress);
    }

    if (this.refCount === 0) {
      void this.unload();
    }
  }

  private notify(status: LLMModelStatus, pct?: number): void {
    for (const listener of this.progressListeners) {
      listener(status, pct);
    }
  }

  private async load(): Promise<string> {
    this.notify('downloading');

    await downloadAsset({
      assetSrc: LLAMA_3_2_1B_INST_Q4_0,
      onProgress: (p: ModelProgressUpdate) => {
        this.notify('downloading', Math.round(p.percentage));
      },
    });

    if (this.refCount === 0) {
      throw new Error('LLM load cancelled');
    }

    this.notify('loading');

    const id = await loadModel({
      modelSrc: LLAMA_3_2_1B_INST_Q4_0,
      modelType: 'llamacpp-completion',
      modelConfig: {
        device: 'gpu',
        ctx_size: LLM_MAX_CTX_SIZE,
        verbosity: VERBOSITY.ERROR,
      },
      onProgress: (p: ModelProgressUpdate) => {
        this.notify('loading', Math.round(p.percentage));
      },
    });

    if (this.refCount === 0) {
      auditModelUnload(LLAMA_3_2_1B_INST_Q4_0.name, id);
      await unloadModel({ modelId: id, clearStorage: false }).catch(() => {});
      throw new Error('LLM load cancelled');
    }

    this.modelId = id;
    auditModelLoad(LLAMA_3_2_1B_INST_Q4_0.name, 'llamacpp-completion', id, 'gpu');
    this.notify('ready');
    return id;
  }

  private async unload(): Promise<void> {
    if (this.unloadPromise) {
      return this.unloadPromise;
    }

    this.unloadPromise = (async () => {
      if (this.loadPromise) {
        await this.loadPromise.catch(() => {});
      }

      if (!this.modelId) {
        return;
      }

      const id = this.modelId;
      this.modelId = null;
      auditModelUnload(LLAMA_3_2_1B_INST_Q4_0.name, id);
      await unloadModel({ modelId: id, clearStorage: false }).catch(() => {});
    })().finally(() => {
      this.unloadPromise = null;
    });

    return this.unloadPromise;
  }
}

export { STATUS_LABELS };
