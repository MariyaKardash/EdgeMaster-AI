import { useRouter } from 'expo-router';

import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import { setEquipHeroPlayerInput } from '@/screens/master/equip-hero';
import { PartyStatusScreen } from '@/screens/master/party-status';

const PartyStatusRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();

  return (
    <PartyStatusScreen
      onEquipHero={(player) => {
        setEquipHeroPlayerInput(player);
        router.push({
          pathname: '/master/equip-hero',
          params: {
            playerId: player.id,
            ...(campaignId ? { campaignId } : {}),
          },
        });
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default PartyStatusRoute;
