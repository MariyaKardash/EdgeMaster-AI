import type { CampaignDoc } from '@/types/campaign.types';

const TYPE_LABEL: Partial<Record<CampaignDoc['type'], string>> = {
  'session-summary': 'Summary',
  'chapter-description': 'Chapter background',
};

/** Plain-text doc block for chat — no bracket metadata or UUIDs. */
export function formatDocContentForChat(doc: CampaignDoc): string {
  const label = TYPE_LABEL[doc.type] ?? 'Note';
  return `${label} — "${doc.title}":\n${doc.content.trim()}`;
}

/** Remove [SESSION-SUMMARY | …] headers from RAG-retrieved chunks. */
export function sanitizeRagContext(raw: string): string {
  return raw
    .split('\n\n')
    .map((chunk) => chunk.replace(/^\[[^\]]+\]\n?/, '').trim())
    .filter(Boolean)
    .join('\n\n');
}

export function truncateForChat(text: string, maxChars: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars - 1).trimEnd()}…`;
}
