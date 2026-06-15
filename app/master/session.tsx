import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { ButtonSecondary, Text } from '@/components';
import { useCampaign } from '@/contexts/campaign-context';
import { styles } from '@/screens/master/session/master-session.styles';

const MasterSessionRoute = () => {
  const router = useRouter();
  const {
    activeCampaign,
    activeChapter,
    activeSession,
    connectedPeers,
    connectionState,
    stopSession,
  } = useCampaign();

  const copySessionCode = async () => {
    if (!activeSession) {
      return;
    }

    await Clipboard.setStringAsync(activeSession.sessionCode);
    Alert.alert('Copied', 'Session code copied to clipboard.');
  };

  if (!activeSession || !activeCampaign) {
    return (
      <View style={styles.container}>
        <Text variant="headlineLgMobile">No active session</Text>
        <ButtonSecondary title="Back" fullWidth onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineLgMobile">{activeCampaign.name}</Text>
        <Text variant="bodyLg">{activeChapter?.title ?? 'Active chapter'}</Text>
      </View>

      <View style={styles.card}>
        <Text variant="labelMd">Session code</Text>
        <Text variant="codeMd" style={styles.sessionCode}>
          {activeSession.sessionCode}
        </Text>
        <Text variant="bodyMd" style={styles.meta}>
          Share this code so players can join. Connected players: {connectedPeers}
        </Text>
        <Text variant="bodyMd" style={styles.meta}>
          Connection: {connectionState}
        </Text>
      </View>

      <View style={styles.actions}>
        <ButtonSecondary
          title="Copy session code"
          fullWidth
          onPress={() => void copySessionCode()}
        />
        <ButtonSecondary
          title="End session"
          fullWidth
          onPress={() => {
            void stopSession();
            router.back();
          }}
        />
        <ButtonSecondary title="Back" fullWidth onPress={() => router.back()} />
      </View>
    </View>
  );
};

export default MasterSessionRoute;
