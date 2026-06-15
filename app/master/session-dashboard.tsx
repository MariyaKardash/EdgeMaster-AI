import { useLocalSearchParams } from 'expo-router';

import { SessionDashboardScreen } from '@/screens/master/session-dashboard';
import { MOCK_SESSION_ID } from '@/screens/master/session-dashboard/session-dashboard.constants';

const SessionDashboardRoute = () => {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();

  return (
    <SessionDashboardScreen
      sessionId={typeof sessionId === 'string' ? sessionId : MOCK_SESSION_ID}
      onOpenChapter={() => {
        // TODO: navigate to chapter view
      }}
      onTabPress={(tab) => {
        if (tab === 'chapters') {
          // TODO: navigate to chapters list
        }
      }}
    />
  );
};

export default SessionDashboardRoute;
