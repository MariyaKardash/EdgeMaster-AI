import { useRouter } from 'expo-router';

import { JoinSessionScreen, type JoinSessionConnectPayload } from '@/screens/player/join-session';

const JoinSessionRoute = () => {
  const router = useRouter();

  const handleConnect = (_payload: JoinSessionConnectPayload) => {
    router.push('/player/character-selection');
  };

  return <JoinSessionScreen onConnect={handleConnect} onBack={() => router.back()} />;
};

export default JoinSessionRoute;
