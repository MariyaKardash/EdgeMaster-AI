import { useRouter } from 'expo-router';

import { useCampaign } from '@/contexts/campaign-context';
import { useCampaignId, useCampaignSessionId } from '@/hooks/useCampaignSessionId';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { SessionDashboardScreen } from '@/screens/master/session-dashboard';

const SessionDashboardRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();
  const sessionId = useCampaignSessionId();
  const { activeChapter, activeCampaign } = useCampaign();

  return (
    <SessionDashboardScreen
      campaignName={activeCampaign?.name}
      sessionId={sessionId}
      activeChapterTitle={activeChapter?.title}
      activeChapterDescription={activeChapter?.description}
      onOpenChapter={
        activeChapter
          ? () => {
              router.push({
                pathname: '/master/live-control',
                params: campaignId ? { campaignId } : undefined,
              });
            }
          : undefined
      }
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default SessionDashboardRoute;
