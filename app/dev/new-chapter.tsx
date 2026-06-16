import { useRouter } from 'expo-router';

import { useCampaign } from '@/contexts/campaign-context';
import { MOCK_CAMPAIGN } from '@/data/mock-campaign';
import { NewChapterScreen } from '@/screens/master/new-chapter';

export default function DevNewChapterRoute() {
  const router = useRouter();
  const { activeCampaign } = useCampaign();

  // Prefer the real active campaign so Holepunch calls work; fall back to mock id for UI testing
  const campaignId = activeCampaign?.id ?? MOCK_CAMPAIGN.id;

  return (
    <NewChapterScreen
      campaignId={campaignId}
      onBack={() => router.back()}
      onSave={() => router.back()}
    />
  );
}
