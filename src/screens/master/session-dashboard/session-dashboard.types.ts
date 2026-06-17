import type { ConnectedPlayer } from '@/components/molecules/connected-player-avatar';
import type { SessionDashboardTab } from '@/components/molecules/session-dashboard-bottom-nav';

export type SessionDashboardScreenProps = {
  campaignName?: string;
  sessionId?: string;
  isSessionActive?: boolean;
  isSessionConnecting?: boolean;
  isStartingSession?: boolean;
  activeChapterTitle?: string;
  activeChapterDescription?: string;
  activeChapterImageUri?: string;
  connectedPlayers?: ConnectedPlayer[];
  onStartSession?: () => void;
  onOpenChapter?: () => void;
  onPlayerPress?: (player: ConnectedPlayer) => void;
  onTabPress?: (tab: SessionDashboardTab) => void;
};
