import { useLocalSearchParams, useRouter } from 'expo-router';

import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { PartyStatusScreen } from '@/screens/master/party-status';
import { MOCK_SESSION_ID } from '@/screens/master/session-dashboard/session-dashboard.constants';

const PartyStatusRoute = () => {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const resolvedSessionId = typeof sessionId === 'string' ? sessionId : MOCK_SESSION_ID;

  return (
    <PartyStatusScreen
      onEquipHero={() => {
        // TODO: navigate to equip hero flow
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, resolvedSessionId);
      }}
    />
  );
};

export default PartyStatusRoute;
