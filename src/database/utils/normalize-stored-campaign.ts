import { sessionIdFromCampaignId } from './session-code';

const LEGACY_CAMPAIGN_DESCRIPTION = 'No description';

export function normalizeStoredCampaign(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  const record = value as Record<string, unknown>;
  const description =
    typeof record.description === 'string' && record.description.trim().length > 0
      ? record.description
      : LEGACY_CAMPAIGN_DESCRIPTION;

  return {
    ...record,
    description,
    sessionId:
      typeof record.sessionId === 'string' && record.sessionId.length > 0
        ? record.sessionId
        : typeof record.id === 'string'
          ? sessionIdFromCampaignId(record.id)
          : record.sessionId,
  };
}
