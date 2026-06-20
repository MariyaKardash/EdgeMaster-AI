export type LLMModelStatus = 'idle' | 'downloading' | 'loading' | 'ready' | 'error';

export type LLMProgressCallback = (status: LLMModelStatus, pct?: number) => void;
