export type ChapterDetailScreenProps = {
  chapterId: string;
  campaignId: string;
  onBack: () => void;
  onCompleteTapped: (chapterId: string) => void;
};
