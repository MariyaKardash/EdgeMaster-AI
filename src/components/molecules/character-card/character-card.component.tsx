import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Icon, Text } from '@/components';
import { colors } from '@/theme';
import { animateButtonPressIn, animateButtonPressOut } from '../button/button.press-animation';
import { CARD_BORDER_DEFAULT, CHECK_BORDER_DEFAULT, STAT_LABELS } from './character-card.constants';
import { styles } from './character-card.styles';
import type { CharacterCardProps } from './character-card.types';
import { formatStat } from './character-card.utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

export const CharacterCard = ({ player, selected, onPress }: CharacterCardProps) => {
  const statValues = [player.stats.str, player.stats.dex, player.stats.int];
  const selectedProgress = useSharedValue(selected ? 1 : 0);
  const pressed = useSharedValue(0);

  useEffect(() => {
    selectedProgress.value = withTiming(selected ? 1 : 0, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
  }, [selected, selectedProgress]);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const pressScale = interpolate(pressed.value, [0, 1], [1, 0.98]);

    return {
      transform: [{ scale: pressScale }],
      borderColor: interpolateColor(
        selectedProgress.value,
        [0, 1],
        [CARD_BORDER_DEFAULT, colors.primary],
      ),
      backgroundColor: interpolateColor(
        selectedProgress.value,
        [0, 1],
        [colors.surfaceContainerLow, colors.surfaceContainerHigh],
      ),
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: selectedProgress.value,
  }));

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(selectedProgress.value, [0, 1], [0.55, 1]),
  }));

  const checkCircleAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectedProgress.value,
      [0, 1],
      ['transparent', colors.primary],
    ),
    borderColor: interpolateColor(
      selectedProgress.value,
      [0, 1],
      [CHECK_BORDER_DEFAULT, colors.primary],
    ),
  }));

  const checkIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: selectedProgress.value,
    transform: [{ scale: selectedProgress.value }],
  }));

  return (
    <View style={styles.cardSlot}>
      <AnimatedView style={[styles.shadowWrapper, selected && styles.shadowWrapperSelected]}>
        <AnimatedView pointerEvents="none" style={[styles.selectionGlow, glowAnimatedStyle]} />

        <AnimatedPressable
          accessibilityRole="button"
          accessibilityState={{ selected }}
          onPress={onPress}
          onPressIn={() => animateButtonPressIn(pressed)}
          onPressOut={() => animateButtonPressOut(pressed)}
          style={[styles.card, cardAnimatedStyle]}
        >
          <View style={styles.row}>
            <AnimatedView style={[styles.avatar, avatarAnimatedStyle]}>
              <Image
                source={{ uri: player.imageUri }}
                style={styles.avatarImage}
                contentFit="cover"
              />
            </AnimatedView>

            <View style={styles.details}>
              <View style={styles.nameRow}>
                <View>
                  <Text variant="headlineMd" style={styles.name}>
                    {player.name}
                  </Text>
                  <Text variant="labelMd" style={styles.classLabel}>
                    {player.class}
                  </Text>
                </View>

                <AnimatedView style={[styles.checkCircle, checkCircleAnimatedStyle]}>
                  <AnimatedView style={checkIconAnimatedStyle}>
                    <Icon name="check" size={16} color="onPrimary" />
                  </AnimatedView>
                </AnimatedView>
              </View>

              <View style={styles.statsRow}>
                {STAT_LABELS.map((label, index) => (
                  <View key={label} style={styles.stat}>
                    <Text style={styles.statLabel}>{label}</Text>
                    <Text variant="codeMd" style={styles.statValue}>
                      {formatStat(statValues[index])}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </AnimatedPressable>
      </AnimatedView>
    </View>
  );
};
