import { useLocalSearchParams, useRouter } from 'expo-router';

import { MOCK_CAMPAIGN } from '@/data/mock-campaign';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { ChaptersListScreen } from '@/screens/master/chapters-list';

const ChaptersListRoute = () => {
  const router = useRouter();
  const { sessionId, campaignId } = useLocalSearchParams<{
    sessionId?: string;
    campaignId?: string;
  }>();
  const resolvedSessionId = typeof sessionId === 'string' ? sessionId : undefined;
  const resolvedCampaignId = typeof campaignId === 'string' ? campaignId : MOCK_CAMPAIGN.id;

  return (
    <ChaptersListScreen
      onChapterPress={() => {
        // TODO: navigate to chapter detail
      }}
      onNewChapter={() => {
        router.push(`/master/new-chapter?campaignId=${resolvedCampaignId}`);
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, resolvedSessionId);
      }}
    />
  );
};

export default ChaptersListRoute;
