import { useLocalSearchParams, useRouter } from 'expo-router';

import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { LiveControlScreen } from '@/screens/master/live-control';
import { MOCK_SESSION_ID } from '@/screens/master/session-dashboard/session-dashboard.constants';

const LiveControlRoute = () => {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const resolvedSessionId = typeof sessionId === 'string' ? sessionId : MOCK_SESSION_ID;

  return (
    <LiveControlScreen
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, resolvedSessionId);
      }}
    />
  );
};

export default LiveControlRoute;
