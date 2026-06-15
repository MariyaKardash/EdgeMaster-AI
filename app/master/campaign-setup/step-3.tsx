import { useRouter } from 'expo-router';

import { CampaignSetupStep3Screen } from '@/screens/master/campaign-setup-step3';

const CampaignSetupStep3Route = () => {
  const router = useRouter();

  return (
    <CampaignSetupStep3Screen
      onBack={() => router.back()}
      onFinalize={() => {
        // TODO: navigate to campaign created screen
      }}
    />
  );
};

export default CampaignSetupStep3Route;
