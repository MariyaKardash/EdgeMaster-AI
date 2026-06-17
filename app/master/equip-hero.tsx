import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';

import { useCampaignId } from '@/hooks/useCampaignSessionId';
import { navigateSessionDashboardTab } from '@/navigation/session-dashboard-tabs';
import {
  consumeEquipHeroPlayerInput,
  EquipHeroScreen,
  setEquipHeroPlayerUpdate,
} from '@/screens/master/equip-hero';
import { MOCK_PARTY_PLAYERS } from '@/screens/master/party-status';

const EquipHeroRoute = () => {
  const router = useRouter();
  const campaignId = useCampaignId();
  const { playerId } = useLocalSearchParams<{ playerId?: string }>();

  const player = useMemo(() => {
    const inputPlayer = consumeEquipHeroPlayerInput();
    if (inputPlayer) {
      return inputPlayer;
    }

    if (typeof playerId === 'string') {
      return MOCK_PARTY_PLAYERS.find((entry) => entry.id === playerId) ?? MOCK_PARTY_PLAYERS[0];
    }

    return MOCK_PARTY_PLAYERS[0];
  }, [playerId]);

  return (
    <EquipHeroScreen
      player={player}
      onBack={(updatedPlayer) => {
        setEquipHeroPlayerUpdate(updatedPlayer);
        router.back();
      }}
      onTabPress={(tab) => {
        navigateSessionDashboardTab(router, tab, campaignId);
      }}
    />
  );
};

export default EquipHeroRoute;
