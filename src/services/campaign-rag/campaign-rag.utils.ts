import type { CampaignDoc } from '@/types/campaign.types';

import { DOC_TYPE_LABELS } from './campaign-rag.constants';

/**
 * Formats a CampaignDoc into a richly prefixed string so the LLM receives
 * structural context from every retrieved chunk, even without metadata filtering.
 *
 * Example output:
 *   [SESSION-SUMMARY | Session 4 | Chapter 3 | master-written]
 *   After a tense negotiation with Pressa…
 */
export function formatDocContent(doc: CampaignDoc): string {
  const typeLabel = DOC_TYPE_LABELS[doc.type];
  const parts = [typeLabel, doc.title];
  if (doc.chapterId) parts.push(`Chapter ${doc.chapterId}`);
  if (doc.sessionNumber != null) parts.push(`Session ${doc.sessionNumber}`);
  parts.push(doc.source);
  return `[${parts.join(' | ')}]\n${doc.content}`;
}
