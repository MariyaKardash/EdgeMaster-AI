import type { ChapterStatus } from '@/database/entities';

export type ChapterListItemCardProps = {
  title: string;
  description: string;
  status: ChapterStatus;
  dateLabel: string;
  onPress?: () => void;
};
