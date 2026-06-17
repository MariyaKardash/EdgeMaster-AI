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
  };
}
