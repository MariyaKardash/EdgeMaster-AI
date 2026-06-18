import type { EventLogItemData } from '@/components/molecules/event-log-item';
import type { PartyPlayer } from '@/components/molecules/party-player-card';
import type { InventoryItem } from '@/screens/master/equip-hero';

export type PlayerSheetTab = 'stats' | 'inventory' | 'history';

export type NarrativeParagraph = {
  text: string;
  variant?: 'body' | 'quote';
};

export type GameViewScreenProps = {
  chapterTitle?: string;
  narrative?: NarrativeParagraph[];
  chapterImageUri?: string;
  partyPlayer?: PartyPlayer;
  inventoryItems?: InventoryItem[];
  gameLog?: EventLogItemData[];
};
