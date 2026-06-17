import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useCampaign } from '@/contexts/campaign-context';
import { JoinSessionScreen, type JoinSessionConnectPayload } from '@/screens/player/join-session';

const JoinSessionRoute = () => {
  const router = useRouter();
  const { joinPlayerSession, connectionState, error } = useCampaign();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleConnect = async ({ topicHex }: JoinSessionConnectPayload) => {
    try {
      setLocalError(null);
      await joinPlayerSession(topicHex);
      router.push('/player/character-selection');
    } catch (connectError) {
      setLocalError(
        connectError instanceof Error ? connectError.message : 'Failed to join the session.',
      );
    }
  };

  return (
    <JoinSessionScreen
      onConnect={(payload) => {
        void handleConnect(payload);
      }}
      onBack={() => router.back()}
      isConnecting={connectionState === 'connecting'}
      errorMessage={localError ?? error}
    />
  );
};

export default JoinSessionRoute;
