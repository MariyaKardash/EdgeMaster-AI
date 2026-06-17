import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { sessionIdFromCampaignId } from '@/database';
import { useCampaign } from '@/contexts/campaign-context';

export function useCampaignId(explicitCampaignId?: string) {
  const { activeCampaign } = useCampaign();
  const { campaignId: paramCampaignId } = useLocalSearchParams<{ campaignId?: string }>();

  return (
    explicitCampaignId ??
    (typeof paramCampaignId === 'string' ? paramCampaignId : undefined) ??
    activeCampaign?.id
  );
}

export function useCampaignSessionId(explicitCampaignId?: string) {
  const campaignId = useCampaignId(explicitCampaignId);

  return useMemo(
    () => (campaignId ? sessionIdFromCampaignId(campaignId) : undefined),
    [campaignId],
  );
}
