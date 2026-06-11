import { Pressable, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { animateButtonPressIn, animateButtonPressOut } from './button.press-animation';
import { styles } from './button.styles';
import type { ButtonProps } from './button.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ title, onPress, icon, fullWidth = false }: ButtonProps) {
  const pressed = useSharedValue(0);

  styles.useVariants({ fullWidth });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.value, [0, 1], [1, 0.9]),
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.98]) }],
  }));

  const handlePressIn = () => {
    scheduleOnUI(animateButtonPressIn, pressed);
  };

  const handlePressOut = () => {
    scheduleOnUI(animateButtonPressOut, pressed);
  };

  return (
    <View style={styles.shadowWrapper}>
      <AnimatedPressable
        style={[styles.button, animatedStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text variant="buttonLabel">{title}</Text>
        {icon ? <Icon name={icon} size={16} color="onPrimary" /> : null}
      </AnimatedPressable>
    </View>
  );
}
