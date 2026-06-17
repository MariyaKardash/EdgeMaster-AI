import { useRouter } from 'expo-router';

import { useCampaignId, useCampaignSessionId } from '@/hooks/useCampaignSessionId';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { SessionDashboardScreen } from '@/screens/master/session-dashboard';

const SessionDashboardRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();
  const sessionId = useCampaignSessionId();

  return (
    <SessionDashboardScreen
      sessionId={sessionId}
      onOpenChapter={() => {
        router.push({
          pathname: '/master/live-control',
          params: campaignId ? { campaignId } : undefined,
        });
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default SessionDashboardRoute;
