import type { ChapterStatus } from '@/database/entities';

export const STATUS_LABELS: Record<ChapterStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  completed: 'Completed',
};

export const GENERATION_SOURCE_LABELS: Record<string, string> = {
  manual: 'Written manually',
  ai_generated: 'AI generated',
  document: 'Imported document',
};

export const DELETE_CONFIRM_TITLE = 'Delete Chapter?';
export const DELETE_CONFIRM_MESSAGE =
  'This chapter and all its data will be permanently deleted. This cannot be undone.';
export const DELETE_CONFIRM_BUTTON = 'Delete';

export const ACTIVATE_BLOCKED_TITLE = 'Chapter Already Active';
