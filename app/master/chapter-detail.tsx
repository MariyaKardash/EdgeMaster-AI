import { useLocalSearchParams, useRouter } from 'expo-router';

import { ChapterDetailScreen } from '@/screens/master/chapter-detail';

const ChapterDetailRoute = () => {
  const router = useRouter();
  const { chapterId, campaignId } = useLocalSearchParams<{
    chapterId: string;
    campaignId: string;
  }>();

  if (!chapterId || !campaignId) {
    return null;
  }

  return (
    <ChapterDetailScreen
      chapterId={chapterId}
      campaignId={campaignId}
      onBack={() => router.back()}
      onStarted={() => {
        router.dismissTo('/master/session-dashboard');
      }}
      onCompleteTapped={(id) => {
        router.push({
          pathname: '/master/chapter-summarize',
          params: { chapterId: id, campaignId },
        });
      }}
    />
  );
};

export default ChapterDetailRoute;
