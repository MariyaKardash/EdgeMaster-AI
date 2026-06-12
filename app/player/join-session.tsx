import { useRouter } from 'expo-router';

import { JoinSessionScreen } from '@/screens/player/join-session';

const JoinSessionRoute = () => {
  const router = useRouter();

  const handleConnect = (_payload: { campaignName: string; sessionHex: string }) => {
    // TODO: connect to local session using sessionHex
  };

  return <JoinSessionScreen onConnect={handleConnect} onBack={() => router.back()} />;
};

export default JoinSessionRoute;
