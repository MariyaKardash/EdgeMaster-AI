export type LiveControlScreenProps = {
  chapterId: string;
  onSummarizeAndEndChapter?: () => void;
  onTabPress?: (tab: 'overview' | 'chapters' | 'players') => void;
};
