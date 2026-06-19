import type { EventLogEntryData } from '@/components/molecules/combat-log-entry';
import type { PartyPlayer } from '@/components/molecules/party-player-card';
import type { InventoryItem } from '@/screens/master/equip-hero';

export type PlayerSheetTab = 'stats' | 'inventory' | 'history';

export type NarrativeParagraph = {
  text: string;
  variant?: 'body' | 'quote';
};

export type GameViewScreenProps = {
  chapterTitle?: string;
  chapterDescription?: string;
  partyPlayer?: PartyPlayer;
  inventoryItems?: InventoryItem[];
  gameLog?: EventLogEntryData[];
};
