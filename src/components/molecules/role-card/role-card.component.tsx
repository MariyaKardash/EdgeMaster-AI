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
  overlayIcon,
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
          shadowOpacity: 0.45,
          shadowRadius: 16,
          elevation: 8,
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
            borderColor: selected ? accentColor : withAlphaHex(accentColor, 0.3),
          },
        ]}
      >
        <View
          style={[
            styles.parchmentOverlay,
            {
              backgroundColor: selected
                ? withAlphaHex(accentColor, 0.14)
                : withAlphaHex(accentColor, 0.07),
            },
          ]}
        />
        <View style={styles.content}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: selected
                  ? withAlphaHex(accentColor, 0.2)
                  : withAlphaHex(accentColor, 0.1),
                borderColor: selected
                  ? withAlphaHex(accentColor, 0.4)
                  : withAlphaHex(accentColor, 0.2),
              },
            ]}
          >
            <Icon name={icon} size={48} color={accentColor} />
            {overlayIcon ? (
              <View style={styles.iconOverlay}>
                <Icon name={overlayIcon} size={28} color={accentColor} />
              </View>
            ) : null}
          </View>

          <Text variant="roleCardTitle" style={[styles.title, { color: accentColor }]}>
            {title}
          </Text>
          <Text variant="roleCardDescription" style={styles.description}>
            {description}
          </Text>
        </View>

        <View
          style={[
            styles.glow,
            { backgroundColor: withAlphaHex(accentColor, selected ? 0.1 : 0.05) },
          ]}
        />
      </AnimatedPressable>
    </View>
  );
};
