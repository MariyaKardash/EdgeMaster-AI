import { useEffect, useRef, useState } from 'react';

import type { EventLogItemData } from '@/components/molecules/event-log-item';
import { useCampaign } from '@/contexts/campaign-context';
import { dbKeys } from '@/database';
import type { P2pWorkletEvent } from '@/database/p2p/types';
import { logDev } from '@/lib/logger';
import { mapGameEventsToLogEntries } from '@/screens/master/live-control/live-control.constants';

function isChapterGameEventDbKey(key: string, chapterId: string) {
  return key.startsWith('@game-event/') || key.startsWith(dbKeys.indexEventsByChapter(chapterId));
}

function shouldReloadChapterGameLog(event: P2pWorkletEvent, chapterId: string) {
  if (event.type === 'campaign-db-updated') {
    return true;
  }

  return (
    (event.type === 'db-put' || event.type === 'db-del') &&
    isChapterGameEventDbKey(event.key, chapterId)
  );
}

export function useChapterGameLog(chapterId?: string) {
  const { listGameEvents, worklet } = useCampaign();
  const [loadedLog, setLoadedLog] = useState<{
    chapterId: string;
    entries: EventLogItemData[];
  } | null>(null);
  const loadGenerationRef = useRef(0);
  const isLoading = Boolean(chapterId) && loadedLog?.chapterId !== chapterId;

  useEffect(() => {
    if (!chapterId) {
      loadGenerationRef.current += 1;
      return;
    }

    let cancelled = false;

    const loadGameLog = async () => {
      const loadGeneration = loadGenerationRef.current + 1;
      loadGenerationRef.current = loadGeneration;

      try {
        const events = await listGameEvents(chapterId);

        if (!cancelled && loadGeneration === loadGenerationRef.current) {
          setLoadedLog({
            chapterId,
            entries: mapGameEventsToLogEntries(events),
          });
        }
      } catch (error) {
        logDev('[useChapterGameLog.loadGameLog]', error);
        if (!cancelled && loadGeneration === loadGenerationRef.current) {
          setLoadedLog({ chapterId, entries: [] });
        }
      }
    };

    void loadGameLog();

    const unsubscribe = worklet.onEvent((event) => {
      if (shouldReloadChapterGameLog(event, chapterId)) {
        void loadGameLog();
      }
    });

    return () => {
      cancelled = true;
      loadGenerationRef.current += 1;
      unsubscribe();
    };
  }, [chapterId, listGameEvents, worklet]);

  if (!chapterId || loadedLog?.chapterId !== chapterId) {
    return { entries: [] as EventLogItemData[], isLoading };
  }

  return { entries: loadedLog.entries, isLoading };
}
