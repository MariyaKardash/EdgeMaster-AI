export type EventLogItemData = {
  id: string;
  title: string;
  body: string;
  timestamp: string;
};

export type EventLogItemProps = {
  entry: EventLogItemData;
  isLast?: boolean;
  isExpanded?: boolean;
  onPress?: () => void;
  onCollapse?: () => void;
};
