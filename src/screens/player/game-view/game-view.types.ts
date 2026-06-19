import type { EventLogItemData } from '@/components/molecules/event-log-item';
import type { PartyPlayer } from '@/components/molecules/party-player-card';
import type { InventoryItem } from '@/screens/master/equip-hero';

export type PlayerSheetTab = 'stats' | 'inventory' | 'chapter';

export type GameViewScreenProps = {
  hasActiveChapter?: boolean;
  chapterTitle?: string | null;
  chapterDescription?: string | null;
  logEntries?: EventLogItemData[];
  isLoadingEvents?: boolean;
  partyPlayer?: PartyPlayer;
  inventoryItems?: InventoryItem[];
  isChatEnabled?: boolean;
  onChatPress?: () => void;
};
