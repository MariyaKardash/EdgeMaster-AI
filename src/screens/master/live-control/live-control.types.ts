import type { EventLogEntryData } from '@/components/molecules/combat-log-entry';

export type LiveControlScreenProps = {
  liveSessionLabel?: string;
  chapterTitle?: string;
  chapterSubtitle?: string;
  logEntries?: EventLogEntryData[];
  onExecuteEvent?: (message: string) => void | Promise<void>;
  onSummarizeAndEndChapter?: () => void;
  onTabPress?: (tab: 'overview' | 'chapters' | 'players') => void;
};
