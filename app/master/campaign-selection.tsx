import { useRouter } from 'expo-router';

import { CampaignSelectionScreen } from '@/screens/master/campaign-selection';

const CampaignSelectionRoute = () => {
  const router = useRouter();

  return (
    <CampaignSelectionScreen
      onBack={() => router.back()}
      onStartNew={() => {
        // TODO: navigate to campaign setup wizard
      }}
      onContinue={() => {
        // TODO: navigate to session dashboard
      }}
    />
  );
};

export default CampaignSelectionRoute;
