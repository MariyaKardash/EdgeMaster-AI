export type EventLogEntryData = {
  id: string;
  message: string;
  timestamp: string;
};

export type EventLogEntryProps = {
  entry: EventLogEntryData;
  isLast?: boolean;
};
