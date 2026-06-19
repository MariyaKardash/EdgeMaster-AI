import type { Chapter } from '@/database';
import type { CampaignDoc, DocSource } from '@/types/campaign.types';

function chapterDescriptionSource(chapter: Chapter): DocSource {
  if (chapter.generationSource?.type === 'ai_generated') {
    return 'ai-generated';
  }

  return 'master-written';
}

function parseChapterTimestamp(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

export function buildCampaignDocuments(chapters: Chapter[]): CampaignDoc[] {
  const documents: CampaignDoc[] = [];

  for (const chapter of chapters) {
    const createdAt = parseChapterTimestamp(chapter.createdAt);

    if (chapter.description.trim()) {
      documents.push({
        id: `chapter-description-${chapter.id}`,
        type: 'chapter-description',
        title: chapter.title,
        content: chapter.description.trim(),
        chapterId: chapter.id,
        source: chapterDescriptionSource(chapter),
        createdAt,
      });
    }

    if (chapter.summary?.trim()) {
      documents.push({
        id: `session-summary-${chapter.id}`,
        type: 'session-summary',
        title: chapter.title,
        content: chapter.summary.trim(),
        chapterId: chapter.id,
        source: 'master-written',
        createdAt: parseChapterTimestamp(chapter.updatedAt),
      });
    }
  }

  return documents;
}
