import type { ConnectedPlayer } from '@/components/molecules/connected-player-avatar';
import type { SessionDashboardTab } from '@/components/molecules/session-dashboard-bottom-nav';

export type SessionDashboardScreenProps = {
  sessionId?: string;
  activeChapterTitle?: string;
  activeChapterDescription?: string;
  activeChapterImageUri?: string;
  connectedPlayers?: ConnectedPlayer[];
  onOpenChapter?: () => void;
  onPlayerPress?: (player: ConnectedPlayer) => void;
  onTabPress?: (tab: SessionDashboardTab) => void;
};
