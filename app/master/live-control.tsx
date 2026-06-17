import { useRouter } from 'expo-router';

import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { LiveControlScreen } from '@/screens/master/live-control';

const LiveControlRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();

  return (
    <LiveControlScreen
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default LiveControlRoute;
