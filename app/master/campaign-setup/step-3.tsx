import { useRouter } from 'expo-router';

import { CampaignSetupStep3Screen } from '@/screens/master/campaign-setup-step3';

const CampaignSetupStep3Route = () => {
  const router = useRouter();

  return (
    <CampaignSetupStep3Screen
      onBack={() => router.back()}
      onFinalize={() => {
        router.replace('/master/campaign-created');
      }}
    />
  );
};

export default CampaignSetupStep3Route;
