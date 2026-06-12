import { Pressable, View } from 'react-native';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { styles } from './campaign-setup-header.styles';
import type { CampaignSetupHeaderProps } from './campaign-setup-header.types';

export const CampaignSetupHeader = ({
  step,
  totalSteps = 3,
  title,
  onBack,
}: CampaignSetupHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        <View style={styles.navStart}>
          <Pressable
            style={styles.backButton}
            onPress={onBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="arrow-back" size={24} color="primary" />
          </Pressable>

          <View style={styles.titleBlock}>
            <Text style={styles.stepLabel}>
              Step {step} of {totalSteps}
            </Text>
            <Text variant="headlineMd" style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          </View>
        </View>

        <View style={styles.sparkleButton} pointerEvents="none">
          <Icon name="auto-awesome" size={24} color="primary" />
        </View>
      </View>

      <View style={styles.progressRow}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[styles.progressSegment, index < step && styles.progressSegmentActive]}
          />
        ))}
      </View>
    </View>
  );
};
