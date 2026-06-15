import type { ChapterStatus } from '@/database/entities';

export const CHAPTER_STATUS_LABELS: Record<ChapterStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  draft: 'New',
};
