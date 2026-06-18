import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { useCampaign } from '@/contexts/campaign-context';
import { sessionIdFromCampaignId } from '@/database/utils/session-code';
import { campaignTopicHex } from '@/lib/holepunch/sessionTopicHex';

export function useCampaignId(explicitCampaignId?: string) {
  const { activeCampaign } = useCampaign();
  const { campaignId: paramCampaignId } = useLocalSearchParams<{ campaignId?: string }>();

  return (
    explicitCampaignId ??
    (typeof paramCampaignId === 'string' ? paramCampaignId : undefined) ??
    activeCampaign?.id
  );
}

export function useCampaignSessionCode(explicitCampaignId?: string) {
  const campaignId = useCampaignId(explicitCampaignId);

  return useMemo(
    () => (campaignId ? sessionIdFromCampaignId(campaignId) : undefined),
    [campaignId],
  );
}

export function useCampaignTopicHex(explicitCampaignId?: string) {
  const campaignId = useCampaignId(explicitCampaignId);

  return useMemo(() => (campaignId ? campaignTopicHex(campaignId) : undefined), [campaignId]);
}

/** @deprecated Use useCampaignSessionCode instead. */
export const useCampaignSessionId = useCampaignSessionCode;
