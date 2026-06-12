import { useRouter } from 'expo-router';

import { CampaignSetupStep2Screen } from '@/screens/master/campaign-setup-step2';

const CampaignSetupStep2Route = () => {
  const router = useRouter();

  return (
    <CampaignSetupStep2Screen
      onBack={() => router.back()}
      onContinue={() => router.push('/master/campaign-setup/step-3')}
    />
  );
};

export default CampaignSetupStep2Route;
