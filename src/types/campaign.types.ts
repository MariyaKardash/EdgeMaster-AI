export type DocType =
  | 'overview'
  | 'lore'
  | 'chapter-description'
  | 'session-summary'
  | 'npc'
  | 'location'
  | 'faction'
  | 'custom';

export type DocSource = 'master-written' | 'ai-generated' | 'seed';

export type CampaignDoc = {
  /** Deterministic ID. Use a stable pattern so edits can upsert:
   *  chapter-description-{chapterId}, session-summary-{n}, npc-{slug}, etc.
   *  For append-only docs (e.g. one-off lore notes) a timestamp suffix is fine. */
  id: string;
  type: DocType;
  /** Human-readable label shown in the master's document list */
  title: string;
  /** Prose content that gets embedded and retrieved */
  content: string;
  /** Links doc to a chapter if relevant */
  chapterId?: string;
  /** Links doc to a session number if relevant */
  sessionNumber?: number;
  source: DocSource;
  createdAt: number; // unix ms
};
