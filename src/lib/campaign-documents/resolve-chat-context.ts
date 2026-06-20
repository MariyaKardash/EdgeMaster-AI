import { formatDocContentForChat } from '@/lib/campaign-documents/format-chat-context';
import type { CampaignDoc } from '@/types/campaign.types';

/** Broad recap-style questions where vector search often scores too low. */
const RECAP_QUERY =
  /\b(what happened|what went on|recap|summarize|summary|tell me about|campaign so far|last session|recent events?|what did we do)\b/i;

export type ChatContextSource = 'rag' | 'seed-fallback' | 'none';

export type ResolvedChatContext = {
  context: string | null;
  source: ChatContextSource;
};

function formatDocs(docs: CampaignDoc[]): string {
  return docs.map(formatDocContentForChat).join('\n\n');
}

function buildSeedFallbackContext(seedDocuments: CampaignDoc[], query: string): string | null {
  const summaries = seedDocuments.filter((doc) => doc.type === 'session-summary');
  const descriptions = seedDocuments.filter((doc) => doc.type === 'chapter-description');

  if (RECAP_QUERY.test(query)) {
    if (summaries.length > 0) return formatDocs(summaries);
    if (descriptions.length > 0) return formatDocs(descriptions);
    return null;
  }

  const docs = [...summaries, ...descriptions];
  if (docs.length === 0) return null;
  return formatDocs(docs);
}

export function resolveChatContext(
  ragContext: string | null,
  seedDocuments: CampaignDoc[],
  query: string,
): ResolvedChatContext {
  if (ragContext) {
    return { context: ragContext, source: 'rag' };
  }

  const fallback = buildSeedFallbackContext(seedDocuments, query);
  return {
    context: fallback,
    source: fallback ? 'seed-fallback' : 'none',
  };
}
