import { useLocalSearchParams, useRouter } from 'expo-router';

import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { SessionDashboardScreen } from '@/screens/master/session-dashboard';
import { MOCK_SESSION_ID } from '@/screens/master/session-dashboard/session-dashboard.constants';

const SessionDashboardRoute = () => {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const resolvedSessionId = typeof sessionId === 'string' ? sessionId : MOCK_SESSION_ID;

  return (
    <SessionDashboardScreen
      sessionId={resolvedSessionId}
      onOpenChapter={() => {
        // TODO: navigate to chapter view
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, resolvedSessionId);
      }}
    />
  );
};

export default SessionDashboardRoute;
