import { useEffect, useRef, useState } from 'react';

import type { EventLogEntryData } from '@/components/molecules/combat-log-entry';
import { useCampaign } from '@/contexts/campaign-context';
import { dbKeys } from '@/database';
import { logDev } from '@/lib/logger';
import { mapGameEventsToLogEntries } from '@/screens/master/live-control/live-control.constants';

function isChapterGameEventDbKey(key: string, chapterId: string) {
  return key.startsWith(dbKeys.indexEventsByChapter(chapterId));
}

export function useChapterGameLog(chapterId?: string) {
  const { listGameEvents, worklet } = useCampaign();
  const [loadedLog, setLoadedLog] = useState<{
    chapterId: string;
    entries: EventLogEntryData[];
  } | null>(null);
  const loadGenerationRef = useRef(0);

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
      }
    };

    void loadGameLog();

    const unsubscribe = worklet.onEvent((event) => {
      if (
        (event.type === 'db-put' || event.type === 'db-del') &&
        isChapterGameEventDbKey(event.key, chapterId)
      ) {
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
    return [];
  }

  return loadedLog.entries;
}
