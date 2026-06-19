import type { DocSource } from '@/types/campaign.types';
import { logDev } from '@/lib/logger';
import { CampaignRAGService } from './CampaignRAGService';

let sharedService: CampaignRAGService | null = null;

export function getSharedCampaignRAGService(): CampaignRAGService {
  if (!sharedService) {
    sharedService = new CampaignRAGService();
  }

  return sharedService;
}

async function ensureCampaignWorkspace(campaignId: string): Promise<CampaignRAGService> {
  const service = getSharedCampaignRAGService();

  await service.initialize();
  await service.openWorkspace(campaignId, []);

  return service;
}

export async function syncChapterDescriptionToRAG(
  campaignId: string,
  chapterId: string,
  title: string,
  description: string,
  source: DocSource = 'master-written',
): Promise<void> {
  try {
    const service = await ensureCampaignWorkspace(campaignId);
    await service.addChapterDescription(chapterId, title, description, source);
  } catch (error) {
    logDev('[campaign-rag-sync] syncChapterDescription failed', error);
  }
}

export async function syncChapterSummaryToRAG(
  campaignId: string,
  chapterId: string,
  chapterTitle: string,
  summary: string,
  source: DocSource = 'master-written',
): Promise<void> {
  try {
    const service = await ensureCampaignWorkspace(campaignId);
    await service.addChapterSummary(chapterId, chapterTitle, summary, source);
  } catch (error) {
    logDev('[campaign-rag-sync] syncChapterSummary failed', error);
  }
}
