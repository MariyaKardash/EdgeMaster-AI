import { useRouter } from 'expo-router';

import { MOCK_CAMPAIGN } from '@/data/mock-campaign';
import { NewChapterScreen } from '@/screens/master/new-chapter';

export default function DevNewChapterRoute() {
  const router = useRouter();

  return (
    <NewChapterScreen
      campaignId={MOCK_CAMPAIGN.id}
      onBack={() => router.back()}
      onSave={() => router.back()}
    />
  );
}
