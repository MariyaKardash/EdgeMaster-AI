import { useLocalSearchParams, useRouter } from 'expo-router';

import { useCampaign } from '@/contexts/campaign-context';
import { useCampaignTopicHex } from '@/hooks/useCampaignSessionId';
import { CampaignCreatedScreen } from '@/screens/master/campaign-created';

const CampaignCreatedRoute = () => {
  const router = useRouter();
  const { activeCampaign } = useCampaign();
  const {
    campaignName: paramCampaignName,
    characterCount,
    itemCount,
  } = useLocalSearchParams<{
    campaignName?: string;
    characterCount?: string;
    itemCount?: string;
  }>();

  const topicHex = useCampaignTopicHex();
  const campaignName =
    activeCampaign?.name ?? (typeof paramCampaignName === 'string' ? paramCampaignName : undefined);

  const resolvedCharacterCount =
    typeof characterCount === 'string' ? Number.parseInt(characterCount, 10) : undefined;
  const resolvedItemCount =
    typeof itemCount === 'string' ? Number.parseInt(itemCount, 10) : undefined;

  return (
    <CampaignCreatedScreen
      sessionId={topicHex}
      campaignName={campaignName}
      characterCount={Number.isNaN(resolvedCharacterCount) ? undefined : resolvedCharacterCount}
      itemCount={Number.isNaN(resolvedItemCount) ? undefined : resolvedItemCount}
      onOpenDashboard={() => {
        router.replace({
          pathname: '/master/session-dashboard',
          params: activeCampaign?.id ? { campaignId: activeCampaign.id } : undefined,
        });
      }}
    />
  );
};

export default CampaignCreatedRoute;
