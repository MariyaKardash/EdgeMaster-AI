import type { Chapter, ChapterGenerationSource } from '@/database/entities';
import { createEntity } from '@/database/utils';

import type { ChapterInputTab } from './new-chapter.types';

export function buildGenerationSource(
  activeTab: ChapterInputTab,
  promptText: string,
  documentName?: string,
): ChapterGenerationSource {
  switch (activeTab) {
    case 'prompt':
      return { type: 'prompt', prompt: promptText };
    case 'doc':
      return { type: 'document', documentName: documentName ?? '' };
    default:
      return { type: 'manual' };
  }
}

export function buildChapterEntity(params: {
  campaignId: string;
  title: string;
  description: string;
  generationSource: ChapterGenerationSource;
  order?: number;
}): Chapter {
  return createEntity<Chapter>({
    campaignId: params.campaignId,
    title: params.title,
    description: params.description,
    order: params.order ?? 0,
    status: 'draft',
    generationSource: params.generationSource,
  });
}

/** Returns true if the file extension is in the supported list */
export function isSupportedExtension(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return lower.endsWith('.txt') || lower.endsWith('.md');
}
