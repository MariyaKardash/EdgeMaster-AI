import { useLocalSearchParams, useRouter } from 'expo-router';

import { ChapterSummarizeScreen } from '@/screens/master/chapter-summarize';

const ChapterSummarizeRoute = () => {
  const router = useRouter();
  const { chapterId, campaignId } = useLocalSearchParams<{
    chapterId: string;
    campaignId: string;
  }>();

  if (!chapterId || !campaignId) {
    return null;
  }

  return (
    <ChapterSummarizeScreen
      chapterId={chapterId}
      onBack={() => router.back()}
      onSaved={() => {
        // Pop back past the detail screen to the chapters list
        router.dismissTo('/master/chapters-list');
      }}
    />
  );
};

export default ChapterSummarizeRoute;
