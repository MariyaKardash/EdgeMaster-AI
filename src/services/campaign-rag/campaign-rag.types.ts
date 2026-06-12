export type RAGServiceStatus =
  | 'idle'
  | 'downloading-embedder'
  | 'loading-embedder'
  | 'seeding'
  | 'ready'
  | 'error';

export type RAGServiceProgressCallback = (status: RAGServiceStatus, pct?: number) => void;
