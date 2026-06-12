import { Pressable, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
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
    scheduleOnUI(animateButtonPressIn, pressed);
  };

  const handlePressOut = () => {
    scheduleOnUI(animateButtonPressOut, pressed);
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
            borderColor: selected ? accentColor : `${accentColor}4D`,
          },
        ]}
      >
        <View
          style={[
            styles.parchmentOverlay,
            { backgroundColor: selected ? `${accentColor}24` : `${accentColor}12` },
          ]}
        />
        <View style={styles.content}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: selected ? `${accentColor}33` : `${accentColor}1A`,
                borderColor: selected ? `${accentColor}66` : `${accentColor}33`,
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
          style={[styles.glow, { backgroundColor: `${accentColor}${selected ? '1A' : '0D'}` }]}
        />
      </AnimatedPressable>
    </View>
  );
};
