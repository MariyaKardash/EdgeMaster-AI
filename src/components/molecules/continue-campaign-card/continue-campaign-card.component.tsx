import { View } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { ButtonSecondary } from '@/components/molecules/button-secondary';
import { styles } from './continue-campaign-card.styles';
import type { ContinueCampaignCardProps } from './continue-campaign-card.types';

export const ContinueCampaignCard = ({ session, onPress }: ContinueCampaignCardProps) => {
  return (
    <View style={styles.card}>
      <View pointerEvents="none" style={styles.ambientGlow} />

      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Icon name="menu-book" size={28} color="primary" />
        </View>

        <View style={styles.headerText}>
          <Text variant="headlineMd" style={styles.title}>
            Continue Campaign
          </Text>
          <Text variant="bodyMd" style={styles.description}>
            Jump back into your active session.
          </Text>
        </View>
      </View>

      <View style={styles.sessionInfo}>
        <View style={styles.sessionHeader}>
          <Text variant="labelMd" style={styles.sessionName}>
            {session.name}
          </Text>
          <Text variant="codeMd" style={styles.sessionNumber}>
            Session #{session.sessionNumber}
          </Text>
        </View>
        <Text style={styles.lastPlayed}>Last played: {session.lastPlayed}</Text>
      </View>

      <View style={styles.action}>
        <ButtonSecondary title="Resume Saga" fullWidth onPress={onPress} />
      </View>
    </View>
  );
};
