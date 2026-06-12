import { useRouter } from 'expo-router';

import { CampaignSelectionScreen } from '@/screens/master/campaign-selection';

const CampaignSelectionRoute = () => {
  const router = useRouter();

  return (
    <CampaignSelectionScreen
      onBack={() => router.back()}
      onStartNew={() => router.push('/master/campaign-setup/step-1')}
      onContinue={() => {
        // TODO: navigate to session dashboard
      }}
    />
  );
};

export default CampaignSelectionRoute;
