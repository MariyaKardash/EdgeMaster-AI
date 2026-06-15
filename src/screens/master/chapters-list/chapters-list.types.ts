import type { ChapterListItem } from './chapters-list.constants';
import type { SessionDashboardTab } from '@/components/molecules/session-dashboard-bottom-nav';

export type ChaptersListScreenProps = {
  chapters?: ChapterListItem[];
  onChapterPress?: (chapter: ChapterListItem) => void;
  onNewChapter?: () => void;
  onTabPress?: (tab: SessionDashboardTab) => void;
};
