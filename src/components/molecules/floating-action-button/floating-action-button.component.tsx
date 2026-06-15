import { Pressable } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Icon } from '@/components/atoms/icon';
import { animateButtonPressIn, animateButtonPressOut } from '../button/button.press-animation';
import { styles } from './floating-action-button.styles';
import type { FloatingActionButtonProps } from './floating-action-button.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FloatingActionButton = ({
  bottom,
  onPress,
  accessibilityLabel = 'New Chapter',
}: FloatingActionButtonProps) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.9]) }],
  }));

  return (
    <AnimatedPressable
      style={[styles.fab, { bottom }, animatedStyle]}
      onPress={onPress}
      onPressIn={() => animateButtonPressIn(pressed)}
      onPressOut={() => animateButtonPressOut(pressed)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Icon name="add" size={32} color="onTertiaryContainer" />
    </AnimatedPressable>
  );
};
