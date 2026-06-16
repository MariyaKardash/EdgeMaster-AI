import { useLocalSearchParams, useRouter } from 'expo-router';

import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { ChaptersListScreen } from '@/screens/master/chapters-list';
import { MOCK_SESSION_ID } from '@/screens/master/session-dashboard/session-dashboard.constants';

const ChaptersListRoute = () => {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const resolvedSessionId = typeof sessionId === 'string' ? sessionId : MOCK_SESSION_ID;

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
        // TODO: navigate to new chapter flow
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, resolvedSessionId);
      }}
    />
  );
};

export default ChaptersListRoute;
