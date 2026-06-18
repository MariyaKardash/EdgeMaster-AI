import type { EventLogItemData } from '@/components/molecules/event-log-item';
import type { GameEvent } from '@/database';

import { formatEventLogTimestamp } from './live-control.constants';

export function deriveEventTitle(body: string): string {
  const line = body.trim().split('\n')[0]?.trim() ?? '';
  if (!line) {
    return 'Event';
  }
  return line.length <= 80 ? line : `${line.slice(0, 77)}…`;
}

export function gameEventToLogItem(event: GameEvent): EventLogItemData {
  return {
    id: event.id,
    title: event.title,
    body: event.body,
    timestamp: formatEventLogTimestamp(new Date(event.createdAt)),
  };
}
