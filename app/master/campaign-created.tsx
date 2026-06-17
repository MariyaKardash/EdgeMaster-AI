import { useLocalSearchParams, useRouter } from 'expo-router';

import { sessionIdFromCampaignId } from '@/database';
import { useCampaign } from '@/contexts/campaign-context';
import { CampaignCreatedScreen } from '@/screens/master/campaign-created';

const CampaignCreatedRoute = () => {
  const router = useRouter();
  const { activeCampaign } = useCampaign();
  const {
    sessionId: paramSessionId,
    campaignName: paramCampaignName,
    characterCount,
    itemCount,
  } = useLocalSearchParams<{
    sessionId?: string;
    campaignName?: string;
    characterCount?: string;
    itemCount?: string;
  }>();

  const sessionId =
    activeCampaign?.sessionId ??
    (activeCampaign?.id ? sessionIdFromCampaignId(activeCampaign.id) : undefined) ??
    (typeof paramSessionId === 'string' ? paramSessionId : undefined);

  const campaignName =
    activeCampaign?.name ?? (typeof paramCampaignName === 'string' ? paramCampaignName : undefined);

  const resolvedCharacterCount =
    typeof characterCount === 'string' ? Number.parseInt(characterCount, 10) : undefined;
  const resolvedItemCount =
    typeof itemCount === 'string' ? Number.parseInt(itemCount, 10) : undefined;

  return (
    <CampaignCreatedScreen
      sessionId={sessionId}
      campaignName={campaignName}
      characterCount={Number.isNaN(resolvedCharacterCount) ? undefined : resolvedCharacterCount}
      itemCount={Number.isNaN(resolvedItemCount) ? undefined : resolvedItemCount}
      onOpenDashboard={() => {
        router.replace({
          pathname: '/master/session-dashboard',
          params: sessionId ? { sessionId } : undefined,
        });
      }}
    />
  );
};

export default CampaignCreatedRoute;
