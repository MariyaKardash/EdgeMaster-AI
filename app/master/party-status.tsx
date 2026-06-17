import { useRouter } from 'expo-router';

import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { PartyStatusScreen } from '@/screens/master/party-status';

const PartyStatusRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();

  return (
    <PartyStatusScreen
      onEquipHero={() => {
        // TODO: navigate to equip hero flow
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default PartyStatusRoute;
