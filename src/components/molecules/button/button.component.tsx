import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { animateButtonPressIn, animateButtonPressOut } from './button.press-animation';
import { styles } from './button.styles';
import type { ButtonProps } from './button.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({
  title,
  onPress,
  icon,
  iconSize = 20,
  fullWidth = false,
  disabled = false,
}: ButtonProps) => {
  styles.useVariants({ fullWidth });

  const iconElement = icon ? <Icon name={icon} size={iconSize} color="onPrimary" /> : null;

  if (disabled) {
    return (
      <View style={[styles.shadowWrapper, styles.shadowWrapperDisabled]}>
        <View style={[styles.button, styles.buttonDisabled]}>
          <Text variant="buttonLabel">{title}</Text>
          {iconElement}
        </View>
      </View>
    );
  }

  return (
    <EnabledButton
      title={title}
      onPress={onPress}
      iconElement={iconElement}
      fullWidth={fullWidth}
    />
  );
};

type EnabledButtonProps = {
  title: string;
  onPress?: () => void;
  iconElement: ReactNode;
  fullWidth: boolean;
};

const EnabledButton = ({ title, onPress, iconElement, fullWidth }: EnabledButtonProps) => {
  styles.useVariants({ fullWidth });

  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.value, [0, 1], [1, 0.9]),
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.98]) }],
  }));

  return (
    <View style={styles.shadowWrapper}>
      <AnimatedPressable
        style={[styles.button, animatedStyle]}
        onPress={onPress}
        onPressIn={() => animateButtonPressIn(pressed)}
        onPressOut={() => animateButtonPressOut(pressed)}
      >
        <Text variant="buttonLabel">{title}</Text>
        {iconElement}
      </AnimatedPressable>
    </View>
  );
};
