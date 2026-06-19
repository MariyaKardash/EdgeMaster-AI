import type { EventLogItemData } from '@/components/molecules/event-log-item';
import { useCampaign } from '@/contexts/campaign-context';
import { useChapterGameLog } from '@/hooks/useChapterGameLog';

export type UsePlayerGameViewResult = {
  hasActiveChapter: boolean;
  chapterTitle: string | null;
  chapterDescription: string | null;
  logEntries: EventLogItemData[];
  isLoading: boolean;
  refresh: () => Promise<void>;
};

export function usePlayerGameView(): UsePlayerGameViewResult {
  const { activeChapter } = useCampaign();
  const { entries: logEntries, isLoading } = useChapterGameLog(activeChapter?.id);

  return {
    hasActiveChapter: activeChapter != null,
    chapterTitle: activeChapter?.title ?? null,
    chapterDescription: activeChapter?.description ?? null,
    logEntries,
    isLoading,
    refresh: async () => {},
  };
}
