import type { SessionDashboardTab } from '@/components/molecules/session-dashboard-bottom-nav';

export type LiveControlScreenProps = {
  chapterId: string;
  onSummarizeAndEndChapter?: () => void;
  onTabPress?: (tab: SessionDashboardTab) => void;
};
