export type ChapterInputTab = 'manual' | 'prompt' | 'doc';

export type DocState = 'idle' | 'processing';

export type NewChapterScreenProps = {
  campaignId: string;
  onBack: () => void;
  onSave: () => void;
};
