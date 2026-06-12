import { Pressable, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { withAlphaHex } from '@/theme/color-utils';
import { animateButtonPressIn, animateButtonPressOut } from '../button/button.press-animation';
import { styles } from './role-card.styles';
import type { RoleCardProps } from './role-card.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const RoleCard = ({
  title,
  description,
  icon,
  accentColor,
  selected = false,
  onPress,
}: RoleCardProps) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.98]) }],
  }));

  const handlePressIn = () => {
    animateButtonPressIn(pressed);
  };

  const handlePressOut = () => {
    animateButtonPressOut(pressed);
  };

  return (
    <View
      style={[
        styles.shadowWrapper,
        selected && {
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 6,
        },
      ]}
    >
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          animatedStyle,
          {
            borderColor: selected ? accentColor : withAlphaHex(accentColor, 0.15),
          },
          selected && { backgroundColor: withAlphaHex(accentColor, 0.06) },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.ambientGlow,
            { backgroundColor: withAlphaHex(accentColor, selected ? 0.1 : 0.05) },
          ]}
        />

        {selected ? (
          <View style={[styles.selectedIndicator, { backgroundColor: accentColor }]} />
        ) : null}

        <View style={styles.headerRow}>
          <View
            style={[
              styles.iconCircle,
              {
                borderColor: withAlphaHex(accentColor, selected ? 0.4 : 0.2),
              },
            ]}
          >
            <Icon name={icon} size={28} color={accentColor} />
          </View>

          <View style={styles.headerText}>
            <Text variant="headlineMd" style={[styles.title, { color: accentColor }]}>
              {title}
            </Text>
            <Text variant="bodyMd" style={styles.description}>
              {description}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    </View>
  );
};
