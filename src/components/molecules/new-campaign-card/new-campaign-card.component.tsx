import { View } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { Button } from '@/components/molecules/button';
import { styles } from './new-campaign-card.styles';
import type { NewCampaignCardProps } from './new-campaign-card.types';

export const NewCampaignCard = ({ onPress, disabled = false }: NewCampaignCardProps) => {
  return (
    <View style={styles.card}>
      <View pointerEvents="none" style={styles.ambientGlow} />

      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Icon name="auto-awesome" size={28} color="primary" />
        </View>

        <View style={styles.headerText}>
          <Text variant="headlineMd" style={styles.title}>
            Start New Campaign
          </Text>
          <Text variant="bodyMd" style={styles.description}>
            Configure characters, items, and world settings from scratch.
          </Text>
        </View>
      </View>

      <View style={styles.action}>
        <Button title="Initialize World" fullWidth onPress={onPress} disabled={disabled} />
      </View>
    </View>
  );
};
