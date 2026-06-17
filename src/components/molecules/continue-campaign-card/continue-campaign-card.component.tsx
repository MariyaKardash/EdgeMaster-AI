import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { styles } from './continue-campaign-card.styles';
import type { ContinueCampaignCardProps } from './continue-campaign-card.types';

export const ContinueCampaignCard = ({ session, onPress }: ContinueCampaignCardProps) => {
  return (
    <Pressable style={styles.row} onPress={onPress} accessibilityRole="button">
      <View style={styles.iconCircle}>
        <Icon name="menu-book" size={20} color="primary" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {session.name}
        </Text>
        <Text style={styles.lastPlayed}>Last played {session.lastPlayed}</Text>
      </View>

      <View style={styles.chevron}>
        <Icon name="chevron-right" size={22} color="onSurfaceVariant" />
      </View>
    </Pressable>
  );
};
