import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

import type { PartyPlayer } from '@/components/molecules/party-player-card';
import type { SessionDashboardTab } from '@/components/molecules/session-dashboard-bottom-nav';

export type InventoryCategory = 'weapons' | 'armor' | 'utility';

export type InventoryFilter = 'all' | InventoryCategory;

export type InventoryItem = {
  id: string;
  name: string;
  description: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  category: InventoryCategory;
};

export type EquipHeroScreenProps = {
  player: PartyPlayer;
  inventoryItems?: InventoryItem[];
  onBack?: (player: PartyPlayer) => void;
  onTabPress?: (tab: SessionDashboardTab) => void;
};
