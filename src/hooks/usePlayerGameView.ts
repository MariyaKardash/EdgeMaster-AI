import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { EventLogItemData } from '@/components/molecules/event-log-item';
import { useCampaign } from '@/contexts/campaign-context';
import { gameEventToLogItem } from '@/screens/master/live-control/live-control.utils';

export type UsePlayerGameViewResult = {
  hasActiveChapter: boolean;
  chapterTitle: string | null;
  chapterDescription: string | null;
  logEntries: EventLogItemData[];
  isLoading: boolean;
  refresh: () => Promise<void>;
};

export function usePlayerGameView(): UsePlayerGameViewResult {
  const { activeChapter, listGameEvents } = useCampaign();

  const [logEntries, setLogEntries] = useState<EventLogItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);

    try {
      const chapterId = activeChapter?.id;
      if (!chapterId) {
        setLogEntries([]);
        return;
      }

      const events = await listGameEvents(chapterId);
      setLogEntries([...events].reverse().map(gameEventToLogItem));
    } catch {
      setLogEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeChapter, listGameEvents]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  return {
    hasActiveChapter: activeChapter != null,
    chapterTitle: activeChapter?.title ?? null,
    chapterDescription: activeChapter?.description ?? null,
    logEntries,
    isLoading,
    refresh: loadData,
  };
}
