import type { Chapter, ChapterStatus } from '@/database/entities';

import { GENERATION_SOURCE_LABELS } from './chapter-detail.constants';

export function formatChapterDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getGenerationSourceLabel(chapter: Chapter): string {
  if (!chapter.generationSource) return GENERATION_SOURCE_LABELS.manual;
  return GENERATION_SOURCE_LABELS[chapter.generationSource.type] ?? 'Unknown';
}

export function canStart(status: ChapterStatus): boolean {
  return status === 'draft';
}

export function canComplete(status: ChapterStatus): boolean {
  return status === 'active';
}

export function canDelete(status: ChapterStatus): boolean {
  return status !== 'active';
}
