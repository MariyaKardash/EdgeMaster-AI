import { useLocalSearchParams, useRouter } from 'expo-router';

import { MOCK_CAMPAIGN } from '@/data/mock-campaign';
import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { ChaptersListScreen } from '@/screens/master/chapters-list';

const ChaptersListRoute = () => {
  const router = useRouter();
  const { campaignId: paramCampaignId } = useLocalSearchParams<{ campaignId?: string }>();
  const campaignId = useCampaignId(
    typeof paramCampaignId === 'string' ? paramCampaignId : undefined,
  );
  const resolvedCampaignId = campaignId ?? MOCK_CAMPAIGN.id;

  return (
    <ChaptersListScreen
      onChapterPress={(chapter) => {
        if (chapter.status === 'active') {
          router.push({
            pathname: '/master/live-control',
            params: { campaignId: resolvedCampaignId },
          });
        }
      }}
      onNewChapter={() => {
        router.push(`/master/new-chapter?campaignId=${resolvedCampaignId}`);
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default ChaptersListRoute;
