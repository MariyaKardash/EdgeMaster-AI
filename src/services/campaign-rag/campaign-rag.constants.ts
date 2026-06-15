import type { DocType } from '@/types/campaign.types';

export const WORKSPACE_PREFIX = 'campaign-';

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  overview: 'OVERVIEW',
  lore: 'LORE',
  'chapter-description': 'CHAPTER-DESCRIPTION',
  'session-summary': 'SESSION-SUMMARY',
  npc: 'NPC',
  location: 'LOCATION',
  faction: 'FACTION',
  custom: 'NOTE',
};
