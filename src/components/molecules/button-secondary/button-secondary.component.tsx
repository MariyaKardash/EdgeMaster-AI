import { Pressable, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { animateButtonPressIn, animateButtonPressOut } from '../button/button.press-animation';
import { styles } from './button-secondary.styles';
import type { ButtonSecondaryProps } from './button-secondary.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ButtonSecondary = ({
  title,
  onPress,
  icon,
  iconPosition = 'trailing',
  fullWidth = false,
  compact = false,
  disabled = false,
}: ButtonSecondaryProps) => {
  const pressed = useSharedValue(0);

  styles.useVariants({ fullWidth, compact, disabled });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.value, [0, 1], [1, 0.9]),
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.98]) }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    animateButtonPressIn(pressed);
  };

  const handlePressOut = () => {
    if (disabled) return;
    animateButtonPressOut(pressed);
  };

  const iconElement = icon ? <Icon name={icon} size={16} color="primary" /> : null;

  return (
    <View style={styles.wrapper}>
      <AnimatedPressable
        style={[styles.button, !disabled && animatedStyle]}
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityState={{ disabled }}
      >
        {iconPosition === 'leading' ? iconElement : null}
        <Text variant="buttonSecondaryLabel">{title}</Text>
        {iconPosition === 'trailing' ? iconElement : null}
      </AnimatedPressable>
    </View>
  );
};
