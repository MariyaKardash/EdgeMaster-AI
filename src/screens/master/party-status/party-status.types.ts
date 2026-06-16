import type { PartyPlayer } from '@/components/molecules/party-player-card';
import type { SessionDashboardTab } from '@/components/molecules/session-dashboard-bottom-nav';

export type PartyStatusScreenProps = {
  players?: PartyPlayer[];
  onPlayersChange?: (players: PartyPlayer[]) => void;
  onEquipHero?: (player: PartyPlayer) => void;
  onTabPress?: (tab: SessionDashboardTab) => void;
};
