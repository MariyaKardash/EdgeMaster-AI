import { useLocalSearchParams, useRouter } from 'expo-router';

import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { ChaptersListScreen } from '@/screens/master/chapters-list';

const ChaptersListRoute = () => {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const resolvedSessionId = typeof sessionId === 'string' ? sessionId : undefined;

  return (
    <ChaptersListScreen
      onChapterPress={() => {
        // TODO: navigate to chapter detail
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
