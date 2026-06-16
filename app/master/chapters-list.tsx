import { useLocalSearchParams, useRouter } from 'expo-router';

import { MOCK_CAMPAIGN } from '@/data/mock-campaign';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { ChaptersListScreen } from '@/screens/master/chapters-list';
import { MOCK_SESSION_ID } from '@/screens/master/session-dashboard/session-dashboard.constants';

const ChaptersListRoute = () => {
  const router = useRouter();
  const { sessionId, campaignId } = useLocalSearchParams<{
    sessionId?: string;
    campaignId?: string;
  }>();
  const resolvedSessionId = typeof sessionId === 'string' ? sessionId : MOCK_SESSION_ID;
  const resolvedCampaignId = typeof campaignId === 'string' ? campaignId : MOCK_CAMPAIGN.id;

  return (
    <ChaptersListScreen
      onChapterPress={(chapter) => {
        if (chapter.status === 'active') {
          router.push({
            pathname: '/master/live-control',
            params: { sessionId: resolvedSessionId },
          });
        }
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
