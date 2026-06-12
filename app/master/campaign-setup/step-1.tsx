import { useRouter } from 'expo-router';

import { CampaignSetupStep1Screen } from '@/screens/master/campaign-setup-step1';

const CampaignSetupStep1Route = () => {
  const router = useRouter();

  return (
    <CampaignSetupStep1Screen
      onBack={() => router.back()}
      onContinue={() => router.push('/master/campaign-setup/step-2')}
    />
  );
};

export default CampaignSetupStep1Route;
