import { useLocalSearchParams, useRouter } from 'expo-router';

import { NewChapterScreen } from '@/screens/master/new-chapter';

const NewChapterRoute = () => {
  const router = useRouter();
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();

  return (
    <NewChapterScreen
      campaignId={campaignId ?? ''}
      onBack={() => router.back()}
      onSave={() => router.back()}
    />
  );
};

export default NewChapterRoute;
