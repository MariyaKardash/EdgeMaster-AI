import type { EventLogItemData } from '@/components/molecules/event-log-item';

import { deriveEventTitle } from './live-control.utils';

export const MOCK_EVENT_LOG: EventLogItemData[] = [
  {
    id: 'log-1',
    timestamp: '14:42',
    title: 'The party enters the Deep Reeds',
    body: 'The party enters the Deep Reeds. Visibility reduced to 10ft.',
  },
  {
    id: 'log-2',
    timestamp: '14:45',
    title: 'A Bog Beast lunges from the murk toward Tordak!',
    body: 'A Bog Beast lunges from the murk toward Tordak!',
  },
  {
    id: 'log-3',
    timestamp: '14:48',
    title: 'Kaelen tries to intimidate the guard captain',
    body: 'Kaelen tries to intimidate the guard captain.',
  },
];

export const SUMMARIZE_END_CHAPTER_LABEL = 'Summarize & End Chapter';

export const NEW_EVENT_LABEL = 'New Event';

export const DESCRIBE_EVENT_TITLE = 'Describe the Event';

export const EVENT_TITLE_PLACEHOLDER = 'e.g. Battle with the cave troll';

export const EVENT_DESCRIPTION_PLACEHOLDER =
  'e.g. The party fought a troll, defeated it, and looted a rusted key from its hoard.';

export const EMPTY_EVENTS_LOG_MESSAGE =
  'No events recorded yet. Tap + New Event to log the first moment.';

export const formatEventLogTimestamp = (date: Date): string =>
  date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });

export const createEventLogEntry = (body: string): EventLogItemData => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  title: deriveEventTitle(body),
  body,
  timestamp: formatEventLogTimestamp(new Date()),
});
