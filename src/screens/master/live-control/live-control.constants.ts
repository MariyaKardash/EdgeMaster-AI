import type { EventLogEntryData } from '@/components/molecules/combat-log-entry';
import type { GameEvent } from '@/database';

export const MOCK_EVENT_LOG: EventLogEntryData[] = [
  {
    id: 'log-1',
    timestamp: '14:42',
    message: 'The party enters the Deep Reeds. Visibility reduced to 10ft.',
  },
  {
    id: 'log-2',
    timestamp: '14:45',
    message: 'A Bog Beast lunges from the murk toward Tordak!',
  },
  {
    id: 'log-3',
    timestamp: '14:48',
    message: 'Kaelen tries to intimidate the guard captain.',
  },
];

export const SUMMARIZE_END_CHAPTER_LABEL = 'Summarize & End Chapter';

export const formatEventLogTimestamp = (date: Date): string =>
  date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });

export const createEventLogEntry = (message: string): EventLogEntryData => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  message,
  timestamp: formatEventLogTimestamp(new Date()),
});

export const mapGameEventsToLogEntries = (events: GameEvent[]): EventLogEntryData[] =>
  [...events]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((event) => ({
      id: event.id,
      message: event.body,
      timestamp: formatEventLogTimestamp(new Date(event.createdAt)),
    }));
